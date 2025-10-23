// Import types for Supabase Edge Functions
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

console.log("Serverless function for new notifications is running.");

// Twilio credentials (replace with your actual credentials)
const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER"); 
const TARGET_PHONE_NUMBER = "+31623009434"; // Recipient phone number

Deno.serve(async (req) => {
  // log that we received a request
  console.log("Received request:", req);
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Parse the query string parameters
    const params = new URL(req.url).searchParams;

    // Extract the notification details
    const id = params.get("id");
    const status = params.get("status");
    const message = params.get("message");
    const detected_at = params.get("detected_at");
    

    // Create the SMS message body
    const smsMessage = `
      🚨 New Notification 🚨
      ID: ${id}
      Status: ${status}
      Message: ${message}
      Detected At: ${detected_at}
    `;

    // Twilio REST API URL
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

    // Make the request to Twilio's API to send an SMS
    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        To: TARGET_PHONE_NUMBER,
        From: TWILIO_PHONE_NUMBER,
        Body: smsMessage.trim(),
      })
    });

    if (!response.ok) {
      throw new Error(`Twilio API Error: ${response.statusText}`);
    }

    console.log("SMS sent successfully!");

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing notification:", error);

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
