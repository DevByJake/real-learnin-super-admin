import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setSearchTerm,
  setCareerFilter,
  setDifficultyFilter,
  setStatusFilter,
  toggleSimulationStatus,
  deleteSimulation,
} from '../store/slices/simulationsSlice';
import {
  setSelectedSimulationIdForDrawer,
  setTestSimulationTarget,
  addToast,
} from '../store/slices/uiSlice';
import {
  Sparkles,
  Search,
  Bot,
  Award,
  Play,
  Trash2,
  CheckCircle,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { AISimulation } from '../types';
import { formatDate } from '../lib/utils';

interface SimulationRunLog {
  id: string;
  simTitle: string;
  careerName: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  orgName: string;
  score: number;
  grade: 'Distinction' | 'Pass' | 'Needs Retake';
  durationMinutes: number;
  completedAt: string;
}

const INITIAL_RUN_LOGS: SimulationRunLog[] = [
  {
    id: 'run-001',
    simTitle: 'Customer De-escalation & Outage Crisis',
    careerName: 'Customer Service',
    userName: 'Sarah Jenkins',
    userEmail: 'sarah.j@apextech.io',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    orgName: 'Apex Technologies Inc.',
    score: 92,
    grade: 'Distinction',
    durationMinutes: 14,
    completedAt: '2026-08-23T12:45:00Z',
  },
  {
    id: 'run-002',
    simTitle: 'Tier-2 Technical Escalation & Triage',
    careerName: 'Tech Support',
    userName: 'David Kalu',
    userEmail: 'david.kalu@gmail.com',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    orgName: 'Individual Learner',
    score: 85,
    grade: 'Pass',
    durationMinutes: 18,
    completedAt: '2026-08-22T19:10:00Z',
  },
  {
    id: 'run-003',
    simTitle: 'Patient Intake Triage & HIPAA Protocols',
    careerName: 'Healthcare Support',
    userName: 'Amara Okafor',
    userEmail: 'amara.o@nexushealth.org',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    orgName: 'Nexus Healthcare Systems',
    score: 96,
    grade: 'Distinction',
    durationMinutes: 12,
    completedAt: '2026-08-23T11:05:00Z',
  },
  {
    id: 'run-004',
    simTitle: 'Network Active Directory Diagnosis',
    careerName: 'IT Specialist',
    userName: 'Marcus Brody',
    userEmail: 'm.brody@vanguardcp.com',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    orgName: 'Vanguard Capital Partners',
    score: 78,
    grade: 'Pass',
    durationMinutes: 22,
    completedAt: '2026-08-21T16:30:00Z',
  },
  {
    id: 'run-005',
    simTitle: 'Handling Angry Escalated Customer',
    careerName: 'Customer Service',
    userName: 'Carlos Santana',
    userEmail: 'carlos.s@solarisretail.com',
    userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    orgName: 'Solaris Global Retail',
    score: 64,
    grade: 'Needs Retake',
    durationMinutes: 20,
    completedAt: '2026-08-19T14:20:00Z',
  },
  {
    id: 'run-006',
    simTitle: 'System Infrastructure Audit & Security',
    careerName: 'IT Specialist',
    userName: 'Tanya Petrova',
    userEmail: 'tanya@auroralabs.ai',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    orgName: 'Aurora Robotics Labs',
    score: 88,
    grade: 'Pass',
    durationMinutes: 16,
    completedAt: '2026-08-23T08:15:00Z',
  },
];

export const SimulationsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    simulations,
    searchTerm,
    careerFilter,
    difficultyFilter,
    statusFilter,
  } = useAppSelector((state) => state.simulations);
  const careers = useAppSelector((state) => state.careers.careers);

  const [activeTab, setActiveTab] = useState<'scenarios' | 'runs'>('scenarios');
  const [runLogs] = useState<SimulationRunLog[]>(INITIAL_RUN_LOGS);
  const [deleteTargetSim, setDeleteTargetSim] = useState<AISimulation | null>(null);

  const filteredSims = simulations.filter((sim) => {
    const matchesSearch =
      searchTerm === '' ||
      sim.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sim.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sim.character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sim.character.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sim.careerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCareer = careerFilter === 'All' || sim.careerId === careerFilter;
    const matchesDifficulty =
      difficultyFilter === 'All' || sim.difficulty === difficultyFilter;
    const matchesStatus = statusFilter === 'All' || sim.status === statusFilter;

    return matchesSearch && matchesCareer && matchesDifficulty && matchesStatus;
  });

  const filteredRunLogs = runLogs.filter((log) => {
    const matchesSearch =
      searchTerm === '' ||
      log.simTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.careerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.orgName.toLowerCase().includes(searchTerm.toLowerCase());

    const selectedCareerObj = careers.find((c) => c.id === careerFilter);
    const matchesCareer =
      careerFilter === 'All' ||
      log.careerName === selectedCareerObj?.name;

    return matchesSearch && matchesCareer;
  });

  const handleTogglePublish = (sim: AISimulation) => {
    dispatch(toggleSimulationStatus(sim.id));
    dispatch(
      addToast({
        type: 'info',
        title: 'Simulation Status Toggled',
        message: `${sim.title} is now ${sim.status === 'Published' ? 'Draft' : 'Published'}.`,
      })
    );
  };

  const handleConfirmDelete = () => {
    if (deleteTargetSim) {
      dispatch(deleteSimulation(deleteTargetSim.id));
      dispatch(
        addToast({
          type: 'info',
          title: 'Simulation Removed',
          message: `${deleteTargetSim.title} scenario has been archived.`,
        })
      );
      setDeleteTargetSim(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#171923] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
              AI Simulations & Execution History
            </h1>
            <Badge variant="brand" size="sm">
              Live AI Inference
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Monitor AI simulation scenarios, learner execution records, and evaluation marks.
          </p>
        </div>

        {/* Navigation View Tabs */}
        <div className="flex items-center gap-1 bg-[#12131C] p-1 rounded-xl border border-[#171923]">
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'scenarios'
                ? 'bg-[#FB923C] text-black shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#171923]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>AI Scenarios ({simulations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('runs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'runs'
                ? 'bg-[#FB923C] text-black shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#171923]'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Learner Marks & Activity ({runLogs.length})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-3.5 sm:p-4 bg-[#12131C] border border-[#171923]">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                activeTab === 'scenarios'
                  ? 'Search simulations, AI persona name, role, or topic...'
                  : 'Search by learner name, email, simulation title, or score...'
              }
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="w-full bg-[#0D0E14] border border-[#171923] text-[#F8FAFC] placeholder-[#94A3B8]/60 text-xs rounded-md pl-8 pr-4 py-1.5 focus:outline-none focus:border-[#FB923C]/70"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Career Track & Goal Filter */}
            <select
              value={careerFilter}
              onChange={(e) => dispatch(setCareerFilter(e.target.value))}
              className="bg-[#0D0E14] border border-[#171923] text-[#CBD5E1] text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-[#FB923C]"
            >
              <option value="All">All Career Tracks</option>
              {careers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {activeTab === 'scenarios' && (
              <>
                <select
                  value={difficultyFilter}
                  onChange={(e) => dispatch(setDifficultyFilter(e.target.value as any))}
                  className="bg-[#0D0E14] border border-[#171923] text-[#CBD5E1] text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-[#FB923C]"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => dispatch(setStatusFilter(e.target.value as any))}
                  className="bg-[#0D0E14] border border-[#171923] text-[#CBD5E1] text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-[#FB923C]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* TAB 1: AI Scenarios Grid */}
      {activeTab === 'scenarios' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSims.map((sim) => {
            return (
              <Card
                key={sim.id}
                className="p-4 sm:p-5 bg-[#12131C] border border-[#171923] hover:border-[#FB7185]/50 transition-all duration-150 flex flex-col justify-between cursor-pointer group"
                onClick={() => dispatch(setSelectedSimulationIdForDrawer(sim.id))}
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="brand" size="sm">
                          {sim.difficulty}
                        </Badge>
                        <Badge
                          variant={sim.status === 'Published' ? 'success' : 'muted'}
                          size="sm"
                        >
                          {sim.status}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-[#F8FAFC] text-xs sm:text-sm group-hover:text-[#FB7185] transition-colors line-clamp-1">
                        {sim.title}
                      </h3>
                    </div>
                  </div>

                  {/* AI Character mini card */}
                  <div className="p-2.5 bg-[#0D0E14] rounded-lg border border-[#171923] flex items-center gap-2.5">
                    <img
                      src={
                        sim.character.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                      }
                      alt={sim.character.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#171923]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#F8FAFC] truncate">
                        {sim.character.name}
                      </p>
                      <p className="text-[10px] text-[#94A3B8] truncate">{sim.character.role}</p>
                      <p className="text-[10px] text-[#FB923C] italic line-clamp-1 mt-0.5">
                        "{sim.character.initialMessage}"
                      </p>
                    </div>
                  </div>

                  {/* Description & Competencies */}
                  <p className="text-xs text-[#CBD5E1] line-clamp-2 leading-relaxed">
                    {sim.description}
                  </p>

                  <div className="pt-2 border-t border-[#171923] flex items-center justify-between text-xs text-[#94A3B8]">
                    <span className="text-[11px] truncate max-w-[130px]">{sim.careerName}</span>
                    <span className="text-[#34D399] font-medium text-[11px]">
                      {sim.completionsCount} Runs
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div
                  className="mt-3.5 pt-3 border-t border-[#171923] flex items-center justify-between"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Play className="w-3 h-3" />}
                    onClick={() => dispatch(setTestSimulationTarget(sim.id))}
                  >
                    Test Sandbox
                  </Button>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant={sim.status === 'Published' ? 'outline' : 'success'}
                      size="sm"
                      onClick={() => handleTogglePublish(sim)}
                    >
                      {sim.status === 'Published' ? 'Unpublish' : 'Publish'}
                    </Button>

                    <button
                      onClick={() => setDeleteTargetSim(sim)}
                      className="p-1.5 text-[#94A3B8] hover:text-[#F87171] hover:bg-[#7F1D1D]/20 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* TAB 2: Learner Marks & Activity Execution Table */}
      {activeTab === 'runs' && (
        <Card className="overflow-hidden border border-[#171923] bg-[#12131C]">
          <div className="p-4 border-b border-[#171923] flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FB923C]" />
              Simulation Execution Records & Learner Marks
            </h3>
            <span className="text-xs font-mono text-[#34D399]">
              Total Runs Logged: {filteredRunLogs.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#171923] bg-[#0D0E14] text-[10px] text-[#94A3B8] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Learner (Who Ran It)</th>
                  <th className="py-3 px-4">Simulation Scenario</th>
                  <th className="py-3 px-4">Career Track</th>
                  <th className="py-3 px-4">Marks & Score</th>
                  <th className="py-3 px-4">Status & Grade</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4 text-right">Execution Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171923] text-[#CBD5E1]">
                {filteredRunLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-[#94A3B8]">
                      No simulation execution logs match your search filter.
                    </td>
                  </tr>
                ) : (
                  filteredRunLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#171923]/40 transition-colors">
                      {/* Learner Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={log.userAvatar}
                            alt={log.userName}
                            className="w-8 h-8 rounded-full object-cover border border-[#171923]"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-semibold text-[#F8FAFC]">{log.userName}</p>
                            <p className="text-[11px] text-[#94A3B8]">{log.userEmail}</p>
                            <p className="text-[10px] text-[#34D399]">{log.orgName}</p>
                          </div>
                        </div>
                      </td>

                      {/* Simulation Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-[#FB923C] shrink-0" />
                          <span className="font-semibold text-[#F8FAFC]">{log.simTitle}</span>
                        </div>
                      </td>

                      {/* Career Track */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs text-[#CBD5E1] bg-[#0D0E14] px-2.5 py-1 rounded-md border border-[#171923]">
                          {log.careerName}
                        </span>
                      </td>

                      {/* Score / Marks */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#F8FAFC] font-mono">
                            {log.score}%
                          </span>
                          <div className="w-16 bg-[#07080C] h-2 rounded-full overflow-hidden border border-[#171923]">
                            <div
                              className={`h-full ${
                                log.score >= 85
                                  ? 'bg-[#34D399]'
                                  : log.score >= 70
                                  ? 'bg-[#FB923C]'
                                  : 'bg-[#F87171]'
                              }`}
                              style={{ width: `${log.score}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Grade Badge */}
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            log.grade === 'Distinction'
                              ? 'success'
                              : log.grade === 'Pass'
                              ? 'brand'
                              : 'error'
                          }
                          size="sm"
                        >
                          {log.grade === 'Distinction' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {log.grade === 'Pass' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {log.grade === 'Needs Retake' && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {log.grade}
                        </Badge>
                      </td>

                      {/* Duration */}
                      <td className="py-3.5 px-4 text-xs text-[#94A3B8]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
                          {log.durationMinutes} mins
                        </span>
                      </td>

                      {/* Execution Date */}
                      <td className="py-3.5 px-4 text-right font-mono text-[11px] text-[#94A3B8]">
                        {formatDate(log.completedAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {deleteTargetSim && (
        <ConfirmDialog
          isOpen={!!deleteTargetSim}
          onClose={() => setDeleteTargetSim(null)}
          onConfirm={handleConfirmDelete}
          title="Delete AI Simulation"
          message={`Are you sure you want to remove the "${deleteTargetSim.title}" simulation scenario?`}
          confirmLabel="Delete Simulation"
          confirmVariant="danger"
        />
      )}
    </div>
  );
};
