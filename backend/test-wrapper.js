import db, { initializeDatabase } from './src/database/index.js';
import { QueryTypes } from 'sequelize';

const pool = {
  query: async (sql, params) => {
    const upperSql = sql.trim().toUpperCase();
    let type = QueryTypes.SELECT;
    
    if (upperSql.startsWith('INSERT')) type = QueryTypes.INSERT;
    else if (upperSql.startsWith('UPDATE')) type = QueryTypes.UPDATE;
    else if (upperSql.startsWith('DELETE')) type = QueryTypes.DELETE;
    
    const result = await db.sequelize.query(sql, {
      replacements: params,
      type
    });
    
    if (type === QueryTypes.SELECT) {
      return [result, []];
    } else if (type === QueryTypes.INSERT) {
      return [{ insertId: result[0], affectedRows: result[1] }, []];
    } else if (type === QueryTypes.UPDATE || type === QueryTypes.DELETE) {
      return [{ affectedRows: result[1] ?? result }, []];
    }
    return [result, []];
  }
};

await initializeDatabase();
const [rows] = await pool.query("SELECT * FROM users LIMIT 1");
console.log("SELECT returned:", rows);
process.exit(0);
