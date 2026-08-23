import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveModal, addToast } from '../../store/slices/uiSlice';
import { addClass } from '../../store/slices/classesSlice';
import { addActivityLog } from '../../store/slices/activitySlice';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { SkillDifficulty, ClassStatus } from '../../types';

export const ClassModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.activeModal === 'addClass');
  const careers = useAppSelector((state) => state.careers.careers);

  const [title, setTitle] = useState('');
  const [careerId, setCareerId] = useState(careers[0]?.id || '');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<SkillDifficulty>('Beginner');
  const [estimatedHours, setEstimatedHours] = useState(3);
  const [status, setStatus] = useState<ClassStatus>('Published');
  const [error, setError] = useState('');

  const handleClose = () => {
    dispatch(setActiveModal(null));
    setTitle('');
    setDescription('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide a Class Title and Description');
      return;
    }

    const selectedCareer = careers.find((c) => c.id === careerId) || careers[0];

    dispatch(
      addClass({
        title: title.trim(),
        careerId: selectedCareer?.id || 'career-cs',
        careerName: selectedCareer?.name || 'Customer Success & Support',
        description: description.trim(),
        level,
        estimatedHours: Number(estimatedHours),
        status,
        lessons: [
          {
            id: 'les-' + Date.now().toString(36) + '-1',
            title: 'Foundational Principles & Core Concepts',
            order: 1,
            durationMinutes: 25,
            summary: 'Essential terminology and baseline frameworks.',
            content: 'In this introductory lesson, learners master key definitions and standard operating procedures for real-world scenarios.',
            keyTakeaways: [
              'Understand core domain concepts',
              'Identify actionable execution steps',
              'Apply standard frameworks in daily workflows',
            ],
          },
        ],
        quiz: [
          {
            id: 'quiz-' + Date.now().toString(36) + '-1',
            question: `What is the core principle taught in ${title}?`,
            options: [
              'Execute methodical analysis before jumping to conclusions',
              'Ignore standard operating procedure during crises',
              'Rely solely on subjective intuition',
              'Delay communication until the sprint concludes',
            ],
            correctOptionIndex: 0,
            explanation: 'Methodical analysis combined with rapid communication yields optimal outcomes.',
          },
        ],
      })
    );

    dispatch(
      addActivityLog({
        type: 'class_completed',
        title: 'New Class Module Created',
        description: `Super Admin authored curriculum module: ${title}.`,
        meta: {
          itemTitle: title,
          careerName: selectedCareer?.name,
        },
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Class Module created',
        message: `${title} is now ready for curriculum editing.`,
      })
    );

    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Class Module"
      description="Author a new interactive curriculum module with lessons and knowledge checks."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-[#7F1D1D]/30 border border-[#991B1B] text-[#F87171] text-xs rounded-lg">
            {error}
          </div>
        )}

        <Input
          label="Class Module Title"
          placeholder="e.g. Advanced Stakeholder De-escalation"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Associated Career"
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
            value={level}
            onChange={(e) => setLevel(e.target.value as SkillDifficulty)}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Estimated Duration (Hours)"
            type="number"
            min={1}
            max={40}
            value={estimatedHours}
            onChange={(e) => setEstimatedHours(parseInt(e.target.value) || 1)}
            required
          />

          <Select
            label="Publish Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ClassStatus)}
          >
            <option value="Published">Published (Live to learners)</option>
            <option value="Draft">Draft (Under review)</option>
            <option value="Archived">Archived</option>
          </Select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
            Module Syllabus & Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Outline what practical skills learners will master upon completing this class..."
            rows={3}
            className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] placeholder-[#94A3B8]/60 text-xs rounded-lg p-3 focus:outline-none focus:border-[#FB923C]/70 focus:ring-1 focus:ring-[#FB923C]/50"
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1F2230]">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Module
          </Button>
        </div>
      </form>
    </Modal>
  );
};
