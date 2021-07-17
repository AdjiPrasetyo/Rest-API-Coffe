/* eslint-disable max-len */

const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const appSaldoUser= express();
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

appSaldoUser.use(cors({origin: true}));

// get all data
appSaldoUser.get("/", async (req, res) => {
  const snapshot = await db.collection("saldo_user").get();
  const saldo = [];
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();

    saldo.push({id, ...data});
  });

  res.status(200).send(JSON.stringify(saldo));
});

// get data by id
appSaldoUser.get("/:id", async (req, res) => {
  const snapshot = await db.collection("saldo_user").doc(req.params.id).get();
  const userId = snapshot.id;
  const saldoData = snapshot.data();
  res.status(200).send(JSON.stringify({id: userId, ...saldoData}));
});

// update data
appSaldoUser.put("/:id", async (req, res) => {
  const body = req.body;
  await db.collection("saldo_user").doc(req.params.id).update({
    ...body,
  });
  res.status(200).send();
});

// post data
appSaldoUser.post("/", (req, res) => {
  const saldoUser = req.body;
  db.collection("saldo_user").add(saldoUser);
  res.status(201).send();
});

appSaldoUser.delete("/:id", async (req, res) => {
  await db.collection("saldo_user").doc(req.params.id).delete();
  res.status(200).send();
});

exports.saldoUser = functions.https.onRequest(appSaldoUser);


