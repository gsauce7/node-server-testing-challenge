const request = require("supertest")
const db = require("./data/db-config.js")
const server = require("./api/server.js")

const gabe = { username: "Gabe", password: "1234", role_id: 1 }
const ania = { username: "Ania", password: "happy", role_id: 1 }

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})
beforeEach(async () => {
    await db("users").truncate()
    await db("roles").truncate()
    await db("roles").insert({ role_name: 'student' })
    await db("roles").insert({ role_name: 'instructor' })
})
afterAll(async () => {
    await db.destroy()
})

describe("server", () => {
    describe("getting a user", () => {
        it("gets users from the database", async () => {
            await db("users").insert(gabe)
            await db("users").insert(ania)
            let res = await request(server).get("/api/user")
            expect(res.body).toHaveLength(2)
        })
    })
    describe("creating a user", () => {
        it("adds a user to the database", async () => {
            let res
            await request(server).post("/api/user").send(gabe)
            res = await db("users")
            expect(res).toHaveLength(1)

            await request(server).post("/api/user").send(ania)
            res = await db("users")
            expect(res).toHaveLength(2)
        })
        it("responds with newly created user", async () => {
            let res
            res = await request(server).post("/api/user").send(gabe)
            expect(res.body).toHaveProperty("username")
            expect(res.body.username).toEqual(gabe.username)

            res = await request(server).post("/api/user").send(ania)
            expect(res.body).toHaveProperty("username")
            expect(res.body.username).toEqual(ania.username)
        })
    })
    describe("deleting a user", () => {
        it("removes user from database", async () => {
            let res = await db("users")
            expect(res).toHaveLength(0)
            await db("users").insert(gabe)
            await db("users").insert(ania)
            res = await db("users")
            expect(res).toHaveLength(2)

            await request(server).delete("/api/user/1")
            res = await db("users")
            expect(res).toHaveLength(1)

            await request(server).delete("/api/user/2")
            res = await db("users")
            expect(res).toHaveLength(0)
        })
    })
})