import dotenv from "dotenv";
import mysql from "mysql2/promise";

// Load environment variables
dotenv.config();

if (!process.env.MONGODB_URI || !process.env.DB_HOST) {
  throw new Error("⚠️ Couldn't find .env file or missing DB variables ⚠️");
}
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  throw new Error("⚠️ Missing DB variables in .env ⚠️");
}

// ✅ Function to get MySQL connection (instead of exporting a Promise)
async function getMySQLConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 3306,
    });
    console.log("✅ MySQL connected!");
    return connection;
  } catch (error) {
    console.error("❌ MySQL connection error:", error);
    process.exit(1);
  }
}


export default {
  port: parseInt(process.env.PORT || "3000", 10),

  // MongoDB
  databaseURL: process.env.MONGODB_URI,

  // MySQL Connection
  getMySQLConnection, // ✅ Use this function instead of a Promise
  jwtSecret: process.env.JWT_SECRET,
  jwtAlgorithm: process.env.JWT_ALGO,

  logs: {
    level: process.env.LOG_LEVEL || "silly",
  },

  agenda: {
    dbCollection: process.env.AGENDA_DB_COLLECTION,
    pooltime: process.env.AGENDA_POOL_TIME,
    concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10),
  },

  agendash: {
    user: "agendash",
    password: "123456",
  },

  api: {
    prefix: "/api",
  },

  emails: {
    apiKey: process.env.MAILGUN_API_KEY,
    apiUsername: process.env.MAILGUN_USERNAME,
    domain: process.env.MAILGUN_DOMAIN,
  },
};