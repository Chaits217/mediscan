const https = require("https");

function buildPrompt(profile) {
  const data = {
    name: profile.fullName,
    age: profile.age,
    gender: profile.gender,
    bloodGroup: profile.bloodGroup,
    allergies: profile.allergies,
    conditions: profile.conditions,
    medications: profile.medications,
    organDonor: profile.organDonor,
    primaryContact: profile.emergencyContacts?.[0]
      ? `${profile.emergencyContacts[0].name} (${profile.emergencyContacts[0].relation})`
      : null,
  };

  return `You are writing a short clinical summary for emergency responders who have just scanned a patient's emergency medical QR code. You will be given the patient's profile data as JSON.

Rules:
- Write exactly one short paragraph (3-4 sentences max).
- Prioritize life-critical information first: allergies, then blood group, then chronic conditions and medications.
- If there is a drug allergy, explicitly warn what to avoid.
- Mention the primary emergency contact by name and relation if provided.
- Use plain clinical language a paramedic would use. No greetings, no headers, no bullet points, no markdown.
- Only use the data given below. Do not invent or assume any medical facts not present in the data.

Patient data:
${JSON.stringify(data, null, 2)}

Write the summary now:`;
}

function generateAiSummary(profile) {
  return new Promise((resolve) => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return resolve(
        "AI summary unavailable - add a GEMINI_API_KEY in your .env file to enable this feature."
      );
    }

    const payload = JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(profile) }] }],
    });

    const options = {
      hostname: "generativelanguage.googleapis.com",
      path: `/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            resolve(text.trim());
          } else {
            console.error("Unexpected AI response:", body);
            resolve("AI summary could not be generated right now.");
          }
        } catch (err) {
          console.error("Failed to parse AI response:", err, body);
          resolve("AI summary could not be generated right now.");
        }
      });
    });

    req.on("error", (err) => {
      console.error("AI request failed:", err.message);
      resolve("AI summary could not be generated right now.");
    });

    req.write(payload);
    req.end();
  });
}

module.exports = generateAiSummary;
