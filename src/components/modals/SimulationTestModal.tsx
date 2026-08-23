import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveModal, setTestSimulationTarget } from '../../store/slices/uiSlice';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Bot, Send, User, RotateCcw, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user' | 'system';
  text: string;
  timestamp: string;
}

export const SimulationTestModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const targetId = useAppSelector((state) => state.ui.testSimulationTargetId);
  const isOpen = useAppSelector((state) => state.ui.activeModal === 'testSimulation');
  const simulations = useAppSelector((state) => state.simulations.simulations);
  const simulation = simulations.find((s) => s.id === targetId) || simulations[0];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (simulation && isOpen) {
      setMessages([
        {
          id: 'sys-start',
          sender: 'system',
          text: `Simulation sandbox active: ${simulation.title} (${simulation.difficulty}). Character: ${simulation.character.name} (${simulation.character.role}).`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        {
          id: 'ai-init',
          sender: 'ai',
          text: simulation.character.initialMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [simulation, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleClose = () => {
    dispatch(setTestSimulationTarget(null));
    dispatch(setActiveModal(null));
    setMessages([]);
    setInputText('');
  };

  const handleReset = () => {
    if (simulation) {
      setMessages([
        {
          id: 'sys-reset',
          sender: 'system',
          text: `Simulation reset. Testing initial character hook.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        {
          id: 'ai-init-reset',
          sender: 'ai',
          text: simulation.character.initialMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !simulation) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI character response following their persona & tone
    setTimeout(() => {
      let aiReply = '';
      const text = userMsg.text.toLowerCase();

      if (simulation.careerId === 'career-cs') {
        if (text.includes('sorry') || text.includes('apologize') || text.includes('understand')) {
          aiReply = `I appreciate the apology, but we have customer SLA obligations on the line. What is your concrete technical rollback timeline, and who is the senior engineer assigned?`;
        } else if (text.includes('minute') || text.includes('update') || text.includes('team')) {
          aiReply = `Okay, I will hold off on legal escalation for 15 minutes. Send me the direct incident ticket link and keep me in the loop every 5 minutes.`;
        } else {
          aiReply = `That does not address our $45,000 revenue impact. Why did your team deploy without sandbox validation?`;
        }
      } else if (simulation.careerId === 'career-b2b-sales') {
        if (text.includes('hours') || text.includes('time') || text.includes('roi') || text.includes('cost')) {
          aiReply = `Interesting. Our reps indeed complain about wasting 6 hours on manual Friday audits. If your solution integrates into our existing stack without additional licensing, I might review a 1-page financial brief.`;
        } else {
          aiReply = `That sounds like every other vendor pitch. What makes your automation different from what our current CRM vendor already claims to do?`;
        }
      } else {
        aiReply = `I hear what you are proposing, but my immediate priority is meeting this quarter commitments. Walk me through the exact phased milestone compromise.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 1100);
  };

  if (!simulation) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`AI Simulation Sandbox: ${simulation.title}`}
      description="Super Admin Live Preview Console — test persona responses, tone fidelity, and scenario boundary constraints."
      maxWidth="3xl"
    >
      <div className="flex flex-col h-[520px] bg-[#07080C] border border-[#1F2230] rounded-xl overflow-hidden">
        {/* Persona Header bar */}
        <div className="p-3.5 px-4 bg-[#12131C] border-b border-[#1F2230] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={simulation.character.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={simulation.character.name}
                className="w-9 h-9 rounded-full object-cover border border-[#2E3345]"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#34D399] rounded-full border-2 border-[#12131C]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#F8FAFC]">
                  {simulation.character.name}
                </span>
                <Badge variant="brand" size="sm">
                  {simulation.difficulty}
                </Badge>
              </div>
              <p className="text-[11px] text-[#94A3B8] truncate max-w-sm">
                {simulation.character.role} • Tone: {simulation.character.tone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={handleReset}
            >
              Reset Chat
            </Button>
          </div>
        </div>

        {/* Chat message history */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
          {messages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <div key={msg.id} className="text-center my-2">
                  <span className="inline-block px-3 py-1 bg-[#171923] text-[#94A3B8] text-[11px] rounded-full border border-[#1F2230]">
                    {msg.text}
                  </span>
                </div>
              );
            }

            const isAI = msg.sender === 'ai';

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-7 h-7 rounded-full bg-[#FB923C]/20 border border-[#FB923C]/30 text-[#FB923C] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[78%] rounded-2xl p-3 text-xs leading-relaxed ${
                    isAI
                      ? 'bg-[#12131C] text-[#F8FAFC] border border-[#1F2230] rounded-tl-sm'
                      : 'gradient-brand text-white rounded-tr-sm shadow-md font-medium'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      isAI ? 'text-[#94A3B8]' : 'text-white/80'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {!isAI && (
                  <div className="w-7 h-7 rounded-full bg-[#171923] border border-[#2E3345] text-[#CBD5E1] flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#94A3B8] p-2 bg-[#12131C] rounded-xl w-fit border border-[#1F2230]">
              <Sparkles className="w-3.5 h-3.5 text-[#FB923C] animate-spin" />
              <span>{simulation.character.name} is formulating response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 bg-[#12131C] border-t border-[#1F2230] flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={`Reply as test learner to ${simulation.character.name}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-[#07080C] border border-[#1F2230] text-[#F8FAFC] placeholder-[#94A3B8]/60 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#FB923C]/70"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!inputText.trim() || isTyping}
            rightIcon={<Send className="w-3.5 h-3.5" />}
          >
            Send
          </Button>
        </form>
      </div>
    </Modal>
  );
};
