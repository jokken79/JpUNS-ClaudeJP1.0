import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSpreadsheet } from 'lucide-react';

const TimecardView = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>タイムカードPDF</CardTitle>
          <CardDescription>
            従業員のタイムカードをPDF形式で生成・管理します。
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center h-64">
          <FileSpreadsheet className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">開発中</h3>
          <p className="text-muted-foreground">この機能は現在開発中です。</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimecardView;
