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
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex relative overflow-hidden font-body">
      {/* Living Bioluminescent Aurora Mesh Substrate */}
      <div className="aurora-canvas" aria-hidden="true">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
        <div className="aurora-orb aurora-orb-4" />
      </div>

      {/* Desktop Persistent Navigation Sidebar */}
      <div className="hidden md:flex shrink-0">
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
        <div className="fixed inset-0 z-40 flex md:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm backdrop-fade-in"
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
        <footer className="border-t border-[rgba(255,255,255,0.06)] px-6 py-4 text-xs text-[var(--text-secondary)] flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto w-full relative z-10">
          <span>
            Mercury Platform &bull; Executive Customer Intelligence & Churn Analytics
          </span>
          <span className="mt-2 sm:mt-0 font-mono text-[11px] text-[var(--text-muted)]">
            TypeScript &bull; React 18 &bull; Vite 5 &bull; Liquid Glass Architecture
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
