import db from "../src/config/db.js";

const check = async () => {
    try {
        const [roles] = await db.query("SELECT * FROM roles");
        console.log("Roles:", roles);

        const [users] = await db.query("SELECT id, username, email, role_id FROM users");
        console.log("Users:", users);

        const [tables] = await db.query("SHOW TABLES");
        console.log("Tables:", tables);

    } catch (error) {
        console.error("Database check failed:", error.message);
    } finally {
        process.exit();
    }
};

check();
