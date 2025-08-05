# Database Utilities Directory

This directory contains utility scripts and files for database management and setup.

## Database Management Scripts

### User Management
- `create-test-users.cjs` - Script to create test users in the database

### Database Maintenance
- `reset-database.js` - Script to reset the database to initial state
- `final-status-check.js` - Script to check final database status

### Sample Data
- `sample-resume.txt` - Sample resume file for testing purposes

## Usage

These utilities help with database setup, testing, and maintenance:

```bash
# Create test users
node database-utils/create-test-users.cjs

# Reset database
node database-utils/reset-database.js

# Check database status
node database-utils/final-status-check.js
```

Make sure to have the proper database connection configured before running these scripts.