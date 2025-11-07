"use client"

import * as React from "react"
import Link from "next/link"
import { XIcon, MenuIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LandingNavbar() {
    const [open, setOpen] = React.useState(false)

    return (
        <nav className="w-full fixed top-0 z-50 bg-white/90 backdrop-blur-md shadow-md">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Brand */}
                    <div className="text-2xl font-bold text-blue-600">
                        ByteCamp
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6 font-medium text-gray-700">



                        <Link href="/contact" className="hover:text-blue-600 transition">Contact</Link>
                        <Button asChild variant="default" className="bg-blue-600 text-white hover:bg-blue-700 ml-4">
                            <Link href="/signup">Get Started</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setOpen(!open)}>
                            {open ? <XIcon className="w-6 h-6 text-blue-600" /> : <MenuIcon className="w-6 h-6 text-blue-600" />}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden bg-white/95 backdrop-blur-md shadow-lg flex flex-col gap-4 px-6 py-4">



                    <Link href="/contact" className="hover:text-blue-600 transition" onClick={() => setOpen(false)}>Contact</Link>
                    <Button asChild variant="default" className="bg-blue-600 text-white hover:bg-blue-700">
                        <Link href="/signup" onClick={() => setOpen(false)}>signup</Link>
                    </Button>
                </div>
            )}
        </nav>
    )
}
