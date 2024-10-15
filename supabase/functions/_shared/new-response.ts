import { corsHeaders } from "./cors.ts";

type Props = {
  body: any;
  status: number;
};

export const newResponse = ({ status, body }: Props) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
