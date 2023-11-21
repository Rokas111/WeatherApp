const passport = require("passport");
const UserController = require("./controllers/UserController.js");

const {Strategy: JWTStrategy, ExtractJwt} = require("passport-jwt");

passport.use(new JWTStrategy({secretOrKey: process.env.JWT_SECRET, jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()},(jwt,done) => {
    UserController.authenticateUser(jwt.id).then((res) => done(null,res)).catch((e) => done(null,false));
}));

module.exports = passport;