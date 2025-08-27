const http = require('http');
const url = require('url');

const PORT = 3004;

console.log('🔄 Starting minimal HTTP server...');

// In-memory storage for jobs and applications
let jobs = [
  {
    id: '1',
    title: 'Senior React Developer',
    company: 'TechCorp',
    location: 'Remote',
    salary: '$80,000 - $120,000',
    salaryRange: '$80,000 - $120,000',
    experience: '3+ years',
    skills: ['React', 'JavaScript', 'Node.js'],
    description: 'We are looking for an experienced React developer to join our team.',
    requirements: 'React, JavaScript, Node.js, 3+ years experience',
    type: 'Full-time',
    jobType: 'full-time',
    postedDate: new Date().toISOString(),
    recruiter: 'manishmodi0408@gmail.com',
    applications: 2
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'StartupHub',
    location: 'New York, NY',
    salary: '$70,000 - $100,000',
    salaryRange: '$70,000 - $100,000',
    experience: '2+ years',
    skills: ['React', 'Node.js', 'MongoDB'],
    description: 'Join our growing startup as a full stack developer.',
    requirements: 'React, Node.js, MongoDB, 2+ years experience',
    type: 'Full-time',
    jobType: 'full-time',
    postedDate: new Date().toISOString(),
    recruiter: 'manishmodi0408@gmail.com',
    applications: 1
  }
];

let applications = [];

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  console.log(`${method} ${path}`);

  // Health check endpoint
  if (path === '/api/health' && method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ 
      status: 'OK', 
      message: 'Minimal server is running',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Login endpoint
  if (path === '/api/auth/login' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const { email, password } = JSON.parse(body);
        console.log('Login attempt:', email);

        if (email === 'manishmodi0408@gmail.com' && password === '987654') {
          res.writeHead(200);
          res.end(JSON.stringify({
            message: 'Login successful',
            token: 'test-token-recruiter',
            user: {
              id: '1',
              email: email,
              userType: 'recruiter',
              fullName: 'Manish Modi',
              companyName: 'The Tech World'
            }
          }));
        } else if (email === 'manish1@gmail.com' && password === '123456') {
          res.writeHead(200);
          res.end(JSON.stringify({
            message: 'Login successful',
            token: 'test-token-jobseeker',
            user: {
              id: '2',
              email: email,
              userType: 'jobseeker',
              fullName: 'Manish Kumar'
            }
          }));
        } else {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid credentials' }));
        }
      } catch (error) {
        console.error('Login error:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Server error' }));
      }
    });
    return;
  }

  // Register endpoint
  if (path === '/api/auth/register' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const { email, password, userType, fullName, companyName } = JSON.parse(body);
        console.log('Registration attempt:', email, userType);

        res.writeHead(201);
        res.end(JSON.stringify({
          message: 'User created successfully',
          token: 'test-token-new-user',
          user: {
            id: Date.now().toString(),
            email: email,
            userType: userType,
            fullName: fullName,
            companyName: companyName
          }
        }));
      } catch (error) {
        console.error('Registration error:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Server error' }));
      }
    });
    return;
  }

  // Get all jobs endpoint
  if (path === '/api/jobs' && method === 'GET') {
    console.log('📋 GET /api/jobs - Getting all jobs, count:', jobs.length);

    res.writeHead(200);
    res.end(JSON.stringify(jobs));
    return;
  }

  // Post new job endpoint
  if (path === '/api/jobs' && method === 'POST') {
    console.log('📝 POST /api/jobs - Job creation request received');
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        console.log('📝 Raw request body:', body);
        const jobData = JSON.parse(body);
        console.log('📝 Parsed job data:', JSON.stringify(jobData, null, 2));

        // Validate required fields
        if (!jobData.title || !jobData.company || !jobData.location) {
          console.log('❌ Missing required fields');
          res.writeHead(400);
          res.end(JSON.stringify({
            error: 'Missing required fields: title, company, location'
          }));
          return;
        }

        const newJob = {
          id: Date.now().toString(),
          title: jobData.title,
          company: jobData.company,
          location: jobData.location,
          experience: jobData.experience || 'Not specified',
          skills: Array.isArray(jobData.skills) ? jobData.skills : (jobData.skills ? jobData.skills.split(',').map(s => s.trim()) : []),
          description: jobData.description || 'No description provided',
          salary: jobData.salaryRange || 'Not specified',
          salaryRange: jobData.salaryRange || 'Not specified',
          type: jobData.jobType || 'full-time',
          jobType: jobData.jobType || 'full-time',
          requirements: Array.isArray(jobData.skills) ? jobData.skills.join(', ') : (jobData.skills || 'Not specified'),
          postedDate: new Date().toISOString(),
          recruiter: 'manishmodi0408@gmail.com', // Mock recruiter
          applications: 0
        };

        // Add to jobs array
        jobs.push(newJob);
        console.log('✅ Job created and stored successfully:', newJob.title);
        console.log('📊 Total jobs now:', jobs.length);

        res.writeHead(201);
        res.end(JSON.stringify({
          message: 'Job created successfully',
          jobId: newJob.id,
          job: newJob
        }));
      } catch (error) {
        console.error('❌ Job creation error:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Server error: ' + error.message }));
      }
    });
    return;
  }

  // Get recruiter's jobs endpoint
  if (path === '/api/jobs/recruiter/my-jobs' && method === 'GET') {
    console.log('📋 GET /api/jobs/recruiter/my-jobs - Getting recruiter jobs');

    // Filter jobs by current recruiter (mock: manishmodi0408@gmail.com)
    const recruiterJobs = jobs.filter(job => job.recruiter === 'manishmodi0408@gmail.com');
    console.log('📊 Found', recruiterJobs.length, 'jobs for recruiter');

    // Add application count to each job
    const jobsWithApplications = recruiterJobs.map(job => ({
      ...job,
      application_count: job.applications || 0
    }));

    res.writeHead(200);
    res.end(JSON.stringify(jobsWithApplications));
    return;
  }

  // Apply for job endpoint
  if (path === '/api/applications' && method === 'POST') {
    console.log('📝 POST /api/applications - Job application request received');
    console.log('📝 Content-Type:', req.headers['content-type']);

    // Handle multipart/form-data for file uploads
    if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
      let body = Buffer.alloc(0);

      req.on('data', chunk => {
        body = Buffer.concat([body, chunk]);
      });

      req.on('end', () => {
        try {
          // Simple multipart parsing (for demo purposes)
          const bodyStr = body.toString();
          console.log('📝 Multipart body received, length:', body.length);
          console.log('📝 First 500 chars of body:', bodyStr.substring(0, 500));

          // Extract jobId from form data - improved parsing
          let jobId = null;

          // Try multiple patterns to extract jobId
          const patterns = [
            /name="jobId"[^]*?\r?\n\r?\n([^\r\n-]+)/,
            /name="jobId"[^]*?([^\r\n-]+)/,
            /Content-Disposition: form-data; name="jobId"[^]*?\r?\n\r?\n([^\r\n-]+)/
          ];

          for (const pattern of patterns) {
            const match = bodyStr.match(pattern);
            if (match && match[1]) {
              jobId = match[1].trim();
              console.log('📝 Found jobId with pattern:', pattern.source);
              break;
            }
          }

          // If still no jobId, try a more aggressive search
          if (!jobId) {
            const lines = bodyStr.split('\n');
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].includes('name="jobId"') && i + 2 < lines.length) {
                jobId = lines[i + 2].trim();
                console.log('📝 Found jobId in line-by-line search:', jobId);
                break;
              }
            }
          }

          // Extract filename if present
          const filenameMatch = bodyStr.match(/filename="([^"]+)"/);
          const filename = filenameMatch ? filenameMatch[1] : 'resume.pdf';

          console.log('📝 Extracted jobId:', jobId);
          console.log('📝 Extracted filename:', filename);
          console.log('📝 Available job IDs:', jobs.map(j => j.id));
          console.log('📝 Total jobs in storage:', jobs.length);

          if (!jobId) {
            console.log('❌ No jobId found in request');
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Job ID is required' }));
            return;
          }

          // Find the job to get job details
          const job = jobs.find(j => j.id === jobId);
          console.log('📝 Looking for job with ID:', jobId);
          console.log('📝 Found job:', job ? job.title : 'NOT FOUND');

          if (!job) {
            console.log('❌ Job not found with ID:', jobId);
            console.log('📝 Available jobs:', jobs.map(j => ({ id: j.id, title: j.title })));
            res.writeHead(404);
            res.end(JSON.stringify({
              error: 'Job not found',
              requestedJobId: jobId,
              availableJobIds: jobs.map(j => j.id)
            }));
            return;
          }

          const newApplication = {
            id: Date.now().toString(),
            jobId: jobId,
            jobTitle: job.title,
            company: job.company,
            applicantName: 'John Doe', // Mock applicant
            applicantEmail: 'manish1@gmail.com', // Mock applicant email
            appliedDate: new Date().toISOString(),
            status: 'pending',
            resume: filename
          };

          // Add to applications array
          applications.push(newApplication);

          // Update job application count
          job.applications = (job.applications || 0) + 1;

          console.log('✅ Application submitted successfully for job:', job.title);
          console.log('📊 Total applications now:', applications.length);

          res.writeHead(201);
          res.end(JSON.stringify({
            message: 'Application submitted successfully',
            applicationId: newApplication.id,
            application: newApplication
          }));
        } catch (error) {
          console.error('❌ Application error:', error);
          res.writeHead(500);
          res.end(JSON.stringify({ error: 'Server error: ' + error.message }));
        }
      });
    } else {
      // Handle JSON data (fallback)
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        try {
          const applicationData = JSON.parse(body);
          console.log('📝 JSON application data:', applicationData);

          const newApplication = {
            id: Date.now().toString(),
            ...applicationData,
            appliedDate: new Date().toISOString(),
            status: 'pending'
          };

          applications.push(newApplication);

          res.writeHead(201);
          res.end(JSON.stringify({
            message: 'Application submitted successfully',
            application: newApplication
          }));
        } catch (error) {
          console.error('❌ Application error:', error);
          res.writeHead(500);
          res.end(JSON.stringify({ error: 'Server error: ' + error.message }));
        }
      });
    }
    return;
  }

  // Get user's applications endpoint
  if (path === '/api/applications/my-applications' && method === 'GET') {
    console.log('📋 GET /api/applications/my-applications - Getting user applications');

    // Filter applications by current user (mock: manish1@gmail.com)
    const userApplications = applications.filter(app => app.applicantEmail === 'manish1@gmail.com');
    console.log('📊 Found', userApplications.length, 'applications for user');

    res.writeHead(200);
    res.end(JSON.stringify(userApplications));
    return;
  }

  // Get recruiter's applications endpoint
  if (path === '/api/applications/recruiter/all' && method === 'GET') {
    console.log('📋 GET /api/applications/recruiter/all - Getting recruiter applications');

    // Filter applications for jobs posted by current recruiter
    const recruiterJobIds = jobs.filter(job => job.recruiter === 'manishmodi0408@gmail.com').map(job => job.id);
    const recruiterApplications = applications.filter(app => recruiterJobIds.includes(app.jobId));
    console.log('📊 Found', recruiterApplications.length, 'applications for recruiter jobs');

    res.writeHead(200);
    res.end(JSON.stringify(recruiterApplications));
    return;
  }

  // Get user profile endpoint
  if (path === '/api/users/profile' && method === 'GET') {
    console.log('Getting user profile');

    const mockProfile = {
      id: '1',
      email: 'manishmodi0408@gmail.com',
      fullName: 'Manish Modi',
      userType: 'recruiter',
      companyName: 'The Tech World'
    };

    res.writeHead(200);
    res.end(JSON.stringify(mockProfile));
    return;
  }

  // Update user profile endpoint
  if (path === '/api/users/profile' && method === 'PUT') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const profileData = JSON.parse(body);
        console.log('Updating user profile:', profileData.fullName);

        res.writeHead(200);
        res.end(JSON.stringify({
          message: 'Profile updated successfully',
          user: profileData
        }));
      } catch (error) {
        console.error('Profile update error:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Server error' }));
      }
    });
    return;
  }

  // 404 for other routes
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Route not found' }));
});

server.listen(PORT, () => {
  console.log(`✅ Minimal server running on http://localhost:${PORT}`);
  console.log(`✅ Health: http://localhost:${PORT}/api/health`);
  console.log(`✅ Ready to accept connections`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔄 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

console.log('✅ Server setup complete');
