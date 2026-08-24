import React from "react";
import {
  Scale,
  Building2,
  Shield,
  Globe,
  Cpu,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

export const LegalInformationPage: React.FC = () => {
  return (
    <div className="space-y-6  mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#171923] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
              Legal Information & Regulatory Compliance
            </h1>
            <Badge variant="outline" size="sm">
              SOC2 Type II Certified
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Corporate disclosures, AI ethical governance guidelines, and
            subprocessor directory.
          </p>
        </div>
      </div>

      {/* Corporate Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-[#12131C] border border-[#171923]">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[#F8FAFC]">
              <Building2 className="w-4 h-4 text-[#FB923C]" />
              Corporate Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-[#CBD5E1]">
            <p className="flex justify-between border-b border-[#171923] pb-1.5">
              <span className="text-[#94A3B8]">Entity Name:</span>
              <span className="font-semibold text-[#F8FAFC]">
                Real Learning Technologies Inc.
              </span>
            </p>
            <p className="flex justify-between border-b border-[#171923] pb-1.5">
              <span className="text-[#94A3B8]">Registration Jurisdiction:</span>
              <span className="font-medium text-[#F8FAFC]">
                Delaware, USA (File #7842910)
              </span>
            </p>
            <p className="flex justify-between border-b border-[#171923] pb-1.5">
              <span className="text-[#94A3B8]">Global DPO Contact:</span>
              <span className="font-mono text-[#FB923C]">
                legal@real-learning.io
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#12131C] border border-[#171923]">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[#F8FAFC]">
              <Cpu className="w-4 h-4 text-[#34D399]" />
              AI Ethics & Safety Standard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-[#CBD5E1]">
            <p className="flex justify-between border-b border-[#171923] pb-1.5">
              <span className="text-[#94A3B8]">AI Model Partner:</span>
              <span className="font-semibold text-[#F8FAFC]">
                Google Cloud Vertex AI
              </span>
            </p>
            <p className="flex justify-between border-b border-[#171923] pb-1.5">
              <span className="text-[#94A3B8]">Safety Filters:</span>
              <span className="font-medium text-[#34D399]">
                Strict Anti-Bias & Moderation
              </span>
            </p>
            <p className="flex justify-between border-b border-[#171923] pb-1.5">
              <span className="text-[#94A3B8]">Audit Frequency:</span>
              <span className="font-medium text-[#F8FAFC]">
                Quarterly Third-Party Review
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subprocessor Directory */}
      <Card className="bg-[#12131C] border border-[#171923]">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[#F8FAFC]">
            <Globe className="w-4 h-4 text-[#38BDF8]" />
            Authorized Subprocessors
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#171923] text-[10px] text-[#94A3B8] uppercase">
                  <th className="py-2.5 px-3">Subprocessor Name</th>
                  <th className="py-2.5 px-3">Service Provided</th>
                  <th className="py-2.5 px-3">Data Location</th>
                  <th className="py-2.5 px-3">Security Standards</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171923] text-[#CBD5E1]">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-[#F8FAFC]">
                    Google Cloud Platform
                  </td>
                  <td className="py-2.5 px-3">
                    Cloud Infrastructure & GenAI API
                  </td>
                  <td className="py-2.5 px-3">US / EU Regions</td>
                  <td className="py-2.5 px-3 text-[#34D399]">
                    SOC2 Type II, ISO 27001
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-[#F8FAFC]">
                    Cloudflare Inc.
                  </td>
                  <td className="py-2.5 px-3">
                    Edge Network & DDoS Protection
                  </td>
                  <td className="py-2.5 px-3">Global Anycast</td>
                  <td className="py-2.5 px-3 text-[#34D399]">
                    PCI-DSS, ISO 27001
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
