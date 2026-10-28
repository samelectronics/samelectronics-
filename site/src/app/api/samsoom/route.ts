/**
 * G8: Samsoom's brain. POST { messages: [{ role: 'user' | 'assistant', text }], lang: 'en' | 'ar' }
 *   → { text, action? }       answered by Claude, with the Company Facts as his only knowledge
 *   → { fallback: true }      no ANTHROPIC_API_KEY yet (or the API failed): the page answers with its
 *                             typo-tolerant fuzzy matcher (src/components/samsoom/fallback.js)
 */
import Anthropic from '@anthropic-ai/sdk';
import { facts } from '@/content/facts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MODEL = 'claude-opus-5-5';
/** Places on the site an answer can send the visitor to (the chat shows one button). */
const ACTIONS = ['visit', 'repair', 'wholesale', 'network', 'models', 'fmp', 'story', 'circuit', 'whatsapp'] as const;

const SYSTEM = `You are Samsoom, the small, cheerful robot assistant of Sam Electronics, a mobile phone parts shop in Deira, Dubai (trading since 2003, formerly Syria Tell). You chat in the corner of the shop's website.

How you talk:
- Reply in the language of the visitor's last message (Arabic → Arabic, English → English, any other language → that language).
- Short and friendly: one to three sentences, plain text, no markdown, no lists unless the visitor asks for one. Warm with greetings and thanks; a little playful is fine.
- Understand spelling mistakes and slang; never correct the visitor.
- You can chat naturally about anything light, but steer gently back to phones, parts, repairs and the shop.

What you know: only the COMPANY FACTS below, plus what the website offers (Find My Part by brand and model, the Repair Lab with an estimator, Wholesale and trade accounts, the worldwide shipping network, the Sam Circuit membership, the Visit section with hours and directions).
- Each fact has a status. CONFIRMED: state it. TO_CONFIRM: do not state it as fact; say the team will confirm and offer WhatsApp (${facts.contact.mobile.value}). SAMPLE: placeholder data, never quote it as real.
- Never invent prices, stock levels, delivery times, warranty terms, discounts or policies. If asked, say the team confirms these and offer WhatsApp, or point to Find My Part for live parts.
- Opening hours are Dubai time; use the current Dubai time given below to say whether the shop is open now.

Actions: if one place on the website would help, end your reply with a final line containing only [[action:NAME]], where NAME is one of: ${ACTIONS.join(', ')}. (visit = hours, directions and contact; fmp = Find My Part; models = brands and grades; network = shipping; whatsapp = message the team.) Use at most one action, and none for small talk.

COMPANY FACTS (JSON; minutes are minutes after midnight, 0 = Sunday):
${JSON.stringify(facts)}`;

type Turn = { role: 'user' | 'assistant'; text: string };

function dubaiNow() {
  return new Date().toLocaleString('en-GB', { timeZone: 'Asia/Dubai', weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false });
}

/** Last 12 turns, trimmed, starting with the visitor. */
function clean(input: unknown): Anthropic.MessageParam[] {
  const list = Array.isArray(input) ? (input as Turn[]) : [];
  const out: Anthropic.MessageParam[] = [];
  for (const m of list.slice(-12)) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.text !== 'string') continue;
    const text = m.text.trim().slice(0, 800);
    if (!text) continue;
    if (!out.length && m.role !== 'user') continue;
    out.push({ role: m.role, content: text });
  }
  return out;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ fallback: true });
  let body: { messages?: unknown; lang?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'bad request' }, { status: 400 });
  }
  const messages = clean(body.messages);
  if (!messages.length || messages[messages.length - 1].role !== 'user') return Response.json({ error: 'bad request' }, { status: 400 });

  try {
    const client = new Anthropic();
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 2000,
      output_config: { effort: 'low' }, // quick chat answers
      system: [
        { type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: `Now in Dubai: ${dubaiNow()}. The visitor's site language: ${({ ar: 'Arabic', es: 'Spanish', fr: 'French', fa: 'Persian (Farsi)' } as Record<string, string>)[body.lang || ''] || 'English'}.` },
      ],
      messages,
    });
    if (res.stop_reason === 'refusal') return Response.json({ fallback: true });
    let text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim();
    let action: string | undefined;
    text = text.replace(/\n*\[\[action:([a-z]+)\]\]\s*$/i, (_, a: string) => {
      if ((ACTIONS as readonly string[]).includes(a.toLowerCase())) action = a.toLowerCase();
      return '';
    }).trim();
    if (!text) return Response.json({ fallback: true });
    return Response.json({ text, action });
  } catch (err) {
    if (err instanceof Anthropic.APIError) console.error('samsoom: API error', err.status, err.message);
    else console.error('samsoom:', err);
    return Response.json({ fallback: true });
  }
}
