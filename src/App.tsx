import React, { useState, useEffect, useCallback } from 'react';
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

export const App: React.FC = () => {
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

  // Subscribe to connection state changes
  useEffect(() => {
    const unsubscribe = subscribeConnectionState(setConnState);
    return () => unsubscribe();
  }, []);

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
    } catch (err) {
      console.error('Failed to refresh data:', err);
    }
  }, []);

  // Quick Customer Lookup Selection
  const handleCustomerSelected = useCallback((customerId: string) => {
    setSelectedCustomerId(customerId);
    setActiveView('customers');
  }, []);

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
      )}

      {activeView === 'customers' && (
        <CustomerIntelligenceView
          selectedCustomerId={selectedCustomerId}
          onSelectCustomer={(id) => setSelectedCustomerId(id)}
          onNavigateToSimulator={(id) => {
            setSelectedCustomerId(id);
            setActiveView('churn-simulator');
          }}
        />
      )}

      {activeView === 'churn-simulator' && (
        <ChurnSimulatorView
          initialCustomerId={selectedCustomerId}
          onSelectCustomer={setSelectedCustomerId}
        />
      )}

      {activeView === 'retention-planner' && <RetentionPlannerView />}

      {activeView === 'marketing-funnel' && <MarketingFunnelView />}

      {activeView === 'catalog-intelligence' && <CatalogIntelligenceView />}
    </AppLayout>
  );
};

export default App;
