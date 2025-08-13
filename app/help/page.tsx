'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';
import WelcomeModal from '../components/WelcomeModal';

interface HelpArticle {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  tags: string[];
  lastUpdated: string;
  popularity: number;
  helpful: number;
  notHelpful: number;
  author: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

export default function HelpPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'articles' | 'faq' | 'video'>('articles');
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const helpArticles: HelpArticle[] = [
    {
      id: 'ART-001',
      title: 'Getting Started with VBMS',
      category: 'Getting Started',
      description: 'Complete guide to accessing and navigating the VBMS system',
      content: `# Getting Started with VBMS\n\nWelcome to the Veterans Benefits Management System (VBMS). This comprehensive guide will walk you through the essential steps to begin using the system effectively.\n\n## System Requirements\n\n- Supported browsers: Chrome, Firefox, Edge, Safari\n- Minimum screen resolution: 1024x768\n- PIV card and card reader required\n- Stable internet connection\n\n## First-Time Login\n\n1. Navigate to the VBMS portal\n2. Insert your PIV card into the card reader\n3. Select your certificate when prompted\n4. Enter your PIN\n5. Complete two-factor authentication\n\n## Main Dashboard Overview\n\nAfter successful login, you'll see the main dashboard with:\n\n- **Quick Stats**: Key metrics for your workload\n- **Recent Claims**: Claims you've recently worked on\n- **Pending Actions**: Items requiring your attention\n- **System Status**: Current system health indicators\n\n## Navigation Menu\n\nThe left sidebar contains:\n- Claims Processing\n- eFolder Search\n- Analytics & Reports\n- Quality Reviews\n- User Settings\n\n## Getting Help\n\nIf you need assistance:\n- Use the Help menu (this section)\n- Contact your supervisor\n- Submit a support ticket\n- Access training materials`,
      tags: ['login', 'navigation', 'dashboard', 'piv card'],
      lastUpdated: '2024-01-10',
      popularity: 95,
      helpful: 142,
      notHelpful: 8,
      author: 'VBMS Training Team'
    },
    {
      id: 'ART-002',
      title: 'Processing Disability Claims',
      category: 'Claims Processing',
      description: 'Step-by-step guide for processing disability compensation claims',
      content: `# Processing Disability Claims\n\nThis guide covers the complete process for handling disability compensation claims in VBMS.\n\n## Claim Assignment\n\nClaims are automatically assigned based on:\n- Workload capacity\n- Specialty expertise\n- Geographic location\n- Priority status\n\n## Initial Review\n\n1. **Open the Claim**: Click on claim ID from your queue\n2. **Review Veteran Information**: Verify identity and service history\n3. **Check Claimed Conditions**: Review all conditions listed\n4. **Examine Evidence**: Review service treatment records, private records, and C&P exams\n\n## Evidence Development\n\n### Service Treatment Records\n- Request from NPRC if missing\n- Review for in-service injuries/illnesses\n- Document relevant entries\n\n### C&P Examinations\n- Schedule when insufficient evidence exists\n- Use RUMEV1 AI to determine necessity\n- Track examination completion\n\n### Private Medical Records\n- Request from treating physicians\n- Obtain signed authorization from veteran\n- Follow up on outstanding requests\n\n## Rating Decision\n\n1. **Apply Rating Schedule**: Use 38 CFR Part 4\n2. **Consider Secondary Conditions**: Evaluate service-connected disabilities\n3. **Effective Date Determination**: Apply appropriate effective date rules\n4. **Calculate Combined Rating**: Use VA math for multiple conditions\n\n## Quality Review\n\nBefore finalizing:\n- Double-check calculations\n- Verify effective dates\n- Ensure proper documentation\n- Review for completeness\n\n## Notification\n\n- Generate decision letter\n- Mail to veteran's address of record\n- Update system status\n- Process payment authorization`,
      tags: ['claims', 'disability', 'processing', 'rating', 'evidence'],
      lastUpdated: '2024-01-08',
      popularity: 88,
      helpful: 156,
      notHelpful: 12,
      author: 'Claims Processing Division'
    },
    {
      id: 'ART-003',
      title: 'Using RUMEV1 AI Assistant',
      category: 'AI Tools',
      description: 'How to effectively use the RUMEV1 AI system for claim analysis',
      content: `# Using RUMEV1 AI Assistant\n\nRUMEV1 (Reducing Unnecessary Medical Exams Version 1) is our AI-powered assistant that helps streamline claim processing.\n\n## What RUMEV1 Does\n\n- **Medical Evidence Analysis**: Scans and interprets medical documents\n- **Exam Necessity Determination**: Decides if C&P exam is required\n- **Condition Recognition**: Identifies medical conditions in records\n- **Confidence Scoring**: Provides accuracy ratings for decisions\n\n## How to Use RUMEV1\n\n1. **Open a Claim**: Navigate to any pending claim\n2. **Click AI Analysis**: Look for the "RUMEV1 Analysis" button\n3. **Review Results**: The AI will provide:\n   - Exam necessity recommendation\n   - Confidence percentage\n   - Supporting evidence highlights\n   - Suggested next steps\n\n## Interpreting Results\n\n### Confidence Levels\n- **95-100%**: Very high confidence, proceed with recommendation\n- **85-94%**: High confidence, minimal manual review needed\n- **70-84%**: Moderate confidence, verify key findings\n- **Below 70%**: Low confidence, conduct thorough manual review\n\n### Exam Recommendations\n- **No Exam Required**: Sufficient evidence exists for rating\n- **Exam Required**: Additional medical evidence needed\n- **Unclear**: Manual review recommended\n\n## Best Practices\n\n1. **Always Review**: Never rely solely on AI recommendations\n2. **Verify Key Points**: Check highlighted evidence manually\n3. **Consider Context**: AI may miss nuanced medical details\n4. **Document Decisions**: Note when you agree or disagree with AI\n\n## When to Override\n\n- Complex multi-system conditions\n- Rare or unusual medical presentations\n- Conflicting medical opinions\n- Veteran-specific circumstances\n\n## Feedback Loop\n\nHelp improve RUMEV1 by:\n- Marking helpful/unhelpful recommendations\n- Reporting errors or missed evidence\n- Suggesting improvements`,
      tags: ['AI', 'RUMEV1', 'analysis', 'medical', 'automation'],
      lastUpdated: '2024-01-12',
      popularity: 82,
      helpful: 134,
      notHelpful: 15,
      author: 'AI Development Team'
    },
    {
      id: 'ART-004',
      title: 'eFolder Navigation',
      category: 'Document Management',
      description: 'Comprehensive guide to searching and viewing veteran documents',
      content: `# eFolder Navigation\n\nThe eFolder contains all digitized documents related to a veteran's claims and service history.\n\n## Accessing eFolder\n\n1. **From Claims**: Click "View eFolder" button in any claim\n2. **Direct Search**: Use eFolder menu option\n3. **Veteran Search**: Enter file number or SSN\n\n## Document Categories\n\n### Service Treatment Records\n- Military medical records\n- Service personnel records\n- Awards and decorations\n\n### VA Medical Records\n- C&P examination reports\n- VHA treatment records\n- Hospitalization records\n\n### Private Medical Records\n- Civilian physician records\n- Hospital records\n- Specialist reports\n\n### Claims Documents\n- Application forms\n- Correspondence\n- Decision letters\n\n## Search Functions\n\n### Basic Search\n- Document type filter\n- Date range selection\n- Keyword search\n\n### Advanced Search\n- Multiple keyword combinations\n- Provider name search\n- Medical condition search\n- Date-specific searches\n\n## Viewing Documents\n\n### Document Viewer Features\n- Zoom in/out controls\n- Page navigation\n- Annotation tools\n- Print options\n- Download capability\n\n### Metadata Information\n- Upload date\n- Document source\n- Page count\n- File size\n- Processing status\n\n## Organization Tips\n\n1. **Use Filters**: Narrow results by document type\n2. **Sort by Date**: Most recent documents first\n3. **Bookmark Important Documents**: Save frequently accessed files\n4. **Use Keywords**: Search for specific conditions or treatments\n\n## Common Issues\n\n### Documents Not Loading\n- Check internet connection\n- Clear browser cache\n- Try different browser\n- Contact IT support\n\n### Missing Documents\n- Verify file number accuracy\n- Check document category filters\n- Contact records department\n- Submit missing document request\n\n## Security Reminders\n\n- Never download sensitive documents to personal devices\n- Log out when finished\n- Report suspected unauthorized access\n- Follow PHI handling procedures`,
      tags: ['documents', 'efolder', 'search', 'records', 'navigation'],
      lastUpdated: '2024-01-05',
      popularity: 91,
      helpful: 167,
      notHelpful: 9,
      author: 'Document Management Team'
    },
    {
      id: 'ART-005',
      title: 'Quality Review Process',
      category: 'Quality Assurance',
      description: 'Understanding the quality review system and requirements',
      content: `# Quality Review Process\n\nQuality reviews ensure accuracy and consistency in claim processing decisions.\n\n## Review Types\n\n### Pre-Decisional Quality Review (PDQR)\n- Conducted before claim completion\n- Identifies issues early in process\n- Allows for corrections before finalization\n\n### Post-Decisional Quality Review (Post-DQR)\n- Reviews completed claims\n- Identifies trends and training needs\n- Measures overall accuracy rates\n\n## Review Categories\n\n### Medical\n- Accuracy of medical interpretations\n- Proper application of rating criteria\n- Completeness of medical development\n\n### Legal\n- Correct application of laws and regulations\n- Proper effective date determinations\n- Due process compliance\n\n### Procedural\n- Adherence to standard operating procedures\n- Timeliness of processing\n- Proper documentation\n\n## Review Process\n\n1. **Random Selection**: Claims selected using statistical sampling\n2. **Reviewer Assignment**: Qualified reviewers assigned to cases\n3. **Thorough Analysis**: Complete review of claim file\n4. **Error Identification**: Documentation of any deficiencies\n5. **Feedback Provision**: Results shared with claim processor\n6. **Corrective Action**: Training or process improvements as needed\n\n## Quality Standards\n\n### Accuracy Targets\n- Overall accuracy: 95% or higher\n- Medical accuracy: 96% or higher\n- Legal accuracy: 98% or higher\n\n### Common Deficiencies\n- Insufficient medical development\n- Incorrect effective date application\n- Mathematical errors in rating\n- Missing required notifications\n\n## Reviewer Qualifications\n\n- Minimum 3 years claims processing experience\n- Completion of quality review training\n- Demonstrated expertise in specialty areas\n- Ongoing professional development\n\n## Appeals Impact\n\n- Track relationship between QR findings and appeals\n- Identify patterns in appealed decisions\n- Use data to improve processes\n- Reduce preventable appeals\n\n## Continuous Improvement\n\n### Data Analysis\n- Monthly accuracy reports\n- Trend identification\n- Root cause analysis\n- Performance metrics tracking\n\n### Training Programs\n- Targeted skills development\n- Refresher training for common errors\n- New regulation updates\n- Best practice sharing`,
      tags: ['quality', 'review', 'accuracy', 'compliance', 'training'],
      lastUpdated: '2024-01-03',
      popularity: 76,
      helpful: 98,
      notHelpful: 7,
      author: 'Quality Assurance Division'
    }
  ];

  const faqs: FAQ[] = [
    {
      id: 'FAQ-001',
      question: 'How do I reset my password?',
      answer: 'VBMS uses PIV card authentication, so there is no traditional password to reset. If you\'re having login issues, ensure your PIV card is properly inserted, try a different card reader, or contact your local IT support team.',
      category: 'Account Access',
      helpful: 89
    },
    {
      id: 'FAQ-002',
      question: 'Why is RUMEV1 recommending no exam when I think one is needed?',
      answer: 'RUMEV1 bases its recommendations on available medical evidence and established patterns. If you disagree with the AI recommendation, you can override it and order an exam. Document your reasoning for the override to help improve the system.',
      category: 'AI Tools',
      helpful: 76
    },
    {
      id: 'FAQ-003',
      question: 'How do I request missing service treatment records?',
      answer: 'Use the "Request Records" function in the claim. Select "Service Treatment Records" and specify the date range. The request will be automatically sent to NPRC. You\'ll receive email notification when records are received.',
      category: 'Records',
      helpful: 112
    },
    {
      id: 'FAQ-004',
      question: 'What should I do if a veteran calls about their claim?',
      answer: 'Direct the veteran to call 1-800-827-1000 or visit VA.gov for claim status updates. Do not provide specific claim information over the phone without proper veteran verification through official channels.',
      category: 'Customer Service',
      helpful: 67
    },
    {
      id: 'FAQ-005',
      question: 'How do I handle claims with multiple conditions?',
      answer: 'Rate each condition separately using the appropriate diagnostic code. Then calculate the combined rating using VA math (not simple addition). The system will automatically calculate the combined rating when you enter individual ratings.',
      category: 'Rating',
      helpful: 134
    },
    {
      id: 'FAQ-006',
      question: 'When should I schedule a C&P examination?',
      answer: 'Schedule a C&P exam when: 1) Insufficient medical evidence exists to rate the condition, 2) Conflicting medical opinions need clarification, 3) Current severity needs assessment, 4) RUMEV1 recommends an exam with high confidence.',
      category: 'Examinations',
      helpful: 156
    }
  ];

  const videoTutorials = [
    {
      id: 'VID-001',
      title: 'VBMS Login and Navigation',
      duration: '8:32',
      description: 'Complete walkthrough of logging into VBMS and navigating the main interface',
      category: 'Getting Started',
      views: 2341
    },
    {
      id: 'VID-002',
      title: 'Processing Your First Claim',
      duration: '15:47',
      description: 'Step-by-step tutorial for processing a simple disability claim from start to finish',
      category: 'Claims Processing',
      views: 1876
    },
    {
      id: 'VID-003',
      title: 'RUMEV1 AI Features Demo',
      duration: '12:15',
      description: 'Demonstration of RUMEV1 AI capabilities and how to interpret results',
      category: 'AI Tools',
      views: 1654
    },
    {
      id: 'VID-004',
      title: 'Advanced eFolder Searching',
      duration: '10:22',
      description: 'Advanced techniques for searching and organizing documents in eFolder',
      category: 'Document Management',
      views: 1432
    }
  ];

  const categories = ['all', ...Array.from(new Set(helpArticles.map(article => article.category)))];

  const filteredArticles = helpArticles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredVideos = videoTutorials.filter(video => {
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <WelcomeModal
          pageName="help"
          title="Help Center"
          description="Comprehensive help and support center with detailed guides, tutorials, and frequently asked questions to help you effectively use the VBMS system."
          features={[
            "Detailed step-by-step guides for all VBMS functions",
            "Interactive FAQ section with searchable answers",
            "Video tutorials and training materials",
            "Quick search across all help content and documentation"
          ]}
          demoActions={[
            { label: "Browse Articles", action: () => setActiveTab('articles') },
            { label: "View FAQs", action: () => setActiveTab('faq') },
            { label: "Search Help", action: () => setSearchTerm('login') }
          ]}
        />
        
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <div>
                  <h1 className="text-xl font-semibold text-slate-100">Help Center</h1>
                  <p className="text-sm text-slate-500">Support & Documentation</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search help articles, FAQs..."
                    className="w-64 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <svg className="absolute right-3 top-2.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Quick Help Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg p-6 border border-blue-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-blue-300">Help Articles</h3>
                  <span className="text-2xl">📚</span>
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {helpArticles.length}
                </div>
                <div className="text-xs text-blue-300/70">Comprehensive guides</div>
              </div>

              <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-lg p-6 border border-emerald-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-emerald-300">FAQ Items</h3>
                  <span className="text-2xl">❓</span>
                </div>
                <div className="text-3xl font-bold text-emerald-400 mb-1">
                  {faqs.length}
                </div>
                <div className="text-xs text-emerald-300/70">Common questions</div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg p-6 border border-purple-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-purple-300">Video Tutorials</h3>
                  <span className="text-2xl">🎥</span>
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {videoTutorials.length}
                </div>
                <div className="text-xs text-purple-300/70">Step-by-step videos</div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-lg p-6 border border-yellow-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-yellow-300">Total Views</h3>
                  <span className="text-2xl">👁️</span>
                </div>
                <div className="text-3xl font-bold text-yellow-400 mb-1">
                  {(helpArticles.reduce((acc, a) => acc + a.popularity, 0) + 
                    videoTutorials.reduce((acc, v) => acc + v.views, 0)).toLocaleString()}
                </div>
                <div className="text-xs text-yellow-300/70">This month</div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-slate-900 p-1 rounded-lg mb-8">
              <button
                onClick={() => setActiveTab('articles')}
                className={`px-6 py-3 rounded-md transition-colors flex-1 text-center ${
                  activeTab === 'articles'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                Help Articles
              </button>
              <button
                onClick={() => setActiveTab('faq')}
                className={`px-6 py-3 rounded-md transition-colors flex-1 text-center ${
                  activeTab === 'faq'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                FAQ
              </button>
              <button
                onClick={() => setActiveTab('video')}
                className={`px-6 py-3 rounded-md transition-colors flex-1 text-center ${
                  activeTab === 'video'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                Video Tutorials
              </button>
            </div>

            {/* Category Filter */}
            {(activeTab === 'articles' || activeTab === 'video') && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Help Articles */}
            {activeTab === 'articles' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-slate-100 mb-2">{article.title}</h3>
                      <p className="text-slate-400 text-sm mb-3">{article.description}</p>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                          {article.category}
                        </span>
                        <span className="text-xs text-slate-500">
                          Updated {new Date(article.lastUpdated).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {article.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                        {article.tags.length > 3 && (
                          <span className="text-xs text-slate-500">+{article.tags.length - 3} more</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="text-emerald-400">✓ {article.helpful}</span>
                        <span className="text-red-400">✗ {article.notHelpful}</span>
                      </div>
                      <span className="text-slate-500">{article.popularity} views</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* FAQ Section */}
            {activeTab === 'faq' && (
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="bg-slate-900 border border-slate-800 rounded-lg">
                    <button
                      className="w-full px-6 py-4 text-left hover:bg-slate-800/50 transition-colors"
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-slate-100">{faq.question}</h3>
                        <svg
                          className={`w-5 h-5 text-slate-400 transition-transform ${
                            expandedFAQ === faq.id ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-6 pb-4 border-t border-slate-800">
                        <div className="pt-4">
                          <p className="text-slate-300 mb-4">{faq.answer}</p>
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                              {faq.category}
                            </span>
                            <div className="flex items-center space-x-2">
                              <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs transition-colors">
                                Helpful
                              </button>
                              <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs transition-colors">
                                Not Helpful
                              </button>
                              <span className="text-slate-500 text-xs">{faq.helpful} found helpful</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Video Tutorials */}
            {activeTab === 'video' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                  <div key={video.id} className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:bg-slate-800/50 transition-colors cursor-pointer">
                    <div className="aspect-video bg-slate-800 rounded-lg mb-4 flex items-center justify-center">
                      <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a2 2 0 002 2h2a2 2 0 002-2v-4m-6 0a2 2 0 012-2h2a2 2 0 012 2m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v1" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-2">{video.title}</h3>
                    <p className="text-slate-400 text-sm mb-3">{video.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                        {video.category}
                      </span>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span>{video.duration}</span>
                        <span>{video.views} views</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {((activeTab === 'articles' && filteredArticles.length === 0) ||
              (activeTab === 'faq' && filteredFAQs.length === 0) ||
              (activeTab === 'video' && filteredVideos.length === 0)) && (
              <div className="text-center py-12">
                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-slate-400">No {activeTab === 'articles' ? 'articles' : activeTab === 'faq' ? 'FAQs' : 'videos'} match your search criteria.</p>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Article Detail Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-700">
              <div className="p-6 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-100">{selectedArticle.title}</h2>
                    <p className="text-slate-400">by {selectedArticle.author}</p>
                  </div>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-line text-slate-300">
                    {selectedArticle.content.replace(/\\n/g, '\n')}
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {selectedArticle.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-slate-400 text-sm">Was this helpful?</span>
                      <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-sm transition-colors">
                        Yes ({selectedArticle.helpful})
                      </button>
                      <button className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-sm transition-colors">
                        No ({selectedArticle.notHelpful})
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}