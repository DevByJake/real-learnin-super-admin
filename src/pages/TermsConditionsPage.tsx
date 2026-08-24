import React, { useState } from "react";
import {
  FileText,
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

const DEFAULT_TERMS_HTML = `
<h2>1. Acceptance & Scope of License</h2>
<p>By accessing or managing the Real Learning Super Admin Dashboard, you agree to comply with this Master Service Agreement. This software provides AI-driven workplace simulation training, competency evaluation, and organization seat management.</p>

<h2>2. Administrator Responsibilities & Credentials</h2>
<p>Super Administrators are granted root-level governance privileges. Administrators must maintain credential confidentiality and enforce hardware-based Two-Factor Authentication (2FA). Unapproved sharing of root tokens or administrative sessions is strictly prohibited.</p>

<h2>3. Service Level Agreement (SLA) & Availability</h2>
<p>Real Learning guarantees a 99.9% uptime for AI simulation inference engines and administration services. Planned maintenance windows are communicated at least 48 hours in advance via the Super Admin notification feed.</p>

<h2>4. Intellectual Property & AI Persona Content</h2>
<p>All scenario structures, proprietary character personas, assessment rubrics, and platform code remain the exclusive intellectual property of Real Learning Inc. Enterprise custom scenarios built by clients remain owned by the respective organization.</p>
`;

export const TermsConditionsPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [content, setContent] = useState(() => {
    return (
      localStorage.getItem("terms_conditions_content") || DEFAULT_TERMS_HTML
    );
  });

  const handleSave = () => {
    localStorage.setItem("terms_conditions_content", content);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm("Reset Terms & Conditions to default content?")) {
      setContent(DEFAULT_TERMS_HTML);
      localStorage.removeItem("terms_conditions_content");
    }
  };

  return (
    <div className="space-y-6  mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#171923] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
              Terms & Conditions Editor
            </h1>
            <Badge variant="brand" size="sm">
              Enterprise SLA 99.9%
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Edit Master Service Agreement, administrator credential rules, and
            SLA commitments using Tiptap Editor.
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
            Save Terms
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-[#34D399]/10 border border-[#34D399]/30 rounded-xl flex items-center gap-2.5 text-xs text-[#34D399] font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
          <span>
            Terms & Conditions content updated and saved successfully!
          </span>
        </div>
      )}

      {/* Editor vs Preview Mode */}
      {isEditing ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#94A3B8] px-1">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-[#FB923C]">
              Tiptap Rich-Text Terms Editor
            </span>
            <span>Live Editing Enabled</span>
          </div>
          <Tiptap
            content={content}
            setContent={setContent}
            placeholder="Write terms & conditions content..."
          />
        </div>
      ) : (
        <Card className="bg-[#12131C] border border-[#171923]">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-[#F8FAFC] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#FB923C]" />
              Published Master Terms Preview
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
