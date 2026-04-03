import { config } from 'dotenv';
config({ path: '.env.local' });

import express from 'express';
import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

let AI_SYSTEM_PROMPT = '';
try {
  const src = readFileSync(join(__dirname, 'src/data/aiContext.ts'), 'utf8');
  const match = src.match(/AI_SYSTEM_PROMPT\s*=\s*\x60([\s\S]*?)\x60\s*\.trim/);
  if (match) AI_SYSTEM_PROMPT = match[1].trim();
} catch {}

const app = express();
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) {
    return res.status(503).json({ reply: 'OPENAI_API_KEY not set in .env.local' });
  }

  const client = new OpenAI({ apiKey: key });
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages is required' });
  }

  const apiMessages = messages
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({ role: m.role, content: String(m.content).slice(0, 4000) }));

  const lastUserMsg = apiMessages.filter(m => m.role === 'user').pop()?.content ?? '';

  try {
    const mainRes = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 1024,
      messages: [{ role: 'system', content: AI_SYSTEM_PROMPT }, ...apiMessages],
    });

    const reply = mainRes.choices[0]?.message?.content ?? 'No response.';

    const insightRes = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 100,
      messages: [
        {
          role: 'system',
          content: `You write punchy display copy — max 20 words, sharp, human. Reply ONLY with valid JSON: {"summary":"...","keyword":"..."}.

Rules:
- The summary must be based ONLY on what is in the reply below — never invent facts about Midhun.
- If the reply is a humorous deflection or off-topic fallback, write a short funny summary that plays along with the joke — still max 20 words, still pick a fun keyword from your summary.
- If the reply contains a real insight about Midhun, distil it into one punchy sentence with the single most impactful word as the keyword.
- The keyword must appear verbatim inside the summary string.
- Never use - or — as punctuation or list markers anywhere in the summary. Write flowing prose only.`,
        },
        {
          role: 'user',
          content: `Question asked: "${lastUserMsg}"\n\nActual reply given:\n${reply.slice(0, 800)}\n\nNow generate the JSON.`,
        },
      ],
    });

    let insight = { summary: '', keyword: '' };
    try {
      const raw = insightRes.choices[0]?.message?.content?.trim() ?? '';
      const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.summary && parsed.keyword) insight = parsed;
    } catch {}

    res.json({ reply, insight });
  } catch (err) {
    console.error('API error:', err.message);
    res.status(500).json({ reply: `Error: ${err.message}` });
  }
});

app.listen(3001, () => console.log('Local API running on http://localhost:3001'));
