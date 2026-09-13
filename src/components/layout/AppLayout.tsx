import React, { useState, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PipelineHealthDrawer } from './PipelineHealthDrawer';
import type { NavViewId } from './types';
import type { ConnectionState, PipelineHealthResponse } from '../../api';

interface AppLayoutProps {
  activeView: NavViewId;
  onSelectView: (view: NavViewId) => void;
  connState: ConnectionState;
  pipelineHealth: PipelineHealthResponse | null;
  onRefreshData?: () => Promise<void> | void;
  onSelectCustomer?: (customerId: string) => void;
  onHealthUpdated?: (data: PipelineHealthResponse) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activeView,
  onSelectView,
  connState,
  pipelineHealth,
  onRefreshData,
  onSelectCustomer,
  onHealthUpdated,
  children,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPipelineDrawerOpen, setIsPipelineDrawerOpen] = useState(false);

  const handleToggleCollapse = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  const handleToggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleOpenPipelineDrawer = useCallback(() => {
    setIsPipelineDrawerOpen(true);
  }, []);

  const handleClosePipelineDrawer = useCallback(() => {
    setIsPipelineDrawerOpen(false);
  }, []);

  const handleSelectViewWithMobileClose = useCallback(
    (view: NavViewId) => {
      onSelectView(view);
      setIsMobileMenuOpen(false);
    },
    [onSelectView]
  );

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex relative font-body">
      {/* Desktop Persistent Navigation Sidebar */}
      <div
        className={`hidden lg:block shrink-0 transition-[width] duration-300 ease-out ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        }`}
        aria-hidden="true"
      />
      <div
        className={`hidden lg:flex flex-col fixed top-0 bottom-0 left-0 z-30 h-screen max-h-screen transition-[width] duration-300 ease-out ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        <Sidebar
          activeView={activeView}
          onSelectView={onSelectView}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
          connState={connState}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm backdrop-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full drawer-slide-in">
            <Sidebar
              activeView={activeView}
              onSelectView={handleSelectViewWithMobileClose}
              isCollapsed={false}
              onToggleCollapse={() => setIsMobileMenuOpen(false)}
              connState={connState}
            />
          </div>
        </div>
      )}

      {/* Primary View Workspace */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 overflow-x-hidden">
        <Header
          activeView={activeView}
          onSelectView={onSelectView}
          onOpenPipelineDrawer={handleOpenPipelineDrawer}
          onToggleMobileMenu={handleToggleMobileMenu}
          pipelineHealth={pipelineHealth}
          connState={connState}
          onRefreshData={onRefreshData}
          onSelectCustomer={onSelectCustomer}
        />

        {/* Dynamic View Container */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-8">
          {children}
        </main>

        {/* Global Executive Footer */}
        <footer className="border-t border-slate-200 px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto w-full relative z-10 bg-white/60">
          <span>
            Mercury Platform &bull; Executive Customer Intelligence & Churn Analytics
          </span>
          <span className="mt-2 sm:mt-0 font-mono text-[11px] text-slate-400">
            TypeScript &bull; React 18 &bull; Vite 5 &bull; Executive Cockpit
          </span>
        </footer>
      </div>

      {/* Slide-Over Pipeline Observability Drawer */}
      <PipelineHealthDrawer
        isOpen={isPipelineDrawerOpen}
        onClose={handleClosePipelineDrawer}
        connState={connState}
        initialHealthData={pipelineHealth}
        onHealthUpdated={onHealthUpdated}
      />
    </div>
  );
};
