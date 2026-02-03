"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api-client";
import { useSolutionsStore } from "@/store/solutions.store";
import { API_ROUTES } from "@/routes";

export function useSolutions(questionId: string) {
  const { getToken } = useAuth()
  const store = useSolutionsStore()
  console.log(questionId)
  useEffect(() => {
    let mounted = true

    async function load() {
      store.setLoading(true)
      const token = await getToken()
      const data = await api<Solution[]>(
        API_ROUTES.CODING.GET_SUBMISSIONS(questionId),
        { token }
      )
      if (mounted) store.setSolutions(data)
    }

    load()
    return () => { mounted = false }
  }, [questionId])

  return store
}

