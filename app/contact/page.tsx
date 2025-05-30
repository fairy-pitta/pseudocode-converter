import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, User, MessageCircle } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Contact Us</CardTitle>
          <CardDescription>Have questions, feedback, or suggestions? We'd love to hear from you!</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" /> Name
              </Label>
              <Input id="name" placeholder="Your Name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </Label>
              <Input id="email" type="email" placeholder="your.email@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> Message
              </Label>
              <Textarea id="message" placeholder="Your message..." rows={5} />
            </div>
            <Button type="submit" className="w-full bg-gray-800 hover:bg-gray-700 text-white">
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
