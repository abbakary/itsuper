import React, { useState } from 'react';
import { useTickets } from '../../contexts/TicketContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  AlertCircle, 
  User, 
  Tag,
  Send,
  Wrench,
  Settings,
  Wifi,
  Monitor,
  Zap,
  HardDrive,
  Eye,
  Shield
} from 'lucide-react';

const DEPARTMENTS = [
  'Information Technology',
  'Human Resources',
  'Finance & Accounting',
  'Marketing & Sales',
  'Operations & Production',
  'Research & Development'
];

const ADMIN_NAMES = [
  'kido muhammed - Senior IT Tech',
  'billy M - Network Admin',
  'amali A - Hardware Specialist',
  
];

const ISSUE_CATEGORIES = {
  'Hardware Issues': [
    'Computer not powering on',
    'Overheating CPU or GPU',
    'No display/output to monitor',
    'Faulty RAM (random crashes, blue screen)',
    'Hard disk failure (clicking noises, unbootable system)',
    'USB ports not working',
    'Battery not charging (laptops)',
    'Keyboard/Mouse not responding',
    'Loud or failing cooling fans',
    'Graphics card not detected'
  ],
  'Software Issues': [
    'Operating system not booting',
    'Blue Screen of Death (BSOD)',
    'Application crashes',
    'Driver conflicts or outdated drivers',
    'Slow performance due to background processes',
    'Malware or virus infections',
    'Software incompatibility',
    'Missing or corrupt system files',
    'Frequent freezing or unresponsiveness',
    'System updates failing or causing issues'
  ],
  'Network Issues': [
    'No internet connection',
    'Wi-Fi not detected',
    'Ethernet port not working',
    'IP address conflict',
    'Slow internet speeds',
    'DNS resolution failures',
    'Intermittent connectivity',
    'Unable to access specific websites or services',
    'Network adapter not detected',
    'Firewall blocking access'
  ],
  'Peripheral Device Issues': [
    'Printer not responding or printing garbled output',
    'Scanner not detected',
    'Webcam not working',
    'External drives not recognized',
    'Display problems with external monitors',
    'Bluetooth devices not connecting',
    'Audio devices (headphones/speakers) not working',
    'Projector not displaying correctly'
  ],
  'Power Issues': [
    'Sudden shutdowns or reboots',
    'Power supply unit (PSU) failure',
    'Laptop not charging or charging intermittently',
    'Loose or damaged power cables',
    'BIOS/CMOS battery failure (causing date/time reset)',
    'UPS failure or faulty surge protector'
  ],
  'BIOS/UEFI & Firmware Issues': [
    'BIOS not detecting hardware',
    'Incorrect BIOS settings causing boot failure',
    'Firmware update failures',
    'Boot loop or system stuck at BIOS screen',
    'Secure Boot or TPM-related issues'
  ],
  'Display Issues': [
    'Blank or black screen',
    'Flickering screen',
    'Distorted or scrambled display',
    'Dead pixels',
    'Screen brightness not adjustable',
    'External monitor not working',
    'Resolution settings not working'
  ],
  'Security Issues': [
    'Virus or malware infection – Slows system, deletes files, or steals data',
    'Ransomware attack – Locks files and demands payment',
    'Phishing attacks – Users tricked into giving away passwords or sensitive info',
    'Unauthorized access – Hacked user accounts or backdoor access',
    'Firewall misconfiguration – Leaving ports open or blocking legitimate traffic',
    'Weak passwords – Easy to guess or reused across accounts',
    'Outdated software/vulnerabilities – Security holes not patched',
    'Antivirus not installed or disabled – Leaving the system exposed',
    'Suspicious network traffic – Indicating a possible breach or malware activity',
    'Data leaks – Sensitive information exposed accidentally or maliciously',
    'Unencrypted communication – Sending passwords or data in plain text',
    'Insecure file sharing – Open shares or public links',
    'Privilege escalation – Normal users gaining admin rights',
    'System logs tampered – To hide intrusions or changes'
  ]
};

export function TicketForm({ onSubmit }: { onSubmit?: () => void }) {
  const { createTicket } = useTickets();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    category: '',
    specificIssue: '',
    reporterName: '',
    department: '',
    assignedAdmin: ''
  });

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Hardware Issues': Wrench,
      'Software Issues': Settings,
      'Network Issues': Wifi,
      'Peripheral Device Issues': Monitor,
      'Power Issues': Zap,
      'BIOS/UEFI & Firmware Issues': HardDrive,
      'Display Issues': Eye,
      'Security Issues': Shield
    };
    const IconComponent = icons[category as keyof typeof icons] || AlertCircle;
    return <IconComponent className="w-5 h-5" />;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category || 
        !formData.specificIssue || !formData.reporterName || 
        !formData.department || !formData.assignedAdmin) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      createTicket({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        category: formData.category,
        specificIssue: formData.specificIssue,
        reporterName: formData.reporterName,
        department: formData.department,
        assignedAdmin: formData.assignedAdmin,
        userId: user?.id || 'demo-user',
        status: 'open'
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        specificIssue: '',
        reporterName: '',
        department: '',
        assignedAdmin: ''
      });

      onSubmit?.();
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create ticket. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-t-xl">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <AlertCircle className="w-7 h-7" />
            Submit New IT Support Ticket
          </h2>
          <p className="mt-2 opacity-90">Provide detailed information about your computer issue for faster resolution</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Reporter Information Section */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Reporter Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reporterName" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  id="reporterName"
                  value={formData.reporterName}
                  onChange={(e) => setFormData(prev => ({ ...prev, reporterName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Issue Details Section */}
          <div className="bg-red-50 rounded-lg p-6 border border-red-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-red-600" />
              Issue Details
            </h3>
            
            <div className="space-y-4">
              {/* Category Selection */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Category *
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => {
                    setFormData(prev => ({ 
                      ...prev, 
                      category: e.target.value,
                      specificIssue: '' // Reset specific issue when category changes
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select Issue Category</option>
                  {Object.keys(ISSUE_CATEGORIES).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Specific Issue Selection */}
              {formData.category && (
                <div>
                  <label htmlFor="specificIssue" className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Issue *
                  </label>
                  <select
                    id="specificIssue"
                    value={formData.specificIssue}
                    onChange={(e) => setFormData(prev => ({ ...prev, specificIssue: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select Specific Issue</option>
                    {ISSUE_CATEGORIES[formData.category as keyof typeof ISSUE_CATEGORIES]?.map(issue => (
                      <option key={issue} value={issue}>{issue}</option>
                    ))}
                  </select>
                  
                  {/* Category Icon Display */}
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    {getCategoryIcon(formData.category)}
                    <span>Category: {formData.category}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Title and Description Section */}
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Ticket Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Brief summary of the issue"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                placeholder="Provide detailed information about the issue, what you were doing when it occurred, error messages, etc."
                required
              />
            </div>
          </div>

          {/* Priority and Admin Assignment */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority Level *
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="low">Low - Minor issue, no rush</option>
                <option value="medium">Medium - Normal priority</option>
                <option value="high">High - Impacts productivity</option>
                <option value="urgent">Urgent - Critical system down</option>
              </select>
            </div>

            <div>
              <label htmlFor="assignedAdmin" className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Admin *
              </label>
              <select
                id="assignedAdmin"
                value={formData.assignedAdmin}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedAdmin: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select Admin</option>
                {ADMIN_NAMES.map(admin => (
                  <option key={admin} value={admin}>{admin}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Send className="w-5 h-5" />
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}