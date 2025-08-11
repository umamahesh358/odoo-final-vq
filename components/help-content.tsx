"use client"

import type React from "react"

import { useState } from "react"
import {
  ArrowLeft,
  Search,
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
  notHelpful: number
}

const faqData: FAQItem[] = [
  {
    id: "1",
    question: "How do I book a sports venue?",
    answer:
      "To book a venue, browse our available facilities, select your preferred date and time, and complete the payment process. You'll receive a confirmation email with all the details.",
    category: "Booking",
    helpful: 45,
    notHelpful: 3,
  },
  {
    id: "2",
    question: "Can I cancel or modify my booking?",
    answer:
      "Yes, you can cancel or modify your booking up to 24 hours before the scheduled time. Go to 'My Bookings' and select the booking you want to change. Cancellation fees may apply depending on the venue's policy.",
    category: "Booking",
    helpful: 38,
    notHelpful: 7,
  },
  {
    id: "3",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and digital wallets like Apple Pay and Google Pay. All transactions are secure and encrypted.",
    category: "Payment",
    helpful: 52,
    notHelpful: 2,
  },
  {
    id: "4",
    question: "How do I get a refund?",
    answer:
      "Refunds are processed according to the venue's cancellation policy. Generally, cancellations made 24+ hours in advance receive a full refund, while later cancellations may incur fees. Refunds typically take 3-5 business days to process.",
    category: "Payment",
    helpful: 29,
    notHelpful: 8,
  },
  {
    id: "5",
    question: "How do I become a facility owner on QuickCourt?",
    answer:
      "To list your facility, create an account and select 'Facility Owner' as your role. Then submit your venue details, photos, and pricing. Our team will review and approve your listing within 2-3 business days.",
    category: "Facility Owners",
    helpful: 33,
    notHelpful: 4,
  },
]

export function HelpContent() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [openFAQs, setOpenFAQs] = useState<string[]>([])
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  })

  const categories = ["all", ...Array.from(new Set(faqData.map((faq) => faq.category)))]

  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFAQ = (id: string) => {
    setOpenFAQs((prev) => (prev.includes(id) ? prev.filter((faqId) => faqId !== id) : [...prev, id]))
  }

  const handleFeedback = (faqId: string, isHelpful: boolean) => {
    toast({
      title: "Thank you!",
      description: `Your feedback helps us improve our help content.`,
    })
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactForm.subject || !contactForm.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    })

    setContactForm({ subject: "", message: "" })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-4 text-blue-600 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Contact Support
              </CardTitle>
              <CardDescription>Need immediate help? Choose your preferred contact method</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-auto p-4 flex flex-col items-center gap-2 bg-blue-600 hover:bg-blue-700">
                  <MessageCircle className="h-6 w-6" />
                  <span className="font-medium">Live Chat</span>
                  <span className="text-xs opacity-90">Available 24/7</span>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                  <Phone className="h-6 w-6" />
                  <span className="font-medium">Call Us</span>
                  <span className="text-xs text-gray-600">+1 (555) 123-4567</span>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                  <Mail className="h-6 w-6" />
                  <span className="font-medium">Email</span>
                  <span className="text-xs text-gray-600">support@quickcourt.com</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Search */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Search our knowledge base for quick answers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                      {category === "all" ? "All" : category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* FAQ Items */}
              <div className="space-y-4">
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No FAQs found matching your search.</p>
                  </div>
                ) : (
                  filteredFAQs.map((faq) => (
                    <Collapsible key={faq.id} open={openFAQs.includes(faq.id)} onOpenChange={() => toggleFAQ(faq.id)}>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-between p-4 h-auto text-left hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary">{faq.category}</Badge>
                            <span className="font-medium">{faq.question}</span>
                          </div>
                          {openFAQs.includes(faq.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-4 pb-4">
                        <p className="text-gray-700 mb-4">{faq.answer}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">Was this helpful?</span>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleFeedback(faq.id, true)}
                                className="h-8 px-2"
                              >
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                {faq.helpful}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleFeedback(faq.id, false)}
                                className="h-8 px-2"
                              >
                                <ThumbsDown className="h-3 w-3 mr-1" />
                                {faq.notHelpful}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>Can't find what you're looking for?</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, subject: e.target.value }))}
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Describe your issue or question..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                    rows={4}
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Additional Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="ghost" className="w-full justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                User Guide
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                Video Tutorials
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                Community Forum
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                API Documentation
              </Button>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">All Systems Operational</span>
              </div>
              <p className="text-xs text-gray-600">Last updated: 2 minutes ago</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
