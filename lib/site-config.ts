export type ContactChannel = { label: string; value: string; href: string | null };

export function getContactChannels(): ContactChannel[] {
  const channels: ContactChannel[] = [];
  const email = process.env.SITE_CONTACT_EMAIL?.trim() || "luiz@devnorm.com.br";
  const phone = (process.env.SITE_WHATSAPP?.trim() || "+55 (41)8777-1267").replace(/\D/g, "");
  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) channels.push({ label: "E-mail", value: email, href: `mailto:${email}` });
  if (phone && /^\d{10,15}$/.test(phone)) channels.push({ label: "WhatsApp", value: phone === "554187771267" ? "+55 (41)8777-1267" : "Conversar pelo WhatsApp", href: `https://wa.me/${phone}` });
  for (const [label, value] of [["GitHub", process.env.SITE_GITHUB_URL], ["LinkedIn", process.env.SITE_LINKEDIN_URL]]) {
    if (!value) continue;
    try { const url = new URL(value); if (url.protocol === "https:") channels.push({ label: label!, value: `Perfil no ${label}`, href: url.href }); } catch { /* Omit invalid optional channels. */ }
  }
  return channels.length ? channels : [
    { label: "E-mail · exemplo", value: "contato@devnorm.example", href: null },
    { label: "WhatsApp · exemplo", value: "+55 (00) 00000-0000", href: null },
  ];
}

export function isContactConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.CONTACT_TO_EMAIL?.trim() && process.env.CONTACT_FROM_EMAIL?.trim());
}
