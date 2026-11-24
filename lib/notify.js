// lib/notify.js  (server only)
// Welcome email (Gmail SMTP via nodemailer) + welcome WhatsApp (Meta WhatsApp Cloud API).
// Both functions NEVER throw: they return true if sent, false otherwise,
// so a failed message can never break registration.

import nodemailer from 'nodemailer'

const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '')

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

export function normalizePhone(raw) {
    let digits = String(raw || '').replace(/\D/g, '')
    if (!digits) return ''
    // Egyptian local format 01XXXXXXXXX -> 201XXXXXXXXX
    if (digits.startsWith('01') && digits.length === 11) digits = `20${digits.slice(1)}`
    return digits.length >= 8 && digits.length <= 15 ? digits : ''
}

export async function sendWelcomeEmail({ name, email }) {
    const user = process.env.EMAIL_USER
    const pass = process.env.EMAIL_APP_PASSWORD
    if (!user || !pass) return false

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: Number(process.env.EMAIL_PORT || 465),
            secure: Number(process.env.EMAIL_PORT || 465) === 465,
            auth: { user, pass },
        })

        const safeName = escapeHtml(name)
        const button = SITE_URL
            ? `<a href="${SITE_URL}/shop" style="display:inline-block;margin-top:24px;background:#22d3ee;color:#030a12;text-decoration:none;font-weight:700;padding:14px 32px;border-radius:999px">Start shopping</a>`
            : ''

        await transporter.sendMail({
            from: process.env.EMAIL_FROM || `"GLOBAL EARTH" <${user}>`,
            to: email,
            subject: "You're in - welcome to the GLOBAL EARTH VIP team",
            text: `Hi ${name}, you have been added to the GLOBAL EARTH VIP team. Enjoy original tech, fast delivery and member-only deals.`,
            html: `
<div style="background:#f1f5f9;padding:32px 12px;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:560px;margin:auto;background:#030a12;border-radius:24px;overflow:hidden;color:#e2e8f0">
    <div style="padding:36px 32px 8px;text-align:center">
      <div style="font-size:22px;font-weight:800;letter-spacing:1px;color:#fff">GLOBAL <span style="color:#22d3ee">EARTH</span></div>
    </div>
    <div style="padding:16px 32px 40px;text-align:center">
      <h1 style="margin:16px 0 8px;font-size:26px;color:#fff">Welcome, ${safeName}!</h1>
      <p style="margin:0;font-size:16px;line-height:1.7;color:#94a3b8">
        You have been added to the <strong style="color:#22d3ee">GLOBAL EARTH VIP team</strong>.<br/>
        Original products, fast delivery across Egypt and member-only deals are waiting for you.
      </p>
      ${button}
    </div>
    <div style="padding:18px 32px;background:#071522;text-align:center;font-size:12px;color:#64748b">
      You received this email because an account was created with this address.
    </div>
  </div>
</div>`,
        })

        return true
    } catch (error) {
        console.error('WELCOME EMAIL ERROR:', error?.message || error)
        return false
    }
}

// Requires an APPROVED WhatsApp message template with ONE body variable: {{1}} = first name.
export async function sendWelcomeWhatsApp({ name, phone }) {
    const token = process.env.WHATSAPP_TOKEN
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
    const template = process.env.WHATSAPP_TEMPLATE_NAME
    const to = normalizePhone(phone)

    if (!token || !phoneNumberId || !template || !to) return false

    try {
        const response = await fetch(
            `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to,
                    type: 'template',
                    template: {
                        name: template,
                        language: { code: process.env.WHATSAPP_TEMPLATE_LANG || 'en' },
                        components: [
                            {
                                type: 'body',
                                parameters: [
                                    { type: 'text', text: String(name).split(' ')[0].slice(0, 60) },
                                ],
                            },
                        ],
                    },
                }),
                signal: AbortSignal.timeout(8000),
            }
        )

        if (!response.ok) {
            console.error('WHATSAPP ERROR:', response.status, await response.text())
            return false
        }
        return true
    } catch (error) {
        console.error('WHATSAPP ERROR:', error?.message || error)
        return false
    }
}
