/* eslint-disable max-len */

const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const appPembelianBarang = express();
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

appPembelianBarang.use(cors({origin: true}));

// get all data
appPembelianBarang.get("/", async (req, res) => {
  const snapshot = await db.collection("pembelian_brg").get();
  const pembelian = [];
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();

    pembelian.push({id, ...data});
  });

  res.status(200).send(JSON.stringify(pembelian));
});

// get data by id
appPembelianBarang.get("/:id", async (req, res) => {
  const snapshot = await db.collection("pembelian_brg").doc(req.params.id).get();
  const userId = snapshot.id;
  const pembelianData = snapshot.data();
  res.status(200).send(JSON.stringify({id: userId, ...pembelianData}));
});

// update data
appPembelianBarang.put("/:id", async (req, res) => {
  const body = req.body;
  await db.collection("pembelian_brg").doc(req.params.id).update({
    ...body,
  });
  res.status(200).send();
});

// post data
appPembelianBarang.post("/", (req, res) => {
  const pembelianBarang = req.body;
  db.collection("pembelian_brg").add(pembelianBarang);
  res.status(201).send();
});

appPembelianBarang.delete("/:id", async (req, res) => {
  await db.collection("pembelian_brg").doc(req.params.id).delete();
  res.status(200).send();
});

exports.pembelianBarang = functions.https.onRequest(appPembelianBarang);


