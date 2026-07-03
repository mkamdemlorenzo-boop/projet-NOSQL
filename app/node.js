let mysql = require('mysql');

let con = mysql.createConnection({
  host: "mysql",
  user: "game",
  password: "game",
  database: "gameproj"
});

// Import the HTTP module
const http = require('http');

// Create a server object
const server = http.createServer((req, res) => {
  // Set the response HTTP header with HTTP status and Content type
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  // Send the response body as 'Hello, World!'
  res.end('Hello, World!\n');
});

// Define the port to listen on const PORT = 3000;

// Start the server and listen on the specified port
const PORT = process.env.PORT;
server.listen(PORT, '0.0.0.0', () => {
  
  con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
  // console.log(`Server running at http://localhost:${PORT}/`);
});