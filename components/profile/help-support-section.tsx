"use client"

import { MessageCircle, Phone, Mail, FileText, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function HelpSupportSection() {
  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      action: "Start Chat",
      available: "24/7",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us for immediate assistance",
      action: "+91 80-1234-5678",
      available: "9 AM - 9 PM IST",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us your questions and concerns",
      action: "support@quickcourt.com",
      available: "Response within 24 hours",
    },
  ]

  const faqCategories = [
    {
      title: "Booking & Payments",
      questions: [
        "How do I book a venue?",
        "What payment methods are accepted?",
        "Can I cancel or modify my booking?",
        "How do refunds work?",
      ],
    },
    {
      title: "Account & Profile",
      questions: [
        "How do I update my profile?",
        "How do I change my password?",
        "How do I delete my account?",
        "How do I verify my email?",
      ],
    },
    {
      title: "Venues & Facilities",
      questions: [
        "How do I find venues near me?",
        "What amenities are available?",
        "How do I contact venue owners?",
        "How do I report an issue with a venue?",
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportOptions.map((option, index) => {
              const Icon = option.icon
              return (
                <div key={index} className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                  <Button variant="outline" className="mb-2 bg-transparent">
                    {option.action}
                  </Button>
                  <p className="text-xs text-gray-500">{option.available}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {faqCategories.map((category, index) => (
              <div key={index} className="space-y-4">
                <h3 className="font-semibold text-gray-900">{category.title}</h3>
                <div className="space-y-2">
                  {category.questions.map((question, qIndex) => (
                    <button
                      key={qIndex}
                      className="text-left text-sm text-blue-600 hover:text-blue-800 hover:underline block"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t text-center">
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              View All FAQs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
              <div className="text-left">
                <h4 className="font-medium">User Guide</h4>
                <p className="text-sm text-gray-600">Learn how to use QuickCourt effectively</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
              <div className="text-left">
                <h4 className="font-medium">Terms of Service</h4>
                <p className="text-sm text-gray-600">Read our terms and conditions</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
              <div className="text-left">
                <h4 className="font-medium">Privacy Policy</h4>
                <p className="text-sm text-gray-600">Understand how we protect your data</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
              <div className="text-left">
                <h4 className="font-medium">Community Guidelines</h4>
                <p className="text-sm text-gray-600">Learn about our community standards</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
