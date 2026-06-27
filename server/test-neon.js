const db = require("./db");

async function testConnection() {
  try {
    const result = await db.query("SELECT NOW()");
    console.log("Neon connected successfully:", result.rows[0]);
  } catch (error) {
    console.error("Neon connection failed:", error.message);
  } finally {
    await db.end();
  }
}

testConnection();