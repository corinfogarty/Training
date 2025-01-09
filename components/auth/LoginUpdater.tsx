'use client'

import { useSession } from "next-auth/react"
import { useEffect } from "react"

export function LoginUpdater() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user) {
      fetch("/api/auth/update-login", { method: "POST" })
        .catch(error => console.error("Error updating login:", error))
    }
  }, [session])

  return null
} 