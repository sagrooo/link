import { corsHeaders } from "../_shared/cors.ts";
import { newResponse } from "../_shared/new-response.ts";
import { supabase } from "../_shared/supabase-client.ts";

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

console.log("Hello from Functions!");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { secret, username } = await req.json();

    await supabase
      .from("users")
      .update({ twoFactorType: "pgp", secret })
      .eq("username", username);

    return newResponse({
      status: 200,
      body: { message: "PGP ключ успешно добавлен" },
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/add-pgp-key' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"username":"sagrof134f1", "secret": "B82DBB460CAB703B824475DD0D040B4B95E7F54F"}'

*/
