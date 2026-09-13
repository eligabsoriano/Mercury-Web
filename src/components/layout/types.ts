import React from 'react';

export type NavViewId =
  | 'overview'
  | 'customers'
  | 'churn-simulator'
  | 'retention-planner'
  | 'marketing-funnel'
  | 'catalog-intelligence';

export interface NavItemConfig {
  id: NavViewId;
  label: string;
  shortLabel: string;
  description: string;
  breadcrumbs: string[];
  badgeText?: string;
  badgeType?: 'crimson' | 'emerald' | 'violet' | 'cyan' | 'amber' | 'neutral';
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
}

export interface BreadcrumbItem {
  label: string;
  isCurrent?: boolean;
}
