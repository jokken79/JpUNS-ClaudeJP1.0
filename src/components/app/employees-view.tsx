import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Employee } from '@/lib/types';

interface EmployeesViewProps {
  employees: Employee[];
}

const EmployeesView: React.FC<EmployeesViewProps> = ({ employees }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>従業員管理</CardTitle>
          <CardDescription>社内の全従業員情報を一覧・管理します。</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>従業員ID</TableHead>
                <TableHead>氏名</TableHead>
                <TableHead>部署</TableHead>
                <TableHead>役職</TableHead>
                <TableHead>メールアドレス</TableHead>
                <TableHead>入社日</TableHead>
                <TableHead>ステータス</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.id}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.joinDate}</TableCell>
                  <TableCell>
                    <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesView;
