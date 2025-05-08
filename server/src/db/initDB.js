import fs from 'fs';
import sqlite3 from 'sqlite3';

sqlite3.verbose();

const db = new sqlite3.Database('./data/takenotes_sqlite.sqlite');

// Here will read the file db.sql and execute the queries
db.exec(fs.readFileSync('./data/createDB.sql', 'utf-8').toString(), (err) => {
  if (err) {
    console.log('Error creating tables', err);
  } else {
    console.log('Tables created');
  }
});
