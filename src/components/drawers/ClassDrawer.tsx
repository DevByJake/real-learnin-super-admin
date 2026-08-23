import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSelectedClassIdForDrawer, addToast } from '../../store/slices/uiSlice';
import {
  updateClass,
  toggleClassPublishStatus,
  addLessonToClass,
  deleteLessonFromClass,
  addQuizQuestionToClass,
  deleteQuizQuestionFromClass,
} from '../../store/slices/classesSlice';
import { Drawer } from '../ui/Drawer';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import { Lesson, QuizQuestion } from '../../types';
import {
  GraduationCap,
  BookOpen,
  HelpCircle,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  Sparkles,
  Save,
} from 'lucide-react';

export const ClassDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedClassId = useAppSelector((state) => state.ui.selectedClassIdForDrawer);
  const classes = useAppSelector((state) => state.classes.classes);
  const cls = classes.find((c) => c.id === selectedClassId);

  const [activeTab, setActiveTab] = useState<'lessons' | 'quiz' | 'info'>('lessons');

  // New Lesson form state
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState(25);
  const [newLessonSummary, setNewLessonSummary] = useState('');
  const [newLessonContent, setNewLessonContent] = useState('');
  const [showAddLesson, setShowAddLesson] = useState(false);

  // New Quiz question form state
  const [newQuizQuestion, setNewQuizQuestion] = useState('');
  const [newQuizOpt1, setNewQuizOpt1] = useState('');
  const [newQuizOpt2, setNewQuizOpt2] = useState('');
  const [newQuizOpt3, setNewQuizOpt3] = useState('');
  const [newQuizCorrect, setNewQuizCorrect] = useState(0);
  const [newQuizExplanation, setNewQuizExplanation] = useState('');
  const [showAddQuiz, setShowAddQuiz] = useState(false);

  if (!cls) return null;

  const handleClose = () => {
    dispatch(setSelectedClassIdForDrawer(null));
    setShowAddLesson(false);
    setShowAddQuiz(false);
  };

  const handleTogglePublish = () => {
    dispatch(toggleClassPublishStatus(cls.id));
    dispatch(
      addToast({
        type: 'info',
        title: cls.status === 'Published' ? 'Module Unpublished' : 'Module Published Live',
        message: `${cls.title} status updated.`,
      })
    );
  };

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim()) return;

    dispatch(
      addLessonToClass({
        classId: cls.id,
        lesson: {
          title: newLessonTitle.trim(),
          order: cls.lessons.length + 1,
          durationMinutes: Number(newLessonDuration),
          summary: newLessonSummary.trim() || 'Lesson overview and practical context.',
          content: newLessonContent.trim() || 'Detailed instructions and practical examples.',
          keyTakeaways: ['Key takeaway 1', 'Key takeaway 2'],
        },
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Lesson Added',
        message: `Added ${newLessonTitle} to curriculum.`,
      })
    );

    setNewLessonTitle('');
    setNewLessonSummary('');
    setNewLessonContent('');
    setShowAddLesson(false);
  };

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuizQuestion.trim() || !newQuizOpt1.trim() || !newQuizOpt2.trim()) return;

    dispatch(
      addQuizQuestionToClass({
        classId: cls.id,
        question: {
          question: newQuizQuestion.trim(),
          options: [newQuizOpt1.trim(), newQuizOpt2.trim(), newQuizOpt3.trim() || 'None of the above'],
          correctOptionIndex: Number(newQuizCorrect),
          explanation: newQuizExplanation.trim() || 'Correct answer based on lesson principles.',
        },
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Quiz Question Added',
        message: 'Knowledge check updated.',
      })
    );

    setNewQuizQuestion('');
    setNewQuizOpt1('');
    setNewQuizOpt2('');
    setNewQuizOpt3('');
    setNewQuizExplanation('');
    setShowAddQuiz(false);
  };

  return (
    <Drawer
      isOpen={!!selectedClassId}
      onClose={handleClose}
      title={cls.title}
      subtitle={`Career: ${cls.careerName} • Level: ${cls.level}`}
      footer={
        <div className="flex items-center justify-between">
          <Button
            variant={cls.status === 'Published' ? 'outline' : 'success'}
            size="sm"
            onClick={handleTogglePublish}
          >
            {cls.status === 'Published' ? 'Unpublish Module' : 'Publish Module Live'}
          </Button>

          <Button variant="secondary" size="sm" onClick={handleClose}>
            Done
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Class Overview Banner */}
        <div className="p-4 bg-[#12131C] border border-[#1F2230] rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={cls.status === 'Published' ? 'success' : 'warning'} size="sm">
                {cls.status}
              </Badge>
              <Badge variant="brand" size="sm">
                {cls.level}
              </Badge>
            </div>
            <span className="text-xs text-[#94A3B8] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#FB923C]" />
              {cls.estimatedHours} Hours
            </span>
          </div>

          <p className="text-xs text-[#CBD5E1] leading-relaxed">{cls.description}</p>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1F2230]/70 text-xs">
            <div className="p-2 bg-[#0D0E14] rounded-lg">
              <span className="text-[#94A3B8] text-[10px] block">Enrolled Learners</span>
              <span className="font-bold text-[#F8FAFC]">{cls.enrolledCount} learners</span>
            </div>
            <div className="p-2 bg-[#0D0E14] rounded-lg">
              <span className="text-[#94A3B8] text-[10px] block">Completion Rate</span>
              <span className="font-bold text-[#34D399]">
                {cls.enrolledCount > 0 ? Math.round((cls.completedCount / cls.enrolledCount) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs
          tabs={[
            { id: 'lessons', label: 'Lessons', count: cls.lessons.length, icon: <BookOpen className="w-3.5 h-3.5" /> },
            { id: 'quiz', label: 'Quiz Questions', count: cls.quiz.length, icon: <HelpCircle className="w-3.5 h-3.5" /> },
          ]}
          activeTab={activeTab}
          onChange={(t) => setActiveTab(t as any)}
          variant="pills"
        />

        {/* TAB: LESSONS */}
        {activeTab === 'lessons' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                Curriculum Lessons
              </h4>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => setShowAddLesson(!showAddLesson)}
              >
                Add Lesson
              </Button>
            </div>

            {showAddLesson && (
              <form onSubmit={handleCreateLesson} className="p-4 bg-[#12131C] border border-[#2E3345] rounded-xl space-y-3">
                <h5 className="text-xs font-bold text-[#F8FAFC]">Create New Lesson</h5>
                <input
                  type="text"
                  placeholder="Lesson Title..."
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#FB923C]"
                  required
                />
                <input
                  type="number"
                  placeholder="Duration (Minutes)..."
                  value={newLessonDuration}
                  onChange={(e) => setNewLessonDuration(parseInt(e.target.value) || 15)}
                  className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#FB923C]"
                />
                <textarea
                  placeholder="Lesson Summary..."
                  value={newLessonSummary}
                  onChange={(e) => setNewLessonSummary(e.target.value)}
                  rows={2}
                  className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#FB923C]"
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddLesson(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Save Lesson
                  </Button>
                </div>
              </form>
            )}

            <div className="space-y-2.5">
              {cls.lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="p-3.5 bg-[#12131C] border border-[#1F2230] rounded-xl flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-[#171923] border border-[#2E3345] flex items-center justify-center text-xs font-bold text-[#FB923C] shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-[#F8FAFC]">{lesson.title}</p>
                        <span className="text-[10px] text-[#94A3B8] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#FB923C]" />
                          {lesson.durationMinutes}m
                        </span>
                      </div>
                      <p className="text-[11px] text-[#CBD5E1] mt-1">{lesson.summary}</p>
                      {lesson.keyTakeaways?.length > 0 && (
                        <div className="mt-2 space-y-0.5">
                          {lesson.keyTakeaways.map((takeaway, tIdx) => (
                            <p key={tIdx} className="text-[10px] text-[#94A3B8] flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-[#34D399] shrink-0" />
                              {takeaway}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => dispatch(deleteLessonFromClass({ classId: cls.id, lessonId: lesson.id }))}
                    className="text-[#94A3B8] hover:text-[#F87171] p-1.5 rounded-lg hover:bg-[#171923] transition-colors shrink-0"
                    title="Remove lesson"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: QUIZ */}
        {activeTab === 'quiz' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                Knowledge Check Questions
              </h4>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => setShowAddQuiz(!showAddQuiz)}
              >
                Add Question
              </Button>
            </div>

            {showAddQuiz && (
              <form onSubmit={handleCreateQuiz} className="p-4 bg-[#12131C] border border-[#2E3345] rounded-xl space-y-3 text-xs">
                <h5 className="font-bold text-[#F8FAFC]">Author Knowledge Check Question</h5>
                <input
                  type="text"
                  placeholder="Question text..."
                  value={newQuizQuestion}
                  onChange={(e) => setNewQuizQuestion(e.target.value)}
                  className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] rounded-lg p-2.5 focus:outline-none focus:border-[#FB923C]"
                  required
                />
                <input
                  type="text"
                  placeholder="Option 1..."
                  value={newQuizOpt1}
                  onChange={(e) => setNewQuizOpt1(e.target.value)}
                  className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] rounded-lg p-2 focus:outline-none focus:border-[#FB923C]"
                  required
                />
                <input
                  type="text"
                  placeholder="Option 2..."
                  value={newQuizOpt2}
                  onChange={(e) => setNewQuizOpt2(e.target.value)}
                  className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] rounded-lg p-2 focus:outline-none focus:border-[#FB923C]"
                  required
                />
                <input
                  type="text"
                  placeholder="Option 3..."
                  value={newQuizOpt3}
                  onChange={(e) => setNewQuizOpt3(e.target.value)}
                  className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] rounded-lg p-2 focus:outline-none focus:border-[#FB923C]"
                />
                <div>
                  <label className="block text-[#94A3B8] mb-1">Correct Option Index (0 = Option 1, 1 = Option 2, etc.):</label>
                  <select
                    value={newQuizCorrect}
                    onChange={(e) => setNewQuizCorrect(parseInt(e.target.value))}
                    className="w-full bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] rounded-lg p-2 focus:outline-none focus:border-[#FB923C]"
                  >
                    <option value={0}>Option 1 is correct</option>
                    <option value={1}>Option 2 is correct</option>
                    <option value={2}>Option 3 is correct</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddQuiz(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Save Question
                  </Button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {cls.quiz.map((q, qIdx) => (
                <div key={q.id} className="p-3.5 bg-[#12131C] border border-[#1F2230] rounded-xl text-xs space-y-2">
                  <div className="flex items-start justify-between">
                    <p className="font-semibold text-[#F8FAFC]">
                      {qIdx + 1}. {q.question}
                    </p>
                    <button
                      onClick={() => dispatch(deleteQuizQuestionFromClass({ classId: cls.id, questionId: q.id }))}
                      className="text-[#94A3B8] hover:text-[#F87171] p-1 rounded transition-colors"
                      title="Remove question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1 pl-3 border-l-2 border-[#1F2230]">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-1.5 rounded text-[11px] ${
                          oIdx === q.correctOptionIndex
                            ? 'bg-[#064E3B]/30 text-[#34D399] font-medium border border-[#065F46]/50'
                            : 'text-[#CBD5E1]'
                        }`}
                      >
                        {oIdx === q.correctOptionIndex ? '✓ ' : '• '} {opt}
                      </div>
                    ))}
                  </div>

                  {q.explanation && (
                    <p className="text-[10px] text-[#94A3B8] italic pt-1 border-t border-[#1F2230]/50">
                      Rationale: {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};
