import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setSelectedSimulationIdForDrawer,
  setTestSimulationTarget,
  addToast,
} from '../../store/slices/uiSlice';
import { toggleSimulationStatus } from '../../store/slices/simulationsSlice';
import { Drawer } from '../ui/Drawer';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Sparkles,
  Bot,
  Target,
  Award,
  Play,
  CheckCircle,
  Clock,
  BarChart2,
  TrendingUp,
} from 'lucide-react';

export const SimulationDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedSimId = useAppSelector((state) => state.ui.selectedSimulationIdForDrawer);
  const simulations = useAppSelector((state) => state.simulations.simulations);
  const sim = simulations.find((s) => s.id === selectedSimId);

  if (!sim) return null;

  const handleClose = () => {
    dispatch(setSelectedSimulationIdForDrawer(null));
  };

  const handleTogglePublish = () => {
    dispatch(toggleSimulationStatus(sim.id));
    dispatch(
      addToast({
        type: 'info',
        title: sim.status === 'Published' ? 'Simulation Unpublished' : 'Simulation Published',
        message: `${sim.title} status updated.`,
      })
    );
  };

  const handleTestChat = () => {
    dispatch(setTestSimulationTarget(sim.id));
  };

  return (
    <Drawer
      isOpen={!!selectedSimId}
      onClose={handleClose}
      title={sim.title}
      subtitle={`Career: ${sim.careerName} • Difficulty: ${sim.difficulty}`}
      footer={
        <div className="flex items-center justify-between">
          <Button
            variant={sim.status === 'Published' ? 'outline' : 'success'}
            size="sm"
            onClick={handleTogglePublish}
          >
            {sim.status === 'Published' ? 'Unpublish' : 'Publish Simulation'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Play className="w-3.5 h-3.5" />}
            onClick={handleTestChat}
          >
            Test Interactive AI Chat
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Top Status & Metrics */}
        <div className="p-4 bg-[#12131C] border border-[#1F2230] rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={sim.status === 'Published' ? 'success' : 'warning'} size="sm">
                {sim.status}
              </Badge>
              <Badge variant="brand" size="sm">
                {sim.difficulty}
              </Badge>
            </div>

            <span className="text-xs text-[#94A3B8] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#FB923C]" />
              ~{sim.avgDurationMinutes || 12} min session
            </span>
          </div>

          <p className="text-xs text-[#CBD5E1] leading-relaxed">{sim.description}</p>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1F2230]/70 text-xs">
            <div className="p-2 bg-[#0D0E14] rounded-lg">
              <span className="text-[#94A3B8] text-[10px] block">Learner Completions</span>
              <span className="font-bold text-[#F8FAFC]">{sim.completionsCount} attempts</span>
            </div>
            <div className="p-2 bg-[#0D0E14] rounded-lg">
              <span className="text-[#94A3B8] text-[10px] block">Average Learner Score</span>
              <span className="font-bold text-[#34D399]">{sim.avgScore || 80}%</span>
            </div>
          </div>
        </div>

        {/* AI Character Card */}
        <div className="p-4 bg-[#12131C] border border-[#1F2230] rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FB923C]">
            <Bot className="w-4 h-4" /> AI Persona Configuration
          </div>

          <div className="flex items-center gap-3">
            <img
              src={sim.character.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={sim.character.name}
              className="w-11 h-11 rounded-full object-cover border border-[#2E3345]"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="text-sm font-bold text-[#F8FAFC]">{sim.character.name}</p>
              <p className="text-xs text-[#CBD5E1]">{sim.character.role}</p>
            </div>
          </div>

          <div className="p-2.5 bg-[#0D0E14] rounded-lg text-xs">
            <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block font-semibold">
              Persona Demeanor & Tone:
            </span>
            <p className="text-[#CBD5E1] mt-0.5">{sim.character.tone}</p>
          </div>

          <div className="p-2.5 bg-[#0D0E14] rounded-lg text-xs border border-[#1F2230]">
            <span className="text-[10px] text-[#FB923C] uppercase tracking-wider block font-semibold">
              Initial AI Greeting / Hook:
            </span>
            <p className="text-[#F8FAFC] italic mt-1 font-medium">"{sim.character.initialMessage}"</p>
          </div>
        </div>

        {/* Scenario and Objective */}
        <div className="p-4 bg-[#12131C] border border-[#1F2230] rounded-xl space-y-3 text-xs">
          <div className="flex items-center gap-2 font-semibold text-[#38BDF8]">
            <Target className="w-4 h-4" /> Scenario & Mission Parameters
          </div>

          <div>
            <span className="text-[10px] text-[#94A3B8] font-semibold uppercase">Background Situation:</span>
            <p className="text-[#CBD5E1] mt-0.5 leading-relaxed">{sim.scenario.situation}</p>
          </div>

          <div>
            <span className="text-[10px] text-[#94A3B8] font-semibold uppercase">Learner Target Objective:</span>
            <p className="text-[#CBD5E1] mt-0.5 leading-relaxed">{sim.scenario.objective}</p>
          </div>

          <div>
            <span className="text-[10px] text-[#94A3B8] font-semibold uppercase">Expected Behavior & Best Practices:</span>
            <p className="text-[#CBD5E1] mt-0.5 leading-relaxed">{sim.scenario.expectedBehavior}</p>
          </div>
        </div>

        {/* Evaluated Competencies */}
        <div className="p-4 bg-[#12131C] border border-[#1F2230] rounded-xl space-y-3 text-xs">
          <div className="flex items-center gap-2 font-semibold text-[#FB7185]">
            <Award className="w-4 h-4" /> Evaluated Competencies & Rubric
          </div>

          <div className="space-y-2">
            {sim.evaluatedSkills.map((sk) => (
              <div key={sk.id} className="p-2.5 bg-[#0D0E14] rounded-lg border border-[#1F2230]/70">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#F8FAFC]">{sk.name}</span>
                  <Badge variant="brand" size="sm">
                    {sk.weight}% Weight
                  </Badge>
                </div>
                <p className="text-[11px] text-[#94A3B8] mt-1">{sk.criteria}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
};
