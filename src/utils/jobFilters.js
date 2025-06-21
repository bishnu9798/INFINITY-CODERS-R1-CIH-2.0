// Job filtering utilities

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Extract salary number from salary string
export const extractSalaryNumber = (salaryString) => {
  if (!salaryString) return null;
  
  // Remove common currency symbols and text
  const cleanSalary = salaryString.replace(/[$,k]/gi, '');
  
  // Extract numbers
  const numbers = cleanSalary.match(/\d+/g);
  if (!numbers) return null;
  
  // Handle 'k' notation (e.g., "50k" = 50000)
  let salary = parseInt(numbers[0]);
  if (salaryString.toLowerCase().includes('k')) {
    salary *= 1000;
  }
  
  return salary;
};

// Calculate skills match percentage
export const calculateSkillsMatch = (jobSkills, searchSkills) => {
  if (!jobSkills || !searchSkills || searchSkills.length === 0) return 0;
  
  const jobSkillsArray = Array.isArray(jobSkills) 
    ? jobSkills.map(skill => skill.toLowerCase().trim())
    : jobSkills.split(',').map(skill => skill.toLowerCase().trim());
  
  const searchSkillsArray = searchSkills.map(skill => skill.toLowerCase().trim());
  
  let matches = 0;
  searchSkillsArray.forEach(searchSkill => {
    if (jobSkillsArray.some(jobSkill => 
      jobSkill.includes(searchSkill) || searchSkill.includes(jobSkill)
    )) {
      matches++;
    }
  });
  
  return Math.round((matches / searchSkillsArray.length) * 100);
};

// Check if job matches date filter
export const matchesDateFilter = (jobDate, dateFilter) => {
  if (!dateFilter || !jobDate) return true;
  
  const now = new Date();
  const jobCreatedDate = new Date(jobDate);
  const diffTime = Math.abs(now - jobCreatedDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  switch (dateFilter) {
    case '24h':
      return diffDays <= 1;
    case '3d':
      return diffDays <= 3;
    case '1w':
      return diffDays <= 7;
    case '2w':
      return diffDays <= 14;
    case '1m':
      return diffDays <= 30;
    case '3m':
      return diffDays <= 90;
    default:
      return true;
  }
};

// Check if job matches experience level
export const matchesExperienceLevel = (jobExperience, filterExperience) => {
  if (!filterExperience || !jobExperience) return true;
  
  const jobExp = jobExperience.toLowerCase();
  const filterExp = filterExperience.toLowerCase();
  
  // Direct match
  if (jobExp.includes(filterExp) || filterExp.includes(jobExp)) return true;
  
  // Experience level mapping
  const experienceMap = {
    'entry': ['entry', 'junior', '0-1', '0-2', 'graduate', 'intern'],
    '1-2': ['1-2', '1-3', 'junior', 'entry'],
    '2-4': ['2-4', '2-5', '3-5', 'mid', 'intermediate'],
    '4-6': ['4-6', '4-8', '5-7', 'senior', 'mid'],
    '6+': ['6+', '7+', '8+', 'senior', 'lead', 'principal'],
    'senior': ['senior', 'lead', 'principal', '5+', '6+', '7+']
  };
  
  const filterMappings = experienceMap[filterExp] || [];
  return filterMappings.some(mapping => jobExp.includes(mapping));
};

// Check if job matches remote work preference
export const matchesRemoteWork = (job, remoteFilter) => {
  if (!remoteFilter) return true;
  
  const jobTitle = (job.title || '').toLowerCase();
  const jobDescription = (job.description || '').toLowerCase();
  const jobLocation = (job.location || '').toLowerCase();
  const jobType = (job.job_type || '').toLowerCase();
  
  const remoteKeywords = ['remote', 'work from home', 'wfh', 'telecommute'];
  const hybridKeywords = ['hybrid', 'flexible', 'part remote'];
  const onsiteKeywords = ['on-site', 'onsite', 'office', 'in-person'];
  
  const hasRemoteKeywords = remoteKeywords.some(keyword => 
    jobTitle.includes(keyword) || jobDescription.includes(keyword) || jobLocation.includes(keyword)
  );
  
  const hasHybridKeywords = hybridKeywords.some(keyword => 
    jobTitle.includes(keyword) || jobDescription.includes(keyword) || jobLocation.includes(keyword)
  );
  
  const hasOnsiteKeywords = onsiteKeywords.some(keyword => 
    jobTitle.includes(keyword) || jobDescription.includes(keyword)
  );
  
  switch (remoteFilter) {
    case 'remote':
      return hasRemoteKeywords || jobLocation.includes('remote');
    case 'hybrid':
      return hasHybridKeywords || (hasRemoteKeywords && !jobLocation.includes('remote'));
    case 'onsite':
      return !hasRemoteKeywords || hasOnsiteKeywords;
    default:
      return true;
  }
};

// Main job filtering function
export const filterJobs = (jobs, filters, userLocation = null) => {
  if (!jobs || jobs.length === 0) return [];
  
  return jobs.filter(job => {
    // Basic search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = [
        job.title,
        job.company,
        job.description,
        Array.isArray(job.skills) ? job.skills.join(' ') : job.skills
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(query)) return false;
    }
    
    // Location and radius filter
    if (filters.location && userLocation) {
      // This would require geocoding API integration
      // For now, we'll do a simple text match
      const jobLocation = (job.location || '').toLowerCase();
      const searchLocation = filters.location.toLowerCase();
      
      if (!jobLocation.includes(searchLocation)) return false;
    }
    
    // Salary range filter
    if (filters.salaryMin || filters.salaryMax) {
      const jobSalary = extractSalaryNumber(job.salary_range);
      if (jobSalary) {
        if (filters.salaryMin && jobSalary < parseInt(filters.salaryMin)) return false;
        if (filters.salaryMax && jobSalary > parseInt(filters.salaryMax)) return false;
      }
    }
    
    // Job type filter
    if (filters.jobType && filters.jobType.length > 0) {
      const jobType = (job.job_type || 'full-time').toLowerCase();
      if (!filters.jobType.some(type => jobType.includes(type))) return false;
    }
    
    // Company size filter
    if (filters.companySize) {
      // This would require company data
      // For now, we'll skip this filter
    }
    
    // Industry filter
    if (filters.industry) {
      const jobIndustry = (job.industry || '').toLowerCase();
      if (!jobIndustry.includes(filters.industry)) {
        // Fallback to company name or description matching
        const companyText = (job.company + ' ' + job.description).toLowerCase();
        const industryKeywords = {
          'technology': ['tech', 'software', 'it', 'digital', 'startup'],
          'finance': ['bank', 'financial', 'investment', 'insurance'],
          'healthcare': ['health', 'medical', 'hospital', 'pharma'],
          'education': ['school', 'university', 'education', 'learning'],
          'retail': ['retail', 'store', 'shop', 'commerce', 'sales']
        };
        
        const keywords = industryKeywords[filters.industry] || [];
        if (!keywords.some(keyword => companyText.includes(keyword))) return false;
      }
    }
    
    // Date posted filter
    if (!matchesDateFilter(job.created_at, filters.datePosted)) return false;
    
    // Experience level filter
    if (!matchesExperienceLevel(job.experience, filters.experienceLevel)) return false;
    
    // Skills filter
    if (filters.skills) {
      const searchSkills = filters.skills.split(',').map(s => s.trim());
      const skillsMatch = calculateSkillsMatch(job.skills, searchSkills);
      if (skillsMatch < 30) return false; // Require at least 30% match
    }
    
    // Remote work filter
    if (!matchesRemoteWork(job, filters.remoteWork)) return false;
    
    return true;
  });
};

// Sort jobs by relevance
export const sortJobsByRelevance = (jobs, filters) => {
  return jobs.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    
    // Skills match scoring
    if (filters.skills) {
      const searchSkills = filters.skills.split(',').map(s => s.trim());
      scoreA += calculateSkillsMatch(a.skills, searchSkills);
      scoreB += calculateSkillsMatch(b.skills, searchSkills);
    }
    
    // Date posted scoring (newer jobs get higher score)
    const dateA = new Date(a.created_at || 0);
    const dateB = new Date(b.created_at || 0);
    const daysDiffA = Math.ceil((new Date() - dateA) / (1000 * 60 * 60 * 24));
    const daysDiffB = Math.ceil((new Date() - dateB) / (1000 * 60 * 60 * 24));
    
    scoreA += Math.max(0, 30 - daysDiffA); // Max 30 points for recent jobs
    scoreB += Math.max(0, 30 - daysDiffB);
    
    // Search query relevance
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      if (a.title.toLowerCase().includes(query)) scoreA += 20;
      if (b.title.toLowerCase().includes(query)) scoreB += 20;
      if (a.company.toLowerCase().includes(query)) scoreA += 10;
      if (b.company.toLowerCase().includes(query)) scoreB += 10;
    }
    
    return scoreB - scoreA; // Higher score first
  });
};

// Get filter summary for display
export const getFilterSummary = (filters) => {
  const summary = [];
  
  if (filters.searchQuery) summary.push(`"${filters.searchQuery}"`);
  if (filters.location) summary.push(`in ${filters.location}`);
  if (filters.jobType && filters.jobType.length > 0) {
    summary.push(`${filters.jobType.join(', ')} positions`);
  }
  if (filters.salaryMin || filters.salaryMax) {
    const salaryRange = [
      filters.salaryMin ? `$${parseInt(filters.salaryMin).toLocaleString()}+` : '',
      filters.salaryMax ? `up to $${parseInt(filters.salaryMax).toLocaleString()}` : ''
    ].filter(Boolean).join(' ');
    summary.push(salaryRange);
  }
  if (filters.experienceLevel) summary.push(`${filters.experienceLevel} experience`);
  if (filters.remoteWork) summary.push(filters.remoteWork);
  if (filters.industry) summary.push(filters.industry);
  
  return summary.join(' • ');
};
