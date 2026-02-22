"use client";

import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

const supabase = createClient();

async function logout() {
await supabase.auth.signOut();
location.href = "/login";
}

<LogOut onClick={logout} className="cursor-pointer text-muted-foreground" />
