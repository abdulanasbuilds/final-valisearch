import { schedules } from '@trigger.dev/sdk/v3'
import { Resend } from 'resend'
import { createServiceClient } from '../lib/supabase/service'

export const checkTrialExpiry = schedules.task({
  id: 'check-trial-expiry',
  cron: '0 9 * * *', // 9am UTC daily
  run: async () => {
    const supabase = createServiceClient()
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Find trials expiring in exactly 3 days
    const warningDate = new Date()
    warningDate.setDate(warningDate.getDate() + 3)
    const dateStr = warningDate.toISOString().split('T')[0]

    const { data: expiring } = await supabase
      .from('profiles')
      .select('id, email, trial_ends_at')
      .eq('is_trial_active', true)
      .gte('trial_ends_at', dateStr + 'T00:00:00Z')
      .lt('trial_ends_at', dateStr + 'T23:59:59Z')

    for (const user of expiring ?? []) {
      await resend.emails.send({
        from: 'ValiSearch <noreply@valisearch.app>',
        to: user.email,
        subject: 'Your Pro trial ends in 3 days',
        html: buildTrialEmail(user.email, user.trial_ends_at),
      })
    }

    // Expire overdue trials
    await supabase.rpc('expire_trials')

    return { processed: expiring?.length ?? 0 }
  },
})

function buildTrialEmail(email: string, endsAt: string): string {
  const endDate = new Date(endsAt).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
  return `
    <div style="font-family: Inter, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px;">
      <h1 style="color: #0C0D0E; font-size: 22px; font-weight: 700;">
        Your Pro trial ends in 3 days
      </h1>
      <p style="color: #52565E; line-height: 1.7; margin: 16px 0;">
        Your 7-day Pro trial expires on ${endDate}. After that,
        your account moves to the free Starter plan — 3 analyses,
        no real-time research, no PDF export.
      </p>
      <a href="https://valisearch.app/settings/billing"
         style="display: inline-block; background: #1B4FFF; color: white;
                padding: 12px 24px; border-radius: 8px; text-decoration: none;
                font-weight: 600; margin: 16px 0;">
        Keep Pro access →
      </a>
      <p style="color: #9CA3AF; font-size: 13px; margin-top: 32px;">
        ValiSearch — Built in Ghana for global founders
      </p>
    </div>
  `
}
