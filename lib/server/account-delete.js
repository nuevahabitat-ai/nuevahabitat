/**
 * Borrado de cuenta cliente (service role): datos en Supabase + auth.users
 */
import { SB_URL, svcHeaders } from './supabase-server.js';

function normEmail(e) {
  return String(e || '').trim().toLowerCase();
}

function storageFolder(email) {
  return email.toLowerCase().replace(/[^a-z0-9@._+-]/g, '_');
}

async function restDelete(path) {
  const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
    method: 'DELETE',
    headers: { ...svcHeaders(), Prefer: 'return=minimal' },
  });
  if (!res.ok && res.status !== 404) {
    const err = await res.text();
    console.error('restDelete', path, res.status, err);
    throw new Error(err || `DELETE failed ${res.status}`);
  }
}

async function deleteStorageForEmail(email) {
  const folder = storageFolder(email);
  const prefix = `${folder}/`;
  const listRes = await fetch(
    `${SB_URL}/storage/v1/object/list/documentos-clientes`,
    {
      method: 'POST',
      headers: svcHeaders(),
      body: JSON.stringify({ prefix, limit: 1000, sortBy: { column: 'name', order: 'asc' } }),
    }
  );
  if (!listRes.ok) {
    console.warn('deleteStorageForEmail list', listRes.status, await listRes.text());
    return;
  }
  const items = await listRes.json();
  const paths = (items || [])
    .map((o) => o.name)
    .filter(Boolean)
    .map((name) => `${folder}/${name}`);
  if (!paths.length) return;
  const delRes = await fetch(`${SB_URL}/storage/v1/object/documentos-clientes`, {
    method: 'DELETE',
    headers: svcHeaders(),
    body: JSON.stringify(paths),
  });
  if (!delRes.ok) console.warn('deleteStorageForEmail del', delRes.status, await delRes.text());
}

async function deleteAuthUserById(userId) {
  if (!userId) return;
  const res = await fetch(`${SB_URL}/auth/v1/admin/users/${userId}`, {
    method: 'DELETE',
    headers: svcHeaders(),
  });
  if (!res.ok && res.status !== 404) {
    const err = await res.text();
    console.error('deleteAuthUserById', userId, res.status, err);
    throw new Error(err || `auth delete ${res.status}`);
  }
}

/**
 * Elimina datos de expediente/cliente y opcionalmente la cuenta Auth.
 * @param {{ userId?: string, email: string, deleteAuth?: boolean }}
 */
export async function purgeClientAccount({ userId, email, deleteAuth = true }) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE) {
    return { ok: false, error: 'Servicio no configurado' };
  }
  const em = normEmail(email);
  if (!em) return { ok: false, error: 'Email inválido' };

  try {
    await deleteStorageForEmail(em);
    await restDelete(`cliente_documentos?cliente_email=ilike.${encodeURIComponent(em)}`);
    await restDelete(`propietarios_alquiler?email=ilike.${encodeURIComponent(em)}`);
    await restDelete(`compradores?email=ilike.${encodeURIComponent(em)}`);
    await restDelete(`vendedores?email=ilike.${encodeURIComponent(em)}`);
    await restDelete(`leads?email=ilike.${encodeURIComponent(em)}`);

    if (deleteAuth && userId) {
      await deleteAuthUserById(userId);
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}
