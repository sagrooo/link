import { corsHeaders } from "../_shared/cors";
import { newResponse } from "../_shared/new-response";
import { supabase } from "../_shared/supabase-client";

import "jsr:@supabase/functions-js/edge-runtime.d";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { username } = await req.json();
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    return newResponse({
      code: 200,
      body: data,
    });
  } catch (error) {
    return newResponse({
      code: 500,
      message: "internal_error",
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/fetch-user' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
