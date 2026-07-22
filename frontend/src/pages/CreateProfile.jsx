import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const inputStyle = {
  width: "100%",
  padding: 10,
  marginBottom: 16,
  border: "1px solid #ccc",
  borderRadius: 6,
  fontFamily: "sans-serif",
  fontSize: 14,
};
const labelStyle = { display: "block", marginBottom: 6, fontSize: 14, fontWeight: 600 };

function CreateProfile() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    age: "",
    gender: "Male",
    bloodGroup: "Unknown",
    allergies: "",
    conditions: "",
    medications: "",
    organDonor: false,
    preferredHospital: "",
    insuranceProvider: "",
    insuranceNumber: "",
    contactName: "",
    contactRelation: "",
    contactPhone: "",
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await api.post("/profile", {
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
        emergencyContacts: form.contactName
          ? [{ name: form.contactName, relation: form.contactRelation, phone: form.contactPhone }]
          : [],
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px 60px" }}>
      <h1 style={{ fontSize: 22, marginBottom: 24 }}>Create your emergency profile</h1>

      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Full name</label>
        <input style={inputStyle} value={form.fullName} onChange={(e) => update("fullName", e.target.value)} required />

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Age</label>
            <input style={inputStyle} type="number" value={form.age} onChange={(e) => update("age", e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
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
          {["Unknown", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
            <option key={bg}>{bg}</option>
          ))}
        </select>

        <label style={labelStyle}>Allergies (comma separated)</label>
        <input style={inputStyle} placeholder="Penicillin, Peanuts" value={form.allergies} onChange={(e) => update("allergies", e.target.value)} />

        <label style={labelStyle}>Chronic conditions (comma separated)</label>
        <input style={inputStyle} placeholder="Type 2 Diabetes, Asthma" value={form.conditions} onChange={(e) => update("conditions", e.target.value)} />

        <label style={labelStyle}>Current medications (comma separated)</label>
        <input style={inputStyle} placeholder="Metformin 500mg" value={form.medications} onChange={(e) => update("medications", e.target.value)} />

        <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={form.organDonor} onChange={(e) => update("organDonor", e.target.checked)} />
          Organ donor
        </label>

        <label style={labelStyle}>Preferred hospital</label>
        <input style={inputStyle} value={form.preferredHospital} onChange={(e) => update("preferredHospital", e.target.value)} />

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Insurance provider</label>
            <input style={inputStyle} value={form.insuranceProvider} onChange={(e) => update("insuranceProvider", e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Insurance number</label>
            <input style={inputStyle} value={form.insuranceNumber} onChange={(e) => update("insuranceNumber", e.target.value)} />
          </div>
        </div>

        <h2 style={{ fontSize: 16, marginTop: 8, marginBottom: 12 }}>Primary emergency contact</h2>

        <label style={labelStyle}>Name</label>
        <input style={inputStyle} value={form.contactName} onChange={(e) => update("contactName", e.target.value)} />

        <label style={labelStyle}>Relation</label>
        <input style={inputStyle} placeholder="Wife, Father, Friend..." value={form.contactRelation} onChange={(e) => update("contactRelation", e.target.value)} />

        <label style={labelStyle}>Phone</label>
        <input style={inputStyle} value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} />

        {error && <p style={{ color: "#B3121F", fontSize: 14, marginBottom: 12 }}>{error}</p>}

        <button
          type="submit"
          disabled={saving}
          style={{
            width: "100%",
            padding: 12,
            background: "#22305C",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {saving ? "Saving... (generating AI summary too)" : "Save profile"}
        </button>
      </form>
    </div>
  );
}

export default CreateProfile;