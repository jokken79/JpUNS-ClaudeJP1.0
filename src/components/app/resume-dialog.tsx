import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import type { Resume } from '@/lib/types';
import RirekishoForm from './rirekisho-form';

// Función para calcular la edad a partir de la fecha de nacimiento
const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0;
  
  const today = new Date();
  const birth = new Date(birthDate);
  
  if (isNaN(birth.getTime())) return 0;
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return Math.max(0, age);
};

interface ResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resume: Resume;
  setResume: (resume: Resume) => void;
  onSave: (resume: Resume) => void;
  onParse: (file: File) => void;
  onGeneratePR: () => void;
  isParsing: boolean;
}

const ResumeDialog: React.FC<ResumeDialogProps> = ({ open, onOpenChange, resume, setResume, onSave, onParse, onGeneratePR, isParsing }) => {
  const [activeTab, setActiveTab] = useState('complete'); // Cambiado: abre formulario completo por defecto
  const [isZairyuProcessing, setIsZairyuProcessing] = useState(false);
  const [isLicenseProcessing, setIsLicenseProcessing] = useState(false);
  const [waitingForOCR, setWaitingForOCR] = useState<'zairyu' | 'license' | null>(null);
  
  // Inicializar rirekishoData con los datos del resume
  const [rirekishoData, setRirekishoData] = useState<any>(() => ({
    applicant_id: resume.id,
    name_kanji: resume.fullName,
    name_furigana: resume.furigana,
    birthday: resume.birthDate,
    age: resume.age,
    gender: resume.gender,
    photo: resume.photo,
    address: resume.address,
    postal_code: resume.postalCode,
    mobile: resume.phone,
    jobHistory: [],
    familyMembers: [],
    experiences: [],
  }));

  // Reinicializar rirekishoData cuando cambie el resume (por ejemplo, al abrir un nuevo diálogo)
  useEffect(() => {
    const calculatedAge = resume.birthDate ? calculateAge(resume.birthDate) : resume.age;
    
    setRirekishoData({
      applicant_id: resume.id,
      name_kanji: resume.fullName,
      name_furigana: resume.furigana,
      birthday: resume.birthDate,
      age: calculatedAge,
      gender: resume.gender,
      photo: resume.photo,
      address: resume.address,
      postal_code: resume.postalCode,
      mobile: resume.phone,
      jobHistory: [],
      familyMembers: [],
      experiences: [],
    });
  }, [open]); // Se ejecuta cuando se abre el diálogo

  // Monitorear cuando el procesamiento OCR del padre termine
  useEffect(() => {
    if (!isParsing && waitingForOCR) {
      // El procesamiento ha terminado, limpiar nuestros estados
      if (waitingForOCR === 'zairyu') {
        setIsZairyuProcessing(false);
      } else {
        setIsLicenseProcessing(false);
      }
      setWaitingForOCR(null);
    }
  }, [isParsing, waitingForOCR]);

  // Sincronizar datos del OCR con el formulario completo
  useEffect(() => {
    // Calcular edad automáticamente si hay fecha de nacimiento
    const calculatedAge = resume.birthDate ? calculateAge(resume.birthDate) : resume.age;
    
    // Actualizar rirekishoData cuando resume cambie (después del OCR)
    setRirekishoData((prev: any) => ({
      ...prev,
      applicant_id: resume.id,
      name_kanji: resume.fullName || prev.name_kanji,
      name_furigana: resume.furigana || prev.name_furigana,
      birthday: resume.birthDate || prev.birthday,
      age: calculatedAge || prev.age,
      gender: resume.gender || prev.gender,
      photo: resume.photo || prev.photo,
      address: resume.address || prev.address,
      postal_code: resume.postalCode || prev.postal_code,
      mobile: resume.phone || prev.mobile,
    }));

    // También actualizar el objeto resume con la edad calculada
    if (resume.birthDate && calculatedAge !== resume.age) {
      setResume({
        ...resume,
        age: calculatedAge
      });
    }
  }, [resume.id, resume.fullName, resume.furigana, resume.birthDate, resume.age, resume.gender, resume.phone, resume.address, resume.postalCode, resume.photo]);

  const handleOCRUpload = async (file: File, type: 'zairyu' | 'license') => {
    // Establecer el estado apropiado basado en el tipo
    if (type === 'zairyu') {
      setIsZairyuProcessing(true);
    } else {
      setIsLicenseProcessing(true);
    }

    // Recordar qué tipo estamos procesando
    setWaitingForOCR(type);

    // Llamar a la función de parse del padre
    onParse(file);
  };

  const handleRirekishoChange = (data: any) => {
    // Calcular edad si cambió la fecha de nacimiento
    const calculatedAge = data.birthday ? calculateAge(data.birthday) : data.age;
    const updatedData = {
      ...data,
      age: calculatedAge
    };
    
    setRirekishoData(updatedData);
    
    // Sincronizar con el objeto Resume
    setResume({
      ...resume,
      fullName: updatedData.name_kanji || resume.fullName,
      furigana: updatedData.name_furigana || resume.furigana,
      birthDate: updatedData.birthday || resume.birthDate,
      age: calculatedAge || resume.age,
      gender: updatedData.gender || resume.gender,
      phone: updatedData.mobile || resume.phone,
      address: updatedData.address || resume.address,
      postalCode: updatedData.postal_code || resume.postalCode,
      photo: updatedData.photo || resume.photo,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>履歴書詳細</DialogTitle>
          <p className="text-sm text-muted-foreground">ID: {resume.id}</p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="simple">簡易入力</TabsTrigger>
            <TabsTrigger value="complete">完全履歴書フォーム</TabsTrigger>
          </TabsList>

          <TabsContent value="simple" className="mt-4">
            <div className="text-sm text-muted-foreground mb-4">
              基本情報のみの簡易入力モード。詳細情報は「完全履歴書フォーム」タブへ。
            </div>
            {/* Contenido simple original - lo mantendré pero simplificado */}
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>氏名</Label>
                  <Input value={resume.fullName} onChange={(e) => setResume({ ...resume, fullName: e.target.value })} />
                </div>
                <div>
                  <Label>ふりがな</Label>
                  <Input value={resume.furigana} onChange={(e) => setResume({ ...resume, furigana: e.target.value })} />
                </div>
                <div>
                  <Label>メールアドレス</Label>
                  <Input type="email" value={resume.email} onChange={(e) => setResume({ ...resume, email: e.target.value })} />
                </div>
                <div>
                  <Label>電話番号</Label>
                  <Input type="tel" value={resume.phone} onChange={(e) => setResume({ ...resume, phone: e.target.value })} />
                </div>
                <div>
                  <Label>希望職種</Label>
                  <Input value={resume.desiredPosition} onChange={(e) => setResume({ ...resume, desiredPosition: e.target.value })} />
                </div>
                <div>
                  <Label>希望給与</Label>
                  <Input type="number" value={resume.desiredSalary} onChange={(e) => setResume({ ...resume, desiredSalary: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="complete" className="mt-4">
            <RirekishoForm
              data={rirekishoData}
              onChange={handleRirekishoChange}
              onOCRUpload={handleOCRUpload}
              isZairyuProcessing={isZairyuProcessing}
              isLicenseProcessing={isLicenseProcessing}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter className="pt-4 border-t">
          <DialogClose asChild>
            <Button variant="outline">キャンセル</Button>
          </DialogClose>
          <Button onClick={() => onSave(resume)} disabled={isParsing || isZairyuProcessing || isLicenseProcessing}>
            {(isParsing || isZairyuProcessing || isLicenseProcessing) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeDialog;
