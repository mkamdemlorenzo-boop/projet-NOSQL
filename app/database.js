const mysql = require("mysql2/promise");
const { MongoClient } = require("mongodb");
const { createClient } = require("redis");
const neo4j = require("neo4j-driver");

async function connectSQL() {
    try {
    const client = await mysql.createConnection({
      host: "mysql",
      user: "game",
      password: "game",
      database: "gameproj",
    });
    console.log("Connecté à MySQL !");
    return client
    } catch (err) {
        console.error("MySQL :", err.code);
        await new Promise(r => setTimeout(r, 2000));
        return connectSQL();
    }
}

async function connectMongo() {
    const client = new MongoClient("mongodb://mongodb:27017");
    try {
      await client.connect();
      console.log("Connecté à MongoDB !");
    return client.db("gameproj");
    } catch (err) {
      console.error("MongoDB erreur :", err);
      await new Promise(r => setTimeout(r, 2000));
      return connectMongo();
    }
}

async function connectRedis() {
    const client = createClient({
    url: "redis://redis:6379"
    });
    try {
      await client.connect();
      console.log("Connecté à Redis !");
      return client
    } catch (err) {
      console.error("Redis erreur :", err);
      await new Promise(r => setTimeout(r, 2000));
      return connectRedis();
    }
}

async function connectNeo4j() {
    const client = neo4j.driver(
      "bolt://neo4j:7687",
      neo4j.auth.basic("neo4j", "streamflix")
    );
    try {
      await client.getServerInfo();
      console.log("Connecté à Neo4j");
      return client
    } catch (err) {
      console.error("Neo4j erreur :", err.code);
      await new Promise(r => setTimeout(r, 2000));
      return connectNeo4j();
    }
}

module.exports = {
  connectSQL,
  connectMongo,
  connectRedis,
  connectNeo4j
};