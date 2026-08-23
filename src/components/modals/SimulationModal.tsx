import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveModal, addToast } from '../../store/slices/uiSlice';
import { addSimulation } from '../../store/slices/simulationsSlice';
import { addActivityLog } from '../../store/slices/activitySlice';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import { SkillDifficulty, SimulationStatus, EvaluatedSkill } from '../../types';
import { Sparkles, Bot, Target, Award, Plus, Trash2 } from 'lucide-react';

export const SimulationModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.activeModal === 'addSimulation');
  const careers = useAppSelector((state) => state.careers.careers);

  const [activeTab, setActiveTab] = useState<'basic' | 'character' | 'scenario' | 'evaluation'>('basic');

  // Basic info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [careerId, setCareerId] = useState(careers[0]?.id || '');
  const [difficulty, setDifficulty] = useState<SkillDifficulty>('Intermediate');
  const [status, setStatus] = useState<SimulationStatus>('Published');

  // AI Character
  const [charName, setCharName] = useState('Jordan Hayes');
  const [charRole, setCharRole] = useState('Director of Procurement');
  const [charAvatar, setCharAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
  const [initialMessage, setInitialMessage] = useState('Your proposal is 30% above our allocated budget. Explain why we should not sign with your rival firm by end of day today.');
  const [charTone, setCharTone] = useState('Demanding, skeptical, focused on compliance and vendor pricing');

  // Scenario
  const [situation, setSituation] = useState('Enterprise client procurement department is conducting final annual RFP vendor evaluations.');
  const [objective, setObjective] = useState('Negotiate without offering immediate margin-destructive discounts and defend proprietary ROI metrics.');
  const [expectedBehavior, setExpectedBehavior] = useState('Learner must ask diagnostic questions about evaluation criteria, reframe total cost of ownership, and offer structured volume tiers.');

  // Evaluated Skills
  const [skills, setSkills] = useState<EvaluatedSkill[]>([
    { id: 'sk-1', name: 'Negotiation & Objection Handling', criteria: 'Holds price boundaries while discovering true buyer pain points', weight: 35 },
    { id: 'sk-2', name: 'Commercial Acumen', criteria: 'Articulates financial ROI and operational payback period', weight: 35 },
    { id: 'sk-3', name: 'Communication & Poise', criteria: 'Maintains calm, confident executive presence under pressure', weight: 30 },
  ]);

  const [error, setError] = useState('');

  const handleClose = () => {
    dispatch(setActiveModal(null));
    setTitle('');
    setDescription('');
    setActiveTab('basic');
    setError('');
  };

  const handleAddSkill = () => {
    setSkills([
      ...skills,
      {
        id: 'sk-' + Date.now().toString(36),
        name: 'New Competency',
        criteria: 'Demonstrates proficiency in targeted skill area',
        weight: 20,
      },
    ]);
  };

  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id));
  };

  const handleUpdateSkill = (id: string, field: keyof EvaluatedSkill, value: any) => {
    setSkills(
      skills.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide a Simulation Title and Description');
      setActiveTab('basic');
      return;
    }
    if (!initialMessage.trim()) {
      setError('Please provide an initial opening AI message');
      setActiveTab('character');
      return;
    }

    const selectedCareer = careers.find((c) => c.id === careerId) || careers[0];

    dispatch(
      addSimulation({
        title: title.trim(),
        description: description.trim(),
        careerId: selectedCareer?.id || 'career-cs',
        careerName: selectedCareer?.name || 'Customer Success & Support',
        difficulty,
        status,
        character: {
          name: charName.trim(),
          role: charRole.trim(),
          avatar: charAvatar.trim(),
          initialMessage: initialMessage.trim(),
          tone: charTone.trim(),
        },
        scenario: {
          situation: situation.trim(),
          objective: objective.trim(),
          expectedBehavior: expectedBehavior.trim(),
        },
        evaluatedSkills: skills,
      })
    );

    dispatch(
      addActivityLog({
        type: 'simulation_completed',
        title: 'New AI Simulation Authored',
        description: `Super Admin configured AI Simulation: ${title} (${difficulty}).`,
        meta: {
          itemTitle: title,
          careerName: selectedCareer?.name,
        },
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'AI Simulation published',
        message: `${title} is now active and ready for learner sessions.`,
      })
    );

    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create AI Simulation Scenario"
      description="Configure dynamic AI chat personas, scenario objectives, and competency rubrics."
      maxWidth="2xl"
    >
      <div className="space-y-5">
        <Tabs
          tabs={[
            { id: 'basic', label: '1. Basic Info', icon: <Sparkles className="w-3.5 h-3.5" /> },
            { id: 'character', label: '2. AI Character', icon: <Bot className="w-3.5 h-3.5" /> },
            { id: 'scenario', label: '3. Scenario & Context', icon: <Target className="w-3.5 h-3.5" /> },
            { id: 'evaluation', label: '4. Evaluation Rubric', icon: <Award className="w-3.5 h-3.5" /> },
          ]}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as any)}
          variant="pills"
        />

        {error && (
          <div className="p-3 bg-[#7F1D1D]/30 border border-[#991B1B] text-[#F87171] text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <Input
                label="Simulation Title"
                placeholder="e.g. Critical Client Escalation Response"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select
                  label="Target Career Track"
                  value={careerId}
                  onChange={(e) => setCareerId(e.target.value)}
                >
                  {careers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Difficulty Level"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as SkillDifficulty)}
                >
                  <option value="Beginner">Beginner (Guided)</option>
                  <option value="Intermediate">Intermediate (Realistic)</option>
                  <option value="Advanced">Advanced (High-Stakes)</option>
                </Select>

                <Select
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as SimulationStatus)}
                >
                  <option value="Published">Published (Active)</option>
                  <option value="Draft">Draft (Internal)</option>
                  <option value="Archived">Archived</option>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                  Brief Simulation Summary
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize the core premise of this interactive conversational practice..."
                  rows={3}
                  className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] placeholder-[#94A3B8]/60 text-xs rounded-lg p-3 focus:outline-none focus:border-[#FB923C]/70 focus:ring-1 focus:ring-[#FB923C]/50"
                  required
                />
              </div>
            </div>
          )}

          {/* TAB 2: AI CHARACTER */}
          {activeTab === 'character' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Character Name"
                  placeholder="e.g. Jordan Hayes"
                  value={charName}
                  onChange={(e) => setCharName(e.target.value)}
                  required
                />

                <Input
                  label="Character Role / Persona"
                  placeholder="e.g. Director of Procurement at FinCorp"
                  value={charRole}
                  onChange={(e) => setCharRole(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Character Avatar Image URL"
                placeholder="https://..."
                value={charAvatar}
                onChange={(e) => setCharAvatar(e.target.value)}
              />

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                  Character Personality, Persona & Tone
                </label>
                <input
                  type="text"
                  value={charTone}
                  onChange={(e) => setCharTone(e.target.value)}
                  placeholder="e.g. Skeptical, impatient, numbers-focused, high risk aversion"
                  className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#FB923C]/70"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                  Opening Message from AI Character (Starts the conversation)
                </label>
                <textarea
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  placeholder="What is the first sentence the AI character sends to the learner?"
                  rows={3}
                  className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] placeholder-[#94A3B8]/60 text-xs rounded-lg p-3 focus:outline-none focus:border-[#FB923C]/70"
                  required
                />
              </div>
            </div>
          )}

          {/* TAB 3: SCENARIO & CONTEXT */}
          {activeTab === 'scenario' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                  Background Situation
                </label>
                <textarea
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  placeholder="What has happened prior to this meeting or call?"
                  rows={3}
                  className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] placeholder-[#94A3B8]/60 text-xs rounded-lg p-3 focus:outline-none focus:border-[#FB923C]/70"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                  Simulation Objective (What the learner must achieve)
                </label>
                <textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="e.g. De-escalate customer anger, secure 10-day extension, and schedule technical demo..."
                  rows={2}
                  className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] placeholder-[#94A3B8]/60 text-xs rounded-lg p-3 focus:outline-none focus:border-[#FB923C]/70"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                  Expected Learner Behavior & Best Practices
                </label>
                <textarea
                  value={expectedBehavior}
                  onChange={(e) => setExpectedBehavior(e.target.value)}
                  placeholder="Guidelines for what ideal responses look like..."
                  rows={2}
                  className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] placeholder-[#94A3B8]/60 text-xs rounded-lg p-3 focus:outline-none focus:border-[#FB923C]/70"
                />
              </div>
            </div>
          )}

          {/* TAB 4: EVALUATION RUBRIC */}
          {activeTab === 'evaluation' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#CBD5E1]">
                  Define the skills evaluated by the AI grader at the end of each session.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={handleAddSkill}
                >
                  Add Skill
                </Button>
              </div>

              <div className="space-y-3">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-3.5 bg-[#0D0E14] border border-[#1F2230] rounded-xl flex flex-col gap-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => handleUpdateSkill(skill.id, 'name', e.target.value)}
                        placeholder="Skill Name (e.g. De-escalation)"
                        className="flex-1 bg-[#171923] border border-[#2E3345] text-[#F8FAFC] text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#FB923C]"
                      />
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[11px] text-[#94A3B8]">Weight:</span>
                        <input
                          type="number"
                          min={5}
                          max={100}
                          value={skill.weight}
                          onChange={(e) => handleUpdateSkill(skill.id, 'weight', parseInt(e.target.value) || 0)}
                          className="w-16 bg-[#171923] border border-[#2E3345] text-[#F8FAFC] text-xs rounded-md px-2 py-1.5 text-center focus:outline-none focus:border-[#FB923C]"
                        />
                        <span className="text-xs text-[#94A3B8]">%</span>
                      </div>
                      {skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill.id)}
                          className="p-1.5 text-[#94A3B8] hover:text-[#F87171] rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={skill.criteria}
                      onChange={(e) => handleUpdateSkill(skill.id, 'criteria', e.target.value)}
                      placeholder="Grading criteria for AI model (e.g. Evaluates empathy and non-defensiveness)"
                      className="w-full bg-[#12131C] border border-[#1F2230] text-[#CBD5E1] text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#FB923C]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#1F2230]">
            <div className="flex gap-1.5">
              {activeTab !== 'basic' && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const order: Array<'basic' | 'character' | 'scenario' | 'evaluation'> = ['basic', 'character', 'scenario', 'evaluation'];
                    const idx = order.indexOf(activeTab);
                    if (idx > 0) setActiveTab(order[idx - 1]);
                  }}
                >
                  Previous Step
                </Button>
              )}
              {activeTab !== 'evaluation' && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const order: Array<'basic' | 'character' | 'scenario' | 'evaluation'> = ['basic', 'character', 'scenario', 'evaluation'];
                    const idx = order.indexOf(activeTab);
                    if (idx < order.length - 1) setActiveTab(order[idx + 1]);
                  }}
                >
                  Next Step
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save & Deploy Simulation
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};
