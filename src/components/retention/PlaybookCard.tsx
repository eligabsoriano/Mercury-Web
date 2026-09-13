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
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-semibold">
          {playbook.playbook_id}
        </span>
      }
    >
      <div className="space-y-4 mt-2 text-xs flex-1 flex flex-col justify-between">
        <p className="text-slate-600 line-clamp-2 leading-relaxed">
          {playbook.description}
        </p>

        {/* Cost & Save Rate Metrics */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px]">
          <div>
            <span className="text-slate-500 text-[10px] block uppercase">
              Unit Cost / Cust:
            </span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              R$ {playbook.default_cost_per_customer.toFixed(2)}
            </span>
          </div>

          <div>
            <span className="text-slate-500 text-[10px] block uppercase">
              Save Rate Range:
            </span>
            <span className="font-bold text-emerald-600 text-sm mt-0.5 block">
              {(playbook.estimated_save_rate_min * 100).toFixed(0)}% -{' '}
              {(playbook.estimated_save_rate_max * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Recommended Strategy Action */}
        <div className="p-2.5 rounded-lg bg-violet-50/60 border border-violet-100 text-[11px]">
          <span className="text-violet-700 font-semibold block flex items-center space-x-1.5">
            <Sparkles size={11} />
            <span>Recommended Intervention:</span>
          </span>
          <p className="text-slate-600 mt-1 leading-normal">
            {playbook.recommended_action}
          </p>
        </div>

        {/* Action Template Box with Copy Action */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
            <span>Outreach Script Template:</span>
            <button
              type="button"
              onClick={handleCopyTemplate}
              className="flex items-center space-x-1 text-violet-600 hover:text-violet-800 transition-colors font-semibold"
              title="Copy template to clipboard"
            >
              {copied ? (
                <>
                  <Check size={11} className="text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={11} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-700 italic line-clamp-2 leading-relaxed font-mono">
            &ldquo;{playbook.action_template}&rdquo;
          </p>
        </div>

        {/* Card Footer: Channel & Fast CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-600">
            {getChannelIcon(playbook.intervention_channel)}
            <span className="truncate max-w-[140px]">{playbook.intervention_channel}</span>
          </span>

          {onSimulateCampaign && (
            <button
              type="button"
              onClick={() => onSimulateCampaign(playbook)}
              className="flex items-center space-x-1 text-xs font-mono font-bold text-violet-700 hover:text-violet-900 transition-colors px-2.5 py-1 rounded-lg bg-violet-50 hover:bg-violet-100 border border-violet-200 shadow-xs"
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
