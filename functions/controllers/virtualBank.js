/* eslint-disable max-len */

const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const appVirtualBank = express();
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

appVirtualBank.use(cors({origin: true}));

// get all data
appVirtualBank.get("/", async (req, res) => {
  const snapshot = await db.collection("virtualBank").get();
  const virtual = [];
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();

    virtual.push({id, ...data});
  });

  res.status(200).send(JSON.stringify(virtual));
});

// get data by id
appVirtualBank.get("/:id", async (req, res) => {
  const snapshot = await db.collection("virtualBank").doc(req.params.id).get();
  const userId = snapshot.id;
  const virtualData = snapshot.data();
  res.status(200).send(JSON.stringify({id: userId, ...virtualData}));
});

// update data
appVirtualBank.put("/:id", async (req, res) => {
  const body = req.body;
  await db.collection("virtualBank").doc(req.params.id).update({
    ...body,
  });
  res.status(200).send();
});

// post data
appVirtualBank.post("/", (req, res) => {
  const virtualBank = req.body;
  db.collection("virtualBank").add(virtualBank);
  res.status(201).send();
});

appVirtualBank.delete("/:id", async (req, res) => {
  await db.collection("virtualBank").doc(req.params.id).delete();
  res.status(200).send();
});

exports.virtualBank = functions.https.onRequest(appVirtualBank);


