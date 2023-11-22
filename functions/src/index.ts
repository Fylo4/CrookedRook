// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
import {onRequest} from "firebase-functions/v2/https";

// The Firebase Admin SDK to access Firestore.
import {initializeApp} from "firebase-admin/app";
import {DocumentData, getFirestore} from "firebase-admin/firestore";

initializeApp();

// https://getallboards-mlqacmsctq-uc.a.run.app
exports.getAllBoards = onRequest(
  {cors: true },
  async (req: any, res: any) => {
  let allBoards: any[] = [];
  await getFirestore()
    .collection("Boards")
    .get()
    .then((snapshot: DocumentData) => {
      allBoards = snapshot.map((b: any) => {
        return {
          boardCode: b.code,
          boardName: b.data.name ?? "",
          creator: b.ownedBy,
          date: b.timeUploaded,
          plays: b.stats.timesPlayed,
          rating: 5,
        };
      });
    })
    .catch((err: any) => {
      console.error("Error getting boards", err);
    });
  res.json({boards: allBoards});
});
