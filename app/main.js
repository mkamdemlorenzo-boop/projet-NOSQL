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
    // await mongo.collection("game").insertOne({
    //     name: "Honkai Impact 3rd",
    //     genre: ["Action et RPG"],
    //     desc: "L'ultime expérience anime d'action qui devient réelle ! Des ombrages celluloïdes HD, des combos infinis, des retours explosifs... Plongez dans l'action en temps réel de dernière génération ! Une histoire originale sur toutes les lèvres, des voix de premier choix... Entrez dans la légende !",
    //     support: ["PC", "Mobile"],
    //     prix: 0.00
    // });

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
    const editor = req.body.editor;
    const genre = req.body.genre;
    const desc = req.body.desc;
    const prix = parseInt(req.body.prix);
    if (name != "" || support != "" || genre != "" || desc != "" || editor != "")
    {
        if (typeof prix === "number") {
            await mongo.collection("game").insertOne({
                name: name,
                editor: editor,
                genre: [genre],
                desc: desc,
                support: [support],
                prix: prix
            });
            await mysql.execute(
                "INSERT INTO game(name) VALUES (?)",
                [name]
            );
            res.redirect("/game");
        }else{
            res.redirect("/addgame");
        }
    }else{
        res.redirect("/addgame");
    }
});

server.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "register.html"));
});

server.get("/user", async (req, res) => {
    const [rows] = await mysql.execute("SELECT name, id FROM user");

    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Users</title>
    </head>
    <body>
        <h1>Liste des utilisateurs</h1>
        <ul>
    `;

    for (const user of rows) {
    html += `
        <form action="/profile/${user.id}" method="GET">
            <button type="submit">${user.name}</button>
        </form>
    `;
}

    html += `
        </ul>
    <form action="/register">
        <button type="submit">create user</button>
    </form>
    </body>
    </html>
    `;

    res.send(html);
});

server.get("/friend/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const [rows] = await mysql.execute(
        "SELECT name, id FROM user WHERE id != ?",
        [id]
    );

    let html = `
    <!DOCTYPE html>
    <html>
    <body>
        <h1>Liste des utilisateurs Existant pour envoie d'amie</h1>
        <ul>
    `;

    for (const user of rows) {
    html += `
        <form action="/profile/${user.id}" method="GET">
            <button type="submit">${user.name}</button>
        </form>
    `;
}
    res.send(html);
});

server.get("/profile/:id", async (req, res) => {
    const id = req.params.id;

    const [rows] = await mysql.execute(
        "SELECT name FROM user WHERE id = ?",
        [id]
    );
    const user = rows[0]
    const vue = await redis.incr(user.name);
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Users</title>
    </head>
    <body>
        <h1>Name: ${user.name}</h1>
        <h1>nombre de vue: ${vue}</h1>
        <ul>
    `;

    for (const user of rows) {
    }

    html += `
        </ul>
    <form action="/friend/${id}">
        <button type="submit">create link</button>
    </form>
    </body>
    </html>
    `;

    res.send(html);
});

server.get("/game", async (req, res) => {
    const [rows] = await mysql.execute("SELECT name, id FROM game");

    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Games</title>
    </head>
    <body>
        <h1>Liste des utilisateurs</h1>
        <ul>
    `;

    for (const game of rows) {
    html += `
        <form action="/resume/${game.id}" method="GET">
            <button type="submit">${game.name}</button>
        </form>
    `;
}

    html += `
        </ul>
    <form action="/addgame">
        <button type="submit">create game</button>
    </form>
    </body>
    </html>
    `;

    res.send(html);
});

server.get("/resume/:id", async (req, res) => {
    const id = req.params.id;

    const [rows] = await mysql.execute(
        "SELECT name FROM game WHERE id = ?",
        [id]
    );

    const detail = await mongo.collection("game").findOne({name: rows[0].name}); //, editor: rows[0].editor 
    const vue = await redis.incr(user.name);
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Games</title>
    </head>
    <body>
        <h1>Name: ${detail.name}</h1>
        <h1>Editor: ${detail.editor}</h1>
        <h1>description: ${detail.desc}</h1>
        <h1>genre: ${detail.genre[0]}</h1>
        <h1>support: ${detail.support[0]}</h1>
        <h1>prix: ${detail.prix}</h1>
        <h1>vue: ${vue}</h1>
        <ul>
    `;
    res.send(html);
});

server.post("/register", async (req, res) => {
    const name = req.body.name;
    const password = Hash(req.body.password);
    const [rows] = await mysql.execute("SELECT name from user where name = ?;",
        [name]);

    if (rows.length < 1) {
        await mysql.execute(
            "INSERT INTO user(name,password) VALUES (?,?)",
            [name, password]
        );

        res.redirect("/user");
    }
    res.redirect("/register");
});

server.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "login.html"));
});

server.post("/login", async (req, res) => {
    const name = req.body.name;
    const password = Hash(req.body.password);
    const [rows] = await mysql.execute("SELECT name from user where name = ? and password = ?;",
        [name, password]);

    if (rows.length > 0) {
        res.redirect("/");
    }
    res.redirect("/login");
});

server.listen(process.env.PORT || 8080, "0.0.0.0", () => {
console.log("Serveur démarré");
});

}start();