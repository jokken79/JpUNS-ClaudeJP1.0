import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileText, Users, ClipboardCheck, TrendingUp, UserPlus } from 'lucide-react';
import type { Resume, NyuushaTodoke, Employee } from '@/lib/types';

interface DashboardViewProps {
  resumes: Resume[];
  nyuushaTodokes: NyuushaTodoke[];
  employees: Employee[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ resumes, nyuushaTodokes, employees }) => {
  const applicantCount = resumes.length;
  const pendingApplicants = resumes.filter(r => r.status === 'pending').length;
  const onboardingCount = nyuushaTodokes.filter(n => n.status === 'submitted' || n.status === 'approved').length;
  const approvedOnboarding = nyuushaTodokes.filter(n => n.status === 'approved').length;
  const employeeCount = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const hiringRate = applicantCount > 0 ? Math.round((nyuushaTodokes.length / applicantCount) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-600 mt-1">人事管理の全体像を把握</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">応募者数</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applicantCount}</div>
            <p className="text-xs text-muted-foreground">承認待ち: {pendingApplicants}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">入社手続き中</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onboardingCount}</div>
            <p className="text-xs text-muted-foreground">承認済: {approvedOnboarding}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総従業員数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeCount}</div>
            <p className="text-xs text-muted-foreground">アクティブ: {activeEmployees}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">採用率</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hiringRate}%</div>
            <p className="text-xs text-muted-foreground">入社: {nyuushaTodokes.length} / 応募: {applicantCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>最近の応募者</CardTitle>
            <CardDescription>直近5件の応募者リスト</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {resumes.slice(0, 5).map(resume => (
              <div key={resume.id} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={resume.photo || undefined} alt="Avatar" />
                  <AvatarFallback><UserPlus className="w-4 h-4" /></AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{resume.fullName}</p>
                  <p className="text-sm text-muted-foreground">{resume.desiredPosition}</p>
                </div>
                <div className="ml-auto font-medium text-sm capitalize">{resume.status}</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>入社予定者</CardTitle>
            <CardDescription>承認済で入社待ちの候補者</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {nyuushaTodokes.filter(n => n.status === 'approved').slice(0, 5).map(todoke => (
              <div key={todoke.id} className="flex items-center">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={resumes.find(r => r.id === todoke.resumeId)?.photo || undefined} alt="Avatar" />
                    <AvatarFallback>{todoke.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{todoke.fullName}</p>
                  <p className="text-sm text-muted-foreground">{todoke.position}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-medium text-sm">{todoke.startDate || '未定'}</p>
                  <p className="text-xs text-muted-foreground">入社予定</p>
                </div>
              </div>
            ))}
             {nyuushaTodokes.filter(n => n.status === 'approved').length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">入社予定者はいません。</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
