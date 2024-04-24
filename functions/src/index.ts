// // The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
// import {onRequest} from "firebase-functions/v2/https";

// // The Firebase Admin SDK to access Firestore.
// import {initializeApp} from "firebase-admin/app";
import functions = require('firebase-functions/v1');
import admin = require('firebase-admin');
import express = require('express');
import { getBoardByCode } from "./nonauth.functions";
import { getMyMatches, getPublicLobbies, getUser, joinPublicLobby, makeMove, postBoard, postLobby, validateFirebaseIdToken } from "./auth.functions";


admin.initializeApp();
const cors = require('cors')({origin: true});

// Auth is for all endpoints that require authentication
// https://us-central1-crooked-rook.cloudfunctions.net/auth
const auth = express();
auth.use(cors);
auth.use(validateFirebaseIdToken);
auth.post('/board', postBoard);
auth.post('/lobby', postLobby);
auth.get('/user', getUser);
auth.get('/lobbies', getPublicLobbies);
auth.get('/joinLobby/:lobbyId', joinPublicLobby);
auth.get('/matches', getMyMatches);
auth.post('/move', makeMove);

// Non-auth is for endpoints that are open for all users
// https://us-central1-crooked-rook.cloudfunctions.net/nonauth
const nonauth = express();
nonauth.use(cors);
nonauth.get('/board/:code', getBoardByCode);

exports.auth = functions.https.onRequest(auth);
exports.nonauth = functions.https.onRequest(nonauth);
// firebase deploy --only functions