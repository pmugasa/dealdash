require("dotenv").config();

const PORT = 3001;

const MONGODB_URI = process.env.MONGODB_URI;

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = { PORT, MONGODB_URI, JWT_SECRET };
