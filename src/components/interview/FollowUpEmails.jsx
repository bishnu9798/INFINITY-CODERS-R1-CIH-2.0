import React, { useState, useEffect } from 'react';

const FollowUpEmails = ({ darkMode, user, interviewData, updateInterviewData }) => {
  const [emailTemplates, setEmailTemplates] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState('thank-you');
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [emailContent, setEmailContent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [scheduledEmails, setScheduledEmails] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);

  const emailTemplateTypes = [
    {
      id: 'thank-you',
      name: 'Thank You Email',
      description: 'Send after interview completion',
      icon: '🙏',
      timing: 'Immediate'
    },
    {
      id: 'follow-up',
      name: 'Follow-up Email',
      description: 'Check in with candidate',
      icon: '📧',
      timing: '2-3 days'
    },
    {
      id: 'decision-positive',
      name: 'Positive Decision',
      description: 'Offer or next round invitation',
      icon: '✅',
      timing: '1 week'
    },
    {
      id: 'decision-negative',
      name: 'Rejection Email',
      description: 'Polite rejection with feedback',
      icon: '❌',
      timing: '1 week'
    },
    {
      id: 'reminder',
      name: 'Interview Reminder',
      description: 'Upcoming interview reminder',
      icon: '⏰',
      timing: '24 hours before'
    },
    {
      id: 'preparation',
      name: 'Interview Preparation',
      description: 'Send preparation materials',
      icon: '📚',
      timing: '2-3 days before'
    }
  ];

  const defaultTemplates = {
    'thank-you': {
      subject: 'Thank you for your interview - {{candidateName}}',
      content: `Dear {{candidateName}},

Thank you for taking the time to interview with us for the {{jobTitle}} position. It was a pleasure speaking with you and learning more about your background and experience.

We were impressed by your {{strengths}} and your enthusiasm for the role. Your insights about {{specificTopic}} were particularly valuable.

We are currently reviewing all candidates and will be in touch within the next week with our decision. If you have any questions in the meantime, please don't hesitate to reach out.

Thank you again for your interest in joining our team.

Best regards,
{{interviewer}}
{{companyName}}`
    },
    'follow-up': {
      subject: 'Following up on your interview - {{candidateName}}',
      content: `Dear {{candidateName}},

I hope this email finds you well. I wanted to follow up on your recent interview for the {{jobTitle}} position.

We are still in the process of evaluating all candidates and expect to make a decision by {{decisionDate}}. Your interview went well, and we appreciate the time you invested in the process.

If you have any questions or if there's any additional information you'd like to share, please feel free to reach out.

Thank you for your patience as we complete our review process.

Best regards,
{{interviewer}}
{{companyName}}`
    },
    'decision-positive': {
      subject: 'Great news about your interview - {{candidateName}}',
      content: `Dear {{candidateName}},

I'm pleased to inform you that we would like to move forward with your application for the {{jobTitle}} position.

Based on your interview performance and qualifications, we believe you would be a great addition to our team. We were particularly impressed by {{specificStrengths}}.

{{nextSteps}}

We're excited about the possibility of you joining our team and look forward to hearing from you soon.

Congratulations and best regards,
{{interviewer}}
{{companyName}}`
    },
    'decision-negative': {
      subject: 'Update on your application - {{candidateName}}',
      content: `Dear {{candidateName}},

Thank you for your interest in the {{jobTitle}} position and for taking the time to interview with us.

After careful consideration, we have decided to move forward with another candidate whose background more closely aligns with our current needs.

This was a difficult decision as we were impressed by {{positiveAspects}}. We encourage you to apply for future opportunities that match your skills and experience.

We wish you the best of luck in your job search and future endeavors.

Best regards,
{{interviewer}}
{{companyName}}`
    },
    'reminder': {
      subject: 'Interview Reminder - {{candidateName}} - {{jobTitle}}',
      content: `Dear {{candidateName}},

This is a friendly reminder about your upcoming interview for the {{jobTitle}} position scheduled for:

Date: {{interviewDate}}
Time: {{interviewTime}}
Duration: {{duration}} minutes
{{meetingDetails}}

Please confirm your attendance by replying to this email. If you need to reschedule, please let us know as soon as possible.

We look forward to speaking with you tomorrow!

Best regards,
{{interviewer}}
{{companyName}}`
    },
    'preparation': {
      subject: 'Interview Preparation Materials - {{candidateName}}',
      content: `Dear {{candidateName}},

Thank you for your interest in the {{jobTitle}} position. We're looking forward to our interview scheduled for {{interviewDate}} at {{interviewTime}}.

To help you prepare, please find the following information:

**Interview Format:** {{interviewFormat}}
**Duration:** {{duration}} minutes
**Interviewer(s):** {{interviewer}}

**What to Expect:**
{{interviewExpectations}}

**Preparation Tips:**
{{preparationTips}}

**Technical Requirements (if applicable):**
{{technicalRequirements}}

If you have any questions before the interview, please don't hesitate to reach out.

Best of luck with your preparation!

Best regards,
{{interviewer}}
{{companyName}}`
    }
  };

  useEffect(() => {
    // Load email templates and sent emails
    const savedTemplates = localStorage.getItem(`email_templates_${user?.id}`);
    const savedSentEmails = localStorage.getItem(`sent_emails_${user?.id}`);
    
    if (savedTemplates) {
      setEmailTemplates(JSON.parse(savedTemplates));
    } else {
      setEmailTemplates(defaultTemplates);
    }

    if (savedSentEmails) {
      setSentEmails(JSON.parse(savedSentEmails));
    }
  }, [user]);

  useEffect(() => {
    // Update email content when template or interview changes
    if (selectedTemplate && emailTemplates[selectedTemplate] && selectedInterview) {
      const template = emailTemplates[selectedTemplate];
      setEmailSubject(populateTemplate(template.subject, selectedInterview));
      setEmailContent(populateTemplate(template.content, selectedInterview));
    }
  }, [selectedTemplate, selectedInterview, emailTemplates]);

  const populateTemplate = (template, interview) => {
    if (!interview) return template;

    const replacements = {
      '{{candidateName}}': interview.candidateName || 'Candidate',
      '{{jobTitle}}': interview.jobTitle || 'Position',
      '{{interviewer}}': interview.interviewer || user?.name || 'Interviewer',
      '{{companyName}}': 'Your Company',
      '{{interviewDate}}': new Date(interview.date).toLocaleDateString(),
      '{{interviewTime}}': interview.time || 'TBD',
      '{{duration}}': interview.duration || '60',
      '{{meetingDetails}}': interview.meetingLink ? `Meeting Link: ${interview.meetingLink}` : 'Location: TBD',
      '{{strengths}}': 'your technical skills and experience',
      '{{specificTopic}}': 'the technical challenges discussed',
      '{{decisionDate}}': new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      '{{specificStrengths}}': 'your problem-solving approach and technical expertise',
      '{{nextSteps}}': 'Our HR team will be in touch with next steps within the next few days.',
      '{{positiveAspects}}': 'your enthusiasm and technical knowledge',
      '{{interviewFormat}}': interview.type === 'video' ? 'Video Interview' : interview.type === 'phone' ? 'Phone Interview' : 'In-person Interview',
      '{{interviewExpectations}}': 'We will discuss your background, technical skills, and experience relevant to the role.',
      '{{preparationTips}}': '• Review the job description\n• Prepare examples of your work\n• Think about questions you have for us',
      '{{technicalRequirements}}': interview.type === 'video' ? 'Stable internet connection and working camera/microphone' : 'None'
    };

    let result = template;
    Object.entries(replacements).forEach(([placeholder, value]) => {
      result = result.replace(new RegExp(placeholder, 'g'), value);
    });

    return result;
  };

  const sendEmail = () => {
    if (!selectedInterview || !emailContent.trim() || !emailSubject.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const emailData = {
      id: Date.now(),
      interviewId: selectedInterview.id,
      candidateName: selectedInterview.candidateName,
      jobTitle: selectedInterview.jobTitle,
      templateType: selectedTemplate,
      subject: emailSubject,
      content: emailContent,
      sentAt: new Date().toISOString(),
      sentBy: user?.name || 'Current User'
    };

    const updatedSentEmails = [...sentEmails, emailData];
    setSentEmails(updatedSentEmails);
    localStorage.setItem(`sent_emails_${user?.id}`, JSON.stringify(updatedSentEmails));

    // Update interview data
    updateInterviewData({
      followUps: [...(interviewData.followUps || []), emailData]
    });

    // Reset form
    setSelectedInterview(null);
    setEmailContent('');
    setEmailSubject('');

    alert('Email sent successfully!');
  };

  const scheduleEmail = (delay) => {
    if (!selectedInterview || !emailContent.trim() || !emailSubject.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const scheduledTime = new Date(Date.now() + delay * 60 * 60 * 1000);
    
    const emailData = {
      id: Date.now(),
      interviewId: selectedInterview.id,
      candidateName: selectedInterview.candidateName,
      jobTitle: selectedInterview.jobTitle,
      templateType: selectedTemplate,
      subject: emailSubject,
      content: emailContent,
      scheduledFor: scheduledTime.toISOString(),
      status: 'scheduled',
      createdBy: user?.name || 'Current User'
    };

    const updatedScheduled = [...scheduledEmails, emailData];
    setScheduledEmails(updatedScheduled);
    localStorage.setItem(`scheduled_emails_${user?.id}`, JSON.stringify(updatedScheduled));

    alert(`Email scheduled for ${scheduledTime.toLocaleString()}`);
  };

  const completedInterviews = interviewData.completed || [];
  const upcomingInterviews = interviewData.scheduled || [];
  const allInterviews = [...completedInterviews, ...upcomingInterviews];

  const renderTemplateSelector = () => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
      <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Email Templates
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {emailTemplateTypes.map(template => (
          <div
            key={template.id}
            onClick={() => setSelectedTemplate(template.id)}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedTemplate === template.id
                ? (darkMode ? 'bg-blue-900 border-blue-600' : 'bg-blue-50 border-blue-500')
                : (darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-gray-50 border-gray-200 hover:bg-gray-100')
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">{template.icon}</span>
              <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {template.name}
              </h5>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              {template.description}
            </p>
            <span className={`text-xs px-2 py-1 rounded-full ${
              darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}>
              {template.timing}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInterviewSelector = () => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
      <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Select Interview
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allInterviews.map(interview => (
          <div
            key={interview.id}
            onClick={() => setSelectedInterview(interview)}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedInterview?.id === interview.id
                ? (darkMode ? 'bg-blue-900 border-blue-600' : 'bg-blue-50 border-blue-500')
                : (darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-gray-50 border-gray-200 hover:bg-gray-100')
            }`}
          >
            <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {interview.candidateName}
            </h5>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {interview.jobTitle}
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {new Date(interview.date).toLocaleDateString()} • {interview.interviewer}
            </p>
            <div className="mt-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                interview.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {interview.status || 'scheduled'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmailComposer = () => {
    if (!selectedTemplate || !selectedInterview) return null;

    return (
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Compose Email: {emailTemplateTypes.find(t => t.id === selectedTemplate)?.name}
        </h4>
        
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Subject
            </label>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Email Content
            </label>
            <textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              rows={12}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                onClick={() => scheduleEmail(1)}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  darkMode ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }`}
              >
                Schedule (1 hour)
              </button>
              <button
                onClick={() => scheduleEmail(24)}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  darkMode ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                Schedule (24 hours)
              </button>
            </div>
            
            <button
              onClick={sendEmail}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Send Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSentEmails = () => {
    if (sentEmails.length === 0) return null;

    return (
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Sent Emails ({sentEmails.length})
        </h4>
        
        <div className="space-y-3">
          {sentEmails.slice(0, 5).map(email => (
            <div key={email.id} className={`p-3 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {email.subject}
                  </h5>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    To: {email.candidateName} • {email.jobTitle}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Sent: {new Date(email.sentAt).toLocaleString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  email.templateType === 'decision-positive' ? 'bg-green-100 text-green-800' :
                  email.templateType === 'decision-negative' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {emailTemplateTypes.find(t => t.id === email.templateType)?.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📧 Automated Follow-up Emails
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Send professional follow-up emails with customizable templates
        </p>
      </div>

      {renderTemplateSelector()}
      {renderInterviewSelector()}
      {renderEmailComposer()}
      {renderSentEmails()}

      {/* Email Statistics */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-50 to-purple-50'} rounded-lg p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📊 Email Statistics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {sentEmails.length}
            </div>
            <div className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
              Emails Sent
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              {sentEmails.filter(e => e.templateType === 'decision-positive').length}
            </div>
            <div className={`text-sm ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
              Positive Decisions
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
              {scheduledEmails.length}
            </div>
            <div className={`text-sm ${darkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>
              Scheduled
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {Object.keys(emailTemplates).length}
            </div>
            <div className={`text-sm ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}>
              Templates
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowUpEmails;
