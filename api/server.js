const express = require("express");
const usersRouter = require("./users/users-router")
const server = express();

server.use(express.json());
server.use("/api/user", usersRouter)

server.use("/", (req, res) => {
    res.status(200).json("Yes, this works!")
})

module.exports = server;