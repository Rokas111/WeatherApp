const mongo_db = require("../mongodb.js");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { ObjectId } = require("bson");

const MONGO_COLLECTION = "users";

mongo_db.collection(MONGO_COLLECTION).createIndex("email",{unique: true});

function isEmailValid(email) {
    return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

function isValidPassword(password) {
    password = String(password);
    if (password.length < 8) return {error: "Password must be at least 8 characters long",success:false};
    if (!password.split("").some((c) => c != c.toLowerCase())) return {error: "Password must have at least 1 capital letter",success:false};
    return {success: true};
}

module.exports.signup = async (email,password) => {
    if (!isEmailValid(email))  throw {message: "Email is invalid", from: "email"};
    if (!isValidPassword(password).success) throw {message: isValidPassword(password).error, from: "password"};

    if ((await mongo_db.collection(MONGO_COLLECTION).findOne({email: email}))) throw {message: "This email is already registered", from: "email"};
    
    const salt = await bcrypt.genSalt();
    const hashed_password = await bcrypt.hash(password,salt);

    const result = await mongo_db.collection(MONGO_COLLECTION).insertOne({
        email: email,
        password: hashed_password,
        avatar: Math.floor(Math.random()*5)
    });
    return jwt.sign({id: result.insertedId}, process.env.JWT_SECRET);
}

module.exports.login = async (email,password) => {
    if (!isEmailValid(email)) throw {message: "Email is invalid", from: "email"};
    if (!isValidPassword(password).success) throw {message: isValidPassword(password).error, from: "password"};

    if (!(await mongo_db.collection(MONGO_COLLECTION).findOne({email: email}))) throw {message: "This email doesn't exist", from: "email"};
    
    const user = await mongo_db.collection(MONGO_COLLECTION).findOne({email: email});

    user

    if (!(await bcrypt.compare(password,user.password))) throw {message:"Password is incorrect",from: "password"};
    return jwt.sign({id: user._id}, process.env.JWT_SECRET);
    
}

module.exports.authenticateUser = async (decoded_jwt) => {
    const user = await mongo_db.collection(MONGO_COLLECTION).findOne({_id: new ObjectId(decoded_jwt)});
    return user;
}

module.exports.deleteUser = async (user) => {
    await mongo_db.collection(MONGO_COLLECTION).deleteOne({_id: user._id});
}