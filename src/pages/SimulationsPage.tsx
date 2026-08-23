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
  setActiveModal,
  addToast,
} from '../store/slices/uiSlice';
import {
  Sparkles,
  Search,
  Plus,
  Bot,
  Target,
  Award,
  Play,
  Trash2,
  CheckCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { AISimulation } from '../types';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
            AI Simulation Scenarios
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Configure conversational AI workplace scenarios, character personas, and grading rubrics.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => dispatch(setActiveModal('addSimulation'))}
        >
          Create AI Simulation
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-3.5 sm:p-4 bg-[#12131C] border border-[#171923]">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search simulations, AI persona name, role, or scenario topic..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="w-full bg-[#0D0E14] border border-[#171923] text-[#F8FAFC] placeholder-[#94A3B8]/60 text-xs rounded-md pl-8 pr-4 py-1.5 focus:outline-none focus:border-[#FB923C]/70"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={careerFilter}
              onChange={(e) => dispatch(setCareerFilter(e.target.value))}
              className="bg-[#0D0E14] border border-[#171923] text-[#CBD5E1] text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-[#FB923C]"
            >
              <option value="All">All Careers</option>
              {careers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => dispatch(setDifficultyFilter(e.target.value))}
              className="bg-[#0D0E14] border border-[#171923] text-[#CBD5E1] text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-[#FB923C]"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => dispatch(setStatusFilter(e.target.value))}
              className="bg-[#0D0E14] border border-[#171923] text-[#CBD5E1] text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-[#FB923C]"
            >
              <option value="All">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Simulations Grid */}
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
