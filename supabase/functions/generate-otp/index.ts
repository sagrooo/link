import { corsHeaders } from "../_shared/cors.ts";
import { newResponse } from "../_shared/new-response.ts";

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { authenticator } from "npm:otplib";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { username } = await req.json();
    if (!username) {
      return newResponse({
        status: 400,
        body: { code: "username_missing", message: "Username is required." },
      });
    }

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(username, "link_test", secret);

    return newResponse({
      status: 200,
      body: { otpauthUrl, secret },
    });
  } catch (error) {
    return newResponse({
      status: 500,
      body: { message: error.message, code: "internal_error" },
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-otp' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"username":"testUser"}'
*/
