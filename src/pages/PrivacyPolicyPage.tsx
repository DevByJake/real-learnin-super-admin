import React, { useState } from "react";
import {
  ShieldCheck,
  Edit3,
  Eye,
  Save,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import Tiptap from "../components/ui/Tiptap";

const DEFAULT_PRIVACY_HTML = `
<h2>1. Information We Collect</h2>
<p>Real Learning collects minimal personal information necessary to deliver AI simulation training and enterprise administration:</p>
<ul>
  <li><strong>Account Data:</strong> Name, professional email address, account type, and assigned organization.</li>
  <li><strong>Simulation & Learning Records:</strong> Scenario completion transcripts, scores, competencies feedback, and module completion timestamps.</li>
  <li><strong>Technical Telemetry:</strong> IP addresses, browser fingerprint, session duration, and device characteristics for security auditing.</li>
</ul>

<h2>2. How Data is Processed & AI Governance</h2>
<p>All conversational interaction during workplace simulation scenarios is processed through dedicated enterprise GenAI API endpoints (Google Gemini Enterprise).</p>
<blockquote>Your organization's simulation transcripts and custom prompts are stored within isolated tenant storage and are never retained by third-party model providers for model training.</blockquote>

<h2>3. Data Retention & Deletion Rights</h2>
<p>Super Administrators can export or request complete purging of learner profiles, organization records, and simulation logs at any time. Accounts marked as 'Deactivated' are permanently archived according to GDPR Article 17 right-to-be-forgotten standards.</p>
`;

export const PrivacyPolicyPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [content, setContent] = useState(() => {
    return (
      localStorage.getItem("privacy_policy_content") || DEFAULT_PRIVACY_HTML
    );
  });

  const handleSave = () => {
    localStorage.setItem("privacy_policy_content", content);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm("Reset Privacy Policy to default content?")) {
      setContent(DEFAULT_PRIVACY_HTML);
      localStorage.removeItem("privacy_policy_content");
    }
  };

  return (
    <div className="space-y-6  mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#171923] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
              Privacy Policy Editor
            </h1>
            <Badge variant="success" size="sm">
              GDPR & CCPA Compliant
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Edit and publish data protection standards, learner privacy, and AI
            infrastructure governance policy using Tiptap Editor.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={
              isEditing ? (
                <Eye className="w-3.5 h-3.5" />
              ) : (
                <Edit3 className="w-3.5 h-3.5" />
              )
            }
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Preview Document" : "Edit Content"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-[#F87171]" />}
            onClick={handleReset}
          >
            Reset
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Save className="w-3.5 h-3.5" />}
            onClick={handleSave}
          >
            Save Policy
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-[#34D399]/10 border border-[#34D399]/30 rounded-xl flex items-center gap-2.5 text-xs text-[#34D399] font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
          <span>Privacy Policy content updated and saved successfully!</span>
        </div>
      )}

      {/* Editor vs Preview Mode */}
      {isEditing ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#94A3B8] px-1">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-[#FB923C]">
              Tiptap Rich-Text Policy Editor
            </span>
            <span>Live Editing Enabled</span>
          </div>
          <Tiptap
            content={content}
            setContent={setContent}
            placeholder="Write privacy policy content..."
          />
        </div>
      ) : (
        <Card className="bg-[#12131C] border border-[#171923]">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-[#F8FAFC] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FB923C]" />
              Published Privacy Policy Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-invert max-w-none text-xs text-[#CBD5E1] space-y-3"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
