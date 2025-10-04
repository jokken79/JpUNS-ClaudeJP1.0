import type { Resume, NyuushaTodoke, Employee, FactoryCondition, DatabaseRecord } from './types';

const now = new Date();
const pastDate = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

export const initialResumes: Resume[] = [
  {
    id: 'RK1687150000123',
    fullName: '鈴木 一郎',
    furigana: 'スズキ イチロウ',
    birthDate: '1995-04-22',
    age: 28,
    gender: '男性',
    email: 'ichiro.suzuki@example.com',
    phone: '090-1234-5678',
    address: '東京都千代田区1-1',
    postalCode: '100-0001',
    photo: 'https://picsum.photos/seed/person1/200/200',
    education: [],
    workExperience: [],
    qualifications: ['TOEIC 800点'],
    skills: ['Microsoft Office', 'プロジェクト管理'],
    selfPR: '責任感が強く、チームでの協調性を重視します。',
    desiredSalary: 350000,
    desiredPosition: '生産管理',
    availableDate: pastDate(0),
    status: 'approved',
    createdAt: pastDate(10),
    updatedAt: pastDate(2),
    notes: '二次面接で高評価。',
  },
  {
    id: 'RK1687160000456',
    fullName: '佐藤 美咲',
    furigana: 'サトウ ミサキ',
    birthDate: '1998-08-15',
    age: 25,
    gender: '女性',
    email: 'misaki.sato@example.com',
    phone: '080-9876-5432',
    address: '大阪府大阪市北区2-2',
    postalCode: '530-0001',
    photo: 'https://picsum.photos/seed/person2/200/200',
    education: [],
    workExperience: [],
    qualifications: ['フォークリフト免許'],
    skills: ['品質管理', 'データ分析'],
    selfPR: '細部にまで気を配り、品質向上に貢献したいです。',
    desiredSalary: 320000,
    desiredPosition: '品質保証',
    availableDate: pastDate(0),
    status: 'pending',
    createdAt: pastDate(5),
    updatedAt: pastDate(5),
    notes: '未経験だがポテンシャルあり。',
  },
  {
    id: 'RK1687170000789',
    fullName: '高橋 健太',
    furigana: 'タカハシ ケンタ',
    birthDate: '1992-11-30',
    age: 31,
    gender: '男性',
    email: 'kenta.takahashi@example.com',
    phone: '070-5555-8888',
    address: '愛知県名古屋市中区3-3',
    postalCode: '460-0001',
    photo: 'https://picsum.photos/seed/person3/200/200',
    education: [],
    workExperience: [],
    qualifications: [],
    skills: ['機械操作', '安全管理'],
    selfPR: '5年間の工場勤務経験があります。',
    desiredSalary: 400000,
    desiredPosition: 'チームリーダー',
    availableDate: pastDate(0),
    status: 'rejected',
    createdAt: pastDate(20),
    updatedAt: pastDate(15),
    notes: '希望給与と合わず。',
  },
];

export const initialNyuushaTodokes: NyuushaTodoke[] = [
  {
    id: 'NT1687150000123',
    resumeId: 'RK1687150000123',
    employeeId: '',
    fullName: '鈴木 一郎',
    department: '生産管理部',
    position: '生産管理',
    startDate: '2023-08-01',
    salary: 350000,
    employmentType: 'full-time',
    probationPeriod: 3,
    workLocation: '東京工場',
    workSchedule: '日勤',
    bankAccount: { bankName: 'みずほ銀行', branchName: '東京支店', accountType: '普通', accountNumber: '1234567', accountHolder: 'スズキ イチロウ' },
    emergencyContact: { name: '鈴木 花子', relationship: '妻', phone: '090-1111-2222', address: '同上' },
    insurance: { healthInsurance: true, employmentInsurance: true, pensionInsurance: true, workersCompensation: true },
    documents: { resumeSubmitted: true, certificatesSubmitted: true, healthCheckSubmitted: true, bankInfoSubmitted: true, photoSubmitted: true },
    approvedBy: '人事部長',
    approvedDate: pastDate(1),
    status: 'approved',
    createdAt: pastDate(2),
  }
];

export const initialEmployees: Employee[] = [
    { id: 'E001', name: '田中 太郎', department: '製造部', position: 'オペレーター', email: 'tanaka@company.jp', joinDate: '2020-04-01', salary: 280000, status: 'active', factoryId: 'F001' },
    { id: 'E002', name: '佐藤 花子', department: '品質管理', position: 'インスペクター', email: 'sato@company.jp', joinDate: '2019-07-15', salary: 320000, status: 'active', factoryId: 'F001' },
];

export const initialFactories: FactoryCondition[] = [
    {
      id: 'F001',
      name: '東京工場',
      schedules: [
        { id: 'S1', name: '早番', startTime: '06:00', endTime: '14:00', breakDuration: 45, breakStartTime: '10:00', overtimeRate: 1.25, active: true },
        { id: 'S2', name: '日勤', startTime: '08:00', endTime: '17:00', breakDuration: 60, breakStartTime: '12:00', overtimeRate: 1.25, active: true },
      ],
      baseSalary: 250000,
      currency: 'JPY',
      paymentCycle: 'monthly',
      customFields: [],
      transportAllowance: 15000,
      mealAllowance: 8000,
    }
];

export const initialDatabaseRecords: DatabaseRecord[] = [
    { id: 'DB1', type: 'resume', action: 'create', data: { resumeId: 'RK1687170000789', name: '高橋 健太' }, timestamp: pastDate(20), userId: 'admin' },
    { id: 'DB2', type: 'resume', action: 'reject', data: { resumeId: 'RK1687170000789' }, timestamp: pastDate(15), userId: 'admin' },
    { id: 'DB3', type: 'resume', action: 'create', data: { resumeId: 'RK1687150000123', name: '鈴木 一郎' }, timestamp: pastDate(10), userId: 'admin' },
    { id: 'DB4', type: 'resume', action: 'create', data: { resumeId: 'RK1687160000456', name: '佐藤 美咲' }, timestamp: pastDate(5), userId: 'admin' },
    { id: 'DB5', type: 'resume', action: 'approve', data: { resumeId: 'RK1687150000123' }, timestamp: pastDate(2), userId: 'admin' },
    { id: 'DB6', type: 'nyuusha', action: 'create', data: { nyuushaId: 'NT1687150000123' }, timestamp: pastDate(2), userId: 'admin' },
    { id: 'DB7', type: 'nyuusha', action: 'approve', data: { nyuushaId: 'NT1687150000123' }, timestamp: pastDate(1), userId: 'admin' },
];
