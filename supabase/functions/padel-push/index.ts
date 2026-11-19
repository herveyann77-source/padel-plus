// Padel+ : envoi des notifications web push (gratuit). n°673, activé au n°685
// Clés VAPID et secret du rappel : table privée padel_push_cfg (lisible seulement par le serveur)
import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-cron, x-client-info" };
const LES = /l[eé]s[iy]gn\w*|l[eé]sini\w*/gi; // jamais côté joueurs
const SITE = "https://herveyann77-source.github.io/padel-plus/moi.html";
let CFG: Record<string, string> | null = null;

async function cfg() {
  if (CFG) return CFG;
  const { data } = await db.from("padel_push_cfg").select("k,v");
  CFG = Object.fromEntries((data || []).map((r: any) => [r.k, r.v]));
  webpush.setVapidDetails("https://herveyann77-source.github.io/padel-plus/", CFG.vapid_public, CFG.vapid_private);
  return CFG;
}

async function sendTo(uids: string[], title: string, body: string) {
  if (!uids.length) return 0;
  await cfg();
  const { data } = await db.from("padel_push").select("endpoint,sub").in("uid", uids);
  let n = 0;
  for (const r of data || []) {
    try { await webpush.sendNotification(r.sub, JSON.stringify({ title, body: body.replace(LES, "").trim(), url: SITE })); n++; }
    catch (e) { const c = (e as any).statusCode; if (c === 404 || c === 410) await db.from("padel_push").delete().eq("endpoint", r.endpoint); }
  }
  return n;
}

const J = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  const b = await req.json().catch(() => ({}));
  // 1) Rappel de la veille à 18h (heure de Paris), appelé par le planificateur
  if (b.mode === "veille") {
    const c = await cfg();
    if (req.headers.get("x-cron") !== c.cron) return J({ ok: false }, 401);
    const hp = +new Date().toLocaleString("en-GB", { timeZone: "Europe/Paris", hour: "2-digit", hour12: false });
    if (hp !== 18 && !b.force) return J({ ok: true, skip: hp });
    const d = new Date(Date.now() + 864e5).toLocaleDateString("sv", { timeZone: "Europe/Paris" });
    const { data } = await db.from("padel_public").select("data").eq("data->>v", "live").eq("data->>d", d);
    let n = 0;
    for (const row of data || []) {
      const D: any = row.data, cat = D.c || "ton tournoi";
      for (const T of D.T || []) {
        if (T[2]) continue;
        const h = String(T[9] || "").replace(":", "h"); // heure de CONVOCATION, jamais l'heure d'un match
        n += await sendTo([T[7], T[8]].filter(Boolean), "🎾 C'est demain !", (h ? "Rendez-vous à " + h + " · " : "") + cat);
      }
    }
    return J({ ok: true, n });
  }
  // 2) « C'est à toi ! » envoyé par le juge-arbitre (connecté) pour SES joueurs, quand il touche ▶ Lancer
  const tok = (req.headers.get("authorization") || "").replace(/^Bearer /, "");
  const { data: u } = await db.auth.getUser(tok);
  if (!u?.user) return J({ ok: false }, 401);
  const ask: string[] = (b.uids || []).filter((x: unknown) => typeof x === "string").slice(0, 8);
  const { data: mine } = await db.from("padel_joueur").select("uid").eq("owner", u.user.id).in("uid", ask);
  const n = await sendTo((mine || []).map((r: any) => r.uid), String(b.title || "🎾 C'est à toi !").slice(0, 60), String(b.body || "").slice(0, 120));
  return J({ ok: true, n });
});
