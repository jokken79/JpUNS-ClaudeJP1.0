import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, CheckCircle, UserCheck } from 'lucide-react';
import type { NyuushaTodoke, Resume } from '@/lib/types';

interface NyuushaViewProps {
  nyuushaTodokes: NyuushaTodoke[];
  onNew: (resumeId: string) => void;
  onEdit: (nyuusha: NyuushaTodoke) => void;
  onApprove: (nyuushaId: string) => void;
  onRegister: (nyuushaId: string) => void;
  resumes: Resume[];
}

const NyuushaView: React.FC<NyuushaViewProps> = ({ nyuushaTodokes, onNew, onEdit, onApprove, onRegister }) => {
  const [resumeSearchId, setResumeSearchId] = useState('');

  const getStatusBadge = (status: NyuushaTodoke['status']) => {
    switch (status) {
      case 'active': return <Badge variant="default" className="bg-green-600 hover:bg-green-700">入社済</Badge>;
      case 'approved': return <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">承認済</Badge>;
      case 'submitted': return <Badge variant="secondary">提出済</Badge>;
      case 'draft': return <Badge variant="outline">下書き</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>入社届管理</CardTitle>
              <CardDescription>承認済み応募者の入社手続き</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="履歴書IDで検索..."
                  value={resumeSearchId}
                  onChange={(e) => setResumeSearchId(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => onNew(resumeSearchId)}>新規作成</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>入社届ID</TableHead>
                  <TableHead>氏名</TableHead>
                  <TableHead>部署</TableHead>
                  <TableHead>役職</TableHead>
                  <TableHead>入社日</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead className="text-right">アクション</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nyuushaTodokes.map((todoke) => (
                  <TableRow key={todoke.id}>
                    <TableCell className="font-medium">{todoke.id}</TableCell>
                    <TableCell>{todoke.fullName}</TableCell>
                    <TableCell>{todoke.department || '未定'}</TableCell>
                    <TableCell>{todoke.position}</TableCell>
                    <TableCell>{todoke.startDate || '未定'}</TableCell>
                    <TableCell>{getStatusBadge(todoke.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(todoke)} className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {todoke.status === 'submitted' && (
                          <Button variant="ghost" size="icon" onClick={() => onApprove(todoke.id)} className="h-8 w-8 text-green-600 hover:text-green-700">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {todoke.status === 'approved' && (
                          <Button variant="outline" size="sm" onClick={() => onRegister(todoke.id)} className="gap-1">
                            <UserCheck className="h-4 w-4" />
                            従業員登録
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NyuushaView;
