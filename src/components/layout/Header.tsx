import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  Menu,
  RotateCw,
  ChevronRight,
  Database,
  X,
  UserCheck,
} from 'lucide-react';
import type { NavViewId } from './types';
import { NAV_ITEMS } from './constants';
import {
  customersApi,
  type ConnectionState,
  type PipelineHealthResponse,
  type CustomerSummary,
} from '../../api';
import { RiskTierBadge, SegmentBadge } from '../common';

interface HeaderProps {
  activeView: NavViewId;
  onSelectView: (view: NavViewId) => void;
  onOpenPipelineDrawer: () => void;
  onToggleMobileMenu: () => void;
  pipelineHealth: PipelineHealthResponse | null;
  connState: ConnectionState;
  onRefreshData?: () => Promise<void> | void;
  onSelectCustomer?: (customerId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onSelectView,
  onOpenPipelineDrawer,
  onToggleMobileMenu,
  pipelineHealth,
  connState,
  onRefreshData,
  onSelectCustomer,
}) => {
  const currentNavItem = NAV_ITEMS.find((item) => item.id === activeView) ?? NAV_ITEMS[0];

  // Quick Customer Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CustomerSummary[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut ⌘K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close search popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search query
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await customersApi.list({
        search: query.trim(),
        page: 1,
        page_size: 5,
      });
      setSearchResults(response.items ?? []);
      setIsSearchOpen(true);
    } catch (err) {
      console.error('Customer lookup error:', err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  const handleSelectCustomer = (customerId: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    if (onSelectCustomer) {
      onSelectCustomer(customerId);
    } else {
      onSelectView('customers');
    }
  };

  const handleRefreshClick = async () => {
    if (onRefreshData && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefreshData();
      } finally {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  };

  // Latency & Health evaluation
  const latency = pipelineHealth?.database_latency_ms ?? connState.latencyMs ?? 42;
  const isHealthy = pipelineHealth?.status === 'ok' || connState.status === 'connected';

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shadow-xs">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center space-x-3 min-w-0">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Toggle Navigation Drawer"
        >
          <Menu size={20} />
        </button>

        {/* Dynamic Breadcrumbs */}
        <nav aria-label="Breadcrumbs" className="hidden md:flex items-center space-x-1.5 text-xs">
          {currentNavItem.breadcrumbs.map((crumb, idx) => {
            const isLast = idx === currentNavItem.breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb}>
                {idx > 0 && <ChevronRight size={12} className="text-slate-400" />}
                <span
                  className={
                    isLast
                      ? 'font-semibold text-slate-900 truncate max-w-[200px]'
                      : 'text-slate-500 hover:text-slate-900 transition-colors cursor-pointer truncate max-w-[150px]'
                  }
                  onClick={() => !isLast && onSelectView(NAV_ITEMS[0].id)}
                >
                  {crumb}
                </span>
              </React.Fragment>
            );
          })}
        </nav>

        {/* View Title on Mobile/Tablet */}
        <span className="md:hidden font-display font-bold text-sm text-slate-900 truncate">
          {currentNavItem.label}
        </span>
      </div>

      {/* Center: Global Quick Customer Lookup Search */}
      <div ref={searchContainerRef} className="relative flex-1 max-w-md hidden xl:block">
        <div className="relative flex items-center">
          <Search
            size={15}
            className="absolute left-3.5 text-slate-400 pointer-events-none"
          />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) setIsSearchOpen(true);
            }}
            placeholder="Quick customer search by ID or state... (⌘K)"
            className="w-full pl-9 pr-14 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:border-indigo-500 rounded-xl outline-none transition-all shadow-2xs focus:ring-2 focus:ring-indigo-100"
          />
          <div className="absolute right-2.5 flex items-center space-x-1.5 pointer-events-none">
            {isSearching ? (
              <RotateCw size={13} className="text-indigo-600 animate-spin" />
            ) : searchQuery ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchQuery('');
                  setSearchResults([]);
                  setIsSearchOpen(false);
                }}
                className="pointer-events-auto p-0.5 rounded text-slate-400 hover:text-slate-700"
              >
                <X size={13} />
              </button>
            ) : (
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 rounded">
                ⌘K
              </kbd>
            )}
          </div>
        </div>

        {/* Live Search Results Popover */}
        {isSearchOpen && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-white border border-slate-200 p-2 z-50 shadow-xl drawer-slide-in">
            <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase text-slate-400 font-semibold flex justify-between items-center border-b border-slate-100">
              <span>Customer Matches</span>
              <span>{searchResults.length} Results</span>
            </div>

            <div className="space-y-1 mt-1.5 max-h-72 overflow-y-auto">
              {searchResults.map((cust) => (
                <button
                  key={cust.customer_unique_id}
                  type="button"
                  onClick={() => handleSelectCustomer(cust.customer_unique_id)}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-indigo-50/70 hover:border-indigo-100 border border-transparent transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 transition-colors">
                      <UserCheck size={16} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-semibold text-slate-900">
                          {cust.customer_unique_id.slice(0, 12)}...
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          ({cust.state ?? 'BR'})
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <SegmentBadge segment={cust.segment ?? 'At Risk'} />
                        <span className="text-[10px] font-mono text-slate-600">
                          R$ {cust.lifetime_spend.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-1">
                    <RiskTierBadge
                      tier={cust.risk_tier ?? 'Low Risk'}
                      probability={cust.churn_probability ?? 0.05}
                    />
                    <span className="text-[9px] font-mono text-slate-400 group-hover:text-indigo-600">
                      View 360 &rarr;
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: Environment Pill & Pipeline Health Observability Trigger */}
      <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
        {/* Environment Indicator Pill */}
        <div className="hidden lg:flex items-center space-x-2 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 text-[11px]">
          <span
            className={`w-2 h-2 rounded-full ${
              connState.status === 'connected' ? 'bg-emerald-500' : 'bg-indigo-500'
            }`}
          />
          <span className="text-slate-600 font-medium">
            {connState.status === 'connected' ? 'Neon DB' : 'Offline Mock'}
          </span>
        </div>

        {/* Real-Time Pipeline Health Badge (Clicking triggers Slide-Over Drawer) */}
        <button
          type="button"
          onClick={onOpenPipelineDrawer}
          className="group flex items-center space-x-2 bg-white hover:bg-slate-50 active:scale-95 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all shadow-2xs cursor-pointer"
          title="Open Pipeline Health & Observability Drawer"
          aria-label="Open Pipeline Health & Observability Drawer"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isHealthy ? 'bg-emerald-400' : 'bg-rose-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isHealthy ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
          </span>

          <Database size={13} className="text-emerald-600 group-hover:text-emerald-700 transition-colors" />

          <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
            {latency} ms
          </span>

          <span className="hidden xl:inline text-[10px] uppercase font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
            Telemetry
          </span>
        </button>

        {/* Refresh Telemetry Action */}
        <button
          type="button"
          onClick={handleRefreshClick}
          className={`p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900 shadow-2xs transition-all cursor-pointer ${
            isRefreshing ? 'rotate-180 transition-transform duration-500' : ''
          }`}
          title="Refresh Telemetry and Analytics"
          aria-label="Refresh Telemetry and Analytics"
        >
          <RotateCw size={14} className={isRefreshing ? 'text-indigo-600' : ''} />
        </button>
      </div>
    </header>
  );
};
