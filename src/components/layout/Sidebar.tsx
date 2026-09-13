import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
  Radio,
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
        return 'bg-[rgba(244,63,94,0.18)] text-[#fecdd3] border-[rgba(244,63,94,0.4)]';
      case 'emerald':
        return 'bg-[rgba(52,211,153,0.18)] text-[#a7f3d0] border-[rgba(52,211,153,0.4)]';
      case 'violet':
        return 'bg-[rgba(139,92,246,0.18)] text-[#e9d5ff] border-[rgba(139,92,246,0.4)]';
      case 'cyan':
        return 'bg-[rgba(56,189,248,0.18)] text-[#bae6fd] border-[rgba(56,189,248,0.4)]';
      case 'amber':
        return 'bg-[rgba(251,191,36,0.18)] text-[#fef08a] border-[rgba(251,191,36,0.4)]';
      default:
        return 'bg-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] border-[rgba(255,255,255,0.14)]';
    }
  };

  return (
    <aside
      className={`relative z-30 flex flex-col transition-all duration-300 ease-out border-r border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(11,16,28,0.85)_0%,rgba(7,10,19,0.92)_100%)] backdrop-blur-2xl ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
      aria-label="Executive Navigation Sidebar"
    >
      {/* Top Branding Section */}
      <div className="h-16 flex items-center px-4 border-b border-[rgba(255,255,255,0.06)] justify-between">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-[rgba(139,92,246,0.22)] border border-[rgba(139,92,246,0.45)] flex items-center justify-center text-[#c084fc] shadow-[0_0_20px_rgba(139,92,246,0.35)] shrink-0">
            <Zap size={20} />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <div className="flex items-center space-x-2">
                <span className="font-display font-extrabold text-lg tracking-tight text-white">
                  MERCURY
                </span>
                <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-[rgba(139,92,246,0.2)] text-[#d8b4fe] border border-[rgba(139,92,246,0.4)] font-bold tracking-wider">
                  HUD
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-secondary)] truncate">
                Customer Intelligence
              </p>
            </div>
          )}
        </div>

        {/* Collapse button on desktop */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] hover:text-white transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-2.5 space-y-1.5 overflow-y-auto" aria-label="Main Navigation">
        {!isCollapsed && (
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold">
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
              className={`w-full group text-left flex items-center rounded-xl transition-all duration-200 relative ${
                isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5 space-x-3'
              } ${
                isActive
                  ? 'nav-item-active'
                  : 'text-[var(--text-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              <div
                className={`transition-colors shrink-0 ${
                  isActive ? 'text-[#c084fc]' : 'group-hover:text-white text-[var(--text-muted)]'
                }`}
              >
                <Icon size={19} />
              </div>

              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-medium truncate ${
                        isActive ? 'text-white font-semibold' : 'text-[var(--text-secondary)]'
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
                  <p className="text-[10px] text-[var(--text-muted)] truncate mt-0.5">
                    {item.description}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile & Engine Telemetry Status */}
      <div className="p-3 border-t border-[rgba(255,255,255,0.06)] space-y-2">
        {/* User Identity Pill */}
        <div
          className={`flex items-center rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] p-2 ${
            isCollapsed ? 'justify-center' : 'space-x-3'
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_100%)] flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0">
            <Shield size={15} />
          </div>

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white truncate">VP of Growth</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[rgba(139,92,246,0.2)] text-[#d8b4fe] font-bold">
                  C-LEVEL
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] truncate font-mono">
                executive-vp-growth
              </p>
            </div>
          )}
        </div>

        {/* Engine Status Indicator */}
        <div
          className={`flex items-center rounded-lg px-2.5 py-1.5 bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.05)] text-[11px] ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
          title={
            connState?.status === 'connected'
              ? `Live REST Backend Connected (${connState.latencyMs}ms)`
              : 'Offline Mock Engine Active (40 REST Contracts Served)'
          }
        >
          <div className="flex items-center space-x-2">
            <Radio
              size={11}
              className={
                connState?.status === 'connected'
                  ? 'text-[#34d399] animate-pulse'
                  : 'text-[#c084fc]'
              }
            />
            {!isCollapsed && (
              <span className="text-[var(--text-muted)] text-[10px]">
                {connState?.status === 'connected' ? 'Live REST' : 'Mock Engine'}
              </span>
            )}
          </div>

          {!isCollapsed && (
            <span
              className={`text-[10px] font-mono font-bold ${
                connState?.status === 'connected' ? 'text-[#34d399]' : 'text-[#c084fc]'
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
