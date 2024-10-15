import { corsHeaders } from "_shared/cors.ts";
import { newResponse } from "_shared/new-response.ts";
import { supabase } from "_shared/supabase-client.ts";

import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { create } from "https://deno.land/x/djwt/mod.ts";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import * as crypto from "node:crypto";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const JWT_SECRET = Deno.env.get("JWT_SECRET");

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

    const payload = {
      id: user.id,
      username: user.username,
      twoFactorType: user.twoFactorType,
      secret: user.secret,
      challenges: user.challenges,
    };

    if (user.twoFactorType === "pgp") {
      const challenges = crypto.randomBytes(32).toString("hex");
      payload.challenges = challenges;

      const { error: insertError } = await supabase.from("challenges").insert({
        username,
        challenges,
      });
    }

    const key = await crypto.subtle.generateKey(
      { name: "HMAC", hash: "SHA-512" },
      true,
      ["sign", "verify"],
    );

    const token = await create({ alg: "HS512", typ: "JWT" }, payload, key);

    return newResponse({
      status: 200,
      body: { token },
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
