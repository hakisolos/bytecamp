"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { fetchUserData } from "@/lib/auth"

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getUser = async () => {
            try {
                const data = await fetchUserData()
                setUser(data)
            } catch (error) {
                console.error("Failed to fetch user:", error)
            } finally {
                setLoading(false)
            }
        }

        getUser()
    }, [])

    return (
        <ProtectedRoute>
            <div className="p-4">
                {loading ? (
                    <p className="text-gray-600">Loading user info...</p>
                ) : user ? (
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm">
                        {JSON.stringify(user, null, 2)}
                    </pre>
                ) : (
                    <p className="text-red-500">No user data found 😢</p>
                )}
            </div>
        </ProtectedRoute>
    )
}
