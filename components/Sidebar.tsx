import React from 'react';
import { MENU_ITEMS, APP_NAME } from '../constants';
import { AppView } from '../types';
import { Sparkles } from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-2xl">
      <div className="p-6 border-b border-slate-800 flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-900/50">
          <Sparkles className="text-white w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
          {APP_NAME}
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-500 mb-3 px-2 uppercase tracking-wider">Creator Tools</p>
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as AppView)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              currentView === item.id
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-inner'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <span className={currentView === item.id ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'}>
              {item.icon}
            </span>
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="text-center py-2">
          <p className="text-xs font-medium text-slate-500">개발자 : 정혁신</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;