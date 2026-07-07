// Group 1, call 3 of 4: DB read (total row count)
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { count, error } = await supabase
    .from("logs")
    .select("*", { count: "exact", head: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ count }), {
    headers: { "Content-Type": "application/json" },
  });
});
