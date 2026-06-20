import { getEnrolledStudents } from '../src/modules/classes/service/class.service.js';
import db from '../src/config/db.js';

async function test() {
  try {
    const res = await getEnrolledStudents(1, { role: 'teacher', id: 1 });
    console.log(res);
  } catch (err) {
    console.error("ERROR CAUGHT:");
    console.error(err);
  } finally {
    process.exit(0);
  }
}
test();
