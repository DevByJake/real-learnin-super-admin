import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

interface FaqItem {
  id: string;
  category:
    | "General"
    | "User Management"
    | "Organizations"
    | "AI Simulations"
    | "Security & Billing";
  question: string;
  answer: string;
}

const INITIAL_FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    category: "User Management",
    question: "How do Super Administrators provision new user accounts?",
    answer:
      'Super Admins can provision single users via the User Management table using the "Provision User" button or import batch CSV lists. Accounts can be assigned Individual or Organization learner roles with custom seat licenses.',
  },
  {
    id: "faq-2",
    category: "Organizations",
    question:
      "What is the maximum seat limit for enterprise organization accounts?",
    answer:
      "Organization seat limits are defined per contract tier (e.g., 50, 200, 500, or unlimited seats). Admins can edit seat capacity in the Organization drawer and monitor live active user allocations.",
  },
  {
    id: "faq-3",
    category: "AI Simulations",
    question: "How are simulation scores and competency rubrics evaluated?",
    answer:
      "Simulations evaluate conversational transcripts against 5 core competencies (Empathy, Clarity, Problem Solving, Professionalism, and Resolution Speed). The AI generates detailed scoring cards and actionable improvement tips for learners.",
  },
  {
    id: "faq-4",
    category: "Security & Billing",
    question: "Can Super Admins reset passwords or enforce hardware 2FA?",
    answer:
      "Yes! Super Admins can initiate password resets, enforce 2FA verification for root access in Platform Settings, and terminate suspicious session tokens from the active sessions table.",
  },
  {
    id: "faq-5",
    category: "General",
    question:
      "Is user data retained when an organization account is suspended?",
    answer:
      "When an organization is suspended, user accounts associated with it are temporarily locked from starting new AI simulations, but existing transcripts and analytical reports are securely preserved.",
  },
];

export const FaqPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>(() => {
    const saved = localStorage.getItem("real_learning_faqs");
    return saved ? JSON.parse(saved) : INITIAL_FAQ_ITEMS;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>("faq-1");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [formData, setFormData] = useState({
    category: "General" as FaqItem["category"],
    question: "",
    answer: "",
  });

  // Notification State
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("real_learning_faqs", JSON.stringify(faqs));
  }, [faqs]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const categories = [
    "All",
    "User Management",
    "Organizations",
    "AI Simulations",
    "Security & Billing",
    "General",
  ];

  const handleOpenAddModal = () => {
    setEditingFaq(null);
    setFormData({
      category: "General",
      question: "",
      answer: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (faq: FaqItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFaq(faq);
    setFormData({
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
    });
    setIsModalOpen(true);
  };

  const handleDeleteFaq = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this FAQ item?")) {
      setFaqs((prev) => prev.filter((item) => item.id !== id));
      showNotification("FAQ item deleted successfully.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) return;

    if (editingFaq) {
      // Update existing FAQ
      setFaqs((prev) =>
        prev.map((item) =>
          item.id === editingFaq.id ? { ...item, ...formData } : item
        )
      );
      showNotification("FAQ item updated successfully.");
    } else {
      // Create new FAQ
      const newFaq: FaqItem = {
        id: `faq-${Date.now()}`,
        category: formData.category,
        question: formData.question.trim(),
        answer: formData.answer.trim(),
      };
      setFaqs((prev) => [newFaq, ...prev]);
      setExpandedId(newFaq.id);
      showNotification("New FAQ item created successfully.");
    }

    setIsModalOpen(false);
  };

  const filteredFaqs = faqs.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#171923] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
              Frequently Asked Questions (FAQ)
            </h1>
            <Badge variant="brand" size="sm">
              Support Center
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Manage, create, edit, and organize support knowledge base questions.
          </p>
        </div>

        {/* Action Button */}
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenAddModal}
        >
          Add New FAQ
        </Button>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="p-3 bg-[#34D399]/10 border border-[#34D399]/30 rounded-xl flex items-center gap-2.5 text-xs text-[#34D399] font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#12131C] border border-[#171923] text-[#F8FAFC] placeholder-[#94A3B8]/60 text-xs rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:border-[#FB923C]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? "bg-[#FB923C]/10 border-[#FB923C] text-[#FB923C] font-semibold"
                  : "bg-[#12131C] border-[#171923] text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Collapsible List */}
      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <Card
                key={faq.id}
                className="bg-[#12131C] border border-[#171923] transition-all overflow-hidden"
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-[#171923]/40 transition-colors"
                >
                  <div className="flex items-center gap-3 pr-4 flex-1 min-w-0">
                    <HelpCircle className="w-4 h-4 text-[#FB923C] shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-[#F8FAFC] truncate">
                      {faq.question}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" size="sm">
                      {faq.category}
                    </Badge>

                    {/* Edit & Delete Action Buttons */}
                    <button
                      onClick={(e) => handleOpenEditModal(faq, e)}
                      className="p-1 text-[#94A3B8] hover:text-[#FB923C] hover:bg-[#171923] rounded transition-colors"
                      title="Edit FAQ"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => handleDeleteFaq(faq.id, e)}
                      className="p-1 text-[#94A3B8] hover:text-[#F87171] hover:bg-[#171923] rounded transition-colors"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#FB923C]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-3 border-t border-[#171923] text-xs text-[#CBD5E1] leading-relaxed bg-[#0D0E14]/40">
                    {faq.answer}
                  </div>
                )}
              </Card>
            );
          })
        ) : (
          <div className="p-8 text-center bg-[#12131C] border border-[#171923] rounded-xl text-xs text-[#94A3B8]">
            No FAQ items found matching your filters.
          </div>
        )}
      </div>

      {/* Create / Edit FAQ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07080C]/80 backdrop-blur-sm">
          <div className="bg-[#12131C] border border-[#171923] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 border-b border-[#171923] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F8FAFC]">
                {editingFaq ? "Edit FAQ Item" : "Create New FAQ Item"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#94A3B8] hover:text-[#F8FAFC] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as FaqItem["category"],
                    })
                  }
                  className="w-full bg-[#0D0E14] border border-[#171923] text-[#F8FAFC] text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#FB923C]"
                >
                  <option value="General">General</option>
                  <option value="User Management">User Management</option>
                  <option value="Organizations">Organizations</option>
                  <option value="AI Simulations">AI Simulations</option>
                  <option value="Security & Billing">Security & Billing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                  Question
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How do Super Administrators export analytics?"
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  className="w-full bg-[#0D0E14] border border-[#171923] text-[#F8FAFC] text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#FB923C]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                  Answer
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide detailed explanation or instructions..."
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  className="w-full bg-[#0D0E14] border border-[#171923] text-[#F8FAFC] text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#FB923C] leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#171923]">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {editingFaq ? "Save Changes" : "Create FAQ"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
