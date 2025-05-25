import React, { useState } from 'react';

const Help = () => {
  const [activeAccordion, setActiveAccordion] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? '' : id);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for your message! We will get back to you soon.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const faqData = [
    {
      id: 'faq1',
      question: 'How do I upload my diabetes reports?',
      answer: 'Go to the Upload page, click "Choose File" to select your report (PDF, image, or document), and click upload. Our AI will automatically analyze it and provide insights.'
    },
    {
      id: 'faq2',
      question: 'What types of reports can I upload?',
      answer: 'You can upload blood glucose reports, HbA1c test results, prescription documents, and other diabetes-related medical reports in PDF, JPG, PNG, or Word formats.'
    },
    {
      id: 'faq3',
      question: 'How accurate is the AI analysis?',
      answer: 'Our AI uses medical-grade models trained on diabetes data. However, always consult with your healthcare provider for medical decisions. The AI provides insights to supplement, not replace, professional medical advice.'
    },
    {
      id: 'faq4',
      question: 'Is my health data secure?',
      answer: 'Yes, we use enterprise-grade encryption and comply with healthcare data protection standards. Your reports and health information are stored securely and never shared without your consent.'
    },
    {
      id: 'faq5',
      question: 'Can I share reports with my doctor?',
      answer: 'Yes, you can generate shareable links or export PDF summaries of your analyzed reports to share with healthcare providers.'
    },
    {
      id: 'faq6',
      question: 'What languages are supported?',
      answer: 'We support multiple Indian languages including Hindi, Tamil, Telugu, Kannada, Malayalam, and English for report translation and interface.'
    }
  ];

  return (
    <div className="container py-4">
      <div className="row">
        {/* Header */}
        <div className="col-12 mb-4">
          <div className="text-center">
            <h1 className="display-4 text-primary">
              <i className="fas fa-question-circle me-3"></i>
              Help & Support
            </h1>
            <p className="lead text-muted">Find answers to common questions and get support</p>
          </div>
        </div>

        {/* Quick Help Cards */}
        <div className="col-12 mb-5">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 text-center border-primary">
                <div className="card-body">
                  <i className="fas fa-upload fa-3x text-primary mb-3"></i>
                  <h5>Upload Reports</h5>
                  <p className="text-muted">Learn how to upload and analyze your diabetes reports</p>
                  <a href="/upload" className="btn btn-outline-primary">Go to Upload</a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 text-center border-success">
                <div className="card-body">
                  <i className="fas fa-chart-line fa-3x text-success mb-3"></i>
                  <h5>View Dashboard</h5>
                  <p className="text-muted">Monitor your health trends and insights</p>
                  <a href="/dashboard" className="btn btn-outline-success">Go to Dashboard</a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 text-center border-info">
                <div className="card-body">
                  <i className="fas fa-cog fa-3x text-info mb-3"></i>
                  <h5>Settings</h5>
                  <p className="text-muted">Customize your preferences and account settings</p>
                  <a href="/settings" className="btn btn-outline-info">Go to Settings</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="col-lg-8 mb-5">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className="fas fa-question me-2"></i>
                Frequently Asked Questions
              </h4>
            </div>
            <div className="card-body p-0">
              <div className="accordion" id="faqAccordion">
                {faqData.map((faq) => (
                  <div key={faq.id} className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button ${activeAccordion === faq.id ? '' : 'collapsed'}`}
                        type="button"
                        onClick={() => toggleAccordion(faq.id)}
                      >
                        {faq.question}
                      </button>
                    </h2>
                    <div
                      className={`accordion-collapse collapse ${activeAccordion === faq.id ? 'show' : ''}`}
                    >
                      <div className="accordion-body">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                <i className="fas fa-envelope me-2"></i>
                Contact Support
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleContactSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Subject</label>
                  <select
                    className="form-select"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="technical">Technical Issue</option>
                    <option value="account">Account Problem</option>
                    <option value="feature">Feature Request</option>
                    <option value="general">General Question</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    placeholder="Describe your issue or question..."
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-info w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane me-2"></i>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Quick Contact Info */}
          <div className="card shadow-sm mt-4">
            <div className="card-body text-center">
              <h6 className="card-title">Need immediate help?</h6>
              <p className="text-muted small">
                <i className="fas fa-envelope me-2"></i>
                support@diabetesmonitor.com
              </p>
              <p className="text-muted small">
                <i className="fas fa-clock me-2"></i>
                Response time: 24-48 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;