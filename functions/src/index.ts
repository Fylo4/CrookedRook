/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
// import { onDocumentCreated } from "firebase-functions/v2/firestore";

// The Firebase Admin SDK to access Firestore.
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });




// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
// exports.addmessage = onRequest(async (req, res) => {
//     // Grab the text parameter.
//     const original = req.query.text;
//     // Push the new message into Firestore using the Firebase Admin SDK.
//     const writeResult = await getFirestore()
//         .collection("messages")
//         .add({original: original});
//     // Send back a message that we've successfully written the message
//     res.json({result: `Message with ID: ${writeResult.id} added.`});
//   });

exports.createLobby = onRequest(async (req, res) => {
    let newMatch = {
        boardCode: req.query.boardCode,
        hostColor: req.query.hostColor,
        hostName: "Fylo",
        hostId: "123",
        isPrivate: req.query.isPrivate,
        privateCode: req.query.privateCode ?? ""
    }
    await getFirestore()
        .collection("Lobby")
        .add(newMatch);
    res.json({success: true});
});


  // Listens for new messages added to /messages/:documentId/original
// and saves an uppercased version of the message
// to /messages/:documentId/uppercase
// exports.makeuppercase = onDocumentCreated("/messages/{documentId}", (event) => {
//     // Grab the current value of what was written to Firestore.
//     const original = event.data.data().original;
  
//     // Access the parameter `{documentId}` with `event.params`
//     logger.log("Uppercasing", event.params.documentId, original);
  
//     const uppercase = original.toUpperCase();
  
//     // You must return a Promise when performing
//     // asynchronous tasks inside a function
//     // such as writing to Firestore.
//     // Setting an 'uppercase' field in Firestore document returns a Promise.
//     return event.data.ref.set({uppercase}, {merge: true});
//   });