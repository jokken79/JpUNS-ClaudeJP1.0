import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Database, Server, HardDrive, RefreshCw } from 'lucide-react';
import type { DatabaseRecord } from '@/lib/types';

interface DatabasePanelProps {
  show: boolean;
  setShow: (show: boolean) => void;
  records: DatabaseRecord[];
  resumeCount: number;
  nyuushaCount: number;
  resumesPending: number;
  resumesApproved: number;
  nyuushaDrafts: number;
}

const FormattedTimestamp: React.FC<{ timestamp: string }> = ({ timestamp }) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(new Date(timestamp).toLocaleString('ja-JP'));
  }, [timestamp]);

  return (
    <p className="text-muted-foreground/70 text-right text-[10px] mt-1">
      {formattedDate}
    </p>
  );
};

const DatabasePanel: React.FC<DatabasePanelProps> = ({
  show,
  setShow,
  records,
  resumeCount,
  nyuushaCount,
  resumesPending,
  resumesApproved,
  nyuushaDrafts,
}) => {
  const getActionInfo = (record: DatabaseRecord) => {
    const typeMap = {
      resume: '履歴書', nyuusha: '入社届', timecard: 'タイムカード',
      payroll: '給与', employee: '従業員', factory: '工場'
    };
    const actionMap = {
      create: { text: '作成', color: 'bg-green-500' },
      update: { text: '更新', color: 'bg-blue-500' },
      delete: { text: '削除', color: 'bg-red-500' },
      approve: { text: '承認', color: 'bg-green-500' },
      reject: { text: '却下', color: 'bg-red-500' },
    };
    return {
      type: typeMap[record.type] || '不明',
      action: actionMap[record.action]?.text || '不明',
      color: actionMap[record.action]?.color || 'bg-gray-500',
    };
  };

  return (
    <aside className={`fixed top-0 right-0 h-full bg-card border-l z-40 transition-transform duration-300 ease-in-out ${show ? 'translate-x-0' : 'translate-x-full'} w-96`}>
      <div className="flex h-full flex-col">
        <div className="p-4 border-b bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">データベース監視</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShow(false)} className="h-7 w-7">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">応募者DB</CardTitle>
                  <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{resumeCount}</div>
                  <p className="text-xs text-muted-foreground">件</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">入社届DB</CardTitle>
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{nyuushaCount}</div>
                  <p className="text-xs text-muted-foreground">件</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">統計情報</CardTitle>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-2 text-sm pt-4">
                <div className="flex justify-between"><span>承認待ち履歴書</span> <span className="font-semibold">{resumesPending}</span></div>
                <div className="flex justify-between"><span>承認済み履歴書</span> <span className="font-semibold">{resumesApproved}</span></div>
                <div className="flex justify-between"><span>処理中入社届</span> <span className="font-semibold">{nyuushaDrafts}</span></div>
              </CardContent>
            </Card>

            <div>
              <h4 className="text-sm font-medium mb-3">最近のアクティビティ</h4>
              <div className="space-y-2">
                {records.slice(0, 20).map((record) => {
                  const { type, action, color } = getActionInfo(record);
                  return (
                    <div key={record.id} className="p-3 bg-muted/50 rounded-lg text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${color}`}></span>
                        <span className="font-semibold">{type}</span>
                        <span className="text-muted-foreground">{action}</span>
                      </div>
                      <p className="text-muted-foreground mt-1 truncate" title={JSON.stringify(record.data)}>
                        ID: {record.data?.resumeId || record.data?.nyuushaId || '...'}
                      </p>
                      <FormattedTimestamp timestamp={record.timestamp} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
};

export default DatabasePanel;
