import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";
import { AI_SYSTEM_PROMPT } from "../src/data/aiContext.js";

const MODEL = "gpt-4o-mini";

function getClient(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const client = getClient();
  if (!client) {
    return res.status(503).json({
      reply: "AI assistant is not configured yet. Add OPENAI_API_KEY to your environment variables.",
    });
  }

  const { messages } = req.body as {
    messages: Array<{ role: "user" | "assistant"; content: string }>;
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages is required" });
  }

  const apiMessages = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: String(m.content).slice(0, 4000),
    }));

  const lastUserMsg = apiMessages.filter(m => m.role === "user").pop()?.content ?? "";

  try {
    const mainRes = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 1024,
      messages: [{ role: "system", content: AI_SYSTEM_PROMPT }, ...apiMessages],
    });

    const reply = mainRes.choices[0]?.message?.content ?? "No response.";

    let insight = { summary: "", keyword: "" };
    try {
      const insightRes = await client.chat.completions.create({
        model: MODEL,
        max_tokens: 100,
        messages: [
          {
            role: "system",
            content: `You write punchy display copy — max 20 words, sharp, human. Reply ONLY with valid JSON: {"summary":"...","keyword":"..."}.

Rules:
- The summary must be based ONLY on what is in the reply below — never invent facts about Midhun.
- If the reply is a humorous deflection or off-topic fallback, write a short funny summary that plays along with the joke — still max 20 words, still pick a fun keyword from your summary.
- If the reply contains a real insight about Midhun, distil it into one punchy sentence with the single most impactful word as the keyword.
- The keyword must appear verbatim inside the summary string.
- Never use - or — as punctuation or list markers anywhere in the summary. Write flowing prose only.`,
          },
          {
            role: "user",
            content: `Question asked: "${lastUserMsg}"\n\nActual reply given:\n${reply.slice(0, 800)}\n\nNow generate the JSON.`,
          },
        ],
      });
      const raw = insightRes.choices[0]?.message?.content?.trim() ?? "";
      const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.summary && parsed.keyword) insight = parsed;
    } catch {
      // Insight is optional — fail silently
    }

    res.json({ reply, insight });
  } catch (err: unknown) {
    console.error("OpenAI API error:", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ reply: `Error: ${msg}` });
  }
}
