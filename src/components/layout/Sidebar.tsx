import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import type { NavViewId, NavItemConfig } from './types';
import { NAV_ITEMS } from './constants';
import type { ConnectionState } from '../../api';

interface SidebarProps {
  activeView: NavViewId;
  onSelectView: (view: NavViewId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  connState?: ConnectionState;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  isCollapsed,
  onToggleCollapse,
  connState,
}) => {
  const getBadgeClass = (type?: NavItemConfig['badgeType']) => {
    switch (type) {
      case 'crimson':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'emerald':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'violet':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'cyan':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'amber':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <aside
      className={`relative z-30 flex flex-col h-full transition-all duration-300 ease-out border-r border-slate-200 bg-white shadow-sm ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
      aria-label="Executive Navigation Sidebar"
    >
      {/* Top Branding Section (Fix Image 2: No Logo Clipping) */}
      <div className={`h-16 flex items-center border-b border-slate-200 shrink-0 ${
        isCollapsed ? 'px-3 justify-center' : 'px-4 justify-between'
      }`}>
        {isCollapsed ? (
          <div className="w-full flex items-center justify-center relative">
            <button
              type="button"
              onClick={onToggleCollapse}
              className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm shrink-0 hover:bg-indigo-100 transition-all cursor-pointer group"
              title="Expand Sidebar (Click to Expand)"
              aria-label="Expand Sidebar"
            >
              <Zap size={20} className="fill-indigo-600/20 text-indigo-600 group-hover:scale-110 transition-transform" />
            </button>
            <button
              type="button"
              onClick={onToggleCollapse}
              className="absolute -right-5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-300 transition-all z-40 cursor-pointer"
              title="Expand Sidebar"
              aria-label="Expand Sidebar"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                <Zap size={20} className="fill-indigo-600/20 text-indigo-600" />
              </div>
              <div className="truncate">
                <div className="flex items-center space-x-2">
                  <span className="font-display font-extrabold text-lg tracking-tight text-slate-900">
                    MERCURY
                  </span>
                  <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold tracking-wider">
                    HUD
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">
                  Customer Intelligence
                </p>
              </div>
            </div>

            {/* Collapse button on desktop */}
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              title="Collapse Sidebar"
              aria-label="Collapse Sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          </>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-2.5 space-y-1 overflow-y-auto" aria-label="Main Navigation">
        {!isCollapsed && (
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Intelligence Modules
          </div>
        )}

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectView(item.id)}
              title={isCollapsed ? `${item.label} — ${item.description}` : undefined}
              className={`w-full group text-left flex items-center rounded-xl transition-all duration-150 cursor-pointer ${
                isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5 space-x-3'
              } ${
                isActive
                  ? 'bg-indigo-50/90 text-indigo-950 font-semibold border-l-4 border-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div
                className={`transition-colors shrink-0 ${
                  isActive ? 'text-indigo-600' : 'group-hover:text-slate-900 text-slate-400'
                }`}
              >
                <Icon size={19} />
              </div>

              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs truncate ${
                        isActive ? 'text-slate-900 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      {item.label}
                    </span>

                    {item.badgeText && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border font-semibold shrink-0 ml-1.5 ${getBadgeClass(
                          item.badgeType
                        )}`}
                      >
                        {item.badgeText}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    {item.description}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile & Engine Telemetry Status (Fix Image 5: User Identity & Connection Widget) */}
      <div className="p-3 border-t border-slate-200 space-y-2 shrink-0 bg-slate-50/50">
        {/* User Identity Avatar */}
        <div
          className={`flex items-center rounded-xl bg-white border border-slate-200 p-2 shadow-2xs ${
            isCollapsed ? 'justify-center' : 'space-x-3'
          }`}
          title="VP of Growth (Executive C-Level)"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0 select-none">
            VG
          </div>

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 truncate">VP of Growth</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                  C-LEVEL
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate font-mono">
                executive-vp-growth
              </p>
            </div>
          )}
        </div>

        {/* Engine Status Indicator */}
        <div
          className={`flex items-center rounded-lg px-2.5 py-1.5 bg-white border border-slate-200 text-[11px] shadow-2xs ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
          title={
            connState?.status === 'connected'
              ? `Live REST Backend Connected (${connState.latencyMs}ms)`
              : 'Offline Mock Engine Active (40 REST Contracts Served)'
          }
        >
          <div className="flex items-center space-x-2">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                connState?.status === 'connected'
                  ? 'bg-emerald-500 animate-pulse'
                  : 'bg-indigo-500'
              }`}
            />
            {!isCollapsed && (
              <span className="text-slate-600 text-[10px] font-medium">
                {connState?.status === 'connected' ? 'Live REST' : 'Mock Engine'}
              </span>
            )}
          </div>

          {!isCollapsed && (
            <span
              className={`text-[10px] font-mono font-bold ${
                connState?.status === 'connected' ? 'text-emerald-700' : 'text-indigo-700'
              }`}
            >
              {connState?.status === 'connected' ? `${connState.latencyMs}ms` : '40 Routes'}
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};
