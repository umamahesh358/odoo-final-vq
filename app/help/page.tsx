"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, Phone, MessageCircle, Mail, ExternalLink, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
}

const faqData: FAQItem[] = [
  {
    id: "1",
    question: "How do I book a venue?",
    answer:
      "To book a venue, browse our available venues on the homepage, select your preferred venue, choose your date and time, and complete the booking process with payment.",
    category: "Booking",
    helpful: 45,
  },
  {
    id: "2",
    question: "Can I cancel my booking?",
    answer:
      "Yes, you can cancel your booking up to 24 hours before the scheduled time. Go to 'My Bookings' and click the cancel button. Refunds will be processed according to our cancellation policy.",
    category: "Booking",
    helpful: 32,
  },
  {
    id: "3",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our encrypted payment system.",
    category: "Payment",
    helpful: 28,
  },
  {
    id: "4",
    question: "How do I become a venue owner?",
    answer:
      "To list your venue on QuickCourt, click on 'Become a Partner' in the footer, fill out the venue registration form, and our team will review your application within 2-3 business days.",
    category: "Venue Owner",
    helpful: 19,
  },
  {
    id: "5",
    question: "What if I need to change my booking time?",
    answer:
      "You can modify your booking time up to 12 hours before the scheduled time, subject to availability. Go to 'My Bookings' and click 'Modify' to see available time slots.",
    category: "Booking",
    helpful: 23,
  },
  {
    id: "6",
    question: "Is there a mobile app available?",
    answer:
      "Yes! QuickCourt is available on both iOS and Android. Download it from the App Store or Google Play Store for a better mobile experience.",
    category: "General",
    helpful: 41,
  },
  {
    id: "7",
    question: "How do refunds work?",
    answer:
      "Refunds are processed within 5-7 business days after cancellation. The refund amount depends on when you cancel: 24+ hours = full refund, 12-24 hours = 50% refund, less than 12 hours = no refund.",
    category: "Payment",
    helpful: 37,
  },
  {
    id: "8",
    question: "Can I book multiple time slots?",
    answer:
      "Yes, you can book multiple consecutive time slots for the same venue. During booking, select your start time and extend the duration, or make separate bookings for different time periods.",
    category: "Booking",
    helpful: 15,
  },
]

export default function HelpPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredFAQs, setFilteredFAQs] = useState(faqData)
  const [openItems, setOpenItems] = useState<string[]>([])

  const categories = ["all", "Booking", "Payment", "Venue Owner", "General"]

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
      return
    }
  }, [user, loading, router])

  // Filter FAQs based on search and category
  useEffect(() => {
    let filtered = faqData

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((faq) => faq.category === selectedCategory)
    }

    setFilteredFAQs(filtered)
  }, [searchTerm, selectedCategory])

  const toggleItem = (itemId: string) => {
    setOpenItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
            <p className="text-gray-600">Find answers to common questions or get in touch with our team</p>
          </div>
        </div>

        {/* Contact Support */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Phone className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-sm text-gray-600 mb-3">Mon-Fri, 9AM-6PM EST</p>
              <p className="font-medium text-blue-600">+1 (555) 123-4567</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-sm text-gray-600 mb-3">Available 24/7</p>
              <p className="font-medium text-green-600">Start Chat</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Mail className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-sm text-gray-600 mb-3">Response within 24 hours</p>
              <p className="font-medium text-purple-600">support@quickcourt.com</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search frequently asked questions..."
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
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No questions found matching your search.</p>
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                  }}
                  className="text-blue-600"
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              filteredFAQs.map((faq) => (
                <Collapsible key={faq.id} open={openItems.includes(faq.id)} onOpenChange={() => toggleItem(faq.id)}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-4 h-auto text-left hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        <Badge variant="secondary" className="text-xs">
                          {faq.category}
                        </Badge>
                      </div>
                      {openItems.includes(faq.id) ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 pb-4">
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-gray-700 mb-3">{faq.answer}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{faq.helpful} people found this helpful</span>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                            👍 Helpful
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            👎 Not helpful
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))
            )}
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="justify-between h-auto p-4 bg-transparent"
                onClick={() => window.open("/user-guide", "_blank")}
              >
                <div className="text-left">
                  <p className="font-medium">User Guide</p>
                  <p className="text-sm text-gray-600">Complete guide to using QuickCourt</p>
                </div>
                <ExternalLink className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="justify-between h-auto p-4 bg-transparent"
                onClick={() => window.open("/video-tutorials", "_blank")}
              >
                <div className="text-left">
                  <p className="font-medium">Video Tutorials</p>
                  <p className="text-sm text-gray-600">Step-by-step video guides</p>
                </div>
                <ExternalLink className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="justify-between h-auto p-4 bg-transparent"
                onClick={() => window.open("/community-forum", "_blank")}
              >
                <div className="text-left">
                  <p className="font-medium">Community Forum</p>
                  <p className="text-sm text-gray-600">Connect with other users</p>
                </div>
                <ExternalLink className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="justify-between h-auto p-4 bg-transparent"
                onClick={() => window.open("/api-docs", "_blank")}
              >
                <div className="text-left">
                  <p className="font-medium">API Documentation</p>
                  <p className="text-sm text-gray-600">For developers and integrations</p>
                </div>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Still Need Help */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Still need help?</h3>
            <p className="text-blue-700 mb-4">
              Can't find what you're looking for? Our support team is here to help you.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">Contact Support</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
