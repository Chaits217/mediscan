import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const NAVY = "#22305C";
const BACKDROP = "#F4F5F7";
const HAIRLINE = "#E4E6ED";
const INK = "#181A24";
const INK_SOFT = "#565A6E";

function EditProfile() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "", age: "", gender: "Male", bloodGroup: "Unknown",
    allergies: "", conditions: "", medications: "", organDonor: false,
    preferredHospital: "", insuranceProvider: "", insuranceNumber: "",
    contactName: "", contactRelation: "", contactPhone: "",
  });

  useEffect(() => {
    api.get("/profile/me").then((res) => {
      const p = res.data.profile;
      const contact = (p.emergencyContacts && p.emergencyContacts[0]) || {};
      setForm({
        fullName: p.fullName || "", age: p.age || "", gender: p.gender || "Male",
        bloodGroup: p.bloodGroup || "Unknown",
        allergies: (p.allergies || []).join(", "),
        conditions: (p.conditions || []).join(", "),
        medications: (p.medications || []).join(", "),
        organDonor: !!p.organDonor,
        preferredHospital: p.preferredHospital || "",
        insuranceProvider: p.insuranceProvider || "",
        insuranceNumber: p.insuranceNumber || "",
        contactName: contact.name || "", contactRelation: contact.relation || "", contactPhone: contact.phone || "",
      });
    }).catch(() => setError("Could not load your profile.")).finally(() => setLoading(false));
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.put("/profile", {
        fullName: form.fullName,
        age: Number(form.age) || undefined,
        gender: form.gender,
        bloodGroup: form.bloodGroup,
        allergies: form.allergies.split(",").map((s) => s.trim()).filter(Boolean),
        conditions: form.conditions.split(",").map((s) => s.trim()).filter(Boolean),
        medications: form.medications.split(",").map((s) => s.trim()).filter(Boolean),
        organDonor: form.organDonor,
        preferredHospital: form.preferredHospital,
        insuranceProvider: form.insuranceProvider,
        insuranceNumber: form.insuranceNumber,
        emergencyContacts: form.contactName ? [{ name: form.contactName, relation: form.contactRelation, phone: form.contactPhone }] : [],
      });
      navigate("/dashboard");
    } catch (err) {
      setError((err.response && err.response.data && err.response.data.error) || "Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  const pageStyle = { minHeight: "100vh", background: BACKDROP, fontFamily: "sans-serif" };
  const headerStyle = { background: "#fff", borderBottom: "1px solid " + HAIRLINE };
  const headerWrapStyle = { maxWidth: 560, margin: "0 auto", padding: "20px 24px", textAlign: "left" };
  const backLinkStyle = { color: INK_SOFT, fontSize: 13, textDecoration: "none" };
  const titleStyle = { fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, margin: "8px 0 0", color: INK };
  const contentStyle = { maxWidth: 560, margin: "0 auto", padding: "28px 24px 60px" };
  const cardStyle = { background: "#fff", borderRadius: 16, border: "1px solid " + HAIRLINE, padding: "28px 28px 8px" };
  const sectionLabelStyle = { fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: INK_SOFT, fontWeight: 700, margin: "0 0 16px" };
  const labelStyle = { display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: INK };
  const inputStyle = { width: "100%", padding: "10px 12px", marginBottom: 18, border: "1px solid " + HAIRLINE, borderRadius: 8, fontFamily: "sans-serif", fontSize: 14, boxSizing: "border-box", background: BACKDROP };
  const rowStyle = { display: "flex", gap: 12 };
  const halfStyle = { flex: 1 };
  const dividerStyle = { border: "none", borderTop: "1px solid " + HAIRLINE, margin: "8px 0 22px" };
  const checkboxRowStyle = { display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 13, fontWeight: 600, color: INK };
  const saveBtnStyle = { width: "100%", padding: 13, background: NAVY, color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 8, marginBottom: 24, boxShadow: "0 4px 12px rgba(34,48,92,0.2)" };
  const errorStyle = { color: "#A3232F", fontSize: 13, marginBottom: 14, marginTop: -8 };

  if (loading) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", color: INK_SOFT }}>Loading your profile...</div>;
  }

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div style={headerWrapStyle}>
          <a href="/dashboard" style={backLinkStyle}>Back to dashboard</a>
          <h1 style={titleStyle}>Edit your emergency profile</h1>
        </div>
      </div>

      <div style={contentStyle}>
        <form onSubmit={handleSubmit}>
          <div style={cardStyle}>
            <p style={sectionLabelStyle}>Basic details</p>

            <label style={labelStyle}>Full name</label>
            <input style={inputStyle} value={form.fullName} onChange={(e) => update("fullName", e.target.value)} required />

            <div style={rowStyle}>
              <div style={halfStyle}>
                <label style={labelStyle}>Age</label>
                <input style={inputStyle} type="number" value={form.age} onChange={(e) => update("age", e.target.value)} />
              </div>
              <div style={halfStyle}>
                <label style={labelStyle}>Gender</label>
                <select style={inputStyle} value={form.gender} onChange={(e) => update("gender", e.target.value)}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <label style={labelStyle}>Blood group</label>
            <select style={inputStyle} value={form.bloodGroup} onChange={(e) => update("bloodGroup", e.target.value)}>
              {["Unknown", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => <option key={bg}>{bg}</option>)}
            </select>

            <hr style={dividerStyle} />
            <p style={sectionLabelStyle}>Medical information</p>

            <label style={labelStyle}>Allergies (comma separated)</label>
            <input style={inputStyle} value={form.allergies} onChange={(e) => update("allergies", e.target.value)} placeholder="Penicillin, Peanuts" />

            <label style={labelStyle}>Chronic conditions (comma separated)</label>
            <input style={inputStyle} value={form.conditions} onChange={(e) => update("conditions", e.target.value)} placeholder="Type 2 Diabetes, Asthma" />

            <label style={labelStyle}>Current medications (comma separated)</label>
            <input style={inputStyle} value={form.medications} onChange={(e) => update("medications", e.target.value)} placeholder="Metformin 500mg" />

            <label style={checkboxRowStyle}>
              <input type="checkbox" checked={form.organDonor} onChange={(e) => update("organDonor", e.target.checked)} />
              Organ donor
            </label>

            <hr style={dividerStyle} />
            <p style={sectionLabelStyle}>Hospital and insurance</p>

            <label style={labelStyle}>Preferred hospital</label>
            <input style={inputStyle} value={form.preferredHospital} onChange={(e) => update("preferredHospital", e.target.value)} />

            <div style={rowStyle}>
              <div style={halfStyle}>
                <label style={labelStyle}>Insurance provider</label>
                <input style={inputStyle} value={form.insuranceProvider} onChange={(e) => update("insuranceProvider", e.target.value)} />
              </div>
              <div style={halfStyle}>
                <label style={labelStyle}>Insurance number</label>
                <input style={inputStyle} value={form.insuranceNumber} onChange={(e) => update("insuranceNumber", e.target.value)} />
              </div>
            </div>

            <hr style={dividerStyle} />
            <p style={sectionLabelStyle}>Primary emergency contact</p>

            <label style={labelStyle}>Name</label>
            <input style={inputStyle} value={form.contactName} onChange={(e) => update("contactName", e.target.value)} />

            <label style={labelStyle}>Relation</label>
            <input style={inputStyle} value={form.contactRelation} onChange={(e) => update("contactRelation", e.target.value)} placeholder="Wife, Father, Friend" />

            <label style={labelStyle}>Phone</label>
            <input style={inputStyle} value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} />
          </div>

          {error && <p style={errorStyle}>{error}</p>}

          <button type="submit" disabled={saving} style={saveBtnStyle}>{saving ? "Saving..." : "Save changes"}</button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;


