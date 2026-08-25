import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setSearchTerm,
  setCareerFilter,
  setLevelFilter,
  setStatusFilter,
  toggleClassPublishStatus,
  deleteClass,
} from '../store/slices/classesSlice';
import {
  setSelectedClassIdForDrawer,
  setActiveModal,
  addToast,
} from '../store/slices/uiSlice';
import {
  GraduationCap,
  Search,
  Plus,
  BookOpen,
  HelpCircle,
  Clock,
  CheckCircle2,
  Trash2,
  Power,
  Users,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { ClassModule } from '../types';

export const ClassesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { classes, searchTerm, careerFilter, levelFilter, statusFilter } = useAppSelector(
    (state) => state.classes
  );
  const careers = useAppSelector((state) => state.careers.careers);

  const [deleteTargetClass, setDeleteTargetClass] = useState<ClassModule | null>(null);

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      searchTerm === '' ||
      cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.careerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCareer = careerFilter === 'All' || cls.careerId === careerFilter;
    const matchesLevel = levelFilter === 'All' || cls.level === levelFilter;
    const matchesStatus = statusFilter === 'All' || cls.status === statusFilter;

    return matchesSearch && matchesCareer && matchesLevel && matchesStatus;
  });

  const handleTogglePublish = (cls: ClassModule) => {
    dispatch(toggleClassPublishStatus(cls.id));
    dispatch(
      addToast({
        type: 'info',
        title: 'Class Module Status Changed',
        message: `${cls.title} is now ${cls.status === 'Published' ? 'Draft' : 'Published'}.`,
      })
    );
  };

  const handleConfirmDelete = () => {
    if (deleteTargetClass) {
      dispatch(deleteClass(deleteTargetClass.id));
      dispatch(
        addToast({
          type: 'info',
          title: 'Class Module Deleted',
          message: `${deleteTargetClass.title} has been archived.`,
        })
      );
      setDeleteTargetClass(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
            Classes & Modules Management
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Author and publish structured curriculum lessons, syllabi, and knowledge checks.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => dispatch(setActiveModal('addClass'))}
        >
          Create Class Module
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-3.5 sm:p-4 bg-[#12131C] border border-[#171923]">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by class title, syllabus topic, or career track..."
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
              value={levelFilter}
              onChange={(e) => dispatch(setLevelFilter(e.target.value))}
              className="bg-[#0D0E14] border border-[#171923] text-[#CBD5E1] text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-[#FB923C]"
            >
              <option value="All">All Levels</option>
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
          </div>
        </div>
      </Card>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClasses.map((cls) => {
          const completionRate =
            cls.enrolledCount > 0 ? Math.round((cls.completedCount / cls.enrolledCount) * 100) : 0;

          return (
            <Card
              key={cls.id}
              className="p-4 sm:p-5 bg-[#12131C] border border-[#171923] hover:border-[#38BDF8]/50 transition-all duration-150 flex flex-col justify-between cursor-pointer group"
              onClick={() => dispatch(setSelectedClassIdForDrawer(cls.id))}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <Badge variant="brand" size="sm">
                      {cls.level}
                    </Badge>
                    <h3 className="font-semibold text-[#F8FAFC] text-xs sm:text-sm group-hover:text-[#38BDF8] transition-colors line-clamp-1">
                      {cls.title}
                    </h3>
                  </div>

                  <Badge variant={cls.status === 'Published' ? 'success' : 'muted'} size="sm">
                    {cls.status}
                  </Badge>
                </div>

                <p className="text-xs text-[#CBD5E1] line-clamp-2 leading-relaxed">
                  {cls.description}
                </p>

                <div className="p-2.5 bg-[#0D0E14] rounded-md border border-[#171923] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[#94A3B8] text-[10px]">
                    <span className="truncate max-w-[150px]">{cls.careerName}</span>
                    <span className="flex items-center gap-1 text-[#CBD5E1]">
                      <Clock className="w-3 h-3 text-[#FB923C]" />
                      {cls.estimatedHours}h
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[#CBD5E1] pt-1 border-t border-[#171923]">
                    <span className="flex items-center gap-1 text-[10px]">
                      <BookOpen className="w-3 h-3 text-[#38BDF8]" />
                      {cls.lessons.length} Lessons
                    </span>
                    <span className="flex items-center gap-1 text-[10px]">
                      <HelpCircle className="w-3 h-3 text-[#FBBF24]" />
                      {cls.quiz.length} Questions
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-[#34D399]">
                      <CheckCircle2 className="w-3 h-3" />
                      {completionRate}% Pass
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div
                className="mt-3.5 pt-3 border-t border-[#171923] flex items-center justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dispatch(setSelectedClassIdForDrawer(cls.id))}
                >
                  Edit Curriculum
                </Button>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant={cls.status === 'Published' ? 'outline' : 'success'}
                    size="sm"
                    onClick={() => handleTogglePublish(cls)}
                  >
                    {cls.status === 'Published' ? 'Unpublish' : 'Publish'}
                  </Button>

                  <button
                    onClick={() => setDeleteTargetClass(cls)}
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

      {deleteTargetClass && (
        <ConfirmDialog
          isOpen={!!deleteTargetClass}
          onClose={() => setDeleteTargetClass(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Class Module"
          message={`Are you sure you want to permanently delete "${deleteTargetClass.title}"? Lesson content and quizzes will be unlinked.`}
          confirmLabel="Delete Module"
          confirmVariant="danger"
        />
      )}
    </div>
  );
};
