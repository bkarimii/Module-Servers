process.env.PORT = process.env.PORT || 9090;
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { searchForWorkspaceRoot } from "vite";

const app = express();

app.use(express.json());

app.use(cors());

// Get __dirname in ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
const messages = [welcomeMessage];

const findMessageById = (arr, msgId) => {
  return arr.filter((obj) => obj.id === Number(msgId));
};

const serachInMessages = (arr, word) => {
  const msgs = arr.filter((object) => {
    return object.text.toLowerCase().includes(word.toLowerCase());
  });
  return msgs;
};

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});

const usersChat = [];

const rejectTheRequest = (obj) => {
  return obj.from === "" || obj.text === "" ? true : false;
};

app.post("/messages", (req, res) => {
  const chatData = req.body;
  if (rejectTheRequest(chatData)) {
    res.status(400).send("Fill all the feilds");
  } else {
    usersChat.push(chatData);
    res.send("Chat added !");
  }
});

app.get("/messages", (req, res) => {
  res.send(usersChat);
});

app.get("/messages/search", (req, res) => {
  const textForSearch = req.query.text;
  console.log(req.query);
  const msgIncludesWord = serachInMessages(usersChat, textForSearch);
  res.status(200).send(msgIncludesWord);
});

app.get("/messages/:id", (req, res) => {
  const msgId = req.params.id;
  console.log(msgId);
  const findedMsg = findMessageById(usersChat, msgId);
  res.send(findedMsg);
});

app.delete("/messages/:id", (req, res) => {
  const msgId = req.params.id;
  const findedMsg = findMessageById(usersChat, msgId);
  const index = usersChat.indexOf(findedMsg[0]);
  usersChat.splice(index, 1);
  res.send("Message deleted !");
});

app.listen(process.env.PORT, () => {
  console.log(`listening on PORT ${process.env.PORT}...`);
});
