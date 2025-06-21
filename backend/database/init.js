const sqlite3 = require('sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'jobportal.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('📁 Connected to SQLite database');
  }
});

// Initialize database tables
const initializeDatabase = async () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          user_type TEXT NOT NULL CHECK(user_type IN ('jobseeker', 'recruiter')),
          full_name TEXT,
          phone TEXT,
          location TEXT,
          bio TEXT,
          skills TEXT,
          experience TEXT,
          education TEXT,
          company_name TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Jobs table
      db.run(`
        CREATE TABLE IF NOT EXISTS jobs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          company TEXT NOT NULL,
          location TEXT NOT NULL,
          experience TEXT NOT NULL,
          skills TEXT NOT NULL,
          description TEXT NOT NULL,
          salary_range TEXT,
          job_type TEXT DEFAULT 'full-time',
          recruiter_id INTEGER NOT NULL,
          status TEXT DEFAULT 'active' CHECK(status IN ('active', 'closed', 'draft')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (recruiter_id) REFERENCES users (id)
        )
      `);

      // Applications table
      db.run(`
        CREATE TABLE IF NOT EXISTS applications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          job_id INTEGER NOT NULL,
          jobseeker_id INTEGER NOT NULL,
          resume_filename TEXT,
          cover_letter TEXT,
          status TEXT DEFAULT 'applied' CHECK(status IN ('applied', 'shortlisted', 'rejected', 'hired')),
          applied_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (job_id) REFERENCES jobs (id),
          FOREIGN KEY (jobseeker_id) REFERENCES users (id),
          UNIQUE(job_id, jobseeker_id)
        )
      `);

      // Insert sample data
      db.run(`
        INSERT OR IGNORE INTO users (id, email, password, user_type, full_name, company_name) 
        VALUES 
        (1, 'recruiter@example.com', '$2a$10$example', 'recruiter', 'John Recruiter', 'Tech Innovators Inc.'),
        (2, 'jobseeker@example.com', '$2a$10$example', 'jobseeker', 'Jane Jobseeker', NULL)
      `);

      db.run(`
        INSERT OR IGNORE INTO jobs (id, title, company, location, experience, skills, description, recruiter_id) 
        VALUES 
        (1, 'Frontend Developer', 'Tech Innovators Inc.', 'New York, NY', '2-4 years', 'React,JavaScript,CSS', 'We are looking for a passionate frontend developer to join our team...', 1),
        (2, 'Data Scientist', 'AI Solutions Ltd.', 'San Francisco, CA', '3-5 years', 'Python,Machine Learning,SQL', 'Join our data science team to build cutting-edge AI solutions...', 1)
      `, (err) => {
        if (err) {
          console.error('Error initializing database:', err);
          reject(err);
        } else {
          console.log('✅ Database initialized successfully');
          resolve();
        }
      });
    });
  });
};

module.exports = { db, initializeDatabase };
