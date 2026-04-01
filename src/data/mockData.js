
// ==========================
// DATASET INFO
// ==========================
export const datasetInfo = {
  name: 'clients.csv',
  rows: 120,
  columns: 6,
  missingValues: 14,
  duplicateRows: 2,
  qualitativeColumns: 2,
  quantitativeColumns: 4,
}

// ==========================
// DATA PREVIEW
// ==========================
export const previewColumns = [
  'Client_ID',
  'Name',
  'Age',
  'Location',
  'Income',
  'Risk_Score',
]

export const previewRows = [
  { Client_ID: 'C001', Name: 'Tariro Ncube', Age: 29, Location: 'Harare', Income: 1200, Risk_Score: 72 },
  { Client_ID: 'C002', Name: 'Nyasha Moyo', Age: 35, Location: 'Bulawayo', Income: 1850, Risk_Score: 65 },
  { Client_ID: 'C003', Name: 'Tatenda Dube', Age: 41, Location: 'Mutare', Income: 2100, Risk_Score: 81 },
  { Client_ID: 'C004', Name: 'Rudo Chikore', Age: 31, Location: 'Gweru', Income: 1600, Risk_Score: 68 },
  { Client_ID: 'C005', Name: 'Panashe Zhou', Age: 27, Location: 'Harare', Income: 980, Risk_Score: 59 },
]

// ==========================
// COLUMN SUMMARY
// ==========================
export const columnSummary = [
  { name: 'Client_ID', type: 'string', category: 'Qualitative', missing: 0 },
  { name: 'Name', type: 'string', category: 'Qualitative', missing: 0 },
  { name: 'Age', type: 'integer', category: 'Quantitative', missing: 3 },
  { name: 'Location', type: 'string', category: 'Qualitative', missing: 1 },
  { name: 'Income', type: 'number', category: 'Quantitative', missing: 6 },
  { name: 'Risk_Score', type: 'number', category: 'Quantitative', missing: 4 },
]

// ==========================
// INSIGHTS
// ==========================
export const quickInsights = [
  'The dataset contains 14 missing values that should be reviewed before analysis.',
  'Income shows a wide distribution indicating varied client investment capacity.',
  'Age and Income may have a positive correlation worth exploring.',
  'Client_ID appears to be a strong primary key candidate.',
]

// ==========================
// DATA QUALITY
// ==========================
export const qualityScore = 84

export const qualityBreakdown = [
  { label: 'Completeness', value: 88 },
  { label: 'Uniqueness', value: 97 },
  { label: 'Consistency', value: 80 },
  { label: 'Validity', value: 71 },
]

export const issues = [
  {
    column: 'Age',
    type: 'Missing values',
    severity: 'Medium',
    recommendation: 'Fill using median value',
  },
  {
    column: 'Income',
    type: 'Missing values',
    severity: 'High',
    recommendation: 'Investigate source system and impute carefully',
  },
  {
    column: 'Location',
    type: 'Inconsistent labels',
    severity: 'Medium',
    recommendation: 'Standardize city naming',
  },
  {
    column: 'Client_ID',
    type: 'Duplicate pattern detected',
    severity: 'High',
    recommendation: 'Validate uniqueness constraint',
  },
]

// ==========================
// EDA SUMMARY
// ==========================
export const numericalSummary = [
  { column: 'Age', mean: 33.7, median: 32, min: 21, max: 58 },
  { column: 'Income', mean: 1640, median: 1580, min: 650, max: 4200 },
  { column: 'Risk_Score', mean: 69.4, median: 70, min: 40, max: 92 },
]

export const categoricalSummary = [
  { column: 'Location', unique: 4, frequent: 'Harare', missing: 1 },
  { column: 'Name', unique: 120, frequent: 'N/A', missing: 0 },
]

// ==========================
// STEM & LEAF (DEMO)
// ==========================
export const stemLeaf = `
2 | 1 7 9
3 | 1 2 5
4 | 1
5 | 8
`

// ==========================
// CORRELATION
// ==========================
export const correlationMatrix = [
  [1.0, 0.71, 0.34],
  [0.71, 1.0, 0.42],
  [0.34, 0.42, 1.0],
]

export const correlationLabels = ['Age', 'Income', 'Risk_Score']

export const correlationDetails = [
  { a: 'Age', b: 'Income', value: 0.71, strength: 'Strong Positive' },
  { a: 'Income', b: 'Risk_Score', value: 0.42, strength: 'Moderate Positive' },
  { a: 'Age', b: 'Risk_Score', value: 0.34, strength: 'Weak Positive' },
]

// ==========================
// PRIMARY KEY
// ==========================
export const keyCandidates = [
  { column: 'Client_ID', unique: 'Yes', nulls: 0, suitable: 'Yes' },
  { column: 'Name', unique: 'Mostly', nulls: 0, suitable: 'No' },
  { column: 'Age', unique: 'No', nulls: 3, suitable: 'No' },
]

// ==========================
// MERGED DATA
// ==========================
export const mergedColumns = [
  'Client_ID',
  'Name',
  'Age',
  'Location',
  'Income',
  'Risk_Score',
  'Transaction_Date',
  'Transaction_Amount',
  'Portfolio_Value',
]

export const mergedRows = [
  {
    Client_ID: 'C001',
    Name: 'Tariro Ncube',
    Age: 29,
    Location: 'Harare',
    Income: 1200,
    Risk_Score: 72,
    Transaction_Date: '2026-03-01',
    Transaction_Amount: 320,
    Portfolio_Value: 5400,
  },
  {
    Client_ID: 'C002',
    Name: 'Nyasha Moyo',
    Age: 35,
    Location: 'Bulawayo',
    Income: 1850,
    Risk_Score: 65,
    Transaction_Date: '2026-03-02',
    Transaction_Amount: 700,
    Portfolio_Value: 6100,
  },
]

// ==========================
// REPORT TEXT
// ==========================
export const reportText = `
Dura Capital - Data Quality Report

Dataset: clients.csv
Rows: 120
Columns: 6
Overall Quality Score: 84%

Key Findings:
- Missing values exist in Age, Income, and Risk_Score.
- Client_ID is the best primary key candidate.
- Age and Income show a strong positive correlation.
- Dataset is suitable for further financial analysis.
`