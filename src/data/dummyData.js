const pad3 = (num) => num.toString().padStart(3, '0');

export const DEPARTMENTS = [
  { code: 'CSE', name: 'CSE' },
  { code: 'CSM', name: 'CSM(AI&ML)' },
  { code: 'CSD', name: 'CSD(DS)' },
  { code: 'CAD', name: 'CAD(AI&DS)' },
  { code: 'ECE', name: 'ECE' },
  { code: 'EEE', name: 'EEE' },
  { code: 'MEC', name: 'MEC' },
  { code: 'CIV', name: 'CIV' },
];

export const SECTIONS = ['A', 'B', 'C'];

export const parseRollNo = (rollNo) => {
  if (!rollNo || typeof rollNo !== 'string') {
    return { dept: null, section: null, num: null };
  }

  let dept = null;
  let section = null;
  let num = null;

  for (const d of DEPARTMENTS) {
    const prefix = `23${d.code}`;
    if (rollNo.startsWith(prefix)) {
      dept = d.code;
      section = rollNo.slice(prefix.length, prefix.length + 1) || null;
      num = rollNo.slice(prefix.length + 1) || null;
      break;
    }
  }

  return { dept, section, num };
};

const getParentMobileFromRoll = (rollNo) => {
  const digits = (rollNo || '').replace(/\D/g, '');
  const seed = parseInt(digits.slice(-6) || '0', 10);
  const num = 6000000000 + (seed * 73) % 3000000000;
  return num.toString().padStart(10, '6');
};

export const hods = DEPARTMENTS.map((dept) => ({
  id: `hod_${dept.code}`,
  username: `hod_${dept.code}`,
  password: 'hod@123',
  name: `Dr. ${dept.code} HOD`,
  dept: dept.code,
  deptName: dept.name,
  role: 'HOD',
}));

export const counselors = (() => {
  const list = [];
  DEPARTMENTS.forEach((dept) => {
    SECTIONS.forEach((section) => {
      const count = section === 'B' ? 3 : 2;
      for (let i = 1; i <= count; i += 1) {
        list.push({
          id: `counselor_${dept.code}_${section}`,
          username: `counselor_${dept.code}_${section}`,
          password: 'counselor@123',
          name: `Counselor ${dept.code}-${section}-${i}`,
          dept: dept.code,
          section,
          role: 'Counselor',
        });
      }
    });
  });
  return list;
})();

export const students = (() => {
  const list = [];
  DEPARTMENTS.forEach((dept) => {
    SECTIONS.forEach((section) => {
      for (let i = 1; i <= 30; i += 1) {
        const rollNo = `23${dept.code}${section}${pad3(i)}`;
        list.push({
          id: rollNo,
          rollNo,
          username: rollNo,
          password: 'student@123',
          name: `Student ${dept.code}${section}${pad3(i)}`,
          dept: dept.code,
          section,
          year: 2,
          role: 'Student',
          parentMobile: getParentMobileFromRoll(rollNo),
        });
      }
    });
  });
  return list;
})();

export const securityUsers = [
  {
    id: 'security1',
    username: 'security1',
    password: 'security@123',
    name: 'Security Officer 1',
    role: 'Security',
  },
  {
    id: 'security2',
    username: 'security2',
    password: 'security@123',
    name: 'Security Officer 2',
    role: 'Security',
  },
];

export const getHod = (dept) => hods.find((h) => h.dept === dept) || null;

export const getCounselors = (dept, section) =>
  counselors.filter((c) => c.dept === dept && c.section === section);

export const assignCounselor = (rollNo) => {
  const { dept, section, num } = parseRollNo(rollNo);
  if (!dept || !section) return null;
  const list = getCounselors(dept, section);
  if (!list.length) return null;
  const idx = (parseInt(num || '0', 10) || 0) % list.length;
  return list[idx];
};

const studentsByRoll = students.reduce((acc, s) => {
  acc[s.rollNo] = s;
  return acc;
}, {});

export const getStudentByRoll = (rollNo) => studentsByRoll[rollNo] || null;

export const getParentMobile = (rollNo) => getParentMobileFromRoll(rollNo);
