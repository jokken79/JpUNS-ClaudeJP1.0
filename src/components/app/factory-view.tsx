import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { FactoryCondition } from '@/lib/types';

interface FactoryViewProps {
  factories: FactoryCondition[];
  setFactories: React.Dispatch<React.SetStateAction<FactoryCondition[]>>;
}

const FactoryView: React.FC<FactoryViewProps> = ({ factories, setFactories }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>工場条件設定</CardTitle>
          <CardDescription>
            各工場の勤務体系や給与条件を設定します。この機能は現在開発中です。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {factories.map((factory) => (
            <Card key={factory.id} className="mb-4">
              <CardHeader>
                <CardTitle>{factory.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>基本給: {factory.baseSalary.toLocaleString()} {factory.currency}</p>
                <p>支払サイクル: {factory.paymentCycle}</p>
                <h4 className="font-semibold mt-4">スケジュール:</h4>
                <ul className="list-disc pl-5">
                  {factory.schedules.map(schedule => (
                    <li key={schedule.id}>{schedule.name} ({schedule.startTime} - {schedule.endTime})</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default FactoryView;
