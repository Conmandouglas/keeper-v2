import express from "express";
import pg from "pg";
import cors from "cors";

const app = express();
const PORT = 5001;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "keeper",
  password: "the_password",
  port: 5433,
});

//middleware
app.use(cors());
app.use(express.json());
db.connect().catch(err => console.log(err));

app.get('/notes', async (req, res) => {
  try {
    const items = await db.query(
      'SELECT * FROM items ORDER BY item_id DESC'
    );
    res.json(items.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.post('/notes', async (req, res) => {
  try {
    console.log("Recieved Data: ", req.data);

    const { item_title, description } = req.body;
    const newNote = await db.query(
      'INSERT INTO items (item_title, description) VALUES ($1, $2) RETURNING *',
      [item_title, description]
    );
    res.json(newNote.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.put("/notes/:id", async (req, res) => {
  try {
    const item_id = parseInt(req.params.id, 10); // ✅ Ensure item_id is a number
    const { item_title, description } = req.body;

    const updateNote = await db.query(
      "UPDATE items SET item_title = $1, description = $2 WHERE item_id = $3 RETURNING *",
      [item_title, description, item_id]
    );

    if (updateNote.rowCount === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    console.log(updateNote.rows);
    res.json(updateNote.rows[0]); // Return the updated row
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete('/notes/:id', async (req, res) => {
  try {
    const item_id = req.params.id;

    const deletedNote = await db.query(
      "DELETE FROM items WHERE item_id = $1",
      [item_id]
    );
    res.json("Note was successfully deleted!");
  } catch (err) {
    console.log(err.message);
  }
});


app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
})