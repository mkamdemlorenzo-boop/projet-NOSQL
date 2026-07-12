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

78 101 32 99 111 110 102 105 101 32 106 97 109 97 105 115 32 100 101 32 116 114 97 118 97 105 108 32 195 160 32 117 110 32 112 114 111 99 114 97 115 116 105 110 97 116 101 117 114 46 