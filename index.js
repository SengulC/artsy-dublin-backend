const express = require('express');
const morgan = require('morgan');
const cors = require("cors");
const chalk = require('chalk');
const path = require("path");
const fileUpload = require('express-fileupload');

const app = express();
const hostname = 'nodejs_2526-cs7025-group2';
const port = 3000;
const project_name = 'cs7025 group 2';

const mariadb = require('mariadb');
const dbconfig = require('./dbconfig');

// Use Morgan for logging HTTP requests
app.use(morgan('dev'));

// Helps the app read JSON data sent from the client
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); //static path

// must be before routes so req.files is available in controllers
app.use(fileUpload({                                
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
    responseOnLimit: "File size exceeds the 5MB limit."
})
);

// Establishing routes
app.use(cors());

const eventsRoute = require("./routes/events");
app.use("/events", eventsRoute);

// const usersRoute = require("./routes/users")
// app.use("/users", usersRoute);

// const postsRoute = require("./routes/posts")
// app.use("/posts", postsRoute);

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Define the root route that renders our index page
app.get('/', (req, res) => {
  res.render('index', { eventsRoute });
});

// Start the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// Create a connection pool
const pool = mariadb.createPool(dbconfig);

async function main() {
  let conn;
  try {
    conn = await pool.getConnection();

    // Query the table to get all rows
    // const rows = await conn.query("SE  LECT * FROM genres");
    // console.log("Table contents:");
    // console.table(rows);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    if (conn) conn.release(); // release to pool
    pool.end(); // close the pool when done
  }
}

main();
