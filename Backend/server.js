"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const { db } = require("./firebase");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

const jwtSecret = "test";
crypto.randomBytes(32).toString("hex");
const PORT = process.env.PORT || 3001;

//lässt undefinierte Properties zu
db.settings({ ignoreUndefinedProperties: true });

const app = express();
app.use(bodyParser.json({ limit: "35mb" }));

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "100mb",
    parameterLimit: 50000,
  })
);

function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.sendStatus(401); // Kein Token vorhanden
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403); // Token ungültig
    }
    req.user = user; // Füge den Benutzer aus dem Token zum Request-Objekt hinzu
    next(); // Führe den nächsten Schritt in der Routenbehandlung aus
  });
}

app.post("/api/register", async (req, res) => {
  const newUser = req.body;
  const email = newUser.email;
  try {
    let hashedPassword = await hashPassword(newUser.password);

    const userRef = db.collection("user").doc(String(email));
    const doc = await userRef.get();

    if (doc.exists) {
      return res.sendStatus(409); // User already registered
    }

    const res2 = await userRef.set({
      email: newUser.email,
      password: hashedPassword,
    });

    return res.sendStatus(201); // successfully registered
  } catch (error) {
    console.error(error);
    return res.sendStatus(500); // Internal Server Error
  }
});

app.post("/api/users/login", async (req, res) => {
  const user = req.body;
  const email = user.email;

  try {
    const userRef = db.collection("user").doc(String(email));
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.sendStatus(400); // User not found
    }

    const storedHashedPassword = doc.data().password;

    // Passwort vergleichen
    const passwordMatch = await comparePassword(
      user.password,
      storedHashedPassword
    );

    if (!passwordMatch) {
      return res.sendStatus(401); // Wrong password
    }

    // JWT generieren
    const token = jwt.sign({ email }, jwtSecret, { expiresIn: "1h" });
    return res
      .status(200)
      .json({ message: "User Logged in Successfully", token });
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Internal Server Error
  }
});

async function hashPassword(plaintextPassword) {
  const hash = await bcrypt.hash(plaintextPassword, 10);
  return hash;
}

async function comparePassword(plaintextPassword, hash) {
  const result = await bcrypt.compare(plaintextPassword, hash);
  return result;
}

app.get("/api/getAllToDos", authenticateToken, async (req, res) => {
  const userEmail = req.user.email; // Benutzer-E-Mail aus dem authentifizierten Token

  const collectionRef = db.collection(String(userEmail));
  const snapshot = await collectionRef.get();
  const todos = [];
  try {
    snapshot.forEach((doc) => {
      todos.push({
        name: doc.data().name,
        categoryKanban: doc.data().categoryKanban,
        categoryEisenhauer: doc.data().categoryEisenhauer,
        description: doc.data().description,
        image: doc.data().image,
        date: doc.data().date,
        id: doc.data().id,
      });
    });
  } catch (e) {
    res.status(404);
  }

  res.json(todos);
});

app.post("/api/addNewToDo", authenticateToken, async (req, res) => {
  const email = req.user.email;

  const newToDo = req.body;
  const toDoId = newToDo.id;

  const collectionRef = db.collection(String(email)).doc(String(toDoId));
  const res2 = await collectionRef.set({
    name: newToDo.name,
    categoryKanban: newToDo.categoryKanban,
    categoryEisenhauer: newToDo.categoryEisenhauer,
    description: newToDo.description,
    image: newToDo.image,
    date: newToDo.date,
    id: newToDo.id,
  });

  res.json(newToDo);
});

app.put("/api/updateCategory", authenticateToken, async (req, res) => {
  const email = req.user.email;

  const toDoId = req.body.id;
  const updatedKanban = req.body.categoryKanban;
  const updateEisenhauer = req.body.categoryEisenhauer;

  const toDoRef = db.collection(String(email)).doc(String(toDoId));
  const res2 = await toDoRef.set(
    {
      categoryKanban: updatedKanban,
      categoryEisenhauer: updateEisenhauer,
    },
    { merge: true }
  );
  res.json({ message: "Category updated successfully" });
});

app.delete("/api/delete/:id", authenticateToken, async (req, res) => {
  const email = req.user.email;

  const toDoId = req.params.id;
  const toDoRef = db.collection(String(email)).doc(String(toDoId));

  try {
    await toDoRef.delete();
    res.json({ message: "ToDo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
