const mysql = require("mysql2");
const { MongoClient } = require("mongodb");
const { createClient } = require("redis");
const neo4j = require("neo4j-driver");

async function connectSQL() {
  const client = mysql.createConnection({
    host: "mysql",
    user: "game",
    password: "game",
    database: "gameproj",
  });
  await client.connect((err) => {
      if (err) {
          console.error("MySQL :", err.code);
          setTimeout(connectSQL, 2000);
          return;
      }
      console.log("Connecté à MySQL !");
  });
}

async function connectMongo() {
  const client_mongo = new MongoClient("mongodb://mongodb:27017");
  try {
    await client_mongo.connect();
    console.log("Connecté à MongoDB !");
  } catch (err) {
    console.error("MongoDB erreur :", err);
    setTimeout(connectMongo, 2000);
  }
}

async function connectRedis() {
  const client_redis = createClient({
  url: "redis://redis:6379"
  });
  try {
    await client_redis.connect();
    console.log("Connecté à Redis !");
  } catch (err) {
    console.error("Redis erreur :", err);
    setTimeout(connectRedis, 2000);
  }
}

async function connectNeo4j() {
  const client_neo4j = neo4j.driver(
    "bolt://neo4j:7687",
    neo4j.auth.basic("neo4j", "streamflix")
  );
  try {
    await client_neo4j.getServerInfo();
    console.log("Connecté à  Neo4j");
  } catch (err) {
    setTimeout(connectNeo4j, 2000);
  }
}

module.exports = {
  connectSQL,
  connectMongo,
  connectRedis,
  connectNeo4j
};