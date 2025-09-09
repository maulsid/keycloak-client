import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyInvitationPublic } from "../../components/api/api";

import type { VerifyInviteResponse } from "../../types";
import dayjs from "dayjs";
import { useAuth } from "../../context/CognitoAuth";

export default function InviteAcceptPage() {
  const [sp] = useSearchParams();
  const token = sp.get("token") ?? "";
  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState<VerifyInviteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const auth = useAuth();

  const expires = useMemo(
    () => (invite?.expires_at ? dayjs(invite.expires_at).format("YYYY-MM-DD HH:mm") : ""),
    [invite]
  );

  useEffect(() => {
    if (!token) {
      setError("Missing token.");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const data = await verifyInvitationPublic(token);
        setInvite(data);
      } catch (e: any) {
        setError(e.message || "Invalid or expired invitation.");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const goSignup = () => {
    // If your login builder supports screen_hint, pass it to show Hosted UI Sign Up
    sessionStorage.setItem("invite_token", token);
    auth.signup();
  };

  if (loading) return <div className="p-6">Verifying invitation…</div>;
  if (error)
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-2">Invitation Error</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">You’re invited</h1>

      <div className="rounded border p-4 space-y-1 bg-gray-50">
        <div><span className="font-medium">Email:</span> {invite?.email}</div>
        <div><span className="font-medium">Role ID:</span> {invite?.role_id}</div>
        <div><span className="font-medium">Organization ID:</span> {invite?.organization_id}</div>
        <div><span className="font-medium">Status:</span> {invite?.status}</div>
        <div><span className="font-medium">Expires:</span> {expires}</div>
      </div>

      <p className="text-sm text-gray-600">
        Continue to sign up with the email shown above. After you confirm, your access will be linked automatically.
      </p>

      <div className="flex gap-3">
        <button className="px-4 py-2 rounded bg-black text-white" onClick={goSignup}>
          Continue to Sign Up
        </button>
        <button className="px-4 py-2 rounded border" onClick={() => navigate("/login")}>
          I already have an account
        </button>
      </div>
    </div>
  );
}
