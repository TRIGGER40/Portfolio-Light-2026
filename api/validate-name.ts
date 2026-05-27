import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

function getClient(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name } = req.body as { name?: string };

  if (!name || typeof name !== "string") {
    return res.status(200).json({ valid: false, reason: "Please enter a name." });
  }

  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return res.status(200).json({ valid: false, reason: "Name is too short." });
  }
  if (trimmed.length > 30) {
    return res.status(200).json({ valid: false, reason: "Name must be 30 characters or less." });
  }

  const client = getClient();
  if (!client) {
    // Fallback: allow if basic length checks pass
    return res.status(200).json({ valid: true });
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a multilingual name validator for a public emoji reaction board on a designer's portfolio.
Respond with ONLY a JSON object in this exact shape:
{"valid": boolean, "category": "ok" | "profanity" | "gibberish" | "other", "reason": "short user-facing message"}

Categories:
- "ok"        — name is acceptable. Set valid:true, reason:"".
- "profanity" — slurs, swears, sexual content, hateful, vulgar, or insulting wording in ANY language. Set valid:false.
- "gibberish" — random keymashed characters like "asdfg", "xyzxyz", or fake placeholders like "test", "aaa". Set valid:false.
- "other"     — anything else invalid (URLs, full sentences, spam-looking numeric strings). Set valid:false.

LANGUAGE COVERAGE — check for profanity, slurs, sexual/insulting words in ALL of these, written in either native script OR Roman/Latin transliteration:
- INDIAN LANGUAGES (priority): Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, Punjabi, Gujarati, Urdu, Odia, Assamese. Catch transliterated common-knowledge Indian profanity such as (but not limited to): variants of "bh*nch*d", "m*derch*d", "ch*tiy*", "g*ndu", "l*nd", "ch*t", "r*ndi", "k*tta", "h*r*mi", "s*la", "k*mina", "p*ttar", "th*v*di", "punda", "k*nj*", "p*ka", "ot*k", "soothu", and their many spelling variants. Hindi-script equivalents (e.g. भोसडीके, मादरचोद, चूतिया, गांडू, रंडी), Tamil/Telugu/Malayalam-script equivalents likewise.
- OTHER MAJOR LANGUAGES: Spanish, Portuguese, French, German, Italian, Russian, Arabic, Mandarin, Cantonese, Japanese, Korean, Turkish, Indonesian, Tagalog, Vietnamese, Thai, Persian. Catch profanity/slurs in those languages and their common transliterations.
- Catch leetspeak / number-letter substitutions (a→@/4, e→3, i→1/!, o→0, s→$/5, t→7) and spaced-out / dotted-out variants like "f.u.c.k", "s h i t", "b h e n c h o d".

VALID names: real first names, nicknames, handles, initials + name combos, names in any script (e.g. "Alex", "sarah_m", "DJ Mike", "raj123", "Priya", "Arjun", "Ananya", "코딩왕", "María", "A.Sharma", "the_designer", "मीरा", "ਰਾਜ", "முகுந்த்").
When in doubt about whether a word is a real name vs. an insult, prefer marking it valid only if it is a recognizable name in some culture. If it is unambiguously a slur or insult in any language, mark profanity.
Short common names like "Jo", "Li", "Ed", "Om", "Su" are valid.

For the "reason" field, write a short friendly user-facing message (not a category label). It must NOT be one of the literal words "profanity", "gibberish", "invalid", "ok", or "other".`,
        },
        {
          role: "user",
          content: `Validate this name for a public board: "${trimmed}"`,
        },
      ],
      max_tokens: 80,
      temperature: 0,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content ?? '{"valid":true,"category":"ok","reason":""}';
    try {
      const result = JSON.parse(content) as { valid?: boolean; category?: string; reason?: string };
      const valid    = result.valid !== false;
      const category = (result.category ?? (valid ? "ok" : "other")).toLowerCase();
      const rawReason = (result.reason ?? "").trim();

      // Sanitize: if the model echoed a label or returned nothing meaningful, use a friendly default.
      const FRIENDLY_FALLBACK = "This doesn't sound like a name. Be kind!";
      const lower = rawReason.toLowerCase();
      const badEchoes = ["short message", "reason", "profanity", "slurs", "gibberish", "invalid", "not valid", "other"];
      const looksBad = !rawReason || badEchoes.some(e => lower === e || lower.includes(e));

      const safeCategory = ["ok", "profanity", "gibberish", "other"].includes(category) ? category : "other";

      return res.status(200).json({
        valid,
        category: safeCategory,
        reason: valid ? "" : (looksBad ? FRIENDLY_FALLBACK : rawReason),
      });
    } catch {
      return res.status(200).json({ valid: true, category: "ok", reason: "" });
    }
  } catch {
    // On API error, allow the post
    return res.status(200).json({ valid: true, category: "ok", reason: "" });
  }
}
