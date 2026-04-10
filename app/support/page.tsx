'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Mail, MessageSquare, BookOpen, Users, Clock, AlertCircle, CheckCircle } from 'lucide-react'

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const faqs = [
    {
      question: "How do I list my agent on the marketplace?",
      answer: "Go to your dashboard and click 'List Your Agent'. Fill in the required details including your agent's description, category, pricing model, and API endpoint. Once submitted, our team will review it within 24 hours.",
      category: "Getting Started"
    },
    {
      question: "What are the pricing tiers for agent creators?",
      answer: "We offer three tiers: Free (3 listings, basic analytics), Pro ($19/month, unlimited listings, featured placement, verified badge), and Enterprise ($99/month, team collaboration, API access). You can upgrade anytime from your dashboard.",
      category: "Pricing"
    },
    {
      question: "How do I get paid for my agent?",
      answer: "Direct payments go directly to you. We facilitate the transactions but don't take commission. For Pro tier creators, we provide verified badges and featured placement that increase your visibility and earning potential.",
      category: "Payments"
    },
    {
      question: "Is there a review process for agent listings?",
      answer: "Yes, all listings undergo manual review to ensure quality, safety, and compliance. Review typically takes 24-48 hours. We check for proper categorization, working API endpoints, and appropriate content.",
      category: "Review Process"
    },
    {
      question: "Can I update my agent listing after submission?",
      answer: "Absolutely! You can edit your listing anytime from your dashboard. Changes will be reflected immediately for your live listing, and future updates to pricing or features can be made without re-submission.",
      category: "Management"
    },
    {
      question: "What happens if my agent is reported?",
      answer: "Reported agents are reviewed within 6 hours. If violations are found, we'll notify you and may suspend the listing. You can appeal any decision through your dashboard. Repeat violations may result in permanent suspension.",
      category: "Safety"
    }
  ]

  const categories = [
    { name: "Getting Started", count: 12, icon: BookOpen },
    { name: "Account Management", count: 8, icon: Users },
    { name: "Technical Support", count: 15, icon: AlertCircle },
    { name: "Payments & Billing", count: 6, icon: CheckCircle }
  ]

  const supportHours = {
    email: "24/7",
    chat: "9 AM - 6 PM GMT+8 (Mon-Fri)",
    responseTime: "Within 2 business hours"
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Help & Support</h1>
        <p className="text-xl text-muted-foreground">
          Everything you need to know about using AgentHub marketplace
        </p>
      </div>

      {/* Quick Support Options */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="text-center">
          <CardHeader>
            <Mail className="h-8 w-8 mx-auto mb-2" />
            <CardTitle>Email Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">{supportHours.email}</p>
            <p className="text-sm font-medium">support@agenthub.syncoe.com</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardHeader>
            <MessageSquare className="h-8 w-8 mx-auto mb-2" />
            <CardTitle>Live Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">{supportHours.chat}</p>
            <p className="text-sm font-medium">Mon-Fri, 9 AM - 6 PM</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardHeader>
            <BookOpen className="h-8 w-8 mx-auto mb-2" />
            <CardTitle>Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">Self-service guides</p>
            <Link href="/docs">
              <Button variant="outline" size="sm">Browse Docs</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Contact Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Send us a message</CardTitle>
          <CardDescription>
            Have a question? We're here to help. We typically respond within 2 business hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
              <p className="text-muted-foreground">
                Thank you for reaching out. We'll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="What's this about?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder="Tell us more..."
                  rows={5}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Quick answers to common questions about AgentHub
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">
                    {faq.category}
                  </Badge>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs/getting-started" className="text-blue-600 hover:underline">
                  Getting Started Guide
                </Link>
              </li>
              <li>
                <Link href="/docs/api-reference" className="text-blue-600 hover:underline">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/docs/pricing" className="text-blue-600 hover:underline">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/docs/security" className="text-blue-600 hover:underline">
                  Security Guidelines
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Community
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/community/forum" className="text-blue-600 hover:underline">
                  Community Forum
                </Link>
              </li>
              <li>
                <Link href="/community/discord" className="text-blue-600 hover:underline">
                  Discord Server
                </Link>
              </li>
              <li>
                <Link href="/community/events" className="text-blue-600 hover:underline">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link href="/community/contributing" className="text-blue-600 hover:underline">
                  Contribute to AgentHub
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          Last updated: April 10, 2026 | 
          <Link href="/terms" className="ml-2 hover:underline">Terms of Service</Link> | 
          <Link href="/privacy" className="ml-2 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}