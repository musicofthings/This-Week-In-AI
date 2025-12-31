
export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const { email } = await request.json();
    if (!email || !email.includes("@")) throw new Error("Invalid email.");

    if (env.SUBSCRIBERS) {
      await env.SUBSCRIBERS.put(`user:${email}`, JSON.stringify({
        lastLogin: new Date().toISOString()
      }));
    }

    return new Response(JSON.stringify({ 
      success: true, 
      token: btoa(email + Date.now()) 
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}
