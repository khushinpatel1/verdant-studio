// Cloudflare Pages Function — POST /api/waitlist
// Captures a waitlist email and stores it to KV. Designed to never hard-error:
// if the KV binding is missing it logs and still returns 200, so the marketing
// funnel never throws in a visitor's face just because storage isn't wired yet.
//
// KP-OWED: bind WAITLIST KV namespace in Pages dashboard + redeploy for storage to persist

interface Env {
  WAITLIST?: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  let email = "";
  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = (await request.json()) as { email?: string };
      email = (body.email || "").trim();
    } else {
      const form = await request.formData();
      email = String(form.get("email") || "").trim();
    }
  } catch {
    // unparseable body — treat as no email
  }

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return new Response("A real email, please.", { status: 400 });
  }

  const timestamp = new Date().toISOString();

  if (!env.WAITLIST) {
    // KV binding missing — return 503 instead of silently losing the signup
    console.log(`[waitlist] ${email} @ ${timestamp} (WAITLIST KV unbound — not persisted)`);
    return new Response("Signups aren't wired up yet — email us at verdantmail@proton.me", { status: 503 });
  }

  try {
    await env.WAITLIST.put(email, timestamp);
    return new Response("You're on the list.", { status: 200 });
  } catch (err) {
    // KV write failed — return 503 instead of pretending success
    console.error("WAITLIST.put failed", err);
    return new Response("Signups aren't wired up yet — email us at verdantmail@proton.me", { status: 503 });
  }
};
