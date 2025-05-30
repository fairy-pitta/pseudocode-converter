'use client'
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Star } from "lucide-react"

const handlePortfolioClick = () => {
  window.open('https://singbirds.net/?section=contact#contact', '_blank')
}

const handleGithubClick = () => {
  window.open('https://github.com/fairy-pitta/pseudocode-converter', '_blank')
}

const handleIssueClick = () => {
  window.open('https://github.com/fairy-pitta/pseudocode-converter/issues/new', '_blank')
}

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Get in Touch</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Have questions, feedback, or suggestions about the Pseudocode Converter? I'd love to hear from you!
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Portfolio Card */}
        <Card className="flex flex-col h-full justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image src="/pitta-gpt.png" alt="Portfolio" width={24} height={24} className="rounded-full" />
              Contact via Portfolio
            </CardTitle>
            <CardDescription>
              Visit my portfolio website to get in touch directly
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 justify-end">
            <p className="text-sm text-gray-600 mb-4">
              For direct communication, you can reach out through my portfolio's contact section.
            </p>
            <Button 
              onClick={handlePortfolioClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Visit Portfolio Contact
            </Button>
          </CardContent>
        </Card>
        {/* Issues Card */}
        <Card className="flex flex-col h-full justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              Report Issues or Suggestions
            </CardTitle>
            <CardDescription>
              Found a bug or have a feature request?
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 justify-end">
            <p className="text-sm text-gray-600 mb-4">
              Please create an issue on GitHub to report bugs, request features, or share suggestions for improvement.
            </p>
            <Button 
              onClick={handleIssueClick}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white"
            >
              Create GitHub Issue
            </Button>
          </CardContent>
        </Card>
      </div>
      {/* Star Section */}
      <Card className="mt-6">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Show Your Support
          </CardTitle>
          <CardDescription>
            If you find this project helpful, please consider giving it a star!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            Your support means a lot and helps motivate continued development. A simple star on GitHub goes a long way in encouraging open-source projects like this one.
          </p>
          <div className="flex justify-center">
            <Button 
              onClick={handleGithubClick}
              className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-2"
            >
              <Star className="w-4 h-4" />
              Star on GitHub
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          This project is open-source and maintained by{' '}
          <a 
            href="https://singbirds.net" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            SingBirds
          </a>
          . Thank you for your interest and support!
        </p>
      </div>
    </div>
  )
}
