import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabase = createClient();

  console.log("rte");
}
