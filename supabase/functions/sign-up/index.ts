import { corsHeaders } from "../_shared/cors";
import { newResponse } from "../_shared/new-response";
import { supabase } from "../_shared/supabase-client";

import * as bcrypt from "https://deno.land/x/bcrypt@v0.3.0/mod";
import "jsr:@supabase/functions-js/edge-runtime.d";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { username, password, email } = await req.json();

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
      .select("username, email, isEnabledTwoFA")
      .single();

    if (insertError) {
      return newResponse({
        status: 400,
        body: { code: "internal_error", message: "Failed to create user." },
      });
    }
    delete newUser.password;

    return newResponse({
      status: 200,
      body: newUser,
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
