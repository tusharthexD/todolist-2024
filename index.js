import bodyParser from "body-parser";
import express from "express";
import pg from "pg";
const { Pool } = pg;

const app = express();
const port = 3000;

const connectionString = "postgres://todolist:ws5rj1VxTfVEhwIuk7cNRfMMYi56Iopp@dpg-cmhui2f109ks739hpkqg-a.singapore-postgres.render.com/todolist_mth3";

const db = new Pool({
  connectionString: connectionString,
  // If you're using a service like Heroku, you might need this for SSL:
  ssl: {
    rejectUnauthorized: false,
  },
});
db.connect();

app.use(express.static("public/"));
app.use(bodyParser.urlencoded({ extended: true }));

async function checkList() {
  const result = await db.query("SELECT * FROM todolist");
  return result.rows;
}

app.get("/", async (req, res) => {
  let result = await checkList();
  res.render("index.ejs", { list: result });
});

app.post("/add", async (req, res) => {
  await db.query("INSERT INTO todolist(title) VALUES ($1)", [req.body.Input]);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  await db.query("DELETE FROM todolist WHERE id = $1", [req.body.dltItem]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  let { id, title } = req.body;
  await db.query("UPDATE todolist SET title = $1 WHERE id = $2", [title, id]);
  res.redirect("/");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
