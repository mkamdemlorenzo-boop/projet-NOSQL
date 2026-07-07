const mysql = require("mysql2");

function connectDB() {
  const con = mysql.createConnection({
    host: "mysql",
    user: "game",
    password: "game",
    database: "gameproj",
  });

  con.connect((err) => {
    if (err) {
      console.error(err.code);
      setTimeout(connectDB, 2000);
      return;
    }

    console.log("Connecté à MySQL !");
  });
}

connectDB();

const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello World\n");
});

server.listen(process.env.PORT || 8080, "0.0.0.0", () => {
  console.log("Serveur démarré");
});