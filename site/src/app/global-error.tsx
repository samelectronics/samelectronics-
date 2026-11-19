'use client';
// When even the site frame fails: its own document, with the same card (styles inline, since global CSS is not loaded).
import ErrorScreen from '@/components/site/ErrorScreen';

const CSS = `body{margin:0;background:#F2F3F4;font-family:Inter,system-ui,sans-serif;color:#26282B}
.ers{min-height:100vh;display:grid;place-items:center;padding:24px 16px;box-sizing:border-box}
.ers-card{width:min(560px,100%);box-sizing:border-box;padding:32px 28px;border-radius:26px;background:#fff;box-shadow:0 30px 60px -30px rgba(38,40,43,.45)}
.ers-ic{display:grid;place-items:center;width:64px;height:64px;border-radius:18px;background:#F7C032;color:#26282B}
.ers-k{display:block;margin-top:18px;font:600 11px monospace;letter-spacing:.16em;color:#8A8E94}
.ers-h{margin:8px 0 10px;font:700 30px/1.1 system-ui,sans-serif}
.ers-why{margin:0;padding:12px 14px;border-radius:12px;background:#F6F6F7;font-size:15px;line-height:1.5}
.ers-p{color:#5D6166;font-size:15px;line-height:1.55}
.ers-acts{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}
.ers-b{display:inline-flex;align-items:center;height:46px;padding:0 18px;border:0;border-radius:12px;background:#F2F3F4;color:#26282B;font:600 15px system-ui,sans-serif;text-decoration:none;cursor:pointer}
.ers-b.y{background:#F7C032}.ers-b.ghost{background:none;box-shadow:inset 0 0 0 1.5px rgba(38,40,43,.2)}
.ers-more{margin-top:16px;padding:0;border:0;background:none;color:#5D6166;font-size:13px;cursor:pointer}
.ers-tech{white-space:pre-wrap;word-break:break-word;padding:12px;border-radius:10px;background:#26282B;color:#F2F3F4;font-size:12px}`;

export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en">
      <body>
        <title>Something went wrong · Sam Electronics</title>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <ErrorScreen error={error} retry={retry} bare />
      </body>
    </html>
  );
}
