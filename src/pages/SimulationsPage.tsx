import React, { useState, useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import { INITIAL_SIMULATION_RUNS } from '../data/mockData';
import { SimulationRun } from '../types';
import { formatDate } from '../lib/utils';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Pagination } from '../components/ui/Pagination';
import { AIFeedbackModal } from '../components/modals/AIFeedbackModal';
import {
  Sparkles,
  Search,
  Bot,
  Award,
  Building2,
  CheckCircle2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Activity,
  TrendingUp,
  Filter,
  User,
  Layers,
  FileCheck,
} from 'lucide-react';

export const SimulationsPage: React.FC = () => {
  const careers = useAppSelector((state) => state.careers.careers);
  const globalSearch = useAppSelector((state) => state.ui.globalSearchQuery);

  const [runs, setRuns] = useState<SimulationRun[]>(INITIAL_SIMULATION_RUNS);
  const [searchTerm, setSearchTerm] = useState('');
  const [careerFilter, setCareerFilter] = useState('All');
  const [gradeFilter, setGradeFilter] = useState<'All' | 'Distinction' | 'Pass' | 'Needs Retake'>('All');
  const [orgFilter, setOrgFilter] = useState<'All' | 'Organization' | 'Individual'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected simulation run for AI feedback modal
  const [selectedRunForFeedback, setSelectedRunForFeedback] = useState<SimulationRun | null>(null);

  // Search & Filtering logic
  const effectiveSearch = (searchTerm || globalSearch).toLowerCase().trim();

  const filteredRuns = useMemo(() => {
    return runs.filter((run) => {
      const matchesSearch =
        effectiveSearch === '' ||
        run.simulationTitle.toLowerCase().includes(effectiveSearch) ||
        run.userName.toLowerCase().includes(effectiveSearch) ||
        run.userEmail.toLowerCase().includes(effectiveSearch) ||
        run.careerName.toLowerCase().includes(effectiveSearch) ||
        (run.organizationName && run.organizationName.toLowerCase().includes(effectiveSearch));

      const matchesCareer =
        careerFilter === 'All' || run.careerId === careerFilter || run.careerName === careerFilter;

      const matchesGrade = gradeFilter === 'All' || run.grade === gradeFilter;

      const matchesOrg =
        orgFilter === 'All' ||
        (orgFilter === 'Organization' && Boolean(run.organizationName)) ||
        (orgFilter === 'Individual' && !run.organizationName);

      return matchesSearch && matchesCareer && matchesGrade && matchesOrg;
    });
  }, [runs, effectiveSearch, careerFilter, gradeFilter, orgFilter]);

  // Pagination slice
  const paginatedRuns = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRuns.slice(start, start + itemsPerPage);
  }, [filteredRuns, currentPage]);

  // Aggregate Metrics
  const totalRuns = runs.length;
  const avgScore = Math.round(runs.reduce((acc, r) => acc + r.score, 0) / Math.max(runs.length, 1));
  const passRate = Math.round(
    (runs.filter((r) => r.grade === 'Distinction' || r.grade === 'Pass').length / Math.max(runs.length, 1)) * 100
  );
  const totalDistinctions = runs.filter((r) => r.grade === 'Distinction').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
              Recent Simulations & AI Evaluations
            </h1>
            <Badge variant="brand" size="sm">
              <Sparkles className="w-3 h-3 mr-1" />
              Live AI Assessment
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Comprehensive audit of learner simulation attempts, scoring marks, and AI evaluation feedback.
          </p>
        </div>
      </div>

      {/* 4 Top Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 sm:p-5 bg-[#12131C] border border-[#171923] flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#94A3B8]">Total Simulations Run</p>
            <p className="text-2xl font-bold text-[#F8FAFC] mt-1 font-mono">{totalRuns}</p>
            <p className="text-[11px] text-[#34D399] mt-0.5 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3 h-3" /> +18.4% this month
            </p>
          </div>
          <div className="p-3 bg-[#FB923C]/10 rounded-xl text-[#FB923C] shrink-0">
            <Bot className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 sm:p-5 bg-[#12131C] border border-[#171923] flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#94A3B8]">Average Learner Score</p>
            <p className="text-2xl font-bold text-[#F8FAFC] mt-1 font-mono">{avgScore}%</p>
            <p className="text-[11px] text-[#34D399] mt-0.5 font-semibold">
              Across all career tracks
            </p>
          </div>
          <div className="p-3 bg-[#34D399]/10 rounded-xl text-[#34D399] shrink-0">
            <Award className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 sm:p-5 bg-[#12131C] border border-[#171923] flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#94A3B8]">Pass & Distinction Rate</p>
            <p className="text-2xl font-bold text-[#F8FAFC] mt-1 font-mono">{passRate}%</p>
            <p className="text-[11px] text-[#38BDF8] mt-0.5 font-semibold">
              {totalDistinctions} with Distinction
            </p>
          </div>
          <div className="p-3 bg-[#38BDF8]/10 rounded-xl text-[#38BDF8] shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 sm:p-5 bg-[#12131C] border border-[#171923] flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#94A3B8]">AI Evaluations Generated</p>
            <p className="text-2xl font-bold text-[#F8FAFC] mt-1 font-mono">{totalRuns} Reports</p>
            <p className="text-[11px] text-[#FB7185] mt-0.5 font-semibold">
              100% automated rubric feedback
            </p>
          </div>
          <div className="p-3 bg-[#FB7185]/10 rounded-xl text-[#FB7185] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-3.5 sm:p-4 bg-[#12131C] border border-[#171923]">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by learner name, email, simulation title, career, or organization..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#0D0E14] border border-[#171923] text-[#F8FAFC] placeholder-[#94A3B8]/60 text-xs rounded-md pl-8 pr-4 py-1.5 focus:outline-none focus:border-[#FB923C]/70"
            />
          </div>

          {/* Filter Selects */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            {/* Career Track Filter */}
            <select
              value={careerFilter}
              onChange={(e) => {
                setCareerFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#0D0E14] border border-[#171923] text-[#CBD5E1] text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-[#FB923C]"
            >
              <option value="All">All Careers</option>
              {careers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Grade / Outcome Filter */}
            <select
              value={gradeFilter}
              onChange={(e) => {
                setGradeFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-[#0D0E14] border border-[#171923] text-[#CBD5E1] text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-[#FB923C]"
            >
              <option value="All">All Scores & Grades</option>
              <option value="Distinction">Distinction (90%+)</option>
              <option value="Pass">Pass (70-89%)</option>
              <option value="Needs Retake">Needs Retake (&lt;70%)</option>
            </select>

            {/* Learner Type / Org Filter */}
            <select
              value={orgFilter}
              onChange={(e) => {
                setOrgFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-[#0D0E14] border border-[#171923] text-[#CBD5E1] text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-[#FB923C]"
            >
              <option value="All">All Learners</option>
              <option value="Organization">Organization Members</option>
              <option value="Individual">Individual Learners</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Recent Simulations Execution Table */}
      <Card className="overflow-hidden border border-[#171923] bg-[#12131C]">
        <div className="p-4 border-b border-[#171923] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#FB923C]" />
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#94A3B8]">
              Recent Simulation Attempts ({filteredRuns.length})
            </h3>
          </div>
          <span className="text-xs text-[#94A3B8]">
            Showing page {currentPage} of {Math.max(1, Math.ceil(filteredRuns.length / itemsPerPage))}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#171923] bg-[#0D0E14] text-[10px] text-[#94A3B8] uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Learner (Who Performed It)</th>
                <th className="py-3.5 px-4">Simulation Scenario</th>
                <th className="py-3.5 px-4">Career Track</th>
                <th className="py-3.5 px-4">Organization</th>
                <th className="py-3.5 px-4">Score & Grade</th>
                <th className="py-3.5 px-4">Time & Duration</th>
                <th className="py-3.5 px-4 text-right">AI Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171923]">
              {paginatedRuns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#94A3B8]">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Bot className="w-8 h-8 text-[#94A3B8] mx-auto opacity-50" />
                      <p className="font-medium text-[#CBD5E1]">No simulation attempts found</p>
                      <p className="text-[11px]">
                        Try adjusting your search criteria or clearing active filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRuns.map((run) => {
                  const scoreBarColor =
                    run.score >= 90
                      ? 'bg-[#34D399]'
                      : run.score >= 70
                      ? 'bg-[#FB923C]'
                      : 'bg-[#F87171]';

                  return (
                    <tr
                      key={run.id}
                      className="hover:bg-[#171923]/40 transition-colors group cursor-pointer"
                      onClick={() => setSelectedRunForFeedback(run)}
                    >
                      {/* Learner Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              run.userAvatar ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                            }
                            alt={run.userName}
                            className="w-8 h-8 rounded-full object-cover border border-[#2E3345]"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-semibold text-[#F8FAFC] group-hover:text-[#FB923C] transition-colors">
                              {run.userName}
                            </div>
                            <div className="text-[11px] text-[#94A3B8]">{run.userEmail}</div>
                          </div>
                        </div>
                      </td>

                      {/* Simulation Scenario */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 max-w-xs">
                          <div className="font-semibold text-[#F8FAFC] line-clamp-1">
                            {run.simulationTitle}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Badge variant="brand" size="sm">
                              {run.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </td>

                      {/* Career Track */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs text-[#CBD5E1] bg-[#0D0E14] px-2.5 py-1 rounded-md border border-[#171923] font-medium">
                          {run.careerName}
                        </span>
                      </td>

                      {/* Organization Name */}
                      <td className="py-3.5 px-4">
                        {run.organizationName ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#34D399] bg-[#34D399]/10 border border-[#34D399]/20 px-2.5 py-1 rounded-lg">
                            <Building2 className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate max-w-[140px]">{run.organizationName}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-[#94A3B8] bg-[#0D0E14] px-2 py-0.5 rounded border border-[#171923]">
                            Individual Learner
                          </span>
                        )}
                      </td>

                      {/* Score & Grade */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#F8FAFC] font-mono">
                              {run.score}%
                            </span>
                            <Badge
                              variant={
                                run.grade === 'Distinction'
                                  ? 'success'
                                  : run.grade === 'Pass'
                                  ? 'brand'
                                  : 'error'
                              }
                              size="sm"
                            >
                              {run.grade === 'Distinction' && (
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                              )}
                              {run.grade === 'Pass' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {run.grade === 'Needs Retake' && (
                                <AlertTriangle className="w-3 h-3 mr-1" />
                              )}
                              {run.grade}
                            </Badge>
                          </div>
                          <div className="w-24 bg-[#07080C] h-1.5 rounded-full overflow-hidden border border-[#171923]">
                            <div
                              className={`h-full rounded-full ${scoreBarColor}`}
                              style={{ width: `${run.score}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Time & Duration */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 text-xs">
                          <p className="text-[#CBD5E1] font-medium">
                            {formatDate(run.completedAt)}
                          </p>
                          <p className="text-[11px] text-[#94A3B8] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#38BDF8]" />
                            {run.durationMinutes} mins session
                          </p>
                        </div>
                      </td>

                      {/* AI Feedback Button */}
                      <td
                        className="py-3.5 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                          onClick={() => setSelectedRunForFeedback(run)}
                          className="shadow-sm"
                        >
                          AI Feedback
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredRuns.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </Card>

      {/* Full AI Feedback Report Modal */}
      {selectedRunForFeedback && (
        <AIFeedbackModal
          isOpen={Boolean(selectedRunForFeedback)}
          onClose={() => setSelectedRunForFeedback(null)}
          run={selectedRunForFeedback}
        />
      )}
    </div>
  );
};
