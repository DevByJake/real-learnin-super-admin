import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveModal, addToast } from '../../store/slices/uiSlice';
import { addCareer } from '../../store/slices/careersSlice';
import { addActivityLog } from '../../store/slices/activitySlice';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { CareerStatus } from '../../types';

export const CareerModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.activeModal === 'addCareer');
  const classes = useAppSelector((state) => state.classes.classes);
  const simulations = useAppSelector((state) => state.simulations.simulations);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Customer Operations');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<CareerStatus>('Active');
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedSims, setSelectedSims] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleClose = () => {
    dispatch(setActiveModal(null));
    setName('');
    setDescription('');
    setSelectedClasses([]);
    setSelectedSims([]);
    setError('');
  };

  const handleToggleClass = (classId: string) => {
    setSelectedClasses((prev) =>
      prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
    );
  };

  const handleToggleSim = (simId: string) => {
    setSelectedSims((prev) =>
      prev.includes(simId) ? prev.filter((id) => id !== simId) : [...prev, simId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError('Please provide a Career Name and Description');
      return;
    }

    dispatch(
      addCareer({
        name: name.trim(),
        category,
        description: description.trim(),
        status,
        iconName: 'Compass',
        relatedClassIds: selectedClasses,
        relatedSimulationIds: selectedSims,
      })
    );

    dispatch(
      addActivityLog({
        type: 'career_updated',
        title: 'New Career Track Created',
        description: `Super Admin created career track: ${name}.`,
        meta: {
          careerName: name,
        },
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Career track published',
        message: `${name} is now available in the curriculum catalog.`,
      })
    );

    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Predefined Career Track"
      description="Define a core career curriculum, learning objectives, and linked modules."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-[#7F1D1D]/30 border border-[#991B1B] text-[#F87171] text-xs rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Career Track Title"
            placeholder="e.g. Enterprise Solutions Architect"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Select
            label="Functional Domain / Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Customer Operations">Customer Operations</option>
            <option value="Revenue & Sales">Revenue & Sales</option>
            <option value="Product & Design">Product & Design</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Finance & Banking">Finance & Banking</option>
            <option value="Engineering & Tech">Engineering & Tech</option>
          </Select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
            Career Description & Learning Outcome
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain what specific skills and workplace competencies this career develops..."
            rows={3}
            className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] placeholder-[#94A3B8]/60 text-xs rounded-lg p-3 focus:outline-none focus:border-[#FB923C]/70 focus:ring-1 focus:ring-[#FB923C]/50"
            required
          />
        </div>

        <Select
          label="Catalog Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as CareerStatus)}
        >
          <option value="Active">Active (Visible to all users)</option>
          <option value="Draft">Draft (Internal preparation)</option>
          <option value="Archived">Archived</option>
        </Select>

        {/* Link related classes */}
        <div>
          <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
            Attach Core Classes / Modules
          </label>
          <div className="max-h-36 overflow-y-auto bg-[#0D0E14] border border-[#1F2230] rounded-lg p-2.5 space-y-1.5">
            {classes.length === 0 ? (
              <p className="text-xs text-[#94A3B8]">No classes available</p>
            ) : (
              classes.map((cls) => (
                <label
                  key={cls.id}
                  className="flex items-center gap-2.5 p-1.5 rounded hover:bg-[#171923] text-xs text-[#CBD5E1] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes(cls.id)}
                    onChange={() => handleToggleClass(cls.id)}
                    className="rounded border-[#2E3345] text-[#FB923C] focus:ring-[#FB923C]"
                  />
                  <span className="font-medium text-[#F8FAFC]">{cls.title}</span>
                  <span className="text-[10px] text-[#94A3B8]">({cls.level})</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Link related simulations */}
        <div>
          <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
            Attach AI Simulations
          </label>
          <div className="max-h-36 overflow-y-auto bg-[#0D0E14] border border-[#1F2230] rounded-lg p-2.5 space-y-1.5">
            {simulations.length === 0 ? (
              <p className="text-xs text-[#94A3B8]">No simulations available</p>
            ) : (
              simulations.map((sim) => (
                <label
                  key={sim.id}
                  className="flex items-center gap-2.5 p-1.5 rounded hover:bg-[#171923] text-xs text-[#CBD5E1] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedSims.includes(sim.id)}
                    onChange={() => handleToggleSim(sim.id)}
                    className="rounded border-[#2E3345] text-[#FB923C] focus:ring-[#FB923C]"
                  />
                  <span className="font-medium text-[#F8FAFC]">{sim.title}</span>
                  <span className="text-[10px] text-[#94A3B8]">({sim.difficulty})</span>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1F2230]">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Career Track
          </Button>
        </div>
      </form>
    </Modal>
  );
};
