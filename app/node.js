const mysql = require("mysql2");
const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://mongodb:27017");

function connectSQL() {
  const con = mysql.createConnection({
    host: "mysql",
    user: "game",
    password: "game",
    database: "gameproj",
  });

  con.connect((err) => {
    if (err) {
      console.error(err.code);
      setTimeout(connectSQL, 2000);
      return;
    }

    console.log("Connecté à MySQL !");
  });
}

async function connectMongo() {
  await client.connect();
  console.log("Connecté à MongoDB !");
  
  const db = client.db("gameproj");
}

connectMongo();
connectSQL();

const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello World\n");
});

server.listen(process.env.PORT || 8080, "0.0.0.0", () => {
  console.log("Serveur démarré");
});