const http = require("http");
const {  
    connectSQL,
    connectMongo,
    connectRedis,
    connectNeo4j 
} = require("./database.js")

async function start() {
const [mongo, redis, mysql, neo4j] = await Promise.all([
    connectMongo(),
    connectRedis(),
    connectSQL(),
    connectNeo4j()
]);
    await mysql.execute("create table if not exists user (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), password VARCHAR(255), profile_picture VARCHAR(50))")
    await mysql.execute("create table if not exists game (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), profile_picture VARCHAR(50))")
    await mongo.collection("game").insertOne({
        nom: "Honkai Impact 3rd",
        suport: ["PC", "Mobile"]
    });

return [mongo, redis, mysql, neo4j]
}

start();

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`Hello World`);
});

server.listen(process.env.PORT || 8080, "0.0.0.0", () => {
console.log("Serveur démarré");
});