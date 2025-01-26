import dotenv from "dotenv";
dotenv.config();

import _knex from "knex";

let knex = _knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  pool: { min: 0, max: 7 },
  useNullAsDefault: true,
});

async function testConnection() {
  try {
    await knex.raw("SELECT VERSION()");
    console.log("Connection to database is successful");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

testConnection();

export default knex;
