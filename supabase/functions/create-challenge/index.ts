// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
// Setup type definitions for built-in Supabase Runtime APIs
import { corsHeaders } from "../_shared/cors.ts";
import { newResponse } from "../_shared/new-response.ts";
import { supabase } from "../_shared/supabase-client.ts";

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const FIVE_MINUTES = 5 * 60 * 1000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { username } = await req.json();

  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    const challenge = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + FIVE_MINUTES);

    const { error: insertError } = await supabase
      .from("challenges")
      .insert([{ userId: users.id, challenge, expiresAt }]);

    if (insertError) {
      return newResponse({
        status: 500,
        body: { code: "internal_error", error: insertError },
      });
    }

    return newResponse({
      status: 200,
      body: { challenge },
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-challenge' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
