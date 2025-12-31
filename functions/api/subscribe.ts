
export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const { email } = await request.json();
    if (!email || !email.includes("@")) throw new Error("Invalid email address.");

    // Store in KV
    if (env.SUBSCRIBERS) {
      await env.SUBSCRIBERS.put(`sub:${email}`, JSON.stringify({
        email,
        timestamp: new Date().toISOString(),
        active: true
      }));
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}
