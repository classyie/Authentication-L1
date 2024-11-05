import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "123456",
  port: 5432,
});

db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(`Username = ${username}, Password = ${password}`);
  try {
    await db.query('insert into users (email, password) values ($1, $2)', [username, password]);
    res.render('secrets.ejs');
  } catch (error) {
    console.error("unable to register", error);
  }
});

app.post("/login", async (req, res) => { 
  const username = req.body.username;
  const password = req.body.password;
  console.log(`Username = ${username}, Password = ${password}`);;
  try {
    const result = await db.query('select * from users where email = $1', [username]);
    const dbpass = result.rows[0].password;
    if(password === dbpass){
      res.render('secrets.ejs');
    }
    else{
      res.redirect('/login');
    }
  } catch (error) {
    console.log('error', error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
