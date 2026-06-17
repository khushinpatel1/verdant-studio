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

  if (env.WAITLIST) {
    try {
      await env.WAITLIST.put(email, timestamp);
    } catch (err) {
      // storage hiccup — don't fail the visitor; log and carry on
      console.error("WAITLIST.put failed", err);
    }
  } else {
    // Binding absent — fall back to forwarding via console so the signup is
    // at least visible in logs until the KV namespace is bound.
    console.log(`[waitlist] ${email} @ ${timestamp} (WAITLIST KV unbound — not persisted)`);
  }

  return new Response("You're on the list.", { status: 200 });
};
