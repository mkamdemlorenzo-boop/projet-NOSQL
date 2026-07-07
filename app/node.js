const mysql = require("mysql2");
const { MongoClient } = require("mongodb");
const { createClient } = require("redis");
const neo4j = require("neo4j-driver");


const con = mysql.createConnection({
    host: "mysql",
    user: "game",
    password: "game",
    database: "gameproj",
  });
const client_mongo = new MongoClient("mongodb://mongodb:27017");
const client_redis = createClient({
  url: "redis://redis:6379"
});
const client_neo4j = neo4j.driver(
  "neo4j://neo4j:7687",
  neo4j.auth.basic("neo4j", "streamflix")
);

function connectSQL() {
  con.connect((err) => {
    if (err) {
      console.error("MySQL erreur :", err);
      setTimeout(connectSQL, 2000);
      return;
    }

    console.log("Connecté à MySQL !");
  });
}

async function connectMongo() {
  try {
    await client_mongo.connect();
    console.log("Connecté à MongoDB !");
  } catch (err) {
    console.error("MongoDB erreur :", err);
    setTimeout(connectMongo, 2000);
  }
}

async function connectRedis() {
  try {
    await client_redis.connect();
    console.log("Connecté à Redis !");
  } catch (err) {
    console.error("Redis erreur :", err);
    setTimeout(connectRedis, 2000);
  }
}

async function connectNeo4j() {
  try {
    const serverInfo = await client_neo4j.getServerInfo();
    console.log("Connecté à  Neo4j");
    console.log(serverInfo);
  } catch (err) {
    console.error("Neo4j erreur :", err.message);
  } finally {
    await client_neo4j.close();
  }
}

connectMongo();
connectSQL();
connectRedis();
connectNeo4j();

const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello World\n");
});

server.listen(process.env.PORT || 8080, "0.0.0.0", () => {
  console.log("Serveur démarré");
});