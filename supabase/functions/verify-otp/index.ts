import { corsHeaders } from "../_shared/cors";
import { newResponse } from "../_shared/new-response";
import { supabase } from "_shared/supabase-client";

import "jsr:@supabase/functions-js/edge-runtime.d";
import { authenticator } from "npm:otplib";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { otp, secret, username } = await req.json();
    const isValid = authenticator.verify({ token: otp, secret });

    if (!isValid) {
      return newResponse({
        status: 401,
        body: { code: "invalid_code", message: "Token is not valid" },
      });
    }

    await supabase
      .from("users")
      .update({ twoFactorType: "google", secret })
      .eq("username", username);

    return newResponse({
      status: 200,
      body: { message: "Token is valid" },
    });
  } catch (error) {
    return newResponse({
      status: 500,
      body: { code: "internal_error", message: error.message },
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/verify-otp' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'
*/
