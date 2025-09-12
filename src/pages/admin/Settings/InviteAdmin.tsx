import { useEffect, useState } from "react";
import Header from "../../../components/common/Header";
import { useAuth } from "../../../context/CognitoAuth";
import type { InviteResponse } from "../../../types";
import { createInvitationExisting } from "../../../components/api/api";
import { FaCheckCircle, FaCopy, FaExclamationTriangle, FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";

const ADMIN_ROLE_ID = Number(import.meta.env.VITE_ADMIN_ROLE_ID ?? 7);

export default function InviteAdmin() {
  const { token, orgId, customerId } = useAuth(); // <- orgId now comes from ID token
  const [email, setEmail] = useState("");
  const [ttlDays, setTtlDays] = useState<number>(14);

  // Optional: if you later want to show org name, fetch it here from a small /me or /orgs/:id
  const [orgName] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [invite, setInvite] = useState<InviteResponse | null>(null);

  useEffect(() => {
    // Friendly message if orgId missing (e.g., claims not injected yet)
    if (!orgId) {
      setError(
        "Your account has no organization assigned. Please contact support to set your organization before inviting admins."
      );
    } else {
      setError("");
    }
     if (!customerId) {
      setError(
        "Your account has no customerId assigned. Please contact support to set your organization before inviting admins."
      );
    } else {
      setError("");
    }
  }, [orgId, customerId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInvite(null);

    if (!token) {
      setError("No authentication token found.");
      return;
    }
    if (!orgId) {
      setError("Organization could not be determined from your sign-in.");
      return;
    }
    if (!email) {
      setError("Please enter the admin's email.");
      return;
    }

    try {
      setSubmitting(true);

      // Backend should validate org from the ID token;
      // We pass organization_id for clarity, but DO NOT send customer_id.
      const payload = {
        organization_id: Number(orgId),
        customer_id: Number(customerId),
        email,
        role_id: ADMIN_ROLE_ID,
        ttl_days: ttlDays,
      };

      const resp = await createInvitationExisting(token, payload as any);
      setInvite(resp);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to send invite.");
    } finally {
      setSubmitting(false);
    }
  };

  const copy = () => {
    if (invite?.invite_link) navigator.clipboard.writeText(invite.invite_link);
  };

  // Success screen
  if (invite) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Invite Admin" showBackButton backLink="/admin/settings" />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <FaCheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold">Invitation Sent</h2>
            <p className="text-gray-600 mt-2">You can also copy the invite link:</p>
            <div className="mt-4 flex items-center gap-2">
              <input className="flex-1 px-3 py-2 border rounded" value={invite.invite_link} readOnly />
              <button onClick={copy} className="px-3 py-2 rounded border inline-flex items-center">
                <FaCopy className="mr-2" /> Copy
              </button>
            </div>
            <div className="mt-6">
              <Link
                to="/admin/settings"
                className="inline-flex items-center px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Back to Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Invite Admin" showBackButton backLink="/admin/settings" />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Send Admin Invitation</h2>
            <p className="text-sm text-gray-500">
              We’ll invite an admin to your organization. Your organization is taken from your sign-in.
            </p>
          </div>

          <form onSubmit={submit} className="px-6 py-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <FaExclamationTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            <div className="text-sm text-gray-700">
              <div className="font-medium mb-1">Organization</div>
              <div className="rounded border p-3 bg-gray-50">
                <div>
                  <span className="text-gray-500 mr-1">Name:</span>
                  {orgName || "—"}
                </div>
                <div>
                  <span className="text-gray-500 mr-1">ID:</span>
                  {orgId ?? "—"}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This page uses your ID token claim (<code>org_id</code>). No customer selection needed.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                The invitation link will be sent to this address.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link expires in (days)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                className="w-full px-3 py-2 border rounded-md"
                value={ttlDays}
                onChange={(e) => setTtlDays(Number(e.target.value) || 14)}
              />
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                disabled={submitting || !token || !orgId || !customerId}
                className="inline-flex items-center px-6 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Sending…
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="h-4 w-4 mr-2" />
                    Send Invite
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
