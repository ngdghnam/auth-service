import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";

const app = express();
const port = 3000;

app.set("view engine", "pug");
app.set("views", "./views");
app.use(bodyParser.json());

var mainUser = {
  name: "Hoai Nam",
  age: 20,
  major: "Fullstack Developer",
};

app.get("/", (req, res) => {
  //   res.send("Hello World!");
  res.render("index", mainUser);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
