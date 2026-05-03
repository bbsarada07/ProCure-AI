export interface Criterion {
  id: string;
  category: 'Financial' | 'Technical' | 'Compliance';
  description: string;
  requirement: string;
  isMandatory: boolean;
  status: 'Pass' | 'Fail' | 'Needs Review';
  compiledValue?: string;
  extractedValue?: string;
  sourceSnippet?: string;
}

export interface Bidder {
  id: string;
  name: string;
  criteria: Record<string, Criterion>;
  overallStatus: 'Pass' | 'Fail' | 'Needs Review';
  riskScore: number;
  riskAnomalies: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

export const MOCK_DNA_COMPILATION = [
  {
    id: 'crit_1',
    category: 'Financial',
    description: 'Minimum Annual Turnover',
    requirement: '₹5 Crore in last 3 financial years',
    isMandatory: true,
  },
  {
    id: 'crit_2',
    category: 'Technical',
    description: 'Similar Projects',
    requirement: 'At least 3 similar projects completed in last 5 years',
    isMandatory: true,
  },
  {
    id: 'crit_3',
    category: 'Compliance',
    description: 'GST Registration',
    requirement: 'Valid GST registration certificate',
    isMandatory: true,
  },
  {
    id: 'crit_4',
    category: 'Compliance',
    description: 'ISO Certification',
    requirement: 'ISO 9001:2015 certification',
    isMandatory: false,
  },
];

export const MOCK_BIDDERS: Bidder[] = [
  {
    id: 'bid_1',
    name: 'Apex Infrastructure Pvt Ltd',
    overallStatus: 'Pass',
    riskScore: 12,
    riskAnomalies: [],
    criteria: {
      crit_1: { id: 'crit_1', category: 'Financial', description: 'Turnover', requirement: '₹5Cr', isMandatory: true, status: 'Pass', compiledValue: '₹6.2 Crore' },
      crit_2: { id: 'crit_2', category: 'Technical', description: 'Projects', requirement: '3 Projects', isMandatory: true, status: 'Pass', compiledValue: '4 Projects' },
      crit_3: { id: 'crit_3', category: 'Compliance', description: 'GST', requirement: 'Valid', isMandatory: true, status: 'Pass', compiledValue: 'Verified' },
      crit_4: { id: 'crit_4', category: 'Compliance', description: 'ISO', requirement: 'Valid', isMandatory: false, status: 'Pass', compiledValue: 'Verified' },
    },
  },
  {
    id: 'bid_2',
    name: 'Bharat Steel Works',
    overallStatus: 'Fail',
    riskScore: 45,
    riskAnomalies: ['Inconsistent turnover reporting'],
    criteria: {
      crit_1: { id: 'crit_1', category: 'Financial', description: 'Turnover', requirement: '₹5Cr', isMandatory: true, status: 'Fail', extractedValue: 'Not Clearly Legible' },
      crit_2: { id: 'crit_2', category: 'Technical', description: 'Projects', requirement: '3 Projects', isMandatory: true, status: 'Pass', extractedValue: '3 Projects' },
      crit_3: { id: 'crit_3', category: 'Compliance', description: 'GST', requirement: 'Valid', isMandatory: true, status: 'Pass', extractedValue: 'Verified' },
      crit_4: { id: 'crit_4', category: 'Compliance', description: 'ISO', requirement: 'Valid', isMandatory: false, status: 'Pass', extractedValue: 'Verified' },
    },
  },
  {
    id: 'bid_3',
    name: 'City Buildcon',
    overallStatus: 'Fail',
    riskScore: 88,
    riskAnomalies: ['Turnover below threshold', 'Multiple litigation flags', 'Incomplete technical history'],
    criteria: {
      crit_1: { id: 'crit_1', category: 'Financial', description: 'Turnover', requirement: '₹5Cr', isMandatory: true, status: 'Fail', extractedValue: '₹3.8 Crore' },
      crit_2: { id: 'crit_2', category: 'Technical', description: 'Projects', requirement: '3 Projects', isMandatory: true, status: 'Pass', extractedValue: '5 Projects' },
      crit_3: { id: 'crit_3', category: 'Compliance', description: 'GST', requirement: 'Valid', isMandatory: true, status: 'Pass', extractedValue: 'Verified' },
      crit_4: { id: 'crit_4', category: 'Compliance', description: 'ISO', requirement: 'Valid', isMandatory: false, status: 'Pass', extractedValue: 'Verified' },
    },
  },
  {
    id: 'bid_4',
    name: 'Dynamic Engineering',
    overallStatus: 'Pass',
    riskScore: 22,
    riskAnomalies: ['Minor PAN mismatch in secondary docs'],
    criteria: {
      crit_1: { id: 'crit_1', category: 'Financial', description: 'Turnover', requirement: '₹5Cr', isMandatory: true, status: 'Pass', extractedValue: '₹12.4 Crore' },
      crit_2: { id: 'crit_2', category: 'Technical', description: 'Projects', requirement: '3 Projects', isMandatory: true, status: 'Pass', extractedValue: '6 Projects' },
      crit_3: { id: 'crit_3', category: 'Compliance', description: 'GST', requirement: 'Valid', isMandatory: true, status: 'Pass', extractedValue: 'Verified' },
      crit_4: { id: 'crit_4', category: 'Compliance', description: 'ISO', requirement: 'Valid', isMandatory: false, status: 'Fail', extractedValue: 'Expired' },
    },
  },
  {
    id: 'bid_5',
    name: 'East-West Infra',
    overallStatus: 'Pass',
    riskScore: 75,
    riskAnomalies: ['cartel topology anomaly (82% below average)', 'collusive entity pattern detected'],
    criteria: {
      crit_1: { id: 'crit_1', category: 'Financial', description: 'Turnover', requirement: '₹5Cr', isMandatory: true, status: 'Pass', compiledValue: '₹5.1 Crore' },
      crit_2: { id: 'crit_2', category: 'Technical', description: 'Projects', requirement: '3 Projects', isMandatory: true, status: 'Pass', compiledValue: '3 Projects' },
      crit_3: { id: 'crit_3', category: 'Compliance', description: 'GST', requirement: 'Valid', isMandatory: true, status: 'Pass', compiledValue: 'Verified' },
      crit_4: { id: 'crit_4', category: 'Compliance', description: 'ISO', requirement: 'Valid', isMandatory: false, status: 'Pass', compiledValue: 'Verified' },
    },
  },
  {
    id: 'bid_6',
    name: 'Falcon Constructions',
    overallStatus: 'Pass',
    riskScore: 52,
    riskAnomalies: ['Unclear parent company relationship'],
    criteria: {
      crit_1: { id: 'crit_1', category: 'Financial', description: 'Turnover', requirement: '₹5Cr', isMandatory: true, status: 'Pass', extractedValue: '₹7.8 Crore' },
      crit_2: { id: 'crit_2', category: 'Technical', description: 'Projects', requirement: '3 Projects', isMandatory: true, status: 'Pass', extractedValue: 'Verified' },
      crit_3: { id: 'crit_3', category: 'Compliance', description: 'GST', requirement: 'Valid', isMandatory: true, status: 'Pass', extractedValue: 'Verified' },
      crit_4: { id: 'crit_4', category: 'Compliance', description: 'ISO', requirement: 'Valid', isMandatory: false, status: 'Pass', extractedValue: 'Verified' },
    },
  },
  {
    id: 'bid_7',
    name: 'Global Builders',
    overallStatus: 'Pass',
    riskScore: 18,
    riskAnomalies: [],
    criteria: {
      crit_1: { id: 'crit_1', category: 'Financial', description: 'Turnover', requirement: '₹5Cr', isMandatory: true, status: 'Pass', extractedValue: '₹9.2 Crore' },
      crit_2: { id: 'crit_2', category: 'Technical', description: 'Projects', requirement: '3 Projects', isMandatory: true, status: 'Pass', extractedValue: '4 Projects' },
      crit_3: { id: 'crit_3', category: 'Compliance', description: 'GST', requirement: 'Valid', isMandatory: true, status: 'Pass', extractedValue: 'Verified' },
      crit_4: { id: 'crit_4', category: 'Compliance', description: 'ISO', requirement: 'Valid', isMandatory: false, status: 'Pass', extractedValue: 'Verified' },
    },
  },
  {
    id: 'bid_8',
    name: 'Heritage Foundations',
    overallStatus: 'Fail',
    riskScore: 68,
    riskAnomalies: ['Technical shortfall', 'History of project delays'],
    criteria: {
      crit_1: { id: 'crit_1', category: 'Financial', description: 'Turnover', requirement: '₹5Cr', isMandatory: true, status: 'Pass', extractedValue: '₹6.5 Crore' },
      crit_2: { id: 'crit_2', category: 'Technical', description: 'Projects', requirement: '3 Projects', isMandatory: true, status: 'Fail', extractedValue: '2 Projects' },
      crit_3: { id: 'crit_3', category: 'Compliance', description: 'GST', requirement: 'Valid', isMandatory: true, status: 'Pass', extractedValue: 'Verified' },
      crit_4: { id: 'crit_4', category: 'Compliance', description: 'ISO', requirement: 'Valid', isMandatory: false, status: 'Pass', extractedValue: 'Verified' },
    },
  },
  {
    id: 'bid_9',
    name: 'Indus Valley Infra',
    overallStatus: 'Pass',
    riskScore: 25,
    riskAnomalies: [],
    criteria: {
      crit_1: { id: 'crit_1', category: 'Financial', description: 'Turnover', requirement: '₹5Cr', isMandatory: true, status: 'Pass', extractedValue: '₹5.9 Crore' },
      crit_2: { id: 'crit_2', category: 'Technical', description: 'Projects', requirement: '3 Projects', isMandatory: true, status: 'Pass', extractedValue: '3 Projects' },
      crit_3: { id: 'crit_3', category: 'Compliance', description: 'GST', requirement: 'Valid', isMandatory: true, status: 'Pass', extractedValue: 'Verified' },
      crit_4: { id: 'crit_4', category: 'Compliance', description: 'ISO', requirement: 'Valid', isMandatory: false, status: 'Pass', extractedValue: 'Verified' },
    },
  },
  {
    id: 'bid_10',
    name: 'Jupiter Structures',
    overallStatus: 'Pass',
    riskScore: 5,
    riskAnomalies: [],
    criteria: {
      crit_1: { id: 'crit_1', category: 'Financial', description: 'Turnover', requirement: '₹5Cr', isMandatory: true, status: 'Pass', extractedValue: '₹15.0 Crore' },
      crit_2: { id: 'crit_2', category: 'Technical', description: 'Projects', requirement: '3 Projects', isMandatory: true, status: 'Pass', extractedValue: '8 Projects' },
      crit_3: { id: 'crit_3', category: 'Compliance', description: 'GST', requirement: 'Valid', isMandatory: true, status: 'Pass', extractedValue: 'Verified' },
      crit_4: { id: 'crit_4', category: 'Compliance', description: 'ISO', requirement: 'Valid', isMandatory: false, status: 'Pass', extractedValue: 'Verified' },
    },
  },
];


export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: '1', timestamp: '2026-04-19 10:15:00', action: 'Logic-Gate Execution', user: 'GFR Engine', details: 'Automatically verified Bidder 1 GST Registration via logic-gate.' },
  { id: '2', timestamp: '2026-04-19 11:30:00', action: 'Export', user: 'Officer Smith', details: 'Exported preliminary evaluation ledger to PDF.' },
];
