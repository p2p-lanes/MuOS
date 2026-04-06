"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

const CheckoutPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace("/portal")
  }, [router])

  return null
}

export default CheckoutPage
