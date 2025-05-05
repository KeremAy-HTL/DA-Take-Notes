import sqlite from 'sqlite3';
import util from 'util';

sqlite.verbose();

const db = new sqlite.Database('./data/takenotes_sqlite_fixed_v2.sqlite', sqlite.OPEN_READWRITE);
db.run('PRAGMA TimeZone = "Europe/Vienna"');
const query = util.promisify(db.all).bind(db);

export default query;
