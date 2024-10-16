// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
// Setup type definitions for built-in Supabase Runtime APIs
import { corsHeaders } from "../_shared/cors.ts";
import { newResponse } from "../_shared/new-response.ts";
import { supabase } from "../_shared/supabase-client.ts";

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createMessage, readKey, readSignature, verify } from "npm:openpgp";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { signedMessage, username } = await req.json();

  try {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (userError) {
      throw new Error(`userError: ${userError.message}`);
    }

    const {
      data: { id: challengeId, challenge, expiresAt },
      error: challengeError,
    } = await supabase
      .from("challenges")
      .select("*")
      .eq("userId", user.id)
      .order("createdAt", { ascending: false })
      .limit(1)
      .single();

    if (challengeError) {
      throw new Error(`challengeError: ${challengeError.message}`);
    }

    const now = new Date();

    if (now > new Date(expiresAt)) {
      return newResponse({
        status: 400,
        body: { code: "challenge_expired", message: "Вызов истёк" },
      });
    }

    const publicKey = user.secret;

    const publicKeyObj = await readKey({ armoredKey: publicKey });
    const { data } = await verify({
      message: await createMessage({ text: challenge }),
      signature: await readSignature({ armoredSignature: signedMessage }),
      verificationKeys: publicKeyObj,
    });

    if (data !== challenge) {
      return newResponse({
        status: 400,
        body: { code: "invalid_challenge", message: "Вызов не совпадает" },
      });
    }

    await supabase
      .from("users")
      .update({ twoFactorType: "pgp" })
      .eq("username", username);
    await supabase.from("challenges").delete().eq("id", challengeId);

    return newResponse({
      status: 200,
      body: { status: "success" },
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/verify-pgp' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"username":"sagro2", "signedMessage":"bfccab08-968a-407e-94c2-2a398e63bb1c", }'

*/
