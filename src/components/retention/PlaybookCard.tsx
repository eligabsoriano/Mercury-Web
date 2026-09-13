import React, { useState } from 'react';
import {
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Phone,
  Truck,
  MessageSquare,
  Mail,
  Award,
  Globe,
} from 'lucide-react';
import { GlassCard } from '../common';
import type { RetentionPlaybook } from '../../api';

interface PlaybookCardProps {
  playbook: RetentionPlaybook;
  onSimulateCampaign?: (playbook: RetentionPlaybook) => void;
}

export const PlaybookCard: React.FC<PlaybookCardProps> = ({
  playbook,
  onSimulateCampaign,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyTemplate = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(playbook.action_template);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const getChannelIcon = (channel: string) => {
    const ch = channel.toLowerCase();
    if (ch.includes('phone') || ch.includes('vip') || ch.includes('whatsapp')) {
      return <Phone size={12} className="text-[#c084fc]" />;
    }
    if (ch.includes('carrier') || ch.includes('sms') || ch.includes('freight')) {
      return <Truck size={12} className="text-[#38bdf8]" />;
    }
    if (ch.includes('review') || ch.includes('escalation')) {
      return <MessageSquare size={12} className="text-[#fb7185]" />;
    }
    if (ch.includes('email') || ch.includes('push')) {
      return <Mail size={12} className="text-[#fbbf24]" />;
    }
    if (ch.includes('loyalty') || ch.includes('in-app')) {
      return <Award size={12} className="text-[#34d399]" />;
    }
    return <Globe size={12} className="text-[var(--text-secondary)]" />;
  };

  return (
    <GlassCard
      title={playbook.name}
      subtitle={playbook.target_criteria}
      glow="violet"
      className="hover:scale-[1.01] transition-transform flex flex-col justify-between"
      headerAction={
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[var(--text-secondary)]">
          {playbook.playbook_id}
        </span>
      }
    >
      <div className="space-y-4 mt-2 text-xs flex-1 flex flex-col justify-between">
        <p className="text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
          {playbook.description}
        </p>

        {/* Cost & Save Rate Metrics */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] font-mono text-[11px]">
          <div>
            <span className="text-[var(--text-muted)] text-[10px] block uppercase">
              Unit Cost / Cust:
            </span>
            <span className="font-bold text-white text-sm mt-0.5 block">
              R$ {playbook.default_cost_per_customer.toFixed(2)}
            </span>
          </div>

          <div>
            <span className="text-[var(--text-muted)] text-[10px] block uppercase">
              Save Rate Range:
            </span>
            <span className="font-bold text-[#34d399] text-sm mt-0.5 block">
              {(playbook.estimated_save_rate_min * 100).toFixed(0)}% -{' '}
              {(playbook.estimated_save_rate_max * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Recommended Strategy Action */}
        <div className="p-2.5 rounded-lg bg-[rgba(139,92,246,0.04)] border border-[rgba(139,92,246,0.15)] text-[11px]">
          <span className="text-[#c084fc] font-semibold block flex items-center space-x-1.5">
            <Sparkles size={11} />
            <span>Recommended Intervention:</span>
          </span>
          <p className="text-[var(--text-secondary)] mt-1 leading-normal">
            {playbook.recommended_action}
          </p>
        </div>

        {/* Action Template Box with Copy Action */}
        <div className="p-2.5 rounded-lg bg-[rgba(0,0,0,0.25)] border border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] mb-1">
            <span>Outreach Script Template:</span>
            <button
              type="button"
              onClick={handleCopyTemplate}
              className="flex items-center space-x-1 text-[#a78bfa] hover:text-white transition-colors"
              title="Copy template to clipboard"
            >
              {copied ? (
                <>
                  <Check size={11} className="text-[#34d399]" />
                  <span className="text-[#34d399]">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={11} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] italic line-clamp-2 leading-relaxed font-mono">
            &ldquo;{playbook.action_template}&rdquo;
          </p>
        </div>

        {/* Card Footer: Channel & Fast CTA */}
        <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs">
          <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] text-[10px] font-mono text-[var(--text-secondary)]">
            {getChannelIcon(playbook.intervention_channel)}
            <span className="truncate max-w-[140px]">{playbook.intervention_channel}</span>
          </span>

          {onSimulateCampaign && (
            <button
              type="button"
              onClick={() => onSimulateCampaign(playbook)}
              className="flex items-center space-x-1 text-xs font-mono font-bold text-[#a78bfa] hover:text-white transition-colors px-2.5 py-1 rounded-lg bg-[rgba(139,92,246,0.12)] hover:bg-[rgba(139,92,246,0.25)] border border-[rgba(139,92,246,0.25)]"
            >
              <span>Simulate ROI</span>
              <ArrowRight size={12} />
            </button>
          )}
        </div>
      </div>
    </GlassCard>
  );
};
