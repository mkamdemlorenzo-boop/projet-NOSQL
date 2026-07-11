const http = require("http");
const {  
    connectSQL,
    connectMongo,
    connectRedis,
    connectNeo4j 
} = require("./node.js")

async function start() {
await connectMongo()
await connectRedis()
await connectNeo4j()
await connectSQL()
}

start();

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`Hello World`);
});

server.listen(process.env.PORT || 8080, "0.0.0.0", () => {
console.log("Serveur démarré");
});