/* Banc d'essai Padel+ : injecté dans la page, joue un tournoi complet et vérifie. */
window.__banc = function (cfg) {
  const out = { cfg, err: [], warn: [], matches: 0 };
  const crash0 = window.showCrash; window.showCrash = (e) => { out.err.push("écran de plantage : " + (e && e.message || e)); };
  try {
    S = def(); Object.assign(S, { fmt: cfg.fmt, n: cfg.n, p: cfg.p, q: cfg.q, nts: cfg.t, pistes: cfg.pistes || 4, mf: cfg.mf || "D" });
    S.date = todayL(); S.lieu = "Club Test"; S.cat = "P250"; S.gen = "Messieurs";
    demo(); inT = true;
    const fav = cfg.mode == "fav";
    const mk = (fm, aw) => {
      const cand = [];
      if (NS(fm) == 1) [9, 10, 8, 4, 6, 7, 5, 12].forEach(g => { const r = Math.floor(Math.random() * (g - 1)); cand.push([[String(g), String(r)]]) });
      else { cand.push([["6", "3"], ["6", "4"]]); cand.push([["4", "2"], ["4", "1"]]); cand.push([["6", "3"], ["3", "6"], ["10", "7"]]); cand.push([["4", "2"], ["2", "4"], ["10", "6"]]) }
      for (const c of cand) { const sc = aw ? c : c.map(z => [z[1], z[0]]); try { if (mres(sc, fm).w === (aw ? 0 : 1)) return sc } catch (e) {} }
      return null;
    };
    let it = 0;
    while (it++ < 300) {
      render();
      const M = allMatches();
      const todo = M.filter(m => m.r.w == null && typeof m.a == "number" && typeof m.b == "number" && m.a >= 0 && m.b >= 0 && (m.kind == "poule" || m.kind == "barrage" || S.drawn));
      if (!todo.length) { if ((FMT() == "PT" || FMT() == "T") && !S.drawn && BK) { doDraw(); continue } break }
      for (const m of todo) {
        const st = m.pk.split(":")[0], k = m.pk.slice(st.length + 1);
        const aw = fav ? (SD[m.a] < SD[m.b]) : Math.random() < .5;
        const sc = mk(m.fm, aw);
        if (!sc) { out.err.push("score impossible à saisir (format " + m.fm + ") : " + m.rl); return out }
        S[st][k] = sc;
      }
    }
    render();
    const M = allMatches(); out.matches = M.length;
    const left = M.filter(m => m.r.w == null);
    if (left.length) out.err.push(left.length + " match(s) jamais jouable(s) : " + left.slice(0, 3).map(m => m.rl).join(" / "));
    // nombre de matchs par équipe
    const per = S.teams.map(() => 0); M.forEach(m => { if (m.r.w != null && m.wo == null) { per[m.a]++; per[m.b]++ } });
    out.minM = Math.min(...per); out.maxM = Math.max(...per);
    // poules complètes
    if (FMT() != "T") (STG || []).forEach((g, gi) => g.forEach(r => { if (r.pl != g.length - 1) out.err.push("Poule " + (gi + 1) + " : une équipe a " + r.pl + " match(s) au lieu de " + (g.length - 1)) }));
    // classement final
    const R = ranking(STG, BK), seen = {};
    R.forEach(r => { seen[r.t] = (seen[r.t] || 0) + 1; if (r.p == null || r.p < 1 || r.p > S.n) out.err.push("classement : équipe " + (r.t + 1) + " place « " + r.p + " »") });
    S.teams.forEach((_, t) => { if (seen[t] != 1) out.err.push("classement : équipe " + (t + 1) + " présente " + (seen[t] || 0) + " fois") });
    // favoris : le n°1 doit gagner
    if (fav && FMT() != "PP") { const w = R.find(r => r.p == 1); if (!w || SD[w.t] != 1) out.err.push("les favoris gagnent tout, mais le vainqueur n'est pas le n°1 (n°" + (w ? SD[w.t] : "?") + ")") }
    if (fav && (FMT() == "PT" || FMT() == "T") && cfg.t >= 2) {
      const f = M.find(m => m.kind == "tableau" && /^finale/i.test(m.rl || ""));
      if (f && !([SD[f.a], SD[f.b]].sort().join() == "1,2")) out.err.push("finale entre favoris attendue TS1–TS2, obtenu n°" + SD[f.a] + "–n°" + SD[f.b]);
    }
    // deux équipes d'une même poule seulement en finale
    if (FMT() == "PT" && cfg.q <= 2) {
      const gp = {}; (STG || []).forEach((g, gi) => g.forEach(r => gp[r.t] = gi));
      M.filter(m => m.kind == "tableau" && !/^finale/i.test(m.rl || "")).forEach(m => { if (gp[m.a] != null && gp[m.a] === gp[m.b]) out.warn.push("même poule avant la finale : " + m.rl) });
    }
    // tous les onglets s'affichent
    ["Réglages", "Équipes", "Poules", "Tableau", "Poules 2", "Planning", "Classement", "Stats", "Communication", "Indemnisation"].forEach(v => { try { go(v); render() } catch (e) { out.err.push("onglet " + v + " : " + e.message) } });
  } catch (e) { out.err.push("plantage : " + (e && e.stack || e).toString().slice(0, 300)) }
  finally { window.showCrash = crash0 }
  return out;
};
window.__cfgs = function () {
  const L = [];
  for (let n = 8; n <= 32; n++) {
    try { afCand(n, 2, 0).forEach(c => L.push({ fmt: "PT", n, p: c.p, q: c.q, t: c.t })) } catch (e) {}
    L.push({ fmt: "T", n, p: 0, q: 0, t: Math.min(8, Math.floor(n / 4)) });
    for (let p = 1; p <= 8; p++) { const m = n; if (m >= p * 3 && m <= p * 5) L.push({ fmt: "P", n, p, q: 1, t: 0 }) }
  }
  // formules demandées par Yann
  [[24, 4, 2, 8], [18, 5, 1, 3], [16, 4, 1, 4], [17, 3, 1, 5], [9, 1, 3, 5], [10, 1, 2, 6], [15, 3, 1, 3]].forEach(([n, p, q, t]) => L.push({ fmt: "PT", n, p, q, t, yann: 1 }));
  return L;
};
