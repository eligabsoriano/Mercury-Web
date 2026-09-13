import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppLayout, type NavViewId } from './components/layout';
import {
  ExecutiveOverviewView,
  CustomerIntelligenceView,
  ChurnSimulatorView,
  RetentionPlannerView,
  MarketingFunnelView,
  CatalogIntelligenceView,
} from './views';
import {
  analyticsApi,
  predictionsApi,
  healthApi,
  subscribeConnectionState,
  type ConnectionState,
  type PortfolioOverview,
  type PipelineHealthResponse,
  type ModelMetadataResponse,
} from './api';
import { ToastProvider, useToast, ErrorBoundary } from './components/common';

const AppInner: React.FC = () => {
  const { showToast } = useToast();

  // Navigation State
  const [activeView, setActiveView] = useState<NavViewId>('overview');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Real-Time Connection & Health State
  const [connState, setConnState] = useState<ConnectionState>({
    status: 'offline',
    latencyMs: null,
    isMock: true,
    lastChecked: new Date().toISOString(),
  });

  // Async Telemetry & Domain Data
  const [overview, setOverview] = useState<PortfolioOverview | null>(null);
  const [pipelineHealth, setPipelineHealth] = useState<PipelineHealthResponse | null>(null);
  const [modelMeta, setModelMeta] = useState<ModelMetadataResponse | null>(null);

  // Track previous connection status to emit toasts only on status transitions
  const prevStatusRef = useRef<string | null>(null);

  // Subscribe to connection state changes
  useEffect(() => {
    const unsubscribe = subscribeConnectionState((newConn) => {
      setConnState(newConn);

      if (prevStatusRef.current !== null && prevStatusRef.current !== newConn.status) {
        if (newConn.status === 'connected') {
          showToast({
            type: 'success',
            title: 'Backend API Connected',
            message: `Live telemetry established (latency: ${newConn.latencyMs ?? 35}ms)`,
          });
        } else {
          showToast({
            type: 'warning',
            title: 'Offline Fallback Engaged',
            message: 'Operating in self-contained offline mode with synthetic market data',
          });
        }
      }
      prevStatusRef.current = newConn.status;
    });

    return () => unsubscribe();
  }, [showToast]);

  // Hydrate Initial Domain Data
  const loadInitialData = useCallback(async () => {
    try {
      const [ovData, pipeData, metaData] = await Promise.all([
        analyticsApi.getOverview(),
        healthApi.getPipelineHealth(),
        predictionsApi.getModelInfo(),
      ]);
      setOverview(ovData);
      setPipelineHealth(pipeData);
      setModelMeta(metaData);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Handle manual data refresh
  const handleRefreshAll = useCallback(async () => {
    try {
      const [ovData, pipeData, metaData] = await Promise.all([
        analyticsApi.getOverview({ bypass_cache: true }),
        healthApi.getPipelineHealth(),
        predictionsApi.getModelInfo(),
      ]);
      setOverview(ovData);
      setPipelineHealth(pipeData);
      setModelMeta(metaData);
      showToast({
        type: 'success',
        title: 'Telemetry Refreshed',
        message: 'Portfolio overview and pipeline health synchronized successfully',
      });
    } catch (err) {
      console.error('Failed to refresh data:', err);
      showToast({
        type: 'error',
        title: 'Refresh Failed',
        message: 'Could not synchronize live telemetry from API endpoint',
      });
    }
  }, [showToast]);

  // Quick Customer Lookup Selection
  const handleCustomerSelected = useCallback((customerId: string) => {
    setSelectedCustomerId(customerId);
    setActiveView('customers');
    showToast({
      type: 'info',
      title: 'Customer Profile Loaded',
      message: `Account ${customerId.slice(0, 12)}... selected for 360 drilldown`,
    });
  }, [showToast]);

  return (
    <AppLayout
      activeView={activeView}
      onSelectView={setActiveView}
      connState={connState}
      pipelineHealth={pipelineHealth}
      onRefreshData={handleRefreshAll}
      onSelectCustomer={handleCustomerSelected}
      onHealthUpdated={setPipelineHealth}
    >
      {activeView === 'overview' && (
        <ErrorBoundary fallbackTitle="Executive Overview Module Error">
          <ExecutiveOverviewView
            overview={overview}
            pipelineHealth={pipelineHealth}
            modelMeta={modelMeta}
            onNavigateToView={(viewId) => setActiveView(viewId as NavViewId)}
            onSelectCustomer={handleCustomerSelected}
            onSelectSegment={() => {
              setActiveView('customers');
            }}
          />
        </ErrorBoundary>
      )}

      {activeView === 'customers' && (
        <ErrorBoundary fallbackTitle="Customer Intelligence Module Error">
          <CustomerIntelligenceView
            selectedCustomerId={selectedCustomerId}
            onSelectCustomer={(id) => setSelectedCustomerId(id)}
            onNavigateToSimulator={(id) => {
              setSelectedCustomerId(id);
              setActiveView('churn-simulator');
            }}
          />
        </ErrorBoundary>
      )}

      {activeView === 'churn-simulator' && (
        <ErrorBoundary fallbackTitle="Churn Simulator Module Error">
          <ChurnSimulatorView
            initialCustomerId={selectedCustomerId}
            onSelectCustomer={setSelectedCustomerId}
          />
        </ErrorBoundary>
      )}

      {activeView === 'retention-planner' && (
        <ErrorBoundary fallbackTitle="Retention Planner Module Error">
          <RetentionPlannerView />
        </ErrorBoundary>
      )}

      {activeView === 'marketing-funnel' && (
        <ErrorBoundary fallbackTitle="Marketing Funnel Module Error">
          <MarketingFunnelView />
        </ErrorBoundary>
      )}

      {activeView === 'catalog-intelligence' && (
        <ErrorBoundary fallbackTitle="Catalog Intelligence Module Error">
          <CatalogIntelligenceView />
        </ErrorBoundary>
      )}
    </AppLayout>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
};

export default App;
