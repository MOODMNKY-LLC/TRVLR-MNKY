'use client'

import { Button } from "@/components/ui/button"
import { Rocket } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function BungieAuthButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleAuth = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/bungie/auth')
      const { url } = await response.json()
      router.push(url)
    } catch (error) {
      console.error('Error initiating Bungie auth:', error)
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleAuth}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? (
        <Rocket className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Rocket className="mr-2 h-4 w-4" />
      )}
      Link Bungie Account
    </Button>
  )
} 