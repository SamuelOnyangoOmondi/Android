
// Student distribution by grade level and gender
export const studentsByGradeData = [
  { grade: "Grade 1", male: 25, female: 28, total: 53 },
  { grade: "Grade 2", male: 30, female: 32, total: 62 },
  { grade: "Grade 3", male: 22, female: 26, total: 48 },
  { grade: "Grade 4", male: 28, female: 30, total: 58 },
  { grade: "Grade 5", male: 24, female: 27, total: 51 },
  { grade: "Grade 6", male: 26, female: 23, total: 49 },
  { grade: "Grade 7", male: 20, female: 22, total: 42 },
  { grade: "Grade 8", male: 18, female: 20, total: 38 },
];

// Attendance data for the past two weeks
export const attendanceData = [
  { date: "Mon", present: 320, absent: 15, late: 8 },
  { date: "Tue", present: 325, absent: 12, late: 6 },
  { date: "Wed", present: 318, absent: 18, late: 7 },
  { date: "Thu", present: 330, absent: 8, late: 5 },
  { date: "Fri", present: 315, absent: 22, late: 6 },
  { date: "Mon", present: 328, absent: 12, late: 3 },
  { date: "Tue", present: 332, absent: 8, late: 3 },
  { date: "Wed", present: 330, absent: 10, late: 4 },
  { date: "Thu", present: 325, absent: 14, late: 4 },
  { date: "Fri", present: 320, absent: 18, late: 5 },
];

// Academic performance by subject
export const performanceData = [
  { subject: "Math", aboveAverage: 120, average: 180, belowAverage: 50 },
  { subject: "English", aboveAverage: 150, average: 160, belowAverage: 40 },
  { subject: "Science", aboveAverage: 110, average: 190, belowAverage: 50 },
  { subject: "Social Studies", aboveAverage: 140, average: 170, belowAverage: 40 },
  { subject: "Art", aboveAverage: 180, average: 130, belowAverage: 40 },
  { subject: "P.E.", aboveAverage: 200, average: 120, belowAverage: 30 },
];

// Behavior tracking data
export const behaviorData = [
  { name: "Positive", value: 65 },
  { name: "Neutral", value: 25 },
  { name: "Negative", value: 10 },
];

// Mock data for student profiles
export const mockStudents = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "2010-05-15",
    nemisId: "NEM123456",
    admissionNumber: "ADM2020001",
    gender: "male" as const,
    contactInfo: {
      email: "john.doe@example.com",
      phone: "254700123456",
      address: "123 School Lane, Nairobi",
    },
    guardianInfo: {
      name: "Jane Doe",
      relationship: "Mother",
      phone: "254711123456",
      email: "jane.doe@example.com",
      address: "123 School Lane, Nairobi",
    },
    gradeLevel: 5,
    className: "5A",
    enrollmentDate: "2020-01-15",
    profileImageUrl: "/placeholder.svg",
  },
  {
    id: "2",
    firstName: "Mary",
    lastName: "Smith",
    dateOfBirth: "2011-03-20",
    nemisId: "NEM123457",
    admissionNumber: "ADM2020002",
    gender: "female" as const,
    contactInfo: {
      email: "mary.smith@example.com",
      phone: "254700123457",
      address: "456 Park Avenue, Nairobi",
    },
    guardianInfo: {
      name: "Robert Smith",
      relationship: "Father",
      phone: "254711123457",
      email: "robert.smith@example.com",
      address: "456 Park Avenue, Nairobi",
    },
    gradeLevel: 4,
    className: "4B",
    enrollmentDate: "2020-01-16",
    profileImageUrl: "/placeholder.svg",
  },
  {
    id: "3",
    firstName: "David",
    lastName: "Johnson",
    dateOfBirth: "2012-07-10",
    nemisId: "NEM123458",
    admissionNumber: "ADM2020003",
    gender: "male" as const,
    contactInfo: {
      email: "david.johnson@example.com",
      phone: "254700123458",
      address: "789 Garden Road, Nairobi",
    },
    guardianInfo: {
      name: "Sarah Johnson",
      relationship: "Mother",
      phone: "254711123458",
      email: "sarah.johnson@example.com",
      address: "789 Garden Road, Nairobi",
    },
    gradeLevel: 3,
    className: "3A",
    enrollmentDate: "2020-01-17",
    profileImageUrl: "/placeholder.svg",
  },
];

// Mock attendance records
export const mockAttendanceRecords = [
  {
    id: "att1",
    studentId: "1",
    date: "2023-05-01",
    status: "present" as const,
  },
  {
    id: "att2",
    studentId: "1",
    date: "2023-05-02",
    status: "present" as const,
  },
  {
    id: "att3",
    studentId: "1",
    date: "2023-05-03",
    status: "absent" as const,
    note: "Family emergency",
  },
  {
    id: "att4",
    studentId: "1",
    date: "2023-05-04",
    status: "present" as const,
  },
  {
    id: "att5",
    studentId: "1",
    date: "2023-05-05",
    status: "late" as const,
    note: "Bus delay",
  },
];

// Mock academic records
export const mockAcademicRecords = [
  {
    id: "acad1",
    studentId: "1",
    subject: "Mathematics",
    term: "Term 1",
    year: "2023",
    score: 85,
    grade: "A",
    teacherRemarks: "Excellent work in algebra",
  },
  {
    id: "acad2",
    studentId: "1",
    subject: "English",
    term: "Term 1",
    year: "2023",
    score: 78,
    grade: "B+",
    teacherRemarks: "Good comprehension skills",
  },
  {
    id: "acad3",
    studentId: "1",
    subject: "Science",
    term: "Term 1",
    year: "2023",
    score: 92,
    grade: "A",
    teacherRemarks: "Outstanding project work",
  },
  {
    id: "acad4",
    studentId: "1",
    subject: "Social Studies",
    term: "Term 1",
    year: "2023",
    score: 80,
    grade: "A-",
    teacherRemarks: "Good participation in class",
  },
];
