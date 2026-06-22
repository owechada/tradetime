import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  sendPromotionalEmail,
  sendBulkEmail,
  previewEmail,
} from "../../services/admin";
import {
  FaEnvelope,
  FaPaperPlane,
  FaEye,
  FaHistory,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import Spinner from "../../components/generic/Spinner";

type EmailMode = "promotional" | "bulk";
type Tab = "compose" | "preview" | "history";

interface EmailFormData {
  subject: string;
  content: string;
  ctaText: string;
  ctaLink: string;
  segment: "all" | "active_subscribers" | "trial_users" | "expired_subscribers";
  emails: string;
}

interface CampaignResult {
  message: string;
  totalUsers?: number;
  totalEmails?: number;
  successCount: number;
  failCount: number;
  segment?: string;
  failedEmails?: string[];
  timestamp: string;
}

const EmailMarketing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("compose");
  const [emailMode, setEmailMode] = useState<EmailMode>("promotional");
  const [loading, setLoading] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [campaignHistory, setCampaignHistory] = useState<CampaignResult[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [formData, setFormData] = useState<EmailFormData>({
    subject: "",
    content: "",
    ctaText: "",
    ctaLink: "",
    segment: "all",
    emails: "",
  });

  const segmentOptions = [
    { value: "all", label: "All Registered Users", icon: FaUsers },
    { value: "active_subscribers", label: "Active Subscribers", icon: FaCheckCircle },
    { value: "trial_users", label: "Trial Users", icon: FaExclamationTriangle },
    { value: "expired_subscribers", label: "Expired Subscribers", icon: FaTimesCircle },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.subject.trim()) {
      toast.error("Subject is required");
      return false;
    }
    if (!formData.content.trim()) {
      toast.error("Email content is required");
      return false;
    }
    if (!formData.ctaText.trim()) {
      toast.error("CTA text is required");
      return false;
    }
    if (!formData.ctaLink.trim()) {
      toast.error("CTA link is required");
      return false;
    }
    if (emailMode === "bulk") {
      const emails = formData.emails
        .split(",")
        .map((e) => e.trim())
        .filter((e) => e);
      if (emails.length === 0) {
        toast.error("At least one email address is required");
        return false;
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const invalidEmails = emails.filter((e) => !emailRegex.test(e));
      if (invalidEmails.length > 0) {
        toast.error(`Invalid email addresses: ${invalidEmails.join(", ")}`);
        return false;
      }
    }
    return true;
  };

  const handlePreview = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await previewEmail({
        subject: formData.subject,
        content: formData.content,
        ctaText: formData.ctaText,
        ctaLink: formData.ctaLink,
      });
      setPreviewHtml(result.html);
      setActiveTab("preview");
      toast.success("Preview generated successfully");
    } catch (error: any) {
      toast.error(error || "Failed to generate preview");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!validateForm()) return;

    setShowConfirmDialog(false);
    setLoading(true);

    try {
      let result;
      if (emailMode === "promotional") {
        result = await sendPromotionalEmail({
          subject: formData.subject,
          content: formData.content,
          ctaText: formData.ctaText,
          ctaLink: formData.ctaLink,
          segment: formData.segment,
        });
      } else {
        const emails = formData.emails
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e);
        result = await sendBulkEmail({
          subject: formData.subject,
          content: formData.content,
          ctaText: formData.ctaText,
          ctaLink: formData.ctaLink,
          emails,
        });
      }

      // Add to campaign history
      const campaign: CampaignResult = {
        ...result,
        timestamp: new Date().toISOString(),
      };
      setCampaignHistory((prev) => [campaign, ...prev]);

      toast.success(
        `Email campaign completed! Sent to ${result.successCount} recipients`
      );

      // Reset form
      setFormData({
        subject: "",
        content: "",
        ctaText: "",
        ctaLink: "",
        segment: "all",
        emails: "",
      });
      setPreviewHtml("");
      setActiveTab("history");
    } catch (error: any) {
      toast.error(error || "Failed to send email campaign");
    } finally {
      setLoading(false);
    }
  };

  const renderComposeTab = () => (
    <div className="space-y-6">
      {/* Email Mode Toggle */}
      <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
        <button
          onClick={() => setEmailMode("promotional")}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            emailMode === "promotional"
              ? "bg-primary text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FaUsers className="inline mr-2" />
          Promotional Email
        </button>
        <button
          onClick={() => setEmailMode("bulk")}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            emailMode === "bulk"
              ? "bg-primary text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FaEnvelope className="inline mr-2" />
          Bulk Email
        </button>
      </div>

      {/* Email Form */}
      <div className="space-y-4">
        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="e.g., Special Offer - 20% Off Premium Plans"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Content (HTML) *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={8}
            placeholder="<p>Dear Trader,</p><p>Get 20% off on all premium plans this week only!</p>"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            You can use HTML tags for formatting
          </p>
        </div>

        {/* CTA Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Call-to-Action Text *
          </label>
          <input
            type="text"
            name="ctaText"
            value={formData.ctaText}
            onChange={handleInputChange}
            placeholder="e.g., Claim Offer"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* CTA Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Call-to-Action Link *
          </label>
          <input
            type="url"
            name="ctaLink"
            value={formData.ctaLink}
            onChange={handleInputChange}
            placeholder="https://tradetimescanner.com/premium"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Segment Selection (Promotional) or Email List (Bulk) */}
        {emailMode === "promotional" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Segment *
            </label>
            <select
              name="segment"
              value={formData.segment}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {segmentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Addresses (comma-separated) *
            </label>
            <textarea
              name="emails"
              value={formData.emails}
              onChange={handleInputChange}
              rows={4}
              placeholder="user1@example.com, user2@example.com, user3@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handlePreview}
          disabled={loading}
          className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <Spinner loading={true} />
          ) : (
            <>
              <FaEye className="mr-2" />
              Preview Email
            </>
          )}
        </button>
        <button
          onClick={() => setShowConfirmDialog(true)}
          disabled={loading}
          className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <FaPaperPlane className="mr-2" />
          Send Campaign
        </button>
      </div>
    </div>
  );

  const renderPreviewTab = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <FaEye className="inline mr-2" />
          This is how your email will appear to recipients
        </p>
      </div>

      {previewHtml ? (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <iframe
            srcDoc={previewHtml}
            title="Email Preview"
            className="w-full h-[600px] bg-white"
            sandbox="allow-same-origin"
          />
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <FaEye className="mx-auto text-4xl mb-4 opacity-50" />
          <p>No preview available. Click "Preview Email" to generate a preview.</p>
        </div>
      )}
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-4">
      {campaignHistory.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FaHistory className="mx-auto text-4xl mb-4 opacity-50" />
          <p>No campaign history yet. Send your first email campaign!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {campaignHistory.map((campaign, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {campaign.message}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(campaign.timestamp).toLocaleString()}
                  </p>
                </div>
                {campaign.segment && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {segmentOptions.find((s) => s.value === campaign.segment)?.label}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Total Recipients</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {campaign.totalUsers || campaign.totalEmails || 0}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-green-600 mb-1">Successful</p>
                  <p className="text-2xl font-bold text-green-700">
                    {campaign.successCount}
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-xs text-red-600 mb-1">Failed</p>
                  <p className="text-2xl font-bold text-red-700">
                    {campaign.failCount}
                  </p>
                </div>
              </div>

              {campaign.failedEmails && campaign.failedEmails.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-xs text-red-800 font-medium mb-2">
                    Failed Email Addresses:
                  </p>
                  <p className="text-xs text-red-700">
                    {campaign.failedEmails.join(", ")}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Marketing</h1>
        <p className="text-gray-600">
          Send promotional emails to user segments or bulk emails to specific addresses
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("compose")}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "compose"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FaEnvelope className="inline mr-2" />
              Compose
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "preview"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FaEye className="inline mr-2" />
              Preview
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "history"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FaHistory className="inline mr-2" />
              History
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "compose" && renderComposeTab()}
          {activeTab === "preview" && renderPreviewTab()}
          {activeTab === "history" && renderHistoryTab()}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Confirm Email Campaign
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to send this email campaign?
              {emailMode === "promotional" ? (
                <span className="block mt-2 font-medium">
                  Target:{" "}
                  {segmentOptions.find((s) => s.value === formData.segment)?.label}
                </span>
              ) : (
                <span className="block mt-2 font-medium">
                  Recipients:{" "}
                  {formData.emails.split(",").filter((e) => e.trim()).length} email(s)
                </span>
              )}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                className="flex-1 bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Send Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailMarketing;
