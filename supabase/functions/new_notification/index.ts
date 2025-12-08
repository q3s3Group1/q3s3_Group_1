import "jsr:@supabase/functions-js/edge-runtime.d.ts";

declare const Deno: {
  env: { get(name: string): string | undefined };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

console.log("Serverless function for new notifications is running.");

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID") ?? "";
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN") ?? "";
const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER") ?? "";
const TARGET_PHONE_NUMBER = Deno.env.get("TARGET_PHONE_NUMBER") ?? "";

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER || !TARGET_PHONE_NUMBER) {
  console.error("Twilio configuration is missing. Check environment variables.");
}

Deno.serve(async (req: Request): Promise<Response> => {
  console.log("Received request:", req.url, "method:", req.method);

  // Accept BOTH GET (for testing) AND POST (for real use)
  let data: { status?: string; message?: string; detected_at?: string; machine_name?: string };

  try {
    if (req.method === "POST") {
      data = await req.json();
    } else if (req.method === "GET") {
      const p = new URL(req.url).searchParams;
      data = {
        status: p.get("status") ?? "",
        message: p.get("message") ?? "",
        detected_at: p.get("detected_at") ?? "",
        machine_name: p.get("machine_name") ?? "",
      };
    } else {
      return new Response("Method not allowed", { status: 405 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const smsMessage = `
🚨 MACHINE FAILURE ALERT 🚨
Machine: ${data.machine_name || "Unknown"}
Status: ${data.status}
Message: ${data.message}
Detected At: ${data.detected_at}
`.trim();

  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

  try {
    const response = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: TARGET_PHONE_NUMBER,
        From: TWILIO_PHONE_NUMBER,
        Body: smsMessage,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Twilio API Error:", response.status, text);
      return new Response(JSON.stringify({ error: text }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
