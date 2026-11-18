// Padel+ : envoi des notifications web push (gratuit). n°673
// Secrets à créer à l'activation : VAPID_PUBLIC, VAPID_PRIVATE, CRON_SECRET
import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const URL_ = Deno.env.get("SUPABASE_URL")!, SR = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
webpush.setVapidDetails("mailto:padelplus@example.org", Deno.env.get("VAPID_PUBLIC")!, Deno.env.get("VAPID_PRIVATE")!);
const db = createClient(URL_, SR);
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-cron" };
const LES = /l[eé]s[iy]gn|l[eé]sini/i; // jamais côté joueurs

async function sendTo(uids: string[], title: string, body: string, url: string) {
  if (!uids.length) return 0;
  const { data } = await db.from("padel_push").select("endpoint,sub").in("uid", uids);
  let n = 0;
  for (const r of data || []) {
    try { await webpush.sendNotification(r.sub, JSON.stringify({ title, body: body.replace(LES, ""), url })); n++; }
    catch (e) { if ((e as any).statusCode === 404 || (e as any).statusCode === 410) await db.from("padel_push").delete().eq("endpoint", r.endpoint); }
  }
  return n;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  const b = await req.json().catch(() => ({}));
  const site = "https://herveyann77-source.github.io/padel-plus/moi.html";
  // 1) Rappel de la veille (appelé par le planificateur)
  if (b.mode === "veille") {
    if (req.headers.get("x-cron") !== Deno.env.get("CRON_SECRET")) return new Response("non", { status: 401, headers: CORS });
    const d = new Date(Date.now() + 864e5).toLocaleDateString("sv", { timeZone: "Europe/Paris" });
    const { data } = await db.from("padel_public").select("data").eq("data->>v", "live").eq("data->>d", d);
    let n = 0;
    for (const row of data || []) {
      const D = row.data, cat = D.c || "ton tournoi";
      for (const T of D.T || []) {
        if (T[2]) continue; const h = String(T[9] || "").replace(":", "h");
        n += await sendTo([T[7], T[8]].filter(Boolean), "🎾 C'est demain !", (h ? "Rendez-vous à " + h + " · " : "") + cat, site);
      }
    }
    return new Response(JSON.stringify({ ok: true, n }), { headers: CORS });
  }
  // 2) « C'est à toi ! » envoyé par le juge-arbitre (connecté) pour SES joueurs
  const tok = (req.headers.get("authorization") || "").replace(/^Bearer /, "");
  const { data: u } = await db.auth.getUser(tok);
  if (!u?.user) return new Response("non", { status: 401, headers: CORS });
  const ask: string[] = (b.uids || []).filter((x: unknown) => typeof x === "string").slice(0, 8);
  const { data: mine } = await db.from("padel_joueur").select("uid").eq("owner", u.user.id).in("uid", ask);
  const n = await sendTo((mine || []).map((r: any) => r.uid), String(b.title || "🎾 C'est à toi !").slice(0, 60), String(b.body || "").slice(0, 120), site);
  return new Response(JSON.stringify({ ok: true, n }), { headers: CORS });
});
