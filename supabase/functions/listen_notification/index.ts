import { Client } from 'https://deno.land/x/postgres/mod.ts';

// postgresql://postgres:postgres@127.0.0.1:54322/postgres
// Initialize PostgreSQL client
const client = new Client({
  user: 'postgres',
  database: 'postgres',
  password: 'postgres',
  hostname: '127.0.0.1',
  port: 54322,
});

// lo
console.log('Connecting to PostgreSQL...');

await client.connect();

// Set up a listener for the pg_notify event
await client.query('LISTEN new_notification');

// Handle the notifications
client.on('notification', async (msg) => {
  console.log('Received notification:', msg.payload);

  // Parse the payload
  const payload = JSON.parse(msg.payload);

  // Now you can call the Edge Function to handle the SMS
  const response = await fetch('http://127.0.0.1:54321/functions/v1/new_notification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    console.log("Notification processed successfully.");
  } else {
    console.error("Failed to process notification.");
  }
});

// Keep the listener running
console.log('Listening for notifications...');
