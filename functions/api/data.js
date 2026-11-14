// Cloudflare Pages Function: đồng bộ dữ liệu báo cáo NG ERP qua KV
// Cần gắn: KV binding tên NG_KV  ·  biến môi trường (Secret) WRITE_KEY = mã ghi
const J = (o, status = 200) => new Response(JSON.stringify(o), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
});
const getMeta = async env => (await env.NG_KV.get('meta', { type: 'json' })) || { v: 0, savedAt: 0 };

export async function onRequestGet({ env, request }) {
  if (!env.NG_KV) return J({ error: 'Chưa gắn KV binding NG_KV' }, 500);
  const meta = await getMeta(env);
  if (new URL(request.url).searchParams.get('meta')) return J(meta);
  const data = await env.NG_KV.get('data');
  return J({ ...meta, data: data ? JSON.parse(data) : null });
}

export async function onRequestPut({ env, request }) {
  if (!env.NG_KV) return J({ error: 'Chưa gắn KV binding NG_KV' }, 500);
  if (!env.WRITE_KEY) return J({ error: 'Chưa đặt biến WRITE_KEY trên Cloudflare' }, 403);
  if ((request.headers.get('x-write-key') || '') !== env.WRITE_KEY) return J({ error: 'Sai mã ghi' }, 401);
  let body;
  try { body = await request.json(); } catch (e) { return J({ error: 'Dữ liệu không hợp lệ' }, 400); }
  if (!body || !body.data || !Array.isArray(body.data.models)) return J({ error: 'Thiếu dữ liệu' }, 400);
  const meta = await getMeta(env);
  if (!body.force && body.base != null && body.base !== meta.v) return J({ error: 'conflict', ...meta }, 409);
  const nm = { v: meta.v + 1, savedAt: body.data.savedAt || Date.now(), by: String(body.by || '').slice(0, 40), at: Date.now() };
  await env.NG_KV.put('data', JSON.stringify(body.data));
  await env.NG_KV.put('meta', JSON.stringify(nm));
  return J(nm);
}
