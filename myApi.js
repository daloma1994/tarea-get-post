const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = 8080;

mongoose.connect("mongodb+srv://API:Daloma1994.@mydatabase1.ev3pgtg.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true });

const db = mongoose.connection;

const User = mongoose.model("User", {
    name: String,
    email: String,
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/add", async (req, res) => {
    const { name, email } = req.body;

    const newUser = new User({ name, email });

    try {
        await newUser.save();
        const userID = newUser._id;
        console.log("Usuario agregado exitosamente " + userID);
        res.redirect(`/?success=1&userId=${userID}`);
    } catch (err) {
        console.error("Error insertando el documento:", err);
        res.status(500).send("Error agregando usuario");
    }
});

app.get("/users/:userId", async (req, res) => {
    try {
        const userID = req.params.userId;
        const user = await User.findById(userID);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json(user);
    } catch (err) {
        console.error("Error mostrando usuario: ", err);
        res.status(500).json({ error: "Error mostrando usuario" });
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
