export const up = async (db) => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS pending_enrollments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      class_id INT NOT NULL,
      student_id INT NOT NULL,
      status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
      requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      responded_at TIMESTAMP NULL,

      UNIQUE (class_id, student_id),

      FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
};

export const down = async (db) => {
  await db.query(`DROP TABLE IF EXISTS pending_enrollments`);
};
