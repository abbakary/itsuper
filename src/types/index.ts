export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  specificIssue: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  userId: string;
  reporterName: string;
  department: string;
  assignedAdmin: string;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
  resolvedAt?: string;
  resolutionTime?: number; // in minutes
  satisfactionRating?: number; // 1-5 stars
  feedback?: string;
}

export interface Message {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  isAdmin: boolean;
}

export interface AnalyticsData {
  totalTickets: number;
  resolvedTickets: number;
  avgResolutionTime: number;
  satisfactionScore: number;
  ticketsByCategory: Record<string, number>;
  ticketsByPriority: Record<string, number>;
  ticketsByStatus: Record<string, number>;
  monthlyTrends: Array<{
    month: string;
    tickets: number;
    resolved: number;
    avgResolutionTime: number;
  }>;
  departmentStats: Record<string, {
    tickets: number;
    avgResolutionTime: number;
    satisfaction: number;
  }>;
}

export interface ForecastData {
  predictedTickets: number;
  trendDirection: 'up' | 'down' | 'stable';
  seasonalPattern: string;
  recommendations: string[];
}

export const DEPARTMENTS = [
  'Information Technology',
  'Human Resources',
  'Finance & Accounting',
  'Marketing & Sales',
  'Operations',
  'Customer Service'
];

export const ADMIN_USERS = [
  'John Smith (IT Manager)',
  'Sarah Johnson (Senior Tech)',
  'Mike Davis (Network Admin)',
  'Lisa Chen (System Admin)',
  'David Wilson (Help Desk Lead)'
];

export const ISSUE_CATEGORIES = {
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
    'Virus or malware infection',
    'Ransomware attack',
    'Phishing attacks',
    'Unauthorized access',
    'Firewall misconfiguration',
    'Weak passwords',
    'Outdated software/vulnerabilities',
    'Antivirus not installed or disabled',
    'Suspicious network traffic',
    'Data leaks',
    'Unencrypted communication',
    'Insecure file sharing',
    'Privilege escalation',
    'System logs tampered'
  ]
};