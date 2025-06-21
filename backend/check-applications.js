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

// Check applications with job and user details
db.all(`
  SELECT 
    a.id as application_id,
    a.status,
    a.applied_date,
    a.resume_filename,
    j.title as job_title,
    j.company,
    u.full_name,
    u.email,
    u.user_type,
    r.full_name as recruiter_name,
    r.email as recruiter_email
  FROM applications a
  JOIN jobs j ON a.job_id = j.id
  JOIN users u ON a.jobseeker_id = u.id
  JOIN users r ON j.recruiter_id = r.id
  ORDER BY a.applied_date DESC
`, (err, rows) => {
  if (err) {
    console.error('Error querying applications:', err);
  } else {
    console.log('\n📊 Applications in database:');
    if (rows.length === 0) {
      console.log('No applications found');
    } else {
      console.table(rows);
    }
  }
  
  // Also check users
  db.all('SELECT id, email, user_type, full_name FROM users', (err, users) => {
    if (err) {
      console.error('Error querying users:', err);
    } else {
      console.log('\n👥 Users in database:');
      console.table(users);
    }
    
    // Check jobs
    db.all('SELECT id, title, company, recruiter_id FROM jobs', (err, jobs) => {
      if (err) {
        console.error('Error querying jobs:', err);
      } else {
        console.log('\n💼 Jobs in database:');
        console.table(jobs);
      }
      
      db.close();
    });
  });
});
