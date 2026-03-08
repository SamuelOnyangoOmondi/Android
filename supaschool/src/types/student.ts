
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nemisId: string;
  admissionNumber: string;
  gender: 'male' | 'female' | 'other';
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  guardianInfo: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
    address: string;
  };
  gradeLevel: number;
  className: string;
  enrollmentDate: string;
  profileImageUrl?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  note?: string;
}

export interface AcademicRecord {
  id: string;
  studentId: string;
  subject: string;
  term: string;
  year: string;
  score: number;
  grade: string;
  teacherRemarks?: string;
}

export interface BehaviorRecord {
  id: string;
  studentId: string;
  date: string;
  type: 'positive' | 'negative' | 'neutral';
  description: string;
  actionTaken?: string;
  reportedBy: string;
}

export interface ExtracurricularActivity {
  id: string;
  studentId: string;
  activityName: string;
  startDate: string;
  endDate?: string;
  role?: string;
  achievements?: string;
}

export interface StudentDocument {
  id: string;
  studentId: string;
  name: string;
  type: 'report_card' | 'medical_record' | 'transfer_form' | 'other';
  uploadDate: string;
  fileUrl: string;
}
