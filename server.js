require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
app.use(express.json({ limit: "1mb" }));
// Avoid stale browser/proxy responses while diagnosing the live deployment.
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  next();
});
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/status", (_req, res) => res.json({
  aiConfigured: Boolean(process.env.OPENAI_API_KEY),
  build: "live-ai-check-2026-10-15"
}));

app.post("/api/chat", async (req, res) => {
  const { messages = [], language = "English" } = req.body || {};
  if (!Array.isArray(messages) || !messages.length) return res.status(400).json({ error: "Please enter a message." });
  const apiKey = process.env.OPENAI_API_KEY;
  const last = String(messages[messages.length - 1]?.content || "").slice(0, 6000);
  console.log("[chat] request", JSON.stringify({ keyConfigured: Boolean(apiKey), language, messageCount: messages.length }));
  if (!apiKey) {
    console.warn("[chat] OPENAI_API_KEY is missing on the chat request");
    return res.json({ mode: "demo", reply: demoReply(last, language) });
  }
  try {
    const safeMessages = messages.slice(-16).map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content || "").slice(0, 6000) }));
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4.1-mini", messages: [
        { role: "system", content: `You are M. Cyrille assistance, a friendly and safe multilingual assistant. Reply in ${language} unless asked otherwise. Help with general questions, coding, AI and mathematics. Explain step by step. Do not claim to control devices or have searched the web unless a configured tool did so.` },
        ...safeMessages
      ] })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("[chat] OpenAI API error", response.status, data?.error?.message || "Unknown API error");
      return res.status(response.status).json({ error: data?.error?.message || "AI request failed. Check the server API key, model, and account." });
    }
    console.log("[chat] OpenAI response succeeded");
    return res.json({ mode: "live", reply: data?.choices?.[0]?.message?.content || "I couldn't generate a reply." });
  } catch (error) {
    console.error("[chat] Connection error", error?.message || "Unknown error");
    return res.status(500).json({ error: "Could not contact the AI service. Check the server connection and logs." });
  }
});

function demoReply(message, language) {
  if (language === "Français") {
    if (/bonjour|salut/i.test(message)) return "Bonjour ! Je suis M. Cyrille assistance. Je fonctionne en mode démo. Configurez OPENAI_API_KEY côté serveur pour activer les réponses IA complètes.";
    if (/dériv|math/i.test(message)) return "Exemple : si f(x) = x², alors f'(x) = 2x. Configurez une clé API côté serveur pour obtenir une aide complète.";
    return "Je suis en mode démo : l'interface fonctionne, mais les réponses sont limitées. Ajoutez OPENAI_API_KEY dans les variables d'environnement du serveur pour activer une vraie IA.";
  }
  if (language === "العربية") return "مرحباً! أنا مساعد M. Cyrille assistance. أعمل حالياً في الوضع التجريبي. أضف مفتاح API في إعدادات الخادم لتفعيل إجابات الذكاء الاصطناعي الكاملة.";
  if (/hello|hi/i.test(message)) return "Hello! I'm M. Cyrille assistance. I'm in demo mode. Configure OPENAI_API_KEY as a server environment secret to enable full AI answers.";
  if (/derivative|math/i.test(message)) return "A useful starting point: if f(x) = x², then f'(x) = 2x. Configure a server API key for full step-by-step help.";
  return "I'm currently in demo mode, so answers are limited. Configure OPENAI_API_KEY as a server environment secret to enable full AI answers.";
}
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`M. Cyrille assistance running on port ${port}`));
