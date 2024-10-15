import { corsHeaders } from "../_shared/cors";
import { newResponse } from "../_shared/new-response";
import { supabase } from "../_shared/supabase-client";

import * as bcrypt from "https://deno.land/x/bcrypt@v0.3.0/mod";
import "jsr:@supabase/functions-js/edge-runtime.d";
import * as crypto from "node:crypto";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { username, password } = await req.json();

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !user) {
      return newResponse({
        status: 404,
        body: { code: "not_found", message: "User not found" },
      });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return newResponse({
        status: 401,
        body: { code: "wrong_password", message: "Wrong password" },
      });
    }

    delete user.password;

    const challenges = crypto.randomBytes(32).toString("hex");

    const { error: insertError } = await supabase.from("challenges").insert({
      username,
      challenges,
    });

    console.log("challenge", insertError);
    return newResponse({
      status: 200,
      body: { ...user, challenges },
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/sign-in' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"username":"sagron","password":"Sol12345"}'

*/
