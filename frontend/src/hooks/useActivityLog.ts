// hooks/useActivityLog.ts
import { useEffect } from "react";
import { api } from "@/lib/api-client";
import { useActivityStore } from "@/store/useActivityStore";
// import { ActivityDTO } from "@/types/activity";
import { useAuth } from "@clerk/nextjs";

export function useActivityLog() {
  const { getToken } = useAuth();
  const {
    activities,
    isLoading,
    setActivities,
    setLoading,
  } = useActivityStore();

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const token = await getToken();

        const data = await api<ActivityDTO[]>("/activity", {
          token,
        });

        if (mounted) setActivities(data);
      } catch (e) {
        console.error("Failed to load activity log", e);
        setActivities([]);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return {
    activities,
    isLoading,
  };
}
