"use client"

import * as React from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowLeftIcon } from "lucide-react"

export default function ContactPage() {
    const [message, setMessage] = React.useState("")

    const handleClick = () => {
        if (!message) return
        const encoded = encodeURIComponent(message)
        const url = `https://wa.me/2349112171078?text=${encoded}`
        window.open(url, "_blank")
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 relative">

                {/* Back Arrow */}
                <Link href="/" className="absolute top-5 left-5 flex items-center text-gray-700 hover:text-blue-600 transition">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Home
                </Link>

                {/* Title */}
                <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-900">Contact Us</h1>

                {/* Form */}
                <div className="flex flex-col gap-6">
                    <div>
                        <Label htmlFor="message" className="text-gray-700 font-medium">Your Message</Label>
                        <Input
                            id="message"
                            placeholder="Type your message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="mt-2 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <Button
                        onClick={handleClick}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl py-3 shadow-md transition transform hover:scale-105"
                    >
                        Send via WhatsApp
                    </Button>
                </div>
            </div>
        </main>
    )
}
