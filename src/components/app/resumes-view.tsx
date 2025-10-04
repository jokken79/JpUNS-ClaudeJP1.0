import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, UserPlus, Mail, Phone, Briefcase, DollarSign, ThumbsUp, ThumbsDown, ClipboardCheck } from 'lucide-react';
import type { Resume } from '@/lib/types';

interface ResumesViewProps {
  resumes: Resume[];
  onNew: () => void;
  onEdit: (resume: Resume) => void;
  onApprove: (resumeId: string) => void;
  onReject: (resumeId: string) => void;
  onOpenNyuusha: (resumeId: string) => void;
}

const ResumesView: React.FC<ResumesViewProps> = ({ resumes, onNew, onEdit, onApprove, onReject, onOpenNyuusha }) => {
  
  const getStatusBadge = (status: Resume['status']) => {
    switch (status) {
      case 'approved': return <Badge variant="default" className="bg-green-600 hover:bg-green-700">承認済</Badge>;
      case 'rejected': return <Badge variant="destructive">却下</Badge>;
      case 'reviewing': return <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600">審査中</Badge>;
      case 'pending': return <Badge variant="outline">保留中</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>履歴書管理</CardTitle>
              <CardDescription>応募者の履歴書を管理・審査</CardDescription>
            </div>
            <Button onClick={onNew} className="gap-2">
              <Plus className="w-4 h-4" />
              新規履歴書作成
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <Card key={resume.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={resume.photo || ''} alt={resume.fullName} />
                    <AvatarFallback><UserPlus className="w-5 h-5 text-muted-foreground" /></AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{resume.fullName}</p>
                    <p className="text-xs text-muted-foreground">ID: {resume.id}</p>
                  </div>
                </div>
                {getStatusBadge(resume.status)}
              </CardHeader>
              <CardContent className="space-y-2 text-sm flex-grow">
                <div className="flex items-center gap-2 text-muted-foreground"><Mail className="w-4 h-4 shrink-0" /><span className="truncate">{resume.email}</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><Phone className="w-4 h-4 shrink-0" /><span>{resume.phone}</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><Briefcase className="w-4 h-4 shrink-0" /><span>{resume.desiredPosition || '未指定'}</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><DollarSign className="w-4 h-4 shrink-0" /><span>¥{resume.desiredSalary?.toLocaleString() || '0'}</span></div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button onClick={() => onEdit(resume)} className="flex-1">詳細</Button>
                {resume.status === 'pending' && (
                  <>
                    <Button onClick={() => onApprove(resume.id)} size="icon" className="bg-green-600 hover:bg-green-700">
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => onReject(resume.id)} size="icon" variant="destructive">
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                  </>
                )}
                {resume.status === 'approved' && (
                  <Button onClick={() => onOpenNyuusha(resume.id)} size="icon" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 hover:text-purple-700">
                    <ClipboardCheck className="w-4 h-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumesView;
