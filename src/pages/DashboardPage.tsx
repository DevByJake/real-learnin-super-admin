import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  Users,
  Building2,
  Sparkles,
  GraduationCap,
  TrendingUp,
  Activity,
  ArrowUpRight,
  UserCheck,
  CheckCircle2,
  Clock,
  Plus,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatNumber, formatDate } from '../lib/utils';
import {
  setSelectedUserIdForDrawer,
  setSelectedOrgIdForDrawer,
  setActiveModal,
} from '../store/slices/uiSlice';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.users);
  const organizations = useAppSelector((state) => state.organizations.organizations);
  const simulations = useAppSelector((state) => state.simulations.simulations);
  const classes = useAppSelector((state) => state.classes.classes);
  const activityLogs = useAppSelector((state) => state.activity.activityLogs);
  const timeSeriesData = useAppSelector((state) => state.activity.timeSeriesData);

  // Compute live overview metrics
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'Active').length;
  const totalOrgs = organizations.length;
  const activeOrgs = organizations.filter((o) => o.status === 'Active').length;
  const totalSims = simulations.length;
  const totalClassesCount = classes.length;
  const totalCompletedSims = simulations.reduce((acc, s) => acc + s.completionsCount, 0);
  const totalCompletedClasses = classes.reduce((acc, c) => acc + c.completedCount, 0);

  const statCards = [
    {
      title: 'Total Users',
      value: `${activeUsers} / ${totalUsers}`,
      subtext: 'Active / Total registered',
      change: '+14.8% this month',
      icon: <Users className="w-5 h-5 text-[#FB923C]" />,
      accent: 'border-[#FB923C]/30',
    },
    {
      title: 'Organizations',
      value: `${activeOrgs} / ${totalOrgs}`,
      subtext: 'Active / Total enterprise accounts',
      change: '+3 new this week',
      icon: <Building2 className="w-5 h-5 text-[#34D399]" />,
      accent: 'border-[#34D399]/30',
    },
    {
      title: 'AI Simulations',
      value: formatNumber(totalCompletedSims || 2450),
      subtext: `${totalSims} live scenario modules`,
      change: '81.4% avg learner score',
      icon: <Sparkles className="w-5 h-5 text-[#FB7185]" />,
      accent: 'border-[#FB7185]/30',
    },
    {
      title: 'Class Completions',
      value: formatNumber(totalCompletedClasses || 3100),
      subtext: `${totalClassesCount} interactive courses`,
      change: '86.2% completion rate',
      icon: <GraduationCap className="w-5 h-5 text-[#38BDF8]" />,
      accent: 'border-[#38BDF8]/30',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
            Platform Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            System-level monitoring and activity across Individual and Organization learners.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#FB923C]" />}
            onClick={() => dispatch(setActiveModal('addSimulation'))}
          >
            New Simulation
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => dispatch(setActiveModal('addUser'))}
          >
            Provision User
          </Button>
        </div>
      </div>

      {/* 4 Stat Overview Metric Cards with High Density Mini Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#12131C] border border-[#171923] rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-[#94A3B8]">Total Users</p>
            <span className="text-[10px] text-[#34D399] font-semibold">+14.2%</span>
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-2xl font-bold text-[#F8FAFC]">{activeUsers} / {totalUsers}</span>
            <span className="text-[10px] text-[#94A3B8]">active</span>
          </div>
          <div className="w-full bg-[#07080C] h-1 rounded-full overflow-hidden mt-1">
            <div
              className="bg-[#FB923C] h-full rounded-full transition-all"
              style={{ width: `${Math.round((activeUsers / Math.max(totalUsers, 1)) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-[#12131C] border border-[#171923] rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-[#94A3B8]">Active Organizations</p>
            <span className="text-[10px] text-[#34D399] font-semibold">+3 new</span>
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-2xl font-bold text-[#F8FAFC]">{activeOrgs} / {totalOrgs}</span>
            <span className="text-[10px] text-[#94A3B8]">accounts</span>
          </div>
          <div className="w-full bg-[#07080C] h-1 rounded-full overflow-hidden mt-1">
            <div
              className="bg-[#FB7185] h-full rounded-full transition-all"
              style={{ width: `${Math.round((activeOrgs / Math.max(totalOrgs, 1)) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-[#12131C] border border-[#171923] rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-[#94A3B8]">AI Simulations</p>
            <span className="text-[10px] text-[#CBD5E1] font-semibold">{totalSims} live</span>
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-2xl font-bold text-[#F8FAFC]">{formatNumber(totalCompletedSims || 2450)}</span>
            <span className="text-[10px] text-[#94A3B8]">runs</span>
          </div>
          <div className="w-full bg-[#07080C] h-1 rounded-full overflow-hidden mt-1">
            <div className="bg-[#FB923C] h-full w-[74%] rounded-full" />
          </div>
        </div>

        <div className="bg-[#12131C] border border-[#171923] rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-[#94A3B8]">Avg Completion</p>
            <span className="text-[10px] text-[#FBBF24] font-semibold">86.2%</span>
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-2xl font-bold text-[#F8FAFC]">{formatNumber(totalCompletedClasses || 3100)}</span>
            <span className="text-[10px] text-[#94A3B8]">courses</span>
          </div>
          <div className="w-full bg-[#07080C] h-1 rounded-full overflow-hidden mt-1">
            <div className="bg-[#34D399] h-full w-[86%] rounded-full" />
          </div>
        </div>
      </div>

      {/* Main Grid: Simulation Activity Chart & Recent Activity Side Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Simulation Practice Activity (8 Cols on Desktop) */}
        <div className="lg:col-span-8 bg-[#12131C] border border-[#171923] rounded-xl p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#94A3B8]">
                Simulation Activity (Last 7 Days)
              </h3>
              <p className="text-xs text-[#CBD5E1] mt-0.5">Daily conversational runs and curriculum passes</p>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1.5 text-[#CBD5E1]">
                <span className="w-2 h-2 rounded-full bg-[#FB923C]" /> Starts / Runs
              </span>
              <span className="flex items-center gap-1.5 text-[#CBD5E1]">
                <span className="w-2 h-2 rounded-full bg-[#34D399]" /> Classes Done
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSim" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FB923C" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#FB923C" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorClasses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#12131C',
                    borderColor: '#171923',
                    borderRadius: '8px',
                    color: '#F8FAFC',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="simulations"
                  name="Simulations"
                  stroke="#FB923C"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSim)"
                />
                <Area
                  type="monotone"
                  dataKey="classes"
                  name="Class Completions"
                  stroke="#34D399"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorClasses)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* High Density Recent Activity Feed (4 Cols on Desktop) */}
        <div className="lg:col-span-4 bg-[#12131C] border border-[#171923] rounded-xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#94A3B8]">
                Recent Activity
              </h3>
              <span className="text-[10px] font-mono text-[#34D399] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" /> Live
              </span>
            </div>

            <div className="space-y-3.5 overflow-hidden">
              {activityLogs.slice(0, 5).map((log) => {
                const borderAccent =
                  log.type === 'new_organization'
                    ? 'border-[#34D399]'
                    : log.type === 'simulation_completed'
                    ? 'border-[#FB7185]'
                    : log.type === 'class_completed'
                    ? 'border-[#38BDF8]'
                    : log.type === 'security_alert'
                    ? 'border-[#F87171]'
                    : 'border-[#FB923C]';

                return (
                  <div
                    key={log.id}
                    className={`border-l-2 ${borderAccent} pl-3 py-1 hover:bg-[#171923]/40 rounded-r-md transition-colors`}
                  >
                    <p className="text-xs font-medium text-[#F8FAFC] truncate">{log.title}</p>
                    <p className="text-[10px] text-[#94A3B8] truncate mt-0.5">
                      {formatDate(log.timestamp)} • {log.type.replace('_', ' ')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => dispatch(setActiveModal('adminProfile'))}
            className="mt-4 text-xs text-[#FB923C] font-semibold hover:underline w-full text-center cursor-pointer"
          >
            View All Audit Logs
          </button>
        </div>
      </div>

      {/* High Density Recent Organizations Table */}
      <div className="bg-[#12131C] border border-[#171923] rounded-xl p-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#94A3B8]">
              Recent Organizations
            </h3>
            <p className="text-xs text-[#CBD5E1] mt-0.5">Enterprise seat allocation & learner engagement</p>
          </div>
          <button
            onClick={() => window.location.assign('/admin-dashboard/organizations')}
            className="text-[10px] text-[#94A3B8] hover:text-[#FB923C] uppercase tracking-widest font-bold cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] text-[#94A3B8] border-b border-[#171923] uppercase tracking-wider">
              <tr>
                <th className="pb-3 font-semibold">Org Name</th>
                <th className="pb-3 font-semibold">Primary POC</th>
                <th className="pb-3 font-semibold">Participants</th>
                <th className="pb-3 font-semibold">Activity</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-[#171923]">
              {organizations.slice(0, 4).map((org) => {
                const totalLearners = org.totalParticipants || org.allocatedSeats || 0;
                const maxSeats = org.totalSeats || 1;
                const percent = Math.min(100, Math.round((totalLearners / Math.max(maxSeats, 1)) * 100));
                const activityLevel = percent > 75 ? 'High' : percent > 40 ? 'Moderate' : 'Low';
                const activityColor = percent > 75 ? 'bg-[#34D399]' : percent > 40 ? 'bg-[#FB923C]' : 'bg-[#FBBF24]';

                return (
                  <tr key={org.id} className="hover:bg-[#171923]/30 transition-colors">
                    <td className="py-3 font-medium text-[#F8FAFC]">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-[#FB923C]" />
                        <span>{org.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-[#CBD5E1]">{org.adminName || 'Elena Vance'}</td>
                    <td className="py-3 text-[#CBD5E1]">
                      {totalLearners} / {maxSeats}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#07080C] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${activityColor}`} style={{ width: `${percent}%` }} />
                        </div>
                        <span className="text-[10px] text-[#94A3B8]">{activityLevel}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          org.status === 'Active'
                            ? 'bg-[#34D399]/10 text-[#34D399]'
                            : 'bg-[#94A3B8]/10 text-[#94A3B8]'
                        }`}
                      >
                        {org.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => dispatch(setSelectedOrgIdForDrawer(org.id))}
                        className="text-[#FB923C] hover:text-white font-medium transition-colors cursor-pointer text-xs"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
