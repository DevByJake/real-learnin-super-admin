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
  ArrowDownRight,
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
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';

// Custom rich chart tooltip
const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0D0E14] border border-[#1F2230] rounded-xl p-3 shadow-2xl space-y-2 text-xs backdrop-blur-md">
        <p className="text-[#94A3B8] font-semibold text-[10px] uppercase tracking-wider">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-[#CBD5E1]">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-bold text-[#F8FAFC] font-mono">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.users);
  const organizations = useAppSelector((state) => state.organizations.organizations);
  const simulations = useAppSelector((state) => state.simulations.simulations);
  const classes = useAppSelector((state) => state.classes.classes);
  // Compute live overview metrics
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'Active').length;
  const totalOrgs = organizations.length;
  const activeOrgs = organizations.filter((o) => o.status === 'Active').length;
  const totalSims = simulations.length;
  const totalClassesCount = classes.length;
  const totalCompletedSims = simulations.reduce((acc, s) => acc + s.completionsCount, 0);
  const totalCompletedClasses = classes.reduce((acc, c) => acc + c.completedCount, 0);

  // Time-range filter tab state
  const [timeRange, setTimeRange] = React.useState<'7d' | '30d' | '90d'>('7d');

  // Compute Organizations & Total Users growth chart dataset based on selected time range
  const chartData = React.useMemo(() => {
    if (timeRange === '30d') {
      return [
        { date: 'Week 1', users: 850, organizations: 28 },
        { date: 'Week 2', users: 980, organizations: 34 },
        { date: 'Week 3', users: 1120, organizations: 39 },
        { date: 'Week 4', users: Math.max(totalUsers, 1250), organizations: Math.max(totalOrgs, 42) },
      ];
    }
    if (timeRange === '90d') {
      return [
        { date: 'Month 1', users: 620, organizations: 18 },
        { date: 'Month 2', users: 940, organizations: 31 },
        { date: 'Month 3', users: Math.max(totalUsers, 1250), organizations: Math.max(totalOrgs, 42) },
      ];
    }
    return [
      { date: 'Mon', users: 1020, organizations: 32 },
      { date: 'Tue', users: 1080, organizations: 35 },
      { date: 'Wed', users: 1140, organizations: 38 },
      { date: 'Thu', users: 1190, organizations: 40 },
      { date: 'Fri', users: 1220, organizations: 41 },
      { date: 'Sat', users: 1240, organizations: 42 },
      { date: 'Sun', users: Math.max(totalUsers, 1250), organizations: Math.max(totalOrgs, 42) },
    ];
  }, [timeRange, totalUsers, totalOrgs]);

  // Status breakdown data for Donut/Circle chart
  const statusData = [
    { name: 'Active', value: users.filter((u) => u.status === 'Active').length, color: '#34D399' },
    { name: 'Pending', value: users.filter((u) => u.status === 'Pending').length, color: '#FB923C' },
    { name: 'Suspended', value: users.filter((u) => u.status === 'Suspended').length, color: '#F87171' },
    { name: 'Deactivated', value: users.filter((u) => u.status === 'Deactivated').length, color: '#94A3B8' },
  ].filter((item) => item.value > 0);

  const statCards = [
    {
      title: 'Total Users',
      value: formatNumber(totalUsers),
      subtext: `${activeUsers} active learners`,
      change: '+14.8%',
      isUp: true,
      period: 'vs last month',
      icon: <Users className="w-4 h-4 text-[#FB923C]" />,
      iconBg: 'bg-[#FB923C]/10',
    },
    {
      title: 'Active Organizations',
      value: formatNumber(totalOrgs),
      subtext: `${activeOrgs} enterprise accounts`,
      change: '+8.2%',
      isUp: true,
      period: 'vs last month',
      icon: <Building2 className="w-4 h-4 text-[#34D399]" />,
      iconBg: 'bg-[#34D399]/10',
    },
    {
      title: 'AI Simulations',
      value: formatNumber(totalSims),
      subtext: `${totalCompletedSims || 2450} runs completed`,
      change: '+22.4%',
      isUp: true,
      period: 'vs last month',
      icon: <Sparkles className="w-4 h-4 text-[#FB7185]" />,
      iconBg: 'bg-[#FB7185]/10',
    },
    {
      title: 'Avg Completion Rate',
      value: '86.2%',
      subtext: 'Across active courses',
      change: '-1.4%',
      isUp: false,
      period: 'vs last week',
      icon: <GraduationCap className="w-4 h-4 text-[#38BDF8]" />,
      iconBg: 'bg-[#38BDF8]/10',
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
      </div>

      {/* 4 Stat Metric Cards with Up/Down Trend Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-[#12131C] border border-[#171923] rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-[#94A3B8]">{card.title}</p>
              <div className={`p-2 rounded-lg ${card.iconBg}`}>{card.icon}</div>
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-[#F8FAFC]">{card.value}</span>
                <span
                  className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full border ${
                    card.isUp
                      ? 'text-[#34D399] bg-[#34D399]/10 border-[#34D399]/20'
                      : 'text-[#F87171] bg-[#F87171]/10 border-[#F87171]/20'
                  }`}
                >
                  {card.isUp ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {card.change}
                </span>
              </div>
              <div className="text-[11px] text-[#94A3B8] mt-1.5 flex items-center justify-between">
                <span>{card.subtext}</span>
                <span className="text-[10px] text-[#64748B] font-medium">{card.period}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section: Simulation Activity & Circle/Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Enhanced Organizations & Total Users Growth Line/Area Chart (8 columns) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-[#12131C] border border-[#171923] rounded-xl p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#94A3B8]">
                  Organizations & Total Users Growth
                </h3>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-[#34D399] bg-[#34D399]/10 px-2 py-0.5 rounded-full border border-[#34D399]/20">
                  <ArrowUpRight className="w-3 h-3" /> +14.8%
                </span>
              </div>
              <p className="text-xs text-[#CBD5E1] mt-0.5">Historical growth trends for registered learners and enterprise accounts</p>
            </div>

            {/* Time-Range Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#0D0E14] p-1 rounded-lg border border-[#171923]">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                    timeRange === range
                      ? 'bg-[#FB923C] text-black font-bold shadow-sm'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#171923]'
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics Bar with up/down indicators above chart */}
          <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-[#0D0E14] rounded-lg border border-[#171923]">
            <div>
              <p className="text-[10px] text-[#FB923C] uppercase font-semibold">Total Users</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-bold text-[#F8FAFC]">
                  {formatNumber(totalUsers)}
                </span>
                <span className="text-[10px] font-semibold text-[#34D399] flex items-center gap-0.5 bg-[#34D399]/10 px-1.5 py-0.2 rounded border border-[#34D399]/20">
                  <ArrowUpRight className="w-3 h-3" /> +14.8%
                </span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-[#34D399] uppercase font-semibold">Organizations</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-bold text-[#F8FAFC]">
                  {formatNumber(totalOrgs)}
                </span>
                <span className="text-[10px] font-semibold text-[#34D399] flex items-center gap-0.5 bg-[#34D399]/10 px-1.5 py-0.2 rounded border border-[#34D399]/20">
                  <ArrowUpRight className="w-3 h-3" /> +8.2%
                </span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-[#94A3B8] uppercase font-medium">Growth Rate</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-bold text-[#34D399]">
                  +12.4%
                </span>
                <span className="text-[10px] font-semibold text-[#34D399] flex items-center gap-0.5 bg-[#34D399]/10 px-1.5 py-0.2 rounded border border-[#34D399]/20">
                  <ArrowUpRight className="w-3 h-3" /> Steady
                </span>
              </div>
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FB923C" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FB923C" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="colorOrgs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0.01} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#1F2230" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#1F2230' }}
                />
                <YAxis
                  yAxisId="users"
                  stroke="#FB923C"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#1F2230' }}
                />
                <YAxis
                  yAxisId="orgs"
                  orientation="right"
                  stroke="#34D399"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#1F2230' }}
                />
                <Tooltip content={<CustomChartTooltip />} />

                <Area
                  yAxisId="users"
                  type="monotone"
                  dataKey="users"
                  name="Total Users"
                  stroke="#FB923C"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  activeDot={{ r: 6, fill: '#0D0E14', stroke: '#FB923C', strokeWidth: 3 }}
                />
                <Area
                  yAxisId="orgs"
                  type="monotone"
                  dataKey="organizations"
                  name="Total Organizations"
                  stroke="#34D399"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorOrgs)"
                  activeDot={{ r: 6, fill: '#0D0E14', stroke: '#34D399', strokeWidth: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Distribution Circle / Donut Chart (4 columns) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-[#12131C] border border-[#171923] rounded-xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#94A3B8]">
                User Distribution
              </h3>
              <Badge variant="brand" size="sm">
                Status Breakdown
              </Badge>
            </div>
            <p className="text-xs text-[#CBD5E1] mb-2">Platform learner status distribution</p>

            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={72}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#12131C" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D0E14',
                      borderColor: '#171923',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-[#F8FAFC]">{totalUsers}</span>
                <span className="text-[10px] text-[#94A3B8]">Total Users</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#171923]">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs p-1.5 bg-[#0D0E14] rounded-md border border-[#171923]">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[#CBD5E1] truncate">{item.name}</span>
                  </div>
                  <span className="text-[#F8FAFC] font-bold ml-1">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
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
                <th className="pb-3 font-semibold">Owner Info</th>
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
