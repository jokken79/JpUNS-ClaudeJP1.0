import React from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { NyuushaTodoke } from '@/lib/types';

interface NyuushaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nyuusha: NyuushaTodoke;
  setNyuusha: (nyuusha: NyuushaTodoke) => void;
  onSave: (nyuusha: NyuushaTodoke) => void;
}

const NyuushaDialog: React.FC<NyuushaDialogProps> = ({ open, onOpenChange, nyuusha, setNyuusha, onSave }) => {
  const handleDocumentChange = (key: keyof NyuushaTodoke['documents'], checked: boolean) => {
    setNyuusha({
      ...nyuusha,
      documents: { ...nyuusha.documents, [key]: checked },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>入社届</DialogTitle>
          <p className="text-sm text-muted-foreground">履歴書ID: {nyuusha.resumeId}</p>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 p-4">
            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm font-medium text-primary">基本情報</p>
              <p className="text-sm text-primary/80 mt-1">氏名: {nyuusha.fullName}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">部署</Label>
                <Input id="department" value={nyuusha.department} onChange={(e) => setNyuusha({ ...nyuusha, department: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="position">役職</Label>
                <Input id="position" value={nyuusha.position} onChange={(e) => setNyuusha({ ...nyuusha, position: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">入社日</Label>
                <Input id="startDate" type="date" value={nyuusha.startDate} onChange={(e) => setNyuusha({ ...nyuusha, startDate: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="salary">給与</Label>
                <Input id="salary" type="number" value={nyuusha.salary} onChange={(e) => setNyuusha({ ...nyuusha, salary: parseInt(e.target.value) || 0 })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employmentType">雇用形態</Label>
                <Select value={nyuusha.employmentType} onValueChange={(value) => setNyuusha({ ...nyuusha, employmentType: value as NyuushaTodoke['employmentType'] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">正社員</SelectItem>
                    <SelectItem value="part-time">パート</SelectItem>
                    <SelectItem value="contract">契約社員</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="probationPeriod">試用期間（月）</Label>
                <Input id="probationPeriod" type="number" value={nyuusha.probationPeriod} onChange={(e) => setNyuusha({ ...nyuusha, probationPeriod: parseInt(e.target.value) || 0 })} />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">必要書類チェック</Label>
              <div className="space-y-2 rounded-md border p-4">
                {Object.entries(nyuusha.documents).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`doc-${key}`}
                      checked={value}
                      onCheckedChange={(checked) => handleDocumentChange(key as keyof NyuushaTodoke['documents'], !!checked)}
                    />
                    <label htmlFor={`doc-${key}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      { { resumeSubmitted: '履歴書', certificatesSubmitted: '資格証明書', healthCheckSubmitted: '健康診断書', bankInfoSubmitted: '銀行口座情報', photoSubmitted: '写真' }[key] || key }
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="pt-4">
            <DialogClose asChild>
                <Button variant="outline">キャンセル</Button>
            </DialogClose>
            <Button onClick={() => onSave(nyuusha)}>
                {nyuusha.status === 'draft' ? '提出' : '保存'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NyuushaDialog;
