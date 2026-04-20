const express = require('express');
const morgan = require('morgan');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const chalk = require('chalk');
const http = require('http');
const cron = require('node-cron');
const { Server } = require('socket.io');
const path = require("path");
const fileUpload = require('express-fileupload');
const registerSocketHandlers = require('./sockets/messaging');

const app = express();
const server = http.createServer(app); // for socket
const hostname = 'nodejs_2526-cs7025-group2';
const port = 3000;
const project_name = 'cs7025 group 2';

const mariadb = require('mariadb');
const dbconfig = require('./dbconfig');

// Use Morgan for logging HTTP requests
app.use(morgan('dev'));

// Helps the app read JSON data sent from the client
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public"))); //static path

// must be before routes so req.files is available in controllers
app.use(fileUpload({                                
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
    responseOnLimit: "File size exceeds the 5MB limit."
})
);

// Frontend proxy
app.use(cors({
  origin: "http://localhost:5173",       
  credentials: true,
}));

// Establishing routes

const genresRouter = require("./routes/genres");
app.use("/ad-genres", genresRouter);

const eventsRoute = require("./routes/events");
app.use("/ad-events", eventsRoute);

// Monthly automated event update
const eventsModel = require("./models/events"); 
cron.schedule('0 0 1 */1 *', async () => { 
// cron.schedule("*/1 * * * *", async () => { // every 1 min.s - FOR TESTING
    console.log('It is the first day of the month. Updating events.');
    try {
      await eventsModel.fetchFilmsAndPopulate();
      await eventsModel.fetchLiveEventsAndPopulate("Music");
      await eventsModel.fetchLiveEventsAndPopulate("Arts-&-Theater");
    }
    catch (error) {
      console.error('Task failed:', error);
    }
});

const usersRoute = require("./routes/users")
app.use("/ad-users", usersRoute);

const authRoute = require("./routes/auth");
app.use("/ad-auth", authRoute);

const postsRoute = require("./routes/posts")
app.use("/ad-posts", postsRoute);

//the images user used can be visit public
app.use("/ad-uploads", express.static("public/uploads"));

// WIP
const messagesRoute = require("./routes/messages");
app.use("/ad-messages", messagesRoute);

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Define the root route that renders our index page
app.get('/', (req, res) => {
  res.render('index', { eventsRoute });
});

// Attach Socket.IO to the http server, then register handlers
const io = new Server(server, {                       
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  }
});
registerSocketHandlers(io);  

// Start the server
server.listen(port, hostname, () => {
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
    // console.table(rows);bruh

  } catch (err) {
    console.error("Error:", err);
  } finally {
    if (conn) conn.release(); // release to pool
    pool.end(); // close the pool when done
  }
}

main();
