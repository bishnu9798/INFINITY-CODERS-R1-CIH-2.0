const sqlite3 = require('sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'jobportal.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('📁 Connected to SQLite database');
  }
});

// Check users in database
db.all('SELECT id, email, user_type, full_name, company_name, created_at FROM users', (err, rows) => {
  if (err) {
    console.error('Error querying users:', err);
  } else {
    console.log('\n📊 Users in database:');
    console.table(rows);
  }
  
  db.close();
});
