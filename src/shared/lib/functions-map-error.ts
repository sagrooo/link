import { FunctionsHttpError } from "@supabase/supabase-js";

export const functionsMapError = async (error: unknown) => {
  if (error && error instanceof FunctionsHttpError) {
    throw await error.context.json();
  }
};
