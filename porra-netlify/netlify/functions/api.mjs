import { getStore } from "@netlify/blobs";

export const config = { path: "/api" };

const json = (o, s = 200) =>
  new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json" } });
const slug = (n) =>
  String(n || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Mètode no permès" }, 405);
  let b;
  try { b = await req.json(); } catch { return json({ error: "Petició no vàlida" }, 400); }

  const CODE = Netlify.env.get("ACCESS_CODE");
  const ADMIN = Netlify.env.get("ADMIN_CODE");
  if (!CODE || !ADMIN) return json({ error: "Falten les variables ACCESS_CODE i ADMIN_CODE a Netlify" }, 500);

  const isAdmin = !!b.adminCode && b.adminCode === ADMIN;
  if (b.code !== CODE && !isAdmin) return json({ error: "Codi d’accés incorrecte" }, 401);

  const store = getStore({ name: "porra", consistency: "strong" });
  const cfg = await store.get("config", { type: "json" });
  const name = String(b.name || "").trim().slice(0, 40);
  const me = slug(name);

  if (b.action === "state") {
    if (!me && !isAdmin) return json({ error: "Escriu el teu nom" }, 400);
    const closed = cfg && Date.now() >= cfg.deadline;
    const { blobs } = await store.list({ prefix: "pred/" });
    const preds = {};
    await Promise.all(blobs.map(async (x) => {
      const p = await store.get(x.key, { type: "json" });
      if (!p) return;
      const id = x.key.slice(5);
      preds[id] = closed || id === me ? p : { name: p.name, at: p.at };
    }));
    return json({ config: cfg, preds, me, admin: isAdmin });
  }

  if (b.action === "save") {
    if (!cfg) return json({ error: "La porra encara no està configurada" }, 400);
    if (Date.now() >= cfg.deadline) return json({ error: "La porra ja està tancada" }, 403);
    if (!me) return json({ error: "Escriu el teu nom" }, 400);
    const secs = [
      { field: "parties", list: cfg.parties || [], total: cfg.total || 350 },
      { field: "cat", list: cfg.partiesCat || [], total: cfg.totalCat || 48 },
    ].filter((s) => s.list.length);
    const out = { name, at: Date.now() };
    for (const s of secs) {
      const arr = Array.isArray(b.pred && b.pred[s.field]) ? b.pred[s.field] : [];
      const clean = s.list.map((p) => {
        const m = arr.find((x) => x && x.p === p);
        return { p, v: Math.max(0, parseInt(m && m.v, 10) || 0) };
      });
      if (clean.reduce((a, x) => a + x.v, 0) !== s.total)
        return json({ error: "Els diputats han de sumar " + s.total }, 400);
      out[s.field] = clean;
    }
    await store.setJSON("pred/" + me, out);
    return json({ ok: true });
  }

  if (b.action === "config") {
    if (!isAdmin) return json({ error: "Només l’organitzador pot fer això" }, 403);
    const c = b.config;
    if (!c || typeof c !== "object" || !Array.isArray(c.parties) || JSON.stringify(c).length > 3e6)
      return json({ error: "Configuració no vàlida" }, 400);
    await store.setJSON("config", c);
    return json({ ok: true });
  }

  return json({ error: "Acció desconeguda" }, 400);
};
