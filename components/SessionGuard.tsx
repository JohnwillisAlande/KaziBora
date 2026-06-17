"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();
  
  // Set your timeout limit here (e.g., 15 minutes = 15 * 60 * 1000)
  const IDLE_TIMEOUT_MS = 30 * 60 * 1000; 
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. The function that kills the session
    const handleLogout = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Only fire if they are actually logged in
      if (session) {
        await supabase.auth.signOut();
        alert("You have been logged out due to inactivity.");
        router.push("/login?message=Session expired due to inactivity. Please log in again.");
      }
    };

    // 2. The function that resets the clock
    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Start a new countdown
      timeoutRef.current = setTimeout(handleLogout, IDLE_TIMEOUT_MS);
    };

    // 3. List of events that prove the user is still there
    const activeEvents = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];

    // Attach the listeners
    activeEvents.forEach((event) => {
      document.addEventListener(event, resetTimer);
    });

    // Start the timer immediately on load
    resetTimer();

    // 4. Cleanup function when the component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      activeEvents.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [router, supabase]);

  // This component doesn't render any UI of its own
  return <>{children}</>;
}