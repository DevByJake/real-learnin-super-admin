import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  toggleCareerStatus,
  deleteCareer,
  setSearchTerm,
  setCategoryFilter,
} from '../store/slices/careersSlice';
import { setActiveModal, addToast } from '../store/slices/uiSlice';
import {
  Compass,
  Search,
  Plus,
  BookOpen,
  Sparkles,
  Users,
  CheckCircle,
  Clock,
  Trash2,
  ExternalLink,
  Power,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Career } from '../types';

export const CareersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { careers, searchTerm, categoryFilter } = useAppSelector((state) => state.careers);
  const classes = useAppSelector((state) => state.classes.classes);
  const simulations = useAppSelector((state) => state.simulations.simulations);
  const users = useAppSelector((state) => state.users.users);

  const [deleteTargetCareer, setDeleteTargetCareer] = useState<Career | null>(null);

  const filteredCareers = careers.filter((career) => {
    const matchesSearch =
      searchTerm === '' ||
      career.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'All' || career.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(careers.map((c) => c.category)));

  const handleToggleStatus = (career: Career) => {
    dispatch(toggleCareerStatus(career.id));
    dispatch(
      addToast({
        type: 'info',
        title: 'Career Catalog Status Updated',
        message: `${career.name} is now ${career.status === 'Active' ? 'Disabled / Draft' : 'Active'}.`,
      })
    );
  };

  const handleConfirmDelete = () => {
    if (deleteTargetCareer) {
      dispatch(deleteCareer(deleteTargetCareer.id));
      dispatch(
        addToast({
          type: 'info',
          title: 'Career Track Removed',
          message: `${deleteTargetCareer.name} has been archived.`,
        })
      );
      setDeleteTargetCareer(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
            Career Tracks & Curriculums
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Define predefined job roles, linked learning modules, and AI practice scenarios.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => dispatch(setActiveModal('addCareer'))}
        >
          Create Career Track
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-3.5 sm:p-4 bg-[#12131C] border border-[#171923]">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search career tracks, competencies, or categories..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="w-full bg-[#0D0E14] border border-[#171923] text-[#F8FAFC] placeholder-[#94A3B8]/60 text-xs rounded-md pl-8 pr-4 py-1.5 focus:outline-none focus:border-[#FB923C]/70"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
            className="bg-[#0D0E14] border border-[#171923] text-[#CBD5E1] text-xs rounded-md px-3 py-1.5 w-full sm:w-auto focus:outline-none focus:border-[#FB923C]"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Career Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCareers.map((career) => {
          const linkedClasses = classes.filter((c) => c.careerId === career.id);
          const linkedSims = simulations.filter((s) => s.careerId === career.id);
          const enrolledLearners = users.filter((u) => u.careerId === career.id).length;

          return (
            <Card
              key={career.id}
              className={`p-4 sm:p-5 flex flex-col justify-between transition-all duration-150 border border-[#171923] hover:border-[#FB923C]/50 ${
                career.status === 'Active' ? 'bg-[#12131C]' : 'bg-[#0D0E14]/80 opacity-75'
              }`}
            >
              <div className="space-y-3.5">
                {/* Header info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#171923] border border-[#1F2230] flex items-center justify-center text-[#FB923C] shrink-0 font-bold">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#F8FAFC] text-xs sm:text-sm line-clamp-1">{career.name}</h3>
                      <span className="text-[10px] text-[#94A3B8]">{career.category}</span>
                    </div>
                  </div>

                  <Badge variant={career.status === 'Active' ? 'success' : 'muted'} size="sm">
                    {career.status}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-xs text-[#CBD5E1] line-clamp-2 leading-relaxed">
                  {career.description}
                </p>

                {/* Curriculum Metrics */}
                <div className="grid grid-cols-3 gap-2 p-2 bg-[#0D0E14] rounded-lg border border-[#171923] text-center text-xs">
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block">Classes</span>
                    <span className="font-bold text-[#38BDF8] flex items-center justify-center gap-1 text-xs">
                      <BookOpen className="w-3 h-3" />
                      {linkedClasses.length || career.relatedClassIds?.length || 0}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#94A3B8] block">Simulations</span>
                    <span className="font-bold text-[#FB7185] flex items-center justify-center gap-1 text-xs">
                      <Sparkles className="w-3 h-3" />
                      {linkedSims.length || career.relatedSimulationIds?.length || 0}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#94A3B8] block">Learners</span>
                    <span className="font-bold text-[#34D399] flex items-center justify-center gap-1 text-xs">
                      <Users className="w-3 h-3" />
                      {enrolledLearners}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action bar */}
              <div className="mt-4 pt-3 border-t border-[#171923] flex items-center justify-between">
                <Button
                  variant={career.status === 'Active' ? 'outline' : 'success'}
                  size="sm"
                  leftIcon={<Power className="w-3.5 h-3.5" />}
                  onClick={() => handleToggleStatus(career)}
                >
                  {career.status === 'Active' ? 'Disable Track' : 'Enable Track'}
                </Button>

                <button
                  onClick={() => setDeleteTargetCareer(career)}
                  className="p-1.5 text-[#94A3B8] hover:text-[#F87171] hover:bg-[#7F1D1D]/20 rounded-md transition-colors"
                  title="Archive Career"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {deleteTargetCareer && (
        <ConfirmDialog
          isOpen={!!deleteTargetCareer}
          onClose={() => setDeleteTargetCareer(null)}
          onConfirm={handleConfirmDelete}
          title="Archive Career Track"
          message={`Are you sure you want to remove ${deleteTargetCareer.name}? Existing enrolled learners will retain completed history.`}
          confirmLabel="Archive Track"
          confirmVariant="danger"
        />
      )}
    </div>
  );
};
