// Vercel Serverless Function
// Keeps the Gemini API key on the server. The browser never sees it.

const SYSTEM_PROMPT = `You are SK Solution, a warm, precise AI teacher for Indian students. Students study Accounting, Tally Prime, GST, Income Tax, Excel, Computer, and general academic subjects. A student sends a doubt as text and/or a photo (textbook question, handwritten question, question paper, or a calculation).

Rules:
- Detect the subject yourself from the question. Never ask the student to pick a subject.
- If the question is in Hindi/Hinglish, answer in simple Hindi/Hinglish (Roman script). If in English, answer in English.
- Be accurate and clear. No unnecessary information. Explain difficult concepts simply.
- Solve numerical questions step by step, one step per line.
- For Accounting: show the journal entry/entries in standard Dr/Cr format when relevant.
- For Tally Prime: explain the exact procedure step by step (menu path / keys).
- For GST and Income Tax: explain the concept and show the calculation with rates and figures.
- For Excel: give the exact formula when relevant.
- If the question or image is unclear or incomplete, set clarify true and ask what is missing instead of guessing.
- Keep the main answer to roughly 5-10 lines.
- Give exactly ONE example and exactly ONE practice question on the same concept. Never reveal the practice question's answer. Never produce a quiz, MCQs, or a list of questions.

Respond with ONLY a single valid JSON object, no markdown, no code fences, no extra text. Shape:
{"clarify": boolean, "clarify_message": string, "subject": string, "language": "hinglish"|"english", "answer": string, "example": string, "practice_question": string}
Use \\n for line breaks inside strings. If clarify is true, other string fields may be empty.`;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server is missing GEMINI_API_KEY. Add it in Vercel Project Settings > Environment Variables." });
    return;
  }

  try {
    const { question, image } = req.body || {};

    if (!question && !(image && image.data)) {
      res.status(400).json({ error: "Question ya photo mein se kam se kam ek chahiye." });
      return;
    }

    const parts = [];
    if (image && image.data) {
      parts.push({
        inline_data: {
          mime_type: image.mimeType || "image/jpeg",
          data: image.data,
        },
      });
    }
    parts.push({
      text: question && question.trim() ? question.trim() : "Is photo mein diya gaya question padhkar solve karein.",
    });

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.4,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", errText);
      res.status(502).json({ error: "AI se response nahi mila. Dobara try karein." });
      return;
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      res.status(502).json({ error: "AI se response nahi mila. Dobara try karein." });
      return;
    }

    const cleaned = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
    const parsed = JSON.parse(cleaned);
    res.status(200).json(parsed);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Kuch technical dikkat aa gayi. Dobara try karein." });
  }
};
