import { Sequelize } from "sequelize";
import config from "@/config";

// ✅ Ensure that environment variables exist
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  throw new Error("⚠️ Missing MySQL environment variables in .env ⚠️");
}

// ✅ Create Sequelize instance with correct credentials
const sequelize = new Sequelize(
  process.env.DB_NAME as string, // Database name
  process.env.DB_USER as string, // Username
  process.env.DB_PASSWORD as string, // Password
  {
    host: process.env.DB_HOST as string,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
    logging: false, // Set to true if you want SQL logs
  }
);

// ✅ Function to test MySQL connection
async function testDBConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connection to MySQL has been established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1); // Stop server if connection fails
  }
}

// Call the test function
testDBConnection();

export default sequelize;