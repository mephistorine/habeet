import {InjectionToken} from "@angular/core";
import {createClient} from "@supabase/supabase-js";
import {Database} from "./database.types";

export const SUPABASE_CLIENT = new InjectionToken("SUPABASE_CLIENT", {
    providedIn: "root",
    factory: () => {
        return createClient<Database>("https://iaewzdhwndperywinnwu.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhZXd6ZGh3bmRwZXJ5d2lubnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMjU2NDUsImV4cCI6MjA2NDkwMTY0NX0.mRLVVQx1mJKivXBA7G1RRN0-PeXBKvh7dU7rivtzAWI");
    },
});
