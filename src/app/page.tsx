'use client';

import React, { useState, useEffect } from 'react';
import type {
  Resume,
  NyuushaTodoke,
  Employee,
  FactoryCondition,
  DatabaseRecord,
} from '@/lib/types';
import {
  initialResumes,
  initialNyuushaTodokes,
  initialEmployees,
  initialFactories,
  initialDatabaseRecords,
} from '@/lib/data';

import AppHeader from '@/components/app/header';
import AppSidebar from '@/components/app/sidebar';
import DatabasePanel from '@/components/app/database-panel';
import DashboardView from '@/components/app/dashboard-view';
import ResumesView from '@/components/app/resumes-view';
import NyuushaView from '@/components/app/nyuusha-view';
import EmployeesView from '@/components/app/employees-view';
import FactoryView from '@/components/app/factory-view';
import TimecardView from '@/components/app/timecard-view';
import PayrollView from '@/components/app/payroll-view';
import ResumeDialog from '@/components/app/resume-dialog';
import NyuushaDialog from '@/components/app/nyuusha-dialog';
import { useToast } from '@/hooks/use-toast';
import { extractResumeData } from '@/ai/flows/resume-data-extraction';
import { generateSelfPR } from '@/ai/flows/resume-self-pr-generator';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDatabasePanel, setShowDatabasePanel] = useState(true);
  const [databaseRecords, setDatabaseRecords] = useState<DatabaseRecord[]>(initialDatabaseRecords);
  const [resumes, setResumes] = useState<Resume[]>(initialResumes);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [editingResume, setEditingResume] = useState<Resume | null>(null);
  const [nyuushaTodokes, setNyuushaTodokes] = useState<NyuushaTodoke[]>(initialNyuushaTodokes);
  const [showNyuushaModal, setShowNyuushaModal] = useState(false);
  const [editingNyuusha, setEditingNyuusha] = useState<NyuushaTodoke | null>(null);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [factories, setFactories] = useState<FactoryCondition[]>(initialFactories);
  const [isParsing, setIsParsing] = useState(false);
  const { toast } = useToast();

  // Función para comprimir imágenes
  const compressImage = (dataUrl: string, quality: number): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Reducir el tamaño si es muy grande
        let { width, height } = img;
        const maxDimension = 1200; // Máximo 1200px en cualquier dirección
        
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Comprimir
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      
      img.src = dataUrl;
    });
  };

  const addDatabaseRecord = (type: DatabaseRecord['type'], action: DatabaseRecord['action'], data: any) => {
    const newRecord: DatabaseRecord = {
      id: `DB${Date.now()}`,
      type,
      action,
      data,
      timestamp: new Date().toISOString(),
      userId: 'admin',
    };
    setDatabaseRecords(prev => [newRecord, ...prev].slice(0, 100));
  };

  const generateId = (prefix: string) => `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;

  const createNewResume = (): Resume => ({
    id: generateId('RK'),
    fullName: '', furigana: '', birthDate: '', age: 0, gender: '', email: '',
    phone: '', address: '', postalCode: '', photo: null, education: [],
    workExperience: [], qualifications: [], skills: [], selfPR: '', desiredSalary: 0,
    desiredPosition: '', availableDate: '', status: 'pending',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), notes: '',
  });

  const createNewNyuusha = (resumeId: string): NyuushaTodoke | null => {
    const resume = resumes.find(r => r.id === resumeId);
    if (!resume) return null;
    return {
      id: generateId('NT'), resumeId, employeeId: '', fullName: resume.fullName,
      department: '', position: resume.desiredPosition || '', startDate: '',
      salary: resume.desiredSalary || 0, employmentType: 'full-time',
      probationPeriod: 3, workLocation: '', workSchedule: '',
      bankAccount: { bankName: '', branchName: '', accountType: '普通', accountNumber: '', accountHolder: resume.fullName },
      emergencyContact: { name: '', relationship: '', phone: '', address: '' },
      insurance: { healthInsurance: true, employmentInsurance: true, pensionInsurance: true, workersCompensation: true },
      documents: { resumeSubmitted: true, certificatesSubmitted: false, healthCheckSubmitted: false, bankInfoSubmitted: false, photoSubmitted: !!resume.photo },
      approvedBy: '', approvedDate: '', status: 'draft', createdAt: new Date().toISOString(),
    };
  };
  
  const handleOpenNewResume = () => {
    setEditingResume(createNewResume());
    setShowResumeModal(true);
  };
  
  const handleEditResume = (resume: Resume) => {
    setEditingResume({ ...resume });
    setShowResumeModal(true);
  };

  const handleSaveResume = (resumeToSave: Resume) => {
    const isNew = !resumes.some(r => r.id === resumeToSave.id);
    if (isNew) {
      setResumes(prev => [resumeToSave, ...prev]);
      addDatabaseRecord('resume', 'create', { resumeId: resumeToSave.id, name: resumeToSave.fullName });
      toast({ title: "Success", description: "New resume created." });
    } else {
      setResumes(prev => prev.map(r => r.id === resumeToSave.id ? { ...resumeToSave, updatedAt: new Date().toISOString() } : r));
      addDatabaseRecord('resume', 'update', { resumeId: resumeToSave.id });
      toast({ title: "Success", description: "Resume updated." });
    }
    setShowResumeModal(false);
    setEditingResume(null);
  };
  
  const approveResume = (resumeId: string) => {
    setResumes(prev => prev.map(r => r.id === resumeId ? { ...r, status: 'approved', updatedAt: new Date().toISOString() } : r));
    addDatabaseRecord('resume', 'approve', { resumeId, action: 'approved' });
    toast({ title: 'Resume Approved', description: `Resume ${resumeId} can now proceed to onboarding.` });
  };
  
  const rejectResume = (resumeId: string) => {
    setResumes(prev => prev.map(r => r.id === resumeId ? { ...r, status: 'rejected', updatedAt: new Date().toISOString() } : r));
    addDatabaseRecord('resume', 'reject', { resumeId, action: 'rejected' });
    toast({ variant: 'destructive', title: 'Resume Rejected', description: `Resume ${resumeId} has been rejected.` });
  };
  
  const handleOpenNewNyuusha = (resumeId: string) => {
    const resume = resumes.find(r => r.id === resumeId && r.status === 'approved');
    if (resume) {
      const newNyuusha = createNewNyuusha(resume.id);
      if (newNyuusha) {
        setEditingNyuusha(newNyuusha);
        setShowNyuushaModal(true);
      }
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'Approved resume not found.' });
    }
  };

  const handleEditNyuusha = (nyuusha: NyuushaTodoke) => {
    setEditingNyuusha(nyuusha);
    setShowNyuushaModal(true);
  };

  const handleSaveNyuusha = (nyuushaToSave: NyuushaTodoke) => {
    const isNew = !nyuushaTodokes.some(n => n.id === nyuushaToSave.id);
    if(isNew) {
      const newNyuusha = { ...nyuushaToSave, status: 'submitted' as const };
      setNyuushaTodokes(prev => [newNyuusha, ...prev]);
      addDatabaseRecord('nyuusha', 'create', { nyuushaId: newNyuusha.id, resumeId: newNyuusha.resumeId });
      toast({ title: 'Submitted', description: 'Onboarding form has been submitted for approval.' });
    } else {
      setNyuushaTodokes(prev => prev.map(n => n.id === nyuushaToSave.id ? nyuushaToSave : n));
      addDatabaseRecord('nyuusha', 'update', { nyuushaId: nyuushaToSave.id });
      toast({ title: 'Updated', description: 'Onboarding form saved.' });
    }
    setShowNyuushaModal(false);
    setEditingNyuusha(null);
  };

  const approveNyuusha = (nyuushaId: string) => {
    setNyuushaTodokes(prev => prev.map(n => n.id === nyuushaId ? { ...n, status: 'approved', approvedDate: new Date().toISOString() } : n));
    addDatabaseRecord('nyuusha', 'approve', { nyuushaId });
    toast({ title: 'Onboarding Approved', description: 'Ready to register as an employee.' });
  };

  const registerEmployee = (nyuushaId: string) => {
    const todoke = nyuushaTodokes.find(n => n.id === nyuushaId);
    if (!todoke) return;

    const newEmployee: Employee = {
      id: generateId('E'), name: todoke.fullName, department: todoke.department,
      position: todoke.position, email: resumes.find(r => r.id === todoke.resumeId)?.email || '',
      joinDate: todoke.startDate, salary: todoke.salary, status: 'active',
      factoryId: 'F001', resumeId: todoke.resumeId,
    };

    setEmployees(prev => [...prev, newEmployee]);
    setNyuushaTodokes(prev => prev.map(n => n.id === nyuushaId ? { ...n, status: 'active', employeeId: newEmployee.id } : n));
    addDatabaseRecord('employee', 'create', { employeeId: newEmployee.id, name: newEmployee.name });
    toast({ title: 'Employee Registered', description: `${newEmployee.name} is now an active employee.` });
  };

  const handleResumeParse = async (file: File) => {
    setIsParsing(true);
    try {
      console.log('Iniciando procesamiento OCR...');
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          let dataUri = e.target?.result as string;
          
          // Comprimir imagen si es muy grande
          if (file.size > 2 * 1024 * 1024) { // Si es > 2MB
            console.log('Imagen grande detectada, comprimiendo...');
            dataUri = await compressImage(dataUri, 0.7); // Comprimir al 70%
          }
          
          console.log('Archivo convertido a base64, enviando a Gemini...');
          
          // Timeout más largo para dar tiempo al procesamiento de fotos
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout: El procesamiento está tardando mucho')), 120000)
          );
          
          const extractPromise = extractResumeData({ resumeDataUri: dataUri });
          
          const extractedData = await Promise.race([extractPromise, timeoutPromise]) as any;
          console.log('Datos extraídos:', extractedData);
          
          // Procesar la foto si existe
          let photoData = null;
          if (extractedData.photo) {
            console.log('Foto encontrada en OCR:', extractedData.photo.substring(0, 50) + '...');
            photoData = extractedData.photo;
          } else {
            console.log('No se encontró foto en el documento');
          }
          
          setEditingResume(prev => ({
            ...createNewResume(),
            ...prev,
            id: prev?.id || createNewResume().id,
            fullName: extractedData.fullName || prev?.fullName || '',
            furigana: extractedData.furigana || prev?.furigana || '',
            birthDate: extractedData.birthDate ? new Date(extractedData.birthDate).toISOString().split('T')[0] : prev?.birthDate || '',
            age: extractedData.age || prev?.age || 0,
            gender: extractedData.gender || prev?.gender || '',
            email: extractedData.email || prev?.email || '',
            phone: extractedData.phone || prev?.phone || '',
            address: extractedData.address || prev?.address || '',
            postalCode: extractedData.postalCode || prev?.postalCode || '',
            photo: photoData || prev?.photo || null,
            education: (extractedData.education || prev?.education || []).map((edu: any) => ({
              school: edu.school || '',
              department: edu.department || '',
              graduationDate: edu.graduationDate || '',
              degree: edu.degree || '',
            })),
            workExperience: (extractedData.workExperience || prev?.workExperience || []).map((exp: any) => ({
              company: exp.company || '',
              position: exp.position || '',
              startDate: exp.startDate || '',
              endDate: exp.endDate || '',
              description: exp.description || '',
            })),
            skills: extractedData.skills || prev?.skills || [],
            selfPR: extractedData.selfPR || prev?.selfPR || '',
            desiredSalary: extractedData.desiredSalary || prev?.desiredSalary || 0,
            desiredPosition: extractedData.desiredPosition || prev?.desiredPosition || '',
          }));
          toast({ title: 'AI Parse Complete', description: 'Resume data and photo have been extracted. Please review.' });
          setIsParsing(false);
        } catch (ocrError) {
          console.error('Error en OCR:', ocrError);
          toast({ variant: 'destructive', title: 'AI Parse Error', description: 'Could not parse document. Please try again.' });
          setIsParsing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error general:', error);
      toast({ variant: 'destructive', title: 'File Error', description: 'Could not read file.' });
      setIsParsing(false);
    }
  };

  const handleGenerateSelfPR = async () => {
    if (!editingResume) return;
    const { skills, workExperience } = editingResume;
    if (skills.length > 0 || workExperience.length > 0) {
      setIsParsing(true);
      try {
        const result = await generateSelfPR({ skills, workExperience });
        setEditingResume({ ...editingResume, selfPR: result.selfPR });
        toast({ title: 'AI Complete', description: 'Self-PR generated.' });
      } catch (error) {
        toast({ variant: 'destructive', title: 'AI Error', description: 'Could not generate self-PR.' });
      } finally {
        setIsParsing(false);
      }
    } else {
      toast({ title: 'Info', description: 'Please add skills or work experience first.' });
    }
  };


  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView resumes={resumes} nyuushaTodokes={nyuushaTodokes} employees={employees} />;
      case 'rirekisho': return <ResumesView resumes={resumes} onNew={handleOpenNewResume} onEdit={handleEditResume} onApprove={approveResume} onReject={rejectResume} onOpenNyuusha={handleOpenNewNyuusha} />;
      case 'nyuusha': return <NyuushaView nyuushaTodokes={nyuushaTodokes} onNew={handleOpenNewNyuusha} onEdit={handleEditNyuusha} onApprove={approveNyuusha} onRegister={registerEmployee} resumes={resumes} />;
      case 'employees': return <EmployeesView employees={employees} />;
      case 'factory': return <FactoryView factories={factories} setFactories={setFactories} />;
      case 'timecard': return <TimecardView />;
      case 'payroll': return <PayrollView />;
      default: return <DashboardView resumes={resumes} nyuushaTodokes={nyuushaTodokes} employees={employees} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setShowDatabasePanel={setShowDatabasePanel} />
      <div className="flex">
        <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${showDatabasePanel ? 'lg:mr-96' : ''}`}>
          {renderContent()}
        </main>
      </div>
      <DatabasePanel show={showDatabasePanel} setShow={setShowDatabasePanel} records={databaseRecords} resumeCount={resumes.length} nyuushaCount={nyuushaTodokes.length} resumesPending={resumes.filter(r => r.status === 'pending').length} resumesApproved={resumes.filter(r => r.status === 'approved').length} nyuushaDrafts={nyuushaTodokes.filter(n => n.status === 'draft').length} />
      
      {editingResume && (
        <ResumeDialog
          open={showResumeModal}
          onOpenChange={setShowResumeModal}
          resume={editingResume}
          setResume={setEditingResume}
          onSave={handleSaveResume}
          onParse={handleResumeParse}
          onGeneratePR={handleGenerateSelfPR}
          isParsing={isParsing}
        />
      )}

      {editingNyuusha && (
        <NyuushaDialog
          open={showNyuushaModal}
          onOpenChange={setShowNyuushaModal}
          nyuusha={editingNyuusha}
          setNyuusha={setEditingNyuusha}
          onSave={handleSaveNyuusha}
        />
      )}
    </div>
  );
}
