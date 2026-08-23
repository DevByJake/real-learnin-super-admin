import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToast } from '../store/slices/uiSlice';
import {
  BarChart2,
  TrendingUp,
  Users,
  Sparkles,
  GraduationCap,
  Download,
  Calendar,
  Award,
  ArrowUpRight,
  PieChart as PieIcon,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const timeSeriesData = useAppSelector((state) => state.activity.timeSeriesData);
  const careers = useAppSelector((state) => state.careers.careers);
  const users = useAppSelector((state) => state.users.users);
  const simulations = useAppSelector((state) => state.simulations.simulations);

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Distribution of users by career track
  const careerDistribution = careers.map((c) => ({
    name: c.name,
    count: users.filter((u) => u.careerId === c.id).length || 1,
  }));

  const COLORS = ['#FB923C', '#FB7185', '#38BDF8', '#34D399', '#FBBF24', '#A78BFA'];

  // Simulation skill proficiency scores
  const skillProficiencyData = [
    { skill: 'De-escalation', score: 84 },
    { skill: 'Objection Handling', score: 79 },
    { skill: 'Empathy & Tone', score: 91 },
    { skill: 'Technical Explanation', score: 76 },
    { skill: 'Commercial Closing', score: 82 },
  ];

  const handleExportReport = () => {
    dispatch(
      addToast({
        type: 'success',
        title: 'Platform Analytics Exported',
        message: 'System audit report (CSV / JSON) has been generated.',
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
            Platform Analytics & Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Holistic cross-platform metrics across simulations, curriculums, and skill outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-[#12131C] border border-[#171923] rounded-md p-0.5 text-xs">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-2.5 py-1 rounded transition-colors text-xs font-semibold ${
                timeRange === '7d' ? 'bg-[#FB923C] text-black font-bold' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-2.5 py-1 rounded transition-colors text-xs font-semibold ${
                timeRange === '30d' ? 'bg-[#FB923C] text-black font-bold' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-2.5 py-1 rounded transition-colors text-xs font-semibold ${
                timeRange === '90d' ? 'bg-[#FB923C] text-black font-bold' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              90 Days
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExportReport}
          >
            Export Metrics
          </Button>
        </div>
      </div>

      {/* Top 3 KPI highlight cards with High Density border and mini progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#12131C] border border-[#171923] rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#94A3B8]">Platform Engagement Rate</span>
            <span className="text-[#34D399] text-[10px] font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +12.4%
            </span>
          </div>
          <div className="text-2xl font-bold text-[#F8FAFC] my-2">78.6%</div>
          <div className="w-full bg-[#07080C] h-1 rounded-full overflow-hidden">
            <div className="bg-[#FB923C] h-full w-[78%]" />
          </div>
          <p className="text-[10px] text-[#94A3B8] mt-2">Weekly active learners completing &gt;1 session</p>
        </div>

        <div className="bg-[#12131C] border border-[#171923] rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#94A3B8]">Avg. AI Simulation Score</span>
            <span className="text-[#34D399] text-[10px] font-bold flex items-center gap-0.5">
              <Award className="w-3 h-3" /> Benchmark
            </span>
          </div>
          <div className="text-2xl font-bold text-[#F8FAFC] my-2">82.4 / 100</div>
          <div className="w-full bg-[#07080C] h-1 rounded-full overflow-hidden">
            <div className="bg-[#FB7185] h-full w-[82%]" />
          </div>
          <p className="text-[10px] text-[#94A3B8] mt-2">Across 2,400+ simulated conversations</p>
        </div>

        <div className="bg-[#12131C] border border-[#171923] rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#94A3B8]">Course Completion Velocity</span>
            <span className="text-[#38BDF8] text-[10px] font-bold flex items-center gap-0.5">
              <GraduationCap className="w-3 h-3" /> +4.2 hrs/wk
            </span>
          </div>
          <div className="text-2xl font-bold text-[#F8FAFC] my-2">14.2 Days</div>
          <div className="w-full bg-[#07080C] h-1 rounded-full overflow-hidden">
            <div className="bg-[#34D399] h-full w-[88%]" />
          </div>
          <p className="text-[10px] text-[#94A3B8] mt-2">Average time to complete full career track</p>
        </div>
      </div>

      {/* Main Charts: Activity Trend + Career Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth & Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Learner Growth & Active Sessions</CardTitle>
              <p className="text-xs text-[#94A3B8]">
                Daily volume of active users practicing in AI simulation environments.
              </p>
            </div>
            <Badge variant="brand" size="sm">
              Live Trajectory
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#12131C',
                      borderColor: '#2E3345',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    name="Active Learners"
                    stroke="#38BDF8"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Career Enrollment Share */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Enrollment by Career</CardTitle>
              <p className="text-xs text-[#94A3B8]">Distribution across tracks</p>
            </div>
            <PieIcon className="w-4 h-4 text-[#FB923C]" />
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={careerDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {careerDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#12131C',
                      borderColor: '#2E3345',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-[11px] text-[#94A3B8] text-center">
                Top track: {careerDistribution[0]?.name || 'Customer Operations'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skill Proficiency Rubric Breakdown */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>AI Simulation Skill Rubric Performance</CardTitle>
            <p className="text-xs text-[#94A3B8]">
              Average score across platform-wide workplace competencies graded by the AI evaluation model.
            </p>
          </div>
          <Badge variant="success" size="sm">
            AI Grader Index
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillProficiencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="skill" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#12131C',
                    borderColor: '#2E3345',
                    borderRadius: '8px',
                    color: '#F8FAFC',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="score" name="Avg. Learner Proficiency" fill="#FB923C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
