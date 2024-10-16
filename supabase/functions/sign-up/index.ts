import { corsHeaders } from "../_shared/cors.ts";
import { newResponse } from "../_shared/new-response.ts";
import { supabase } from "../_shared/supabase-client.ts";

import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { create } from "https://deno.land/x/djwt/mod.ts";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import * as crypto from "node:crypto";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { username, password, email } = await req.json();

    if (!username || !password) {
      return newResponse({
        status: 400,
        body: { code: "missing_fields", message: "Missing fields" },
      });
    }

    const { data: existingUser, error: existingUserError } = await supabase
      .from("users")
      .select("username")
      .eq("username", username)
      .limit(1);

    if (existingUser?.length > 0 || existingUserError) {
      return newResponse({
        status: 400,
        body: { code: "already_exist", message: "User already exists" },
      });
    }

    const passwordHash = bcrypt.hashSync(password);

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        username,
        password: passwordHash,
        email,
      })
      .select("username, email")
      .single();

    if (insertError) {
      return newResponse({
        status: 400,
        body: { code: "internal_error", message: insertError },
      });
    }

    const payload = {
      username: newUser.username,
    };

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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/sign-up' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
