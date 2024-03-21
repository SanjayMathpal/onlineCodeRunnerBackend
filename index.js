import express from "express";
import mysql from "mysql";
import cors from "cors"
import dotenv from "dotenv"

const app = express();

const port = 8000;

dotenv.config()

app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME
});

db.connect((e) => {
    if (e) {
        console.log("error");
    } else {
        console.log("connection successful");
    }
});

// Middleware for parsing JSON request bodies
app.use(express.json());

// Route to handle form submission
app.post('/api/submit', (req, res) => {
    const {username, language, stdin, sourceCode} = req.body;
  
    // Insert data into MySQL database using the 'db' connection
    db.query('INSERT INTO tbl (username, language, stdin, sourceCode) VALUES (?, ?, ?, ?)', [username, language, stdin, sourceCode], (error, results) => {
      if (error) {
        console.error('Error inserting data into database:', error);
        res.status(500).json({ error: 'An error occurred while submitting the code snippet.' });
      } else {
        res.status(201).json({ message: 'Code snippet submitted successfully.' });
      }
    });
});

app.get('/api/output', (req, res) => {
    db.query('SELECT * FROM tbl', (error, results, fields) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'An error occurred while retrieving code snippets' });
        return;
      }
      res.json(results);
    });
  });

app.get("/", (req, res) => {
    res.send("hello world");
});

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
