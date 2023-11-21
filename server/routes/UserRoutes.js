const userController = require("../controllers/UserController.js");
const passport = require("../passport.js");


const Router = new (require("express").Router);

Router.post("/api/signup", async (req,res) => {
    try {
        res.json({jwt: await userController.signup(req.body.email,req.body.password)});
    } catch (e) {
        res.json({error: e});
    }
});

Router.post("/api/login", async (req,res) => {
    try {
        res.json({jwt: await userController.login(req.body.email,req.body.password)});
    } catch (e) {
        res.json({error: e});
    }
});

Router.get("/api/user",passport.authenticate('jwt', { session: false }), async (req,res) => {
    res.json(req.user);
});

Router.delete("/api/user",passport.authenticate('jwt', { session: false }), async (req,res) => {
    try {
        await userController.deleteUser(req.user);
        res.status(200).json({});
    } catch (e) {
        console.log(e);
        res.status(500).json({error: e});
    }
});

module.exports = Router;