'use client';

import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, Loader2, Trash2, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface RirekishoFormData {
  // Foto
  photo: string | null;

  // Información básica
  name_kanji: string;
  name_furigana: string;
  name_roman: string;
  birthday: string;
  age: number;
  gender: string;
  nationality: string;

  // Dirección y contacto
  postal_code: string;
  address: string;
  mobile: string;
  phone: string;

  // Contacto de emergencia
  emergency_name: string;
  emergency_relation: string;
  emergency_phone: string;

  // Documentos
  visa_type: string;
  visa_period: string;
  residence_card_no: string;
  passport_no: string;
  passport_expiry: string;
  license_no: string;
  license_expiry: string;
  car_owner: string;
  insurance: string;

  // Idioma japonés
  speak_level: string;
  listen_level: string;
  kanji_level: string;
  kana_read: string;
  kana_write: string;

  // Educación
  education: string;
  major: string;

  // Información física
  height: number;
  weight: number;
  uniform_size: string;
  waist: number;
  shoe_size: number;
  blood_type: string;
  vision_right: string;
  vision_left: string;
  glasses: string;
  dominant_arm: string;
  allergy: string;
  safety_shoes: string;
  vaccine: string;

  // Calificaciones y experiencia
  qualifications: string;
  experiences: string[];

  // Historial laboral
  jobHistory: Array<{
    start: string;
    end: string;
    hakenmoto: string;
    hakensaki: string;
    content: string;
    reason: string;
  }>;

  // Familia
  familyMembers: Array<{
    name: string;
    relation: string;
    birthday: string;
    age: number;
    residence: string;
    dependent: string;
  }>;

  // Otros
  commute_time: number;
  lunch_pref: string;
  applicant_id: string;
}

interface RirekishoFormProps {
  data: Partial<RirekishoFormData>;
  onChange: (data: Partial<RirekishoFormData>) => void;
  onOCRUpload?: (file: File, type: 'zairyu' | 'license') => void;
  isZairyuProcessing?: boolean;
  isLicenseProcessing?: boolean;
}

const RirekishoForm: React.FC<RirekishoFormProps> = ({ data, onChange, onOCRUpload, isZairyuProcessing, isLicenseProcessing }) => {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const zairyuInputRef = useRef<HTMLInputElement>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);

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

  const updateField = (field: keyof RirekishoFormData, value: any) => {
    const updatedData = { ...data, [field]: value };
    
    // Si se está actualizando la fecha de nacimiento, calcular automáticamente la edad
    if (field === 'birthday' && value) {
      updatedData.age = calculateAge(value);
    }
    
    onChange(updatedData);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateField('photo', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleOCRFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'zairyu' | 'license') => {
    const file = e.target.files?.[0];
    if (file && onOCRUpload) {
      onOCRUpload(file, type);
    }
  };

  const addJobEntry = () => {
    const current = data.jobHistory || [];
    updateField('jobHistory', [...current, { start: '', end: '', hakenmoto: '', hakensaki: '', content: '', reason: '' }]);
  };

  const removeJobEntry = (index: number) => {
    const current = data.jobHistory || [];
    updateField('jobHistory', current.filter((_, i) => i !== index));
  };

  const updateJobEntry = (index: number, field: string, value: string) => {
    const current = data.jobHistory || [];
    const updated = [...current];
    updated[index] = { ...updated[index], [field]: value };
    updateField('jobHistory', updated);
  };

  const addFamilyEntry = () => {
    const current = data.familyMembers || [];
    updateField('familyMembers', [...current, { name: '', relation: '', birthday: '', age: 0, residence: '', dependent: '有' }]);
  };

  const removeFamilyEntry = (index: number) => {
    const current = data.familyMembers || [];
    updateField('familyMembers', current.filter((_, i) => i !== index));
  };

  const updateFamilyEntry = (index: number, field: string, value: any) => {
    const current = data.familyMembers || [];
    const updated = [...current];
    updated[index] = { ...updated[index], [field]: value };
    updateField('familyMembers', updated);
  };

  const toggleExperience = (exp: string) => {
    const current = data.experiences || [];
    if (current.includes(exp)) {
      updateField('experiences', current.filter(e => e !== exp));
    } else {
      updateField('experiences', [...current, exp]);
    }
  };

  return (
    <ScrollArea className="h-[70vh] pr-4">
      <div className="space-y-6">

        {/* OCR Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📷 書類OCR自動入力</CardTitle>
            <p className="text-sm text-muted-foreground">在留カードまたは運転免許証をアップロードすると自動入力されます</p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>在留カード</Label>
              <input ref={zairyuInputRef} type="file" accept="image/*" onChange={(e) => handleOCRFileChange(e, 'zairyu')} className="hidden" />
              <Button variant="outline" className="w-full" onClick={() => zairyuInputRef.current?.click()} disabled={isZairyuProcessing || isLicenseProcessing}>
                {isZairyuProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                在留カードアップロード
              </Button>
            </div>
            <div>
              <Label>運転免許証</Label>
              <input ref={licenseInputRef} type="file" accept="image/*" onChange={(e) => handleOCRFileChange(e, 'license')} className="hidden" />
              <Button variant="outline" className="w-full" onClick={() => licenseInputRef.current?.click()} disabled={isLicenseProcessing || isZairyuProcessing}>
                {isLicenseProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                運転免許証アップロード
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-shrink-0">
                <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                <div className="relative">
                  <Avatar className="w-36 h-44 rounded-lg cursor-pointer" onClick={() => photoInputRef.current?.click()}>
                    <AvatarImage src={data.photo || undefined} className="object-cover" />
                    <AvatarFallback className="rounded-lg"><Camera className="w-8 h-8 text-muted-foreground" /></AvatarFallback>
                  </Avatar>
                  <Button size="icon" onClick={() => photoInputRef.current?.click()} className="absolute -bottom-2 -right-2 rounded-full h-8 w-8">
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>氏名 (漢字)</Label>
                    <Input value={data.name_kanji || ''} onChange={(e) => updateField('name_kanji', e.target.value)} placeholder="山田 太郎" />
                  </div>
                  <div>
                    <Label>フリガナ</Label>
                    <Input value={data.name_furigana || ''} onChange={(e) => updateField('name_furigana', e.target.value)} placeholder="ヤマダ タロウ" />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>生年月日</Label>
                    <Input type="date" value={data.birthday || ''} onChange={(e) => updateField('birthday', e.target.value)} />
                  </div>
                  <div>
                    <Label>年齢</Label>
                    <Input type="number" value={data.age || ''} readOnly className="bg-muted" placeholder="自動計算" />
                  </div>
                  <div>
                    <Label>性別</Label>
                    <Select value={data.gender || ''} onValueChange={(v) => updateField('gender', v)}>
                      <SelectTrigger><SelectValue placeholder="選択" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="男性">男性</SelectItem>
                        <SelectItem value="女性">女性</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>国籍</Label>
                    <Select value={data.nationality || ''} onValueChange={(v) => updateField('nationality', v)}>
                      <SelectTrigger><SelectValue placeholder="選択" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="日本">日本</SelectItem>
                        <SelectItem value="ベトナム">ベトナム</SelectItem>
                        <SelectItem value="ブラジル">ブラジル</SelectItem>
                        <SelectItem value="ペルー">ペルー</SelectItem>
                        <SelectItem value="インドネシア">インドネシア</SelectItem>
                        <SelectItem value="その他">その他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>郵便番号</Label>
                <Input value={data.postal_code || ''} onChange={(e) => updateField('postal_code', e.target.value)} placeholder="000-0000" />
              </div>
              <div className="md:col-span-3">
                <Label>住所</Label>
                <Input value={data.address || ''} onChange={(e) => updateField('address', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>携帯電話</Label>
                <Input type="tel" value={data.mobile || ''} onChange={(e) => updateField('mobile', e.target.value)} />
              </div>
              <div>
                <Label>電話番号</Label>
                <Input type="tel" value={data.phone || ''} onChange={(e) => updateField('phone', e.target.value)} />
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold">緊急連絡先</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div>
                  <Label>氏名</Label>
                  <Input value={data.emergency_name || ''} onChange={(e) => updateField('emergency_name', e.target.value)} />
                </div>
                <div>
                  <Label>続柄</Label>
                  <Input value={data.emergency_relation || ''} onChange={(e) => updateField('emergency_relation', e.target.value)} />
                </div>
                <div>
                  <Label>電話番号</Label>
                  <Input type="tel" value={data.emergency_phone || ''} onChange={(e) => updateField('emergency_phone', e.target.value)} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">書類関係</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><Label>ビザ種類</Label><Input value={data.visa_type || ''} onChange={(e) => updateField('visa_type', e.target.value)} /></div>
              <div><Label>ビザ期間</Label><Input value={data.visa_period || ''} onChange={(e) => updateField('visa_period', e.target.value)} /></div>
              <div><Label>在留カード番号</Label><Input value={data.residence_card_no || ''} onChange={(e) => updateField('residence_card_no', e.target.value)} /></div>
              <div><Label>パスポート番号</Label><Input value={data.passport_no || ''} onChange={(e) => updateField('passport_no', e.target.value)} /></div>
              <div><Label>パスポート期限</Label><Input type="date" value={data.passport_expiry || ''} onChange={(e) => updateField('passport_expiry', e.target.value)} /></div>
              <div><Label>運転免許番号</Label><Input value={data.license_no || ''} onChange={(e) => updateField('license_no', e.target.value)} /></div>
              <div><Label>運転免許期限</Label><Input type="date" value={data.license_expiry || ''} onChange={(e) => updateField('license_expiry', e.target.value)} /></div>
              <div>
                <Label>自動車所有</Label>
                <RadioGroup value={data.car_owner || ''} onValueChange={(v) => updateField('car_owner', v)} className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="有" id="car-yes" /><Label htmlFor="car-yes">有</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="無" id="car-no" /><Label htmlFor="car-no">無</Label></div>
                </RadioGroup>
              </div>
              <div>
                <Label>任意保険加入</Label>
                <RadioGroup value={data.insurance || ''} onValueChange={(v) => updateField('insurance', v)} className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="有" id="ins-yes" /><Label htmlFor="ins-yes">有</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="無" id="ins-no" /><Label htmlFor="ins-no">無</Label></div>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Habilidad en Japonés */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">日本語能力・学歴</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>話す</Label>
                <Select value={data.speak_level || '初級'} onValueChange={(v) => updateField('speak_level', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="初級">初級（挨拶程度）</SelectItem>
                    <SelectItem value="中級">中級（日常会話）</SelectItem>
                    <SelectItem value="上級">上級（通訳可）</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>聞く</Label>
                <Select value={data.listen_level || '初級'} onValueChange={(v) => updateField('listen_level', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="初級">初級（挨拶程度）</SelectItem>
                    <SelectItem value="中級">中級（日常会話）</SelectItem>
                    <SelectItem value="上級">上級（通訳可）</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>漢字読み書き</Label>
                <Select value={data.kanji_level || 'できる'} onValueChange={(v) => updateField('kanji_level', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="できる">できる</SelectItem>
                    <SelectItem value="少し">少し</SelectItem>
                    <SelectItem value="できない">できない</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>カナ読み</Label>
                <Select value={data.kana_read || 'できる'} onValueChange={(v) => updateField('kana_read', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="できる">できる</SelectItem>
                    <SelectItem value="少し">少し</SelectItem>
                    <SelectItem value="できない">できない</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div><Label>最終学歴</Label><Input value={data.education || ''} onChange={(e) => updateField('education', e.target.value)} /></div>
              <div><Label>専攻</Label><Input value={data.major || ''} onChange={(e) => updateField('major', e.target.value)} /></div>
            </div>
          </CardContent>
        </Card>

        {/* Información Física */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">身体情報・健康状態</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div><Label>身長(cm)</Label><Input type="number" value={data.height || ''} onChange={(e) => updateField('height', parseInt(e.target.value) || 0)} /></div>
              <div><Label>体重(kg)</Label><Input type="number" value={data.weight || ''} onChange={(e) => updateField('weight', parseInt(e.target.value) || 0)} /></div>
              <div><Label>服のサイズ</Label><Input value={data.uniform_size || ''} onChange={(e) => updateField('uniform_size', e.target.value)} /></div>
              <div><Label>ウエスト(cm)</Label><Input type="number" value={data.waist || ''} onChange={(e) => updateField('waist', parseInt(e.target.value) || 0)} /></div>
              <div><Label>靴サイズ(cm)</Label><Input type="number" value={data.shoe_size || ''} onChange={(e) => updateField('shoe_size', parseInt(e.target.value) || 0)} /></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><Label>血液型</Label><Input value={data.blood_type || ''} onChange={(e) => updateField('blood_type', e.target.value)} /></div>
              <div><Label>視力(右)</Label><Input value={data.vision_right || ''} onChange={(e) => updateField('vision_right', e.target.value)} /></div>
              <div><Label>視力(左)</Label><Input value={data.vision_left || ''} onChange={(e) => updateField('vision_left', e.target.value)} /></div>
              <div>
                <Label>メガネ使用</Label>
                <RadioGroup value={data.glasses || ''} onValueChange={(v) => updateField('glasses', v)} className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="有" id="glass-yes" /><Label htmlFor="glass-yes">有</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="無" id="glass-no" /><Label htmlFor="glass-no">無</Label></div>
                </RadioGroup>
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              <div>
                <Label>利き腕</Label>
                <RadioGroup value={data.dominant_arm || ''} onValueChange={(v) => updateField('dominant_arm', v)} className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="右" id="arm-right" /><Label htmlFor="arm-right">右</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="左" id="arm-left" /><Label htmlFor="arm-left">左</Label></div>
                </RadioGroup>
              </div>
              <div>
                <Label>アレルギー</Label>
                <RadioGroup value={data.allergy || ''} onValueChange={(v) => updateField('allergy', v)} className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="有" id="allergy-yes" /><Label htmlFor="allergy-yes">有</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="無" id="allergy-no" /><Label htmlFor="allergy-no">無</Label></div>
                </RadioGroup>
              </div>
              <div>
                <Label>安全靴持参</Label>
                <RadioGroup value={data.safety_shoes || ''} onValueChange={(v) => updateField('safety_shoes', v)} className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="有" id="shoes-yes" /><Label htmlFor="shoes-yes">有</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="無" id="shoes-no" /><Label htmlFor="shoes-no">無</Label></div>
                </RadioGroup>
              </div>
            </div>

            <div>
              <Label>コロナワクチン</Label>
              <RadioGroup value={data.vaccine || ''} onValueChange={(v) => updateField('vaccine', v)} className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center space-x-2"><RadioGroupItem value="未接種" id="vac-0" /><Label htmlFor="vac-0">未接種</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="1回" id="vac-1" /><Label htmlFor="vac-1">1回</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="2回" id="vac-2" /><Label htmlFor="vac-2">2回</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="3回" id="vac-3" /><Label htmlFor="vac-3">3回</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="4回" id="vac-4" /><Label htmlFor="vac-4">4回</Label></div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Calificaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">有資格取得・経験作業</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>有資格取得（フォークリフト、溶接など）</Label>
              <Textarea value={data.qualifications || ''} onChange={(e) => updateField('qualifications', e.target.value)} rows={2} />
            </div>

            <div>
              <Label className="text-base font-semibold">経験作業内容</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {['NC旋盤', '旋盤', 'プレス', 'フォークリフト', '梱包', '溶接', '車部品組立', '車部品ライン', '車部品検査', '電子部品検査', '食品加工', '鋳造', '塗装', 'ラインリーダー'].map(exp => (
                  <div key={exp} className="flex items-center space-x-2">
                    <Checkbox
                      id={`exp-${exp}`}
                      checked={(data.experiences || []).includes(exp)}
                      onCheckedChange={() => toggleExperience(exp)}
                    />
                    <Label htmlFor={`exp-${exp}`} className="cursor-pointer">{exp}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Historial Laboral */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              職務経歴
              <Button size="sm" onClick={addJobEntry}><Plus className="w-4 h-4 mr-1" />追加</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(data.jobHistory || []).map((job, index) => (
              <div key={index} className="border rounded-lg p-4 mb-4 space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-sm">職歴 #{index + 1}</span>
                  <Button size="icon" variant="destructive" onClick={() => removeJobEntry(index)}><Trash2 className="w-4 h-4" /></Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><Label>開始</Label><Input type="month" value={job.start} onChange={(e) => updateJobEntry(index, 'start', e.target.value)} /></div>
                  <div><Label>終了</Label><Input type="month" value={job.end} onChange={(e) => updateJobEntry(index, 'end', e.target.value)} /></div>
                  <div><Label>派遣元</Label><Input value={job.hakenmoto} onChange={(e) => updateJobEntry(index, 'hakenmoto', e.target.value)} /></div>
                  <div><Label>派遣先</Label><Input value={job.hakensaki} onChange={(e) => updateJobEntry(index, 'hakensaki', e.target.value)} /></div>
                  <div><Label>作業内容</Label><Input value={job.content} onChange={(e) => updateJobEntry(index, 'content', e.target.value)} /></div>
                  <div><Label>退社理由</Label><Input value={job.reason} onChange={(e) => updateJobEntry(index, 'reason', e.target.value)} /></div>
                </div>
              </div>
            ))}
            {(data.jobHistory || []).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">職歴がありません。「追加」ボタンをクリックしてください。</p>
            )}
          </CardContent>
        </Card>

        {/* Familia */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              家族構成
              <Button size="sm" onClick={addFamilyEntry}><Plus className="w-4 h-4 mr-1" />追加</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(data.familyMembers || []).map((member, index) => (
              <div key={index} className="border rounded-lg p-4 mb-4 space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-sm">家族 #{index + 1}</span>
                  <Button size="icon" variant="destructive" onClick={() => removeFamilyEntry(index)}><Trash2 className="w-4 h-4" /></Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div><Label>氏名</Label><Input value={member.name} onChange={(e) => updateFamilyEntry(index, 'name', e.target.value)} /></div>
                  <div><Label>続柄</Label><Input value={member.relation} onChange={(e) => updateFamilyEntry(index, 'relation', e.target.value)} /></div>
                  <div><Label>生年月日</Label><Input type="date" value={member.birthday} onChange={(e) => updateFamilyEntry(index, 'birthday', e.target.value)} /></div>
                  <div><Label>年齢</Label><Input type="number" value={member.age} onChange={(e) => updateFamilyEntry(index, 'age', parseInt(e.target.value) || 0)} /></div>
                  <div><Label>居住</Label><Input value={member.residence} onChange={(e) => updateFamilyEntry(index, 'residence', e.target.value)} /></div>
                  <div>
                    <Label>扶養</Label>
                    <Select value={member.dependent} onValueChange={(v) => updateFamilyEntry(index, 'dependent', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="有">有</SelectItem>
                        <SelectItem value="無">無</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
            {(data.familyMembers || []).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">家族情報がありません。「追加」ボタンをクリックしてください。</p>
            )}
          </CardContent>
        </Card>

        {/* Otros */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">その他</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>通勤片道時間（分）</Label>
                <Input type="number" value={data.commute_time || ''} onChange={(e) => updateField('commute_time', parseInt(e.target.value) || 0)} />
              </div>
              <div>
                <Label>お弁当（社内食堂）</Label>
                <Select value={data.lunch_pref || '昼/夜'} onValueChange={(v) => updateField('lunch_pref', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="昼/夜">昼/夜</SelectItem>
                    <SelectItem value="昼のみ">昼のみ</SelectItem>
                    <SelectItem value="夜のみ">夜のみ</SelectItem>
                    <SelectItem value="持参">持参</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>ID</Label>
                <Input value={data.applicant_id || ''} readOnly className="bg-muted" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default RirekishoForm;
