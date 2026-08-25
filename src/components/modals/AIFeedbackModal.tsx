import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SimulationRun } from '../../types';
import { formatDate } from '../../lib/utils';
import {
  Sparkles,
  Bot,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Award,
  Clock,
  MessageSquare,
  TrendingUp,
  ShieldCheck,
  Zap,
  Target,
  ArrowRight,
} from 'lucide-react';

interface AIFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  run: SimulationRun | null;
}

export const AIFeedbackModal: React.FC<AIFeedbackModalProps> = ({
  isOpen,
  onClose,
  run,
}) => {
  const [activeTab, setActiveTab] = useState<'rubric' | 'dialogue'>('rubric');

  if (!run) return null;

  const gradeVariant = {
    Distinction: 'success',
    Pass: 'brand',
    'Needs Retake': 'error',
  }[run.grade] as any;

  const scoreColor =
    run.score >= 90
      ? 'text-[#34D399] border-[#34D399]/40 bg-[#34D399]/10'
      : run.score >= 70
      ? 'text-[#FB923C] border-[#FB923C]/40 bg-[#FB923C]/10'
      : 'text-[#F87171] border-[#F87171]/40 bg-[#F87171]/10';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Simulation Assessment & Feedback"
      description={`Detailed evaluation metrics and qualitative AI coach report for ${run.userName}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Top Summary Banner */}
        <div className="p-4 sm:p-5 bg-[#0D0E14] border border-[#1F2230] rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={
                run.userAvatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              }
              alt={run.userName}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#2E3345] shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-[#F8FAFC]">{run.userName}</h3>
                {run.organizationName ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#34D399] bg-[#34D399]/10 border border-[#34D399]/20 px-2 py-0.5 rounded-full">
                    <Building2 className="w-3 h-3" />
                    {run.organizationName}
                  </span>
                ) : (
                  <span className="text-[11px] text-[#94A3B8] bg-[#171923] px-2 py-0.5 rounded-full border border-[#2E3345]">
                    Individual Learner
                  </span>
                )}
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">{run.userEmail}</p>
              <div className="flex items-center gap-3 text-[11px] text-[#94A3B8] mt-1.5 flex-wrap">
                <span className="text-[#CBD5E1] font-medium">{run.careerName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#38BDF8]" />
                  {run.durationMinutes} mins duration
                </span>
                <span>•</span>
                <span>{formatDate(run.completedAt)}</span>
              </div>
            </div>
          </div>

          {/* Overall Score Badge Card */}
          <div className={`px-4 py-3 rounded-xl border flex items-center gap-3 shrink-0 ${scoreColor}`}>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black font-mono leading-none block">
                {run.score}%
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 mt-0.5 block">
                {run.grade}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-[#07080C]/40">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Simulation Context Header */}
        <div className="p-3.5 bg-[#171923]/60 border border-[#1F2230] rounded-lg flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 truncate">
            <Bot className="w-4 h-4 text-[#FB923C] shrink-0" />
            <span className="text-[#94A3B8]">Scenario:</span>
            <span className="font-semibold text-[#F8FAFC] truncate">{run.simulationTitle}</span>
          </div>
          <Badge variant="brand" size="sm">
            {run.difficulty}
          </Badge>
        </div>

        {/* AI Performance Narrative Summary */}
        <div className="p-4 bg-[#12131C] border border-[#1F2230] rounded-xl space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#38BDF8] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            AI Evaluation Narrative
          </div>
          <p className="text-xs text-[#CBD5E1] leading-relaxed">
            {run.aiFeedback.overallSummary}
          </p>
        </div>

        {/* View Switcher: Rubric Evaluation vs Transcript Highlights */}
        <div className="flex items-center gap-2 border-b border-[#1F2230] pb-2">
          <button
            onClick={() => setActiveTab('rubric')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'rubric'
                ? 'bg-[#FB923C] text-black shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#171923]'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            Rubric Criteria Breakdown ({run.aiFeedback.rubricBreakdown.length})
          </button>

          {run.aiFeedback.dialogueHighlights && run.aiFeedback.dialogueHighlights.length > 0 && (
            <button
              onClick={() => setActiveTab('dialogue')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'dialogue'
                  ? 'bg-[#FB923C] text-black shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#171923]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Dialogue Highlights
            </button>
          )}
        </div>

        {/* TAB 1: Rubric Competency Breakdown & Strengths */}
        {activeTab === 'rubric' && (
          <div className="space-y-4">
            {/* Criteria Breakdown */}
            <div className="space-y-2.5">
              {run.aiFeedback.rubricBreakdown.map((item, idx) => {
                const itemPercent = Math.round((item.score / item.maxScore) * 100);
                const barColor =
                  itemPercent >= 90 ? 'bg-[#34D399]' : itemPercent >= 75 ? 'bg-[#FB923C]' : 'bg-[#F87171]';

                return (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#0D0E14] border border-[#1F2230] rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#F8FAFC]">{item.criteria}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-[10px] text-[#94A3B8] bg-[#171923] px-2 py-0.5 rounded border border-[#2E3345]">
                          Weight: {item.weightPercentage}%
                        </span>
                        <span className="font-bold text-[#F8FAFC] text-sm">
                          {item.score}/{item.maxScore}
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-[#171923] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${itemPercent}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                      {item.feedback}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Strengths & Improvement Areas Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Key Strengths */}
              <div className="p-4 bg-[#0D0E14] border border-[#34D399]/20 rounded-xl space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#34D399] uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" /> Key Strengths Observed
                </div>
                <ul className="space-y-2 text-xs text-[#CBD5E1]">
                  {run.aiFeedback.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] shrink-0 mt-1.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div className="p-4 bg-[#0D0E14] border border-[#FB923C]/20 rounded-xl space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FB923C] uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" /> Areas for Growth
                </div>
                <ul className="space-y-2 text-xs text-[#CBD5E1]">
                  {run.aiFeedback.improvementAreas.map((imp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FB923C] shrink-0 mt-1.5" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Coach Actionable Recommendation */}
            <div className="p-3.5 bg-[#FB923C]/5 border border-[#FB923C]/20 rounded-xl flex items-start gap-3">
              <Zap className="w-4 h-4 text-[#FB923C] shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold text-[#FB923C] block mb-0.5">
                  AI Coach Actionable Recommendation:
                </span>
                <p className="text-[#CBD5E1] leading-relaxed">
                  {run.aiFeedback.coachRecommendation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Transcript & Dialogue Exchange */}
        {activeTab === 'dialogue' && run.aiFeedback.dialogueHighlights && (
          <div className="space-y-3 p-4 bg-[#0D0E14] border border-[#1F2230] rounded-xl">
            <div className="text-[10px] text-[#94A3B8] uppercase font-semibold tracking-wider mb-2">
              Critical Simulation Exchange & Sentiment Analysis
            </div>

            {run.aiFeedback.dialogueHighlights.map((turn, idx) => {
              const isAI = turn.speaker === 'ai';
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-xs space-y-1 ${
                    isAI
                      ? 'bg-[#171923]/60 border-[#2E3345] ml-0 mr-8'
                      : 'bg-[#12131C] border-[#FB923C]/30 ml-8 mr-0'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-bold ${
                        isAI ? 'text-[#38BDF8]' : 'text-[#FB923C]'
                      }`}
                    >
                      {turn.name}
                    </span>
                    {turn.sentiment && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                          turn.sentiment === 'frustrated'
                            ? 'bg-[#7F1D1D]/40 text-[#F87171]'
                            : turn.sentiment === 'positive'
                            ? 'bg-[#064E3B]/40 text-[#34D399]'
                            : 'bg-[#1F2230] text-[#94A3B8]'
                        }`}
                      >
                        {turn.sentiment}
                      </span>
                    )}
                  </div>
                  <p className="text-[#F8FAFC] leading-relaxed italic">
                    "{turn.message}"
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1F2230]">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Assessment
          </Button>
        </div>
      </div>
    </Modal>
  );
};
