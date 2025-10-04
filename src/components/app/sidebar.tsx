import React from 'react';
import { Home, FileText, ClipboardCheck, FileSpreadsheet, Factory, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigationItems = [
  { id: 'dashboard', label: 'ダッシュボード', icon: Home },
  { id: 'rirekisho', label: '履歴書管理', icon: FileText },
  { id: 'nyuusha', label: '入社届', icon: ClipboardCheck },
  { id: 'employees', label: '従業員管理', icon: Users },
  { id: 'factory', label: '工場条件設定', icon: Factory },
  { id: 'timecard', label: 'タイムカード', icon: FileSpreadsheet },
  { id: 'payroll', label: '給与計算', icon: DollarSign },
];

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const NavButton = ({ item }: { item: typeof navigationItems[0] }) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    return (
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        className="w-full justify-start gap-3"
        onClick={() => {
          setActiveTab(item.id);
          setSidebarOpen(false);
        }}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
        <span className="font-medium">{item.label}</span>
      </Button>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <aside
        className={`fixed lg:static top-0 left-0 z-40 w-64 h-screen bg-card border-r transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 border-b flex items-center px-4 lg:hidden">
             <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex-shrink-0"></div>
              <span className="text-xl font-bold">FactoryFlow HR</span>
            </div>
        </div>
        <nav className="p-4 space-y-1">
          {navigationItems.map(item => <NavButton key={item.id} item={item} />)}
        </nav>
      </aside>
    </>
  );
};

export default AppSidebar;
