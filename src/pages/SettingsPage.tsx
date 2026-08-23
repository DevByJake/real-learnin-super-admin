import React, { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { addToast } from '../store/slices/uiSlice';
import {
  Settings,
  Bot,
  Shield,
  Database,
  Cpu,
  Save,
  RotateCcw,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

export const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const [aiModel, setAiModel] = useState('gemini-2.5-pro');
  const [temperature, setTemperature] = useState(0.7);
  const [safetyFilter, setSafetyFilter] = useState('Strict');
  const [sessionMaxTurns, setSessionMaxTurns] = useState(15);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowOrgSelfSignup, setAllowOrgSelfSignup] = useState(true);

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveSettings = () => {
    dispatch(
      addToast({
        type: 'success',
        title: 'System Settings Updated',
        message: 'Super Admin runtime and AI simulation hyperparameters applied.',
      })
    );
  };

  const handleResetDatabase = () => {
    localStorage.removeItem('rl_users');
    localStorage.removeItem('rl_organizations');
    localStorage.removeItem('rl_careers');
    localStorage.removeItem('rl_classes');
    localStorage.removeItem('rl_simulations');
    localStorage.removeItem('rl_activity');

    dispatch(
      addToast({
        type: 'info',
        title: 'Platform Database Reset',
        message: 'Mock database refreshed to baseline seed values. Reloading page...',
      })
    );

    setShowResetConfirm(false);
    setTimeout(() => {
      window.location.reload();
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
            Platform Settings & AI Infrastructure
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Configure system-wide AI inference parameters, security governance, and mock storage.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Save className="w-4 h-4" />}
          onClick={handleSaveSettings}
        >
          Save Configurations
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* AI Simulation Engine Settings */}
        <Card className="bg-[#12131C] border border-[#171923]">
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#FB923C]/10 text-[#FB923C]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>AI Simulation Engine</CardTitle>
                <p className="text-xs text-[#94A3B8]">Inference model selection and response realism</p>
              </div>
            </div>
            <Badge variant="brand" size="sm">
              GenAI Runtime
            </Badge>
          </CardHeader>

          <CardContent className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                Default LLM Model for Character Personas
              </label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full bg-[#0D0E14] border border-[#171923] text-[#F8FAFC] text-xs rounded-md px-3 py-2 focus:outline-none focus:border-[#FB923C]"
              >
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Recommended for Complex Personas)</option>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultra-Low Latency Conversational)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-medium text-[#CBD5E1] mb-1.5">
                <span>Creativity & Persona Variance (Temperature)</span>
                <span className="text-[#FB923C] font-mono">{temperature}</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={1.2}
                step={0.05}
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-[#FB923C]"
              />
              <div className="flex justify-between text-[10px] text-[#94A3B8] mt-1">
                <span>0.1 (Strict & Repetitive)</span>
                <span>0.7 (Balanced Realism)</span>
                <span>1.2 (High Chaos)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                  Content Safety Filter
                </label>
                <select
                  value={safetyFilter}
                  onChange={(e) => setSafetyFilter(e.target.value)}
                  className="w-full bg-[#0D0E14] border border-[#171923] text-[#F8FAFC] text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-[#FB923C]"
                >
                  <option value="Strict">Strict (Block all hostility)</option>
                  <option value="Moderate">Moderate (Allow realistic friction)</option>
                  <option value="Unrestricted">Unrestricted (Raw Sandbox)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                  Max Turns Per Session
                </label>
                <input
                  type="number"
                  min={5}
                  max={50}
                  value={sessionMaxTurns}
                  onChange={(e) => setSessionMaxTurns(parseInt(e.target.value) || 15)}
                  className="w-full bg-[#0D0E14] border border-[#171923] text-[#F8FAFC] text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-[#FB923C]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security & Access Controls */}
        <Card className="bg-[#12131C] border border-[#171923]">
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#34D399]/10 text-[#34D399]">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Platform Security & Governance</CardTitle>
                <p className="text-xs text-[#94A3B8]">Super Admin access policy and network gating</p>
              </div>
            </div>
            <Badge variant="success" size="sm">
              Enforced
            </Badge>
          </CardHeader>

          <CardContent className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-3 bg-[#0D0E14] rounded-lg border border-[#171923]">
              <div>
                <p className="font-semibold text-[#F8FAFC]">System Maintenance Mode</p>
                <p className="text-[#94A3B8] text-[10px] mt-0.5">
                  Locks learner logins and displays scheduled maintenance notice.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-[#171923] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#FB923C]" />
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#0D0E14] rounded-lg border border-[#171923]">
              <div>
                <p className="font-semibold text-[#F8FAFC]">Allow Organization Self-Onboarding</p>
                <p className="text-[#94A3B8] text-[10px] mt-0.5">
                  Allow enterprise teams to invite learners via domain SSO matching.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowOrgSelfSignup}
                  onChange={(e) => setAllowOrgSelfSignup(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-[#171923] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#FB923C]" />
              </label>
            </div>

            <div className="p-3 bg-[#0D0E14] rounded-lg border border-[#171923] space-y-1">
              <span className="text-[#94A3B8] block text-[10px] uppercase font-semibold">
                Super Admin Session Security
              </span>
              <p className="text-[#CBD5E1]">
                Single Sign-On (SSO) enforced with TOTP Hardware 2FA. Session idle timeout: 60 minutes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Database & Mock Data Reset */}
        <Card className="bg-[#12131C] lg:col-span-2 border border-[#171923]">
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#F87171]/10 text-[#F87171]">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Mock Database Management</CardTitle>
                <p className="text-xs text-[#94A3B8]">
                  Reset sample records, simulation transcripts, and custom test users back to initial seed data.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-[#CBD5E1]">
                Clear browser localStorage persistence and regenerate full sample database with realistic learner metrics, enterprise organizations, and simulation scenarios.
              </p>
            </div>

            <Button
              variant="danger"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={() => setShowResetConfirm(true)}
            >
              Reset Seed Database
            </Button>
          </CardContent>
        </Card>
      </div>

      {showResetConfirm && (
        <ConfirmDialog
          isOpen={showResetConfirm}
          onClose={() => setShowResetConfirm(false)}
          onConfirm={handleResetDatabase}
          title="Reset Platform Database"
          message="Are you sure you want to purge all local mock modifications and reload initial seed data? All custom users, classes, and simulations created in this browser session will be reset."
          confirmLabel="Confirm Reset"
          confirmVariant="danger"
        />
      )}
    </div>
  );
};
