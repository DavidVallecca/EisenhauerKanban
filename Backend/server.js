"use strict";

//https://console.firebase.google.com/u/0/project/eisenhauer-kanban/firestore/data/~2Fuser~2FDaveVallecca@gmail.com?view=panel-view&scopeType=collection&scopeName=%2FDaveVallecca@gmail.com&query=

const express = require("express");
const bodyParser = require("body-parser");
const { db } = require("./firebase");
const bcrypt = require("bcrypt");
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

let currentUser = "";

app.post("/api/register", async (req, res) => {
  const newUser = req.body;
  const email = newUser.email;
  try {
    console.log("Register Password after clienthashing: " + newUser.password);
    let hashedPassword = await hashPassword(newUser.password);

    const userRef = db.collection("user").doc(String(email));
    const doc = await userRef.get();

    if (doc.exists) {
      return res.sendStatus(300);
    }

    const res2 = await userRef.set({
      email: newUser.email,
      password: hashedPassword,
    });

    return res.sendStatus(200);
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
      return res.sendStatus(400); // Benutzer nicht gefunden
    }

    const storedHashedPassword = doc.data().password;

    // Passwort vergleichen
    const passwordMatch = await comparePassword(
      user.password,
      storedHashedPassword
    );

    if (!passwordMatch) {
      return res.sendStatus(401); // Passwort falsch
    }
    currentUser = email;
    res.status(200).json(doc.data());
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

app.get("/api/getAllToDos", async (req, res) => {
  const collectionRef = db.collection(String(currentUser));
  const snapshot = await collectionRef.get();
  const todos = [];

  snapshot.forEach((doc) => {
    todos.push({
      name: doc.data().name,
      categoryKanban: doc.data().categoryKanban,
      categoryEisenhauer: doc.data().categoryEisenhauer,
      description: doc.data().description,
      image: doc.data().image,
      id: doc.data().id,
    });
  });

  if (todos.length === 0) {
    res.status(404);
  }

  res.json(todos);
});

app.post("/api/addNewToDo", async (req, res) => {
  const newToDo = req.body;
  const toDoId = newToDo.id;

  const collectionRef = db.collection(String(currentUser)).doc(String(toDoId));
  const res2 = await collectionRef.set({
    name: newToDo.name,
    categoryKanban: newToDo.categoryKanban,
    categoryEisenhauer: newToDo.categoryEisenhauer,
    description: newToDo.description,
    image: newToDo.image,
    id: newToDo.id,
  });

  res.json(newToDo);
});

app.put("/api/updateCategory", async (req, res) => {
  const toDoId = req.body.id;
  const updatedKanban = req.body.categoryKanban;
  const updateEisenhauer = req.body.categoryEisenhauer;

  const toDoRef = db.collection(String(currentUser)).doc(String(toDoId));
  const res2 = await toDoRef.set(
    {
      categoryKanban: updatedKanban,
      categoryEisenhauer: updateEisenhauer,
    },
    { merge: true }
  );
  res.json({ message: "Category updated successfully" });
});

app.delete("/api/delete/:id", async (req, res) => {
  const toDoId = req.params.id;
  const toDoRef = db.collection(String(currentUser)).doc(String(toDoId));

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
