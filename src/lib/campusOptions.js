export const departments = [
  { value: 'CSE', label: 'Computer Science & Engineering' },
  { value: 'EEE', label: 'Electrical & Electronic Engineering' },
  { value: 'BBA', label: 'Business Administration (BBA)' },
  { value: 'MBA', label: 'Business Administration (MBA)' },
  { value: 'ECO', label: 'Economics & Social Sciences' },
  { value: 'ENG', label: 'English & Humanities' },
  { value: 'PHY', label: 'Mathematics & Natural Sciences' },
  { value: 'LAW', label: 'School of Law' },
  { value: 'PHA', label: 'Pharmacy' },
  { value: 'ARC', label: 'Architecture' },
  { value: 'CIV', label: 'Civil & Environmental Engineering' },
  { value: 'ME',  label: 'Mechanical Engineering' },
  { value: 'NET', label: 'Networking & Telecommunications' },
  { value: 'EDU', label: 'Institute of Educational Development' },
  { value: 'PUB', label: 'School of Public Health' },
];

export const buildings = [
  { value: 'UB40', label: 'UB40 – Main Academic Building' },
  { value: 'UB60', label: 'UB60 – Science & Engineering Block' },
  { value: 'UB80', label: 'UB80 – Business & Social Sciences' },
  { value: 'UB20', label: 'UB20 – Graduate Building' },
  { value: 'Lib',  label: 'Central Library' },
  { value: 'SAC',  label: 'Student Activity Center (SAC)' },
  { value: 'Cafe', label: 'Main Cafeteria' },
  { value: 'Gym',  label: 'Sports & Gymnasium Complex' },
  { value: 'Med',  label: 'Medical Centre' },
  { value: 'Annex', label: 'Annex Building' },
  { value: 'ResHall', label: 'Residential Hall' },
  { value: 'Admin', label: 'Administration Block' },
  { value: 'Lab',  label: 'Research & Labs Wing' },
  { value: 'Arts', label: 'Fine Arts & Architecture Studio' },
];

export const departmentMap = departments.reduce((acc, d) => { acc[d.value] = d.label; return acc; }, {});
export const buildingMap   = buildings.reduce((acc, b)   => { acc[b.value] = b.label; return acc; }, {});