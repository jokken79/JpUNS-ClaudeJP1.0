export interface Resume {
  id: string;
  fullName: string;
  furigana: string;
  birthDate: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  photo: string | null;
  education: {
    school: string;
    department: string;
    graduationDate: string;
    degree: string;
  }[];
  workExperience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  qualifications: string[];
  skills: string[];
  selfPR: string;
  desiredSalary: number;
  desiredPosition: string;
  availableDate: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  notes: string;
}

export interface NyuushaTodoke {
  id: string;
  resumeId: string;
  employeeId: string;
  fullName: string;
  department: string;
  position: string;
  startDate: string;
  salary: number;
  employmentType: 'full-time' | 'part-time' | 'contract';
  probationPeriod: number;
  workLocation: string;
  workSchedule: string;
  bankAccount: {
    bankName: string;
    branchName: string;
    accountType: string;
    accountNumber: string;
    accountHolder: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    address: string;
  };
  insurance: {
    healthInsurance: boolean;
    employmentInsurance: boolean;
    pensionInsurance: boolean;
    workersCompensation: boolean;
  };
  documents: {
    resumeSubmitted: boolean;
    certificatesSubmitted: boolean;
    healthCheckSubmitted: boolean;
    bankInfoSubmitted: boolean;
    photoSubmitted: boolean;
  };
  approvedBy: string;
  approvedDate: string;
  status: 'draft' | 'submitted' | 'approved' | 'active';
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  email: string;
  joinDate: string;
  salary: number;
  status: 'active' | 'vacation' | 'sick';
  factoryId: string;
  resumeId?: string;
}

export interface TimecardEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  breakTime: number;
  overtime: number;
  regularHours: number;
  totalHours: number;
  status: 'approved' | 'pending' | 'rejected';
  factoryId: string;
  shiftType?: string;
}

export interface WorkSchedule {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  breakDuration: number;
  breakStartTime: string;
  overtimeRate: number;
  active: boolean;
}

export interface CustomField {
  id: string;
  fieldName: string;
  fieldType: 'text' | 'number' | 'boolean' | 'date' | 'select';
  fieldValue: any;
  options?: string[];
  required: boolean;
}

export interface FactoryCondition {
  id: string;
  name: string;
  schedules: WorkSchedule[];
  baseSalary: number;
  currency: string;
  paymentCycle: 'weekly' | 'biweekly' | 'monthly';
  customFields: CustomField[];
  nightShiftRate?: number;
  weekendRate?: number;
  holidayRate?: number;
  transportAllowance?: number;
  mealAllowance?: number;
  housingAllowance?: number;
  specialBonuses?: { name: string; amount: number }[];
}

export interface DatabaseRecord {
  id: string;
  type: 'timecard' | 'payroll' | 'employee' | 'factory' | 'resume' | 'nyuusha';
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject';
  data: any;
  timestamp: string;
  userId: string;
}
