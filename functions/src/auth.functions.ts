import { getFirestore } from "firebase-admin/firestore";
import functions = require('firebase-functions/v1');
import admin = require('firebase-admin');
import {BoardType, CreateLobbyType, MatchType, StoredLobbyType} from "../../src/types/types";
import {Board, BoardMatchObject} from "../../src/assets/TCR_Core/board/Board";
import {GameData} from "../../src/assets/TCR_Core/game_data/GameData";
import { cyrb128, mulberry32 } from "../../src/assets/TCR_Core/random";

export const validateFirebaseIdToken = async (req: any, res: any, next: any) => {
    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
        !(req.cookies && req.cookies.__session)) {
      functions.logger.error(
        'No Firebase ID token was passed as a Bearer token in the Authorization header.',
        'Make sure you authorize your request by providing the following HTTP header:',
        'Authorization: Bearer <Firebase ID Token>',
        'or by passing a "__session" cookie.'
      );
      res.status(403).send('Unauthorized');
      return;
    }
  
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      // Read the ID Token from the Authorization header.
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else if(req.cookies) {
      // Read the ID Token from cookie.
      idToken = req.cookies.__session;
    } else {
      // No cookie
      res.status(403).send('Unauthorized');
      return;
    }
  
    try {
      const decodedIdToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedIdToken;
      next();
      return;
    } catch (error) {
      functions.logger.error('Error while verifying Firebase ID token:', error);
      res.status(403).send('Unauthorized');
      return;
    }
};

export const getUser = async (req: any, res: any) => {
    if (req.user.uid == undefined)
      return res.status(401).send("User ID is undefined");
    let userData = await getFirestore()
      .collection("Users")
      .doc(req.user.uid)
      .get()
      .then(async v => {
        // return v;
        if (v.exists) {
          return v.data();
        }
        else {
          let newProfile = {
            id: req.user.uid,
            name: req.user.name,
            isOnline: true,
            lastLogout: new Date(),
            friends: [],
            starredBoards: [],
            trophies: [],
            stats: {
              boardsCreated: 0,
              boardsPlayed: [],
              gamesPlayed: 0,
              gamesDrew: 0,
              gamesLost: 0,
              gamesWon: 0,
            },
            myBoards: []
          };
          
          getFirestore()
            .collection("Users")
            .doc(req.user.uid)
            .set(newProfile);
          return newProfile;
        }
      });
    return res.send(userData);
}

export const getBoardStats = (board: any) => {
    let pieceCount = 0;
    let setup = board.setup ?? '';
    setup.split(" ")
      .filter((w: string) => !w.includes('.'))
      .forEach((w: string) => {
        let firstNonNum = w.search(/[^0-9]/);
        if (firstNonNum === 0) pieceCount ++;
        else if (firstNonNum > 0) pieceCount += Number(w.substring(0, firstNonNum));
      });
    let uniquePieceCount = board.all_pieces?.length ?? 0;
    let squareCount = board.width * board.height;
    if (board.active_squares) {
      squareCount = 0;
      for(var i=0; i<board.active_squares.length; squareCount+= +('1'===board.active_squares[i++]));
    }
    if (board.copy && ['flip', 'f', 'rotate', 'r'].includes(board.copy.toLowerCase()))
      pieceCount *= 2;
    return {
      pieceCount,
      uniquePieceCount,
      squareCount
    }
}

export const postBoard = async (req: any, res: any) => {
    if (req.user.uid == undefined)
      return res.status(401).send("User ID is undefined");
    // Test if board is already there
    let docs = await getFirestore().collection("Boards").listDocuments();
    //Paths begin with Boards/, remove first 7 letters of each path
    let names = docs.map(d => d.path.slice(7));
    let code = req.body.code;
    if (names.includes(code)) {
      return res.status(401).send("Board code already taken");
    }
    
    let newBoardData: BoardType = {
      code,
      comments: [],
      data: req.body.board,
      isCanon: false,
      lastPlayed: new Date(),
      ownedBy: req.user.uid,
      ratings: [],
      stats: {
        blackWins: 0,
        draws: 0,
        endsByChoice: 0,
        endsByTermination: 0,
        timesPlayed: 0,
        turnCounts: [],
        ...getBoardStats(req.body.board)
      },
      timeUploaded: new Date(),
      tournamentEntries: 0,
      finalized: false
    }
    getFirestore()
      .collection("Boards")
      .doc(code)
      .create(newBoardData)
      .catch(e => functions.logger.error("Error in board post: ",e));
    // Add the board to the uploader's user array
    getFirestore()
      .collection("Users")
      .doc(req.user.uid)
      .update({myBoards: admin.firestore.FieldValue.arrayUnion(req.body.code)})
      .catch(e => functions.logger.error("Error in board post: ",e));
    return res.send(true);
}

export const postLobby = async (req: any, res: any) => {
    if (req.user.uid == undefined)
      return res.status(401).send("User ID is undefined");
    let createData: CreateLobbyType = req.body.data;
    //Step 1 - Get the board
    getFirestore()
        .collection("Boards")
        .doc(createData.boardCode)
        .get()
        .then(v => {
            if(v.exists)
                step2(v.data()?.data.name ?? createData.boardCode);
            else
                return res.status(401).send("Board code does not exist");
        })
    //Step 2 - Check how many lobbies this player has open
    let step2 = (boardName: string) => getFirestore()
        .collection("Lobbies")
        .get()
        .then(v => {
          let myCount = v.docs.map(d => d.data()).filter(d => d.hostId === req.user.uid).length;
          if (myCount < 10) step3(boardName);
          else return res.status(401).send("You cannot have more than 10 lobbies open at once");
        })
    //Step 2 - Create the lobby
    let step3 = (boardName: string) => {
      let newLobby: StoredLobbyType = {
        boardCode: createData.boardCode,
        hostColor: createData.hostColor,
        hostId: req.user.uid,
        hostName: req.user.name,
        isPrivate: createData.isPrivate,
        privateCode: createData.privateCode,
        boardName,
        saveMode: createData.saveMode,
      };
        getFirestore()
            .collection("Lobbies")
            .add(newLobby).then(v => {
                step4(v.id)
            })
    }
    let step4 = (id: string) => {
        // Currently the users don't store what lobbies they have in their name
        // I figure there's only going to be a couple of lobbies open anyways
        // client can just search for what is theirs. less opportunities for bugs.
        // If I decide to add this functionality, I'll add it here
        return res.send(true);
    }
}
export const getPublicLobbies = async (req: any, res: any) => {
    let lobbiesdb = await getFirestore()
        .collection("Lobbies")
        .get()
    let lobbies: StoredLobbyType[] = lobbiesdb.docs
                .map(d =>  ({ 
                    ...(d.data() as StoredLobbyType),
                    id: d.id
                  } as StoredLobbyType))
                .filter(d => !d.isPrivate);
    return res.send(lobbies);

}
export const joinPublicLobby = async (req: any, res: any) => {
  //Find the lobby we're joining
  let myLobby: StoredLobbyType = await getFirestore()
    .collection("Lobbies")
    .doc(req.params.lobbyId)
    .get()
    .then(v => {
      let data = v.data();
      if (data === undefined)
        return res.status(400).send("Requested lobby could not be found in the database");
      // if (data.hostId === req.user.uid)
      //   return res.status(400).send("Cannot join your own lobby");
      if (data.isPrivate)
        return res.status(400).send("Requested lobby could not be joined");
      return data;
    })
  let IAmWhite = myLobby.hostColor === "random" ? (Math.random() > 0.5) : (myLobby.hostColor === "black");
  //Get the match data
  let gameDataSeed = await getFirestore()
    .collection("Boards")
    .doc(myLobby.boardCode)
    .get()
    .then(v => {
      let data = v.data();
      if (data === undefined) return res.status(400).send("Board data undefined")
      return data.data;
    });
  const seed = Math.random();
  let brd = new Board({gameData: new GameData(gameDataSeed), rand: mulberry32(cyrb128(seed+'')[0])});
  brd.refresh_moves();
  let newMatchData = {
    blackId: IAmWhite ? myLobby.hostId : req.user.uid,
    blackName: IAmWhite ? myLobby.hostName : req.user.name,
    whiteId: IAmWhite ? req.user.uid : myLobby.hostId,
    whiteName: IAmWhite ? req.user.name : myLobby.hostName,
    boardCode: myLobby.boardCode,
    dateTimeStarted: new Date(),
    isPrivate: myLobby.isPrivate,
    toMove: false,
    turnNum: 1,
    seed,
  };
  //Make the match object
  let matchDoc = await getFirestore()
    .collection("Matches")
    .add({});
  // Make the moves sub-collection
  matchDoc.collection("match").doc("moves").set({moves: []});
  matchDoc.collection("match").doc("matchData").set(newMatchData);
  matchDoc.collection("match").doc("game").set(gameDataSeed);
  matchDoc.collection("match").doc("board").set(brd.toMatchObject());
  //Delete the lobby object
  getFirestore()
    .collection("Lobbies")
    .doc(req.params.lobbyId)
    .delete();
  
  return res.send({ id: matchDoc.id });
}
export const getMyMatches = async (req: any, res: any) => {
  let blackMatches: MatchType[] = await getFirestore()
  .collection("Matches")
  .where("blackId", "==", req.user.uid)
  .get()
  .then(v => {
    return v.docs.map(d => ({...d.data(), id: d.id}) as MatchType)
  });
  let whiteMatches: MatchType[] = await getFirestore()
  .collection("Matches")
  .where("whiteId", "==", req.user.uid)
  .get()
  .then(v => {
    return v.docs.map(d => ({...d.data(), id: d.id}) as MatchType)
  });
  // In theory nobody should have a match with themselves
  let allMatches = [
    ...whiteMatches,
    ...blackMatches.filter(m1 => !whiteMatches.find(m2 => m2.id === m1.id))
  ]
  return res.send(allMatches);
}

export const makeMove = async (req: any, res: any) => {
  // First find board and game data for the match
  // matchId: string, src_x: number, src_y: number, dst_x: number, dst_y: number, promotion?: number | undefined
  const id = req.body.data.matchId;
  const collection = await getFirestore().collection(`Matches/${id}/match`).get();
  const game = collection.docs.find(d => d.id === 'game')?.data();
  const board = (collection.docs.find(d => d.id === 'board')?.data() as any) as BoardMatchObject;
  const history = collection.docs.find(d => d.id === 'moves')?.data();
  // return res.send({game, board});
  if (!game) return res.status(400).send("Game undefined: "+JSON.stringify(game));
  if (!board) return res.status(400).send("Board undefined: "+JSON.stringify(board));
  let brd = new Board({game, board});
  brd.refresh_moves();
  try {
    brd.make_move(req.body.data.src_x, req.body.data.src_y, req.body.data.dst_x, req.body.data.dst_y, req.body.data.promotion);
  }
  catch(e: any) {
    return res.status(400).send(e.message);
  }
  await getFirestore().doc(`Matches/${id}/match/board`).set(brd.toMatchObject());
  const historyEntry = {
    src_x: req.body.data.src_x,
    src_y: req.body.data.src_y,
    dst_x: req.body.data.dst_x,
    dst_y: req.body.data.dst_y,
  };
  const newHistory = [...(history?.moves??[]), historyEntry];
  await getFirestore().doc(`Matches/${id}/match/moves`).set({moves: newHistory});
  await getFirestore().doc(`Matches/${id}/match/matchData`).update({toMove: brd.turn, turnNum: brd.turn_count})
  return res.send(true);
}