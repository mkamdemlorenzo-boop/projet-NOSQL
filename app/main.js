const express = require("express");
const path = require("path");
const {Hash} = require("./hash.js");

const server = express();

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
    await mysql.execute("create table if not exists user (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, profile_picture VARCHAR(50))")
    await mysql.execute("create table if not exists game (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, profile_picture VARCHAR(50))")
    await mongo.collection("game").insertOne({
        nom: "Honkai Impact 3rd",
        genre: ["Action et RPG"],
        desc: "L'ultime expérience anime d'action qui devient réelle ! Des ombrages celluloïdes HD, des combos infinis, des retours explosifs... Plongez dans l'action en temps réel de dernière génération ! Une histoire originale sur toutes les lèvres, des voix de premier choix... Entrez dans la légende !",
        suport: ["PC", "Mobile"],
        prix: 0.00
    });

server.use(express.urlencoded({ extended: true }));

server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "home.html"));
});

server.get("/addgame", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "create_game.html"));
});

server.post("/addgame", async (req, res) => {
    const name = req.body.name;
    const support = req.body.support;
    await mongo.collection("game").insertOne({
        name: name,
        genre: [""],
        desc: "",
        support: [""],
        prix: 0.00
    });
    await mysql.execute(
        "INSERT INTO game(name) VALUES (?)",
        [name]
    );
    res.redirect("/");
});

server.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "register.html"));
});

server.post("/register", async (req, res) => {
    const name = req.body.name;
    const password = Hash(req.body.password);
    await mysql.execute(
        "INSERT INTO user(name,password) VALUES (?,?)",
        [name, password]
    );
    res.redirect("/");
});

server.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "login.html"));
});

server.post("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "login.html"));
});

server.listen(process.env.PORT || 8080, "0.0.0.0", () => {
console.log("Serveur démarré");
});

}start();