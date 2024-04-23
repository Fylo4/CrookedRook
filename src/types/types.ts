export type CreateLobbyType = {
    boardCode: string,
    isPrivate: boolean,
    privateCode?: string,
    hostColor: "white" | "black" | "random",
    saveMode: "save" | "no-save" | "save-anon"
}
export type StoredLobbyType = {
    id?: string, //Not stored in db, but passed to client
    boardCode: string,
    boardName: string,
    hostId: string,
    hostName: string,
    hostColor: "white" | "black" | "random",
    saveMode: "save" | "no-save" | "save-anon",
    isPrivate: boolean,
    privateCode?: string,
}
export type BoardType = {
    code: string,
    comments: any[],
    data: any,
    isCanon: boolean,
    lastPlayed: Date,
    ownedBy: string,
    ratings: any[],
    stats: {
        blackWins: number,
        draws: number,
        endsByChoice: number,
        endsByTermination: number,
        pieceCount: number,
        squareCount: number,
        timesPlayed: number,
        turnCounts: number[],
        uniquePieceCount: number,
    },
    timeUploaded: Date,
    tournamentEntries: number,
    finalized: boolean,
}
export type UserType = {
    friends: string[],
    id: string,
    lastLogout: Date,
    myBoards: string[],
    name: string,
    starredBoards: string[],
    stats: {
        boardsPlayed: string[],
        gamesDrew: number,
        gamesLost: number,
        gamesPlayed: number,
        gamesWon: number,
    },
    trophies: number[],
}
export type MatchType = {
    id?: string; //Not stored in db
    blackId: string;
    blackName: string;
    boardCode: string;
    dateTimeStarted: Date;
    isPrivate: boolean;
    toMove: boolean;
    turnNum: number;
    whiteId: string;
    whiteName: string;
}