import { createContactHandler } from "@/lib/contact-handler";

export const runtime = "nodejs";
export const POST = createContactHandler({ config: () => ({ apiKey: process.env.RESEND_API_KEY?.trim(), from: process.env.CONTACT_FROM_EMAIL?.trim(), to: process.env.CONTACT_TO_EMAIL?.trim() }) });
