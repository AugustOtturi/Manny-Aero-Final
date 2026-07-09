import nodemailer from "nodemailer";
import { getEnv, mailCcList } from "./env";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;
  const env = getEnv();
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
  return transporter;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function fieldRow(label: string, value: string): string {
  if (!value.trim()) return "";
  return `<tr>
    <td style="padding:7px 0;font:600 12px/1.5 Arial,Helvetica,sans-serif;color:#6b7280;width:150px;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td>
    <td style="padding:7px 0;font:400 14px/1.5 Arial,Helvetica,sans-serif;color:#111827">${value}</td>
  </tr>`;
}

function sectionLabel(label: string): string {
  return `<div style="font:700 11px/1 Arial,Helvetica,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#b8860b;padding-bottom:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(label)}</div>`;
}

function section(label: string, rows: string[]): string {
  const inner = rows.join("");
  if (!inner.trim()) return "";
  return `<tr><td style="padding:22px 32px 0">
    ${sectionLabel(label)}
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:6px">${inner}</table>
  </td></tr>`;
}

function flightsSection(flights: unknown): string {
  if (!Array.isArray(flights) || flights.length === 0) return "";

  let cards = "";
  let n = 0;
  for (const flight of flights) {
    if (typeof flight !== "object" || flight === null) continue;
    let rows = "";
    for (const [key, val] of Object.entries(flight as Record<string, unknown>)) {
      rows += fieldRow(escapeHtml(String(key)), escapeHtml(String(val)));
    }
    if (!rows.trim()) continue;
    n++;
    cards += `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:10px;background:#f9fafb;border:1px solid #eceef1;border-radius:10px">
      <tr><td style="padding:12px 16px">
        <div style="font:700 12px/1 Arial,Helvetica,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#0d0d0d;margin-bottom:4px">&#9992;&#65039; Flight ${n}</div>
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">${rows}</table>
      </td></tr>
    </table>`;
  }
  if (!cards.trim()) return "";

  return `<tr><td style="padding:22px 32px 0">
    ${sectionLabel("Flight Details")}
    ${cards}
  </td></tr>`;
}

function emailDocument(heading: string, subheading: string, sectionsHtml: string, footerNote: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
</head>
<body style="margin:0;padding:0;background:#eef0f3;-webkit-font-smoothing:antialiased">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#eef0f3">
    <tr><td align="center" style="padding:28px 12px">
      <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="width:600px;max-width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 10px 34px rgba(13,13,13,.10)">

        <tr><td style="background:#0d0d0d;padding:26px 32px;border-bottom:3px solid #ffb900">
          <div style="font:800 22px/1 Arial,Helvetica,sans-serif;color:#ffffff;letter-spacing:.04em">MANNY<span style="color:#ffb900">AERO</span></div>
          <div style="font:600 11px/1 Arial,Helvetica,sans-serif;color:#9ca3af;letter-spacing:.16em;text-transform:uppercase;margin-top:9px">Ground Handling &amp; FBO Coordination &middot; Mexico</div>
        </td></tr>

        <tr><td style="padding:28px 32px 2px">
          <div style="font:700 20px/1.3 Arial,Helvetica,sans-serif;color:#0d0d0d">${escapeHtml(heading)}</div>
          <div style="font:400 13px/1.5 Arial,Helvetica,sans-serif;color:#6b7280;margin-top:5px">${escapeHtml(subheading)}</div>
        </td></tr>

        ${sectionsHtml}

        <tr><td style="padding:28px 32px 30px">
          <div style="border-top:1px solid #e5e7eb;padding-top:18px;font:400 12px/1.6 Arial,Helvetica,sans-serif;color:#9ca3af">${escapeHtml(footerNote)}</div>
        </td></tr>

      </table>
      <div style="font:400 11px/1.5 Arial,Helvetica,sans-serif;color:#9ca3af;padding:16px 0">Manny Aero &middot; 24/7 Operations &middot; manny.aero</div>
    </td></tr>
  </table>
</body>
</html>`;
}

function toAltBody(html: string): string {
  return html
    .replace(/<tr>/g, "\n")
    .replace(/<\/tr>/g, "")
    .replace(/<td>/g, " | ")
    .replace(/<\/td>/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

async function send(to: string, subject: string, html: string, replyTo?: string, replyToName?: string) {
  const env = getEnv();
  const cc = mailCcList(env);
  await getTransporter().sendMail({
    from: `"${env.MAIL_FROM_NAME}" <${env.MAIL_FROM}>`,
    to,
    cc: cc.length ? cc : undefined,
    replyTo: replyTo ? { address: replyTo, name: replyToName || replyTo } : undefined,
    subject,
    html,
    text: toAltBody(html),
  });
}

export interface ContactEmailData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  aircraft: string;
  notes: string;
  flights: unknown;
}

export async function sendContactEmail(data: ContactEmailData): Promise<void> {
  const env = getEnv();
  const emailLink = `<a href="mailto:${escapeHtml(data.email)}" style="color:#b8860b;text-decoration:none">${escapeHtml(data.email)}</a>`;

  const sections =
    section("Operator", [
      fieldRow("Name", escapeHtml(data.fullName)),
      fieldRow("Email", emailLink),
      fieldRow("Phone", escapeHtml(data.phone)),
      fieldRow("Company", escapeHtml(data.company)),
    ]) +
    section("Service Requested", [
      fieldRow("Service", escapeHtml(data.service)),
      fieldRow("Aircraft Type", escapeHtml(data.aircraft)),
    ]) +
    flightsSection(data.flights) +
    (data.notes.trim()
      ? `<tr><td style="padding:22px 32px 0">
          ${sectionLabel("Notes")}
          <div style="font:400 14px/1.6 Arial,sans-serif;color:#1f2937;background:#f9fafb;border:1px solid #eceef1;border-radius:10px;padding:14px 16px;margin-top:8px">${escapeHtml(data.notes).replace(/\n/g, "<br>")}</div>
        </td></tr>`
      : "");

  const subheading = `Submitted ${new Date().toUTCString()} · via manny.aero contact form`;
  const footer = "Reply directly to this email to reach the operator. Sent automatically from the Manny Aero website contact form.";
  const subject = `New Flight Request — ${data.fullName}${data.company ? ` | ${data.company}` : ""}`;
  const html = emailDocument("New Flight Request", subheading, sections, footer);

  await send(env.MAIL_TO_CONTACT, subject, html, data.email, data.fullName);
}

export async function sendGateEmail(email: string, fileName: string): Promise<void> {
  const env = getEnv();
  const emailLink = `<a href="mailto:${escapeHtml(email)}" style="color:#b8860b;text-decoration:none">${escapeHtml(email)}</a>`;

  const sections = section("Lead", [
    fieldRow("Email", emailLink),
    fieldRow("File", escapeHtml(fileName)),
    fieldRow("Captured", new Date().toUTCString()),
  ]);

  const subheading = "A visitor unlocked a downloadable permit document on manny.aero";
  const footer = "This lead was captured by the permit download gate. Reply to this email to follow up with the operator.";
  const html = emailDocument("Permit Download Lead", subheading, sections, footer);

  await send(env.MAIL_TO_GATE, "New Lead — Permit Download Requested", html);
}
