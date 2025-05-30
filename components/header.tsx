"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookMarked, BookOpen, FileText, MessageCircleQuestion, } from "lucide-react"


export function AppHeader() {
  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-xl font-semibold hover:text-gray-300">
              <BookMarked className="w-7 h-7" />
              <span>Pseudocode Converter</span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-4">
            <Button variant="ghost" asChild className="text-white hover:bg-gray-700 hover:text-white">
              <Link href="/ib-rules">
                <FileText className="w-4 h-4 mr-2" />
                IB Rules
              </Link>
            </Button>
            <Button variant="ghost" asChild className="text-white hover:bg-gray-700 hover:text-white">
              <Link href="/cambridge-rules">
                <FileText className="w-4 h-4 mr-2" />
                Cambridge Rules
              </Link>
            </Button>
            <Button variant="ghost" asChild className="text-white hover:bg-gray-700 hover:text-white">
              <Link href="/references">
                <BookOpen className="w-4 h-4 mr-2" />
                References
              </Link>
            </Button>
            <Button variant="ghost" asChild className="text-white hover:bg-gray-700 hover:text-white">
              <Link href="/contact">
                <MessageCircleQuestion className="w-6 h-6 mr-2" />
                Contact
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
