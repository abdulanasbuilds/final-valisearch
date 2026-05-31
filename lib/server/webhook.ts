import { createServerFn } from '@tanstack/react-start'

function hexToBytes(hex: string): Uint8Array {
  const normalized = hex.trim().toLowerCase()
  if (!/^[0-9a-f]+$/.test(normalized) || normalized.length % 2 !== 0) {
    throw new Error('INVALID_SIGNATURE_FORMAT')
  }
  const out = new Uint8Array(normalized.length / 2)
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(normalized.slice(i * 2, i * 2 + 2), 16)
  }
  return out
}

export const handleLSWebhook = createServerFn({ method: 'POST' }).inputValidator((d: {
  rawBody: string
  signature: string
}) => d).handler(async ({ data: payload }) => {
  // Verify HMAC SHA-256 using Web Crypto API (NOT Node crypto)
  const secret =
    (typeof process !== 'undefined' && process.env?.LS_WEBHOOK_SECRET)
      ? process.env.LS_WEBHOOK_SECRET
      : ''
  if (!secret) throw new Error('WEBHOOK_SECRET_NOT_SET')

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
  )

  const sigHex = payload.signature.startsWith('sha256=')
    ? payload.signature.slice('sha256='.length)
    : payload.signature
  if (!/^[0-9a-fA-F]{64}$/.test(sigHex)) throw new Error('INVALID_SIGNATURE_FORMAT')
  const sigBytes = hexToBytes(sigHex)

  const isValid = await crypto.subtle.verify(
    'HMAC', key, sigBytes, encoder.encode(payload.rawBody)
  )
  if (!isValid) throw new Error('INVALID_SIGNATURE')

  const event = JSON.parse(payload.rawBody) as {
    meta: { event_name: string; custom_data?: { user_id?: string } }
    data: { attributes: { variant_id: number } }
  }

  if (event.meta.event_name !== 'order_created') return { ok: true }

  const userId = event.meta.custom_data?.user_id
  if (!userId) return { ok: true }

  const plan = getPlanFromVariant(String(event.data.attributes.variant_id))
  const credits = plan === 'pro' ? 100 : plan === 'business' ? 400 : 999999

  // Use service role for DB mutations
  const { createServiceClient } = await import('@/lib/supabase/service')
  const supabase = createServiceClient()
  await Promise.all([
    supabase.from('credits').update({ balance: credits }).eq('user_id', userId),
    supabase.from('profiles').update({ plan }).eq('id', userId),
  ])

  return { ok: true }
})

function getPlanFromVariant(variantId: string): string {
  const proIds = [
    import.meta.env.VITE_LS_PRO_MONTHLY_ID,
    import.meta.env.VITE_LS_PRO_ANNUAL_ID,
  ]
  const bizIds = [
    import.meta.env.VITE_LS_BIZ_MONTHLY_ID,
    import.meta.env.VITE_LS_BIZ_ANNUAL_ID,
  ]
  const entIds = [
    import.meta.env.VITE_LS_ENT_MONTHLY_ID,
    import.meta.env.VITE_LS_ENT_ANNUAL_ID,
  ]
  if (proIds.includes(variantId)) return 'pro'
  if (bizIds.includes(variantId)) return 'business'
  if (entIds.includes(variantId)) return 'enterprise'
  return 'enterprise'
}
