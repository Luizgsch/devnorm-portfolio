"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { contactMessage, demandOptions, emptyContact, validateContact, type ContactData, type ContactErrors } from "@/lib/contact";
import { Arrow } from "./SiteChrome";
import styles from "../site.module.css";

export default function ContactForm({ available, initialDemand }: { available: boolean; initialDemand?: string }) {
  const form = useRef<HTMLFormElement>(null);
  const requestId = useRef<string | null>(null);
  const [values, setValues] = useState<ContactData>({ ...emptyContact, demand: demandOptions.some((option) => option.value === initialDemand) ? initialDemand! : "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error" | "copied">("idle");
  const [message, setMessage] = useState("");

  function change(field: keyof ContactData, value: string) {
    setValues((current) => ({ ...current, [field]: value, ...(field === "method" ? { contact: "" } : {}) }));
    setErrors((current) => ({ ...current, [field]: undefined, ...(field === "method" ? { contact: undefined } : {}) }));
    if (status !== "sending") { setStatus("idle"); setMessage(""); }
  }

  function validate() {
    const result = validateContact(values);
    setErrors(result.errors);
    if (!result.valid) {
      setStatus("error"); setMessage("Revise os campos indicados antes de continuar.");
      const field = Object.keys(result.errors)[0];
      (form.current?.elements.namedItem(field) as HTMLElement | null)?.focus();
    }
    return result;
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const result = validate();
    if (!result.valid) return;
    if (!available) { setStatus("error"); setMessage("O envio está indisponível. Nenhuma mensagem foi enviada."); return; }
    setStatus("sending"); setMessage("Enviando sua mensagem…");
    requestId.current ??= crypto.randomUUID();
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...result.data, requestId: requestId.current }), signal: AbortSignal.timeout(15_000) });
      const outcome = await response.json();
      if (!response.ok || outcome.ok !== true) {
        setStatus("error"); setMessage(typeof outcome.error === "string" ? outcome.error : "Não foi possível confirmar o envio. Tente novamente.");
        if (outcome.fields) setErrors(outcome.fields);
        return;
      }
      setStatus("success"); setMessage("Mensagem encaminhada. Responderei pelo canal que você informou.");
      setValues({ ...emptyContact }); setErrors({}); requestId.current = null;
    } catch { setStatus("error"); setMessage("Não foi possível confirmar o envio. Verifique sua conexão e tente novamente. Seu texto foi mantido."); }
  }

  async function copy() {
    const result = validate();
    if (!result.valid) return;
    try { await navigator.clipboard.writeText(contactMessage(result.data)); setStatus("copied"); setMessage("Texto copiado. Ele ainda não foi enviado."); }
    catch { setStatus("error"); setMessage("O navegador não permitiu copiar. Selecione e copie os campos manualmente."); }
  }

  function fieldError(field: keyof ContactData) { return errors[field] ? <span className={styles.fieldError} id={`${field}-error`}>{errors[field]}</span> : null; }
  const busy = status === "sending";
  return <form className={styles.form} ref={form} onSubmit={submit} noValidate aria-label="Descreva seu projeto" aria-busy={busy}>
    {!available && <p className={styles.formNotice} id="form-availability">O envio pelo formulário ainda está indisponível. Você pode preparar e copiar sua mensagem.</p>}
    <fieldset disabled={busy}>
      <legend className={styles.srOnly}>Informações para contato</legend>
      <div className={styles.field}><label htmlFor="name">Seu nome</label><input id="name" name="name" autoComplete="name" placeholder="Como posso chamar você?" value={values.name} onChange={(e) => change("name", e.target.value)} required minLength={2} maxLength={100} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />{fieldError("name")}</div>
      <div className={styles.formRow}><div className={styles.field}><label htmlFor="method">Prefere conversar por</label><select id="method" name="method" value={values.method} onChange={(e) => change("method", e.target.value)} required aria-invalid={Boolean(errors.method)} aria-describedby={errors.method ? "method-error" : undefined}><option value="email">E-mail</option><option value="whatsapp">WhatsApp</option></select>{fieldError("method")}</div><div className={styles.field}><label htmlFor="contact">{values.method === "email" ? "Seu e-mail" : "WhatsApp com DDD"}</label><input id="contact" name="contact" type={values.method === "email" ? "email" : "tel"} autoComplete={values.method === "email" ? "email" : "tel"} placeholder={values.method === "email" ? "voce@empresa.com" : "+55 (00) 00000-0000"} value={values.contact} onChange={(e) => change("contact", e.target.value)} required maxLength={values.method === "email" ? 254 : 30} aria-invalid={Boolean(errors.contact)} aria-describedby={errors.contact ? "contact-error" : undefined} />{fieldError("contact")}</div></div>
      <div className={styles.field}><label htmlFor="demand">Do que você precisa?</label><select id="demand" name="demand" value={values.demand} onChange={(e) => change("demand", e.target.value)} required aria-invalid={Boolean(errors.demand)} aria-describedby={errors.demand ? "demand-error" : undefined}><option value="" disabled>Selecione uma opção</option>{demandOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>{fieldError("demand")}</div>
      <div className={styles.field}><label htmlFor="description">Conte um pouco sobre a demanda</label><textarea id="description" name="description" rows={4} placeholder="O que você quer construir ou melhorar? Como funciona hoje?" value={values.description} onChange={(e) => change("description", e.target.value)} minLength={20} maxLength={5000} required aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "description-error description-hint" : "description-hint"} /><div className={styles.fieldMeta}><span id="description-hint">De 20 a 5.000 caracteres.</span><span>{values.description.length.toLocaleString("pt-BR")} / 5.000</span></div>{fieldError("description")}</div>
      <div className={styles.honeypot} aria-hidden="true"><label htmlFor="website">Deixe este campo vazio</label><input id="website" name="website" value={values.website} onChange={(e) => change("website", e.target.value)} autoComplete="off" tabIndex={-1} /></div>
      <p className={styles.formPrivacy}>Seus dados serão usados para responder a esta solicitação. <Link href="/privacidade">Como são tratados</Link>.</p>
      <div className={styles.formActions}><button className={styles.primaryAction} type="submit" disabled={!available || busy} aria-describedby={!available ? "form-availability" : undefined}>{busy ? "Enviando…" : available ? "Enviar mensagem" : "Envio indisponível"}<Arrow /></button>{!available && <button className={styles.copyButton} type="button" onClick={copy}>Copiar mensagem</button>}</div>
    </fieldset>
    <div className={`${styles.formStatus} ${status === "error" ? styles.errorStatus : ""}`} role={status === "error" ? "alert" : "status"} aria-live="polite" aria-atomic="true">{message}</div>
    <noscript><p>Ative o JavaScript para usar este formulário.</p></noscript>
  </form>;
}
