import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const COLORS = {
  ink: "#181A24",
  inkSoft: "#565A6E",
  hint: "#8B8FA3",
  paper: "#FFFFFF",
  backdrop: "#EEF0F4",
  hairline: "#E4E6ED",
  navy: "#22305C",
  navyTint: "#EBEFF7",
  alert: "#A3232F",
  alertTint: "#FBEAEC",
};

function initials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function EmergencyPage() {
  const { publicId } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/public/${publicId}`)
      .then((res) => setProfile(res.data.profile))
      .catch((err) => setError(err.response?.data?.error || "This profile could not be found."))
      .finally(() => setLoading(false));
  }, [publicId]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100, fontFamily: "sans-serif", color: COLORS.inkSoft }}>
        Loading emergency profile...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ textAlign: "center", marginTop: 100, fontFamily: "sans-serif", color: COLORS.alert }}>
        {error || "Profile not found."}
      </div>
    );
  }

  return (
    <div style={{ background: COLORS.backdrop, minHeight: "100vh", padding: "40px 16px 60px", fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif" }}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 0 18px", fontSize: 12.5, color: COLORS.inkSoft }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3E8A5C", boxShadow: "0 0 0 4px rgba(62,138,92,0.15)" }}></span>
          Verified emergency profile
        </div>

        <div style={{ position: "relative", background: COLORS.paper, borderRadius: 22, boxShadow: "0 1px 2px rgba(20,25,45,0.04), 0 12px 32px rgba(20,25,45,0.08)", paddingTop: 34, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", width: 14, height: 14, borderRadius: "50%", background: COLORS.backdrop, boxShadow: "inset 0 1px 2px rgba(0,0,0,0.12)" }}></div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "6px 26px 22px", borderBottom: `1px solid ${COLORS.hairline}` }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: COLORS.navyTint, color: COLORS.navy, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 600, flexShrink: 0 }}>
              {initials(profile.fullName)}
            </div>
            <div>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 21, fontWeight: 700, margin: "0 0 2px" }}>{profile.fullName}</p>
              <p style={{ fontSize: 13, color: COLORS.inkSoft, margin: 0 }}>
                {profile.age ? `${profile.age} years` : ""}{profile.age && profile.gender ? " · " : ""}{profile.gender || ""}
              </p>
            </div>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "#3E8A5C", background: "#EAF5EE", padding: "5px 10px", borderRadius: 20, fontWeight: 600, whiteSpace: "nowrap" }}>MediScan</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <div style={{ padding: "18px 24px", background: COLORS.navy }}>
              <p style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.72)", margin: "0 0 6px", fontWeight: 600 }}>Blood group</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>{profile.bloodGroup || "Unknown"}</p>
            </div>
            <div style={{ padding: "18px 24px", background: COLORS.alert, borderLeft: "1px solid rgba(255,255,255,0.14)" }}>
              <p style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.72)", margin: "0 0 6px", fontWeight: 600 }}>Allergies</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>
                {profile.allergies && profile.allergies.length ? profile.allergies.join(", ") : "None known"}
              </p>
            </div>
          </div>

          {profile.aiSummary && (
            <div style={{ padding: "22px 26px", borderBottom: `1px solid ${COLORS.hairline}` }}>
              <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.hint, fontWeight: 700, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
                Clinical summary
                <span style={{ background: COLORS.navyTint, color: COLORS.navy, fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>AI generated</span>
              </p>
              <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 15, lineHeight: 1.6, margin: 0 }}>"{profile.aiSummary}"</p>
            </div>
          )}

          {((profile.conditions && profile.conditions.length) || (profile.medications && profile.medications.length)) && (
            <div style={{ padding: "22px 26px", borderBottom: `1px solid ${COLORS.hairline}` }}>
              <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.hint, fontWeight: 700, margin: "0 0 12px" }}>Conditions & medications</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {profile.conditions && profile.conditions.map((c, i) => (
                  <span key={"c" + i} style={{ fontSize: 13, padding: "7px 13px", borderRadius: 20, background: COLORS.navyTint, color: COLORS.navy, fontWeight: 600 }}>{c}</span>
                ))}
                {profile.medications && profile.medications.map((m, i) => (
                  <span key={"m" + i} style={{ fontSize: 13, padding: "7px 13px", borderRadius: 20, background: COLORS.navyTint, color: COLORS.navy, fontWeight: 600 }}>{m}</span>
                ))}
              </div>
            </div>
          )}

          {profile.emergencyContacts && profile.emergencyContacts.length > 0 && (
            <div style={{ padding: "22px 26px", borderBottom: `1px solid ${COLORS.hairline}` }}>
              <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.hint, fontWeight: 700, margin: "0 0 12px" }}>Emergency contacts</p>
              {profile.emergencyContacts.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderTop: i > 0 ? `1px solid ${COLORS.hairline}` : "none" }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, margin: "0 0 2px" }}>{c.name}</p>
                    <p style={{ fontSize: 12.5, color: COLORS.inkSoft, margin: 0 }}>{c.relation}</p>
                  </div>
                  <a href={`tel:${c.phone}`} style={{ background: COLORS.navy, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, padding: "9px 16px", borderRadius: 20, textDecoration: "none" }}>
                    Call
                  </a>
                </div>
              ))}
            </div>
          )}

          <div style={{ padding: "22px 26px" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.hint, fontWeight: 700, margin: "0 0 12px" }}>Additional information</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 18px" }}>
              {profile.preferredHospital && (
                <div>
                  <p style={{ fontSize: 11, color: COLORS.hint, margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Preferred hospital</p>
                  <p style={{ fontSize: 14, margin: 0, fontWeight: 600 }}>{profile.preferredHospital}</p>
                </div>
              )}
              {profile.insuranceProvider && (
                <div>
                  <p style={{ fontSize: 11, color: COLORS.hint, margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Insurance</p>
                  <p style={{ fontSize: 14, margin: 0, fontWeight: 600 }}>{profile.insuranceProvider} {profile.insuranceNumber ? `· ${profile.insuranceNumber}` : ""}</p>
                </div>
              )}
              <div>
                <p style={{ fontSize: 11, color: COLORS.hint, margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Organ donor</p>
                <p style={{ fontSize: 14, margin: 0, fontWeight: 600 }}>{profile.organDonor ? "Yes" : "Not specified"}</p>
              </div>
            </div>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 11.5, color: COLORS.hint, padding: "20px 30px 0", lineHeight: 1.6 }}>
          This profile is shown for emergency use only.
        </p>
      </div>
    </div>
  );
}

export default EmergencyPage;
