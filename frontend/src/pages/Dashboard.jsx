import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const NAVY = "#22305C";
const BACKDROP = "#F4F5F7";
const HAIRLINE = "#E4E6ED";
const INK = "#181A24";
const INK_SOFT = "#565A6E";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/profile/me").then((res) => {
      setProfile(res.data.profile);
      return api.get("/profile/qr");
    }).then((res) => setQr(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    localStorage.removeItem("mediscan_token");
    navigate("/login");
  }

  if (loading) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", color: INK_SOFT }}>Loading...</div>;
  }

  const headerStyle = { background: "#fff", borderBottom: "1px solid " + HAIRLINE };
  const wrapStyle = { maxWidth: 560, margin: "0 auto", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" };
  const logoutBtnStyle = { background: "none", border: "1px solid " + HAIRLINE, color: INK_SOFT, borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" };
  const pageStyle = { minHeight: "100vh", background: BACKDROP, fontFamily: "sans-serif" };
  const contentStyle = { maxWidth: 560, margin: "0 auto", padding: "32px 24px 60px" };
  const emptyCardStyle = { textAlign: "center", padding: "56px 32px", background: "#fff", borderRadius: 16, border: "1px solid " + HAIRLINE };
  const plusCircleStyle = { width: 56, height: 56, borderRadius: "50%", background: "#EBEFF7", color: NAVY, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 24 };
  const createBtnStyle = { background: NAVY, color: "#fff", border: "none", padding: "13px 28px", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(34,48,92,0.25)" };
  const editBtnStyle = { background: "#fff", border: "1px solid " + NAVY, color: NAVY, borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" };
  const qrCardStyle = { background: "#fff", borderRadius: 16, border: "1px solid " + HAIRLINE, padding: "36px 24px", textAlign: "center" };
  const qrBoxStyle = { display: "inline-block", padding: 16, background: BACKDROP, borderRadius: 12 };
  const downloadBtnStyle = { background: NAVY, color: "#fff", padding: "11px 22px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600, boxShadow: "0 4px 12px rgba(34,48,92,0.2)" };
  const previewBtnStyle = { background: "#fff", border: "1px solid " + HAIRLINE, color: INK, padding: "11px 22px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600 };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div style={wrapStyle}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 700, margin: 0, color: INK }}>MediScan</h1>
          <button onClick={handleLogout} style={logoutBtnStyle}>Log out</button>
        </div>
      </div>

      <div style={contentStyle}>
        {!profile ? (
          <div style={emptyCardStyle}>
            <div style={plusCircleStyle}>+</div>
            <p style={{ fontSize: 16, color: INK, marginBottom: 24, fontWeight: 500 }}>You haven't created your emergency medical profile yet.</p>
            <button onClick={() => navigate("/create-profile")} style={createBtnStyle}>Create my profile</button>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "#3E8A5C", fontWeight: 700, margin: "0 0 4px" }}>Profile active</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: INK, margin: 0, fontFamily: "Georgia, serif" }}>{profile.fullName}</p>
              </div>
              <button onClick={() => navigate("/edit-profile")} style={editBtnStyle}>Edit profile</button>
            </div>

            {qr && (
              <div style={qrCardStyle}>
                <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: INK_SOFT, fontWeight: 700, marginBottom: 20 }}>Your emergency QR code</p>
                <div style={qrBoxStyle}>
                  <img src={qr.qrDataUrl} alt="Your MediScan QR code" style={{ width: 200, height: 200, display: "block" }} />
                </div>
                <p style={{ fontSize: 12.5, color: "#9AA0C0", marginTop: 18, wordBreak: "break-all", padding: "0 20px" }}>{qr.scanUrl}</p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
                  <a href={qr.qrDataUrl} download="mediscan-qr.png" style={downloadBtnStyle}>Download QR code</a>
                  <a href={qr.scanUrl} target="_blank" rel="noreferrer" style={previewBtnStyle}>Preview emergency page</a>
                </div>
                <p style={{ fontSize: 12, color: "#9AA0C0", marginTop: 24, lineHeight: 1.6 }}>Print this and keep it on your phone case, wallet, or a bracelet, anyone can scan it in an emergency, no login needed.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
