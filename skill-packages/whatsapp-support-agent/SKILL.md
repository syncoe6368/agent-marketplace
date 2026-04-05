# WhatsApp Support Agent

> 24/7 AI customer support agent for Malaysian SMEs via WhatsApp Business API.

## What It Does

WhatsApp Support Agent automates customer interactions through WhatsApp Business API, handling inquiries, bookings, order tracking, and FAQs. Designed specifically for Malaysian SMEs with built-in BM/EN bilingual support and PDPA compliance.

## Features

- **WhatsApp Native** — Runs directly on WhatsApp Business API, no extra app needed
- **Bilingual BM/EN** — Automatically detects and responds in the customer's language
- **Appointment Booking** — Schedule, reschedule, and send reminders automatically
- **Order Tracking** — Real-time status updates from your order management system
- **FAQ Engine** — Learns from your knowledge base to answer common questions
- **Human Handoff** — Seamlessly escalates complex issues to your team
- **Lead Capture** — Every conversation is an opportunity; auto-capture to CRM
- **PDPA Compliant** — Built-in consent management and data handling

## Quick Start

```bash
# Install via OpenClaw
openclaw skill install whatsapp-support-agent

# Or manual setup
git clone https://github.com/syncoe6368/web-business-app
cd web-business-app
npm install
cp .env.example .env
# Edit .env with your WhatsApp Business API credentials
npm run dev
```

## Configuration

```env
WHATSAPP_BUSINESS_TOKEN=your-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-id
WHATSAPP_VERIFY_TOKEN=your-verify-token
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-key
```

## Supported Industries

| Industry | Use Case | Example |
|----------|----------|---------|
| F&B | Reservations, menu inquiries | "Table for 4 tonight?" |
| Healthcare | Appointment booking | "Next available slot with Dr. Lee" |
| Professional | Lead qualification | "How much for company registration?" |
| Retail | Order tracking | "Where's my order #12345?" |

## Pricing

| Tier | Price | Messages | Features |
|------|-------|----------|----------|
| Free | $0 | 100/mo | EN only, basic FAQ |
| Pro | $49/mo | Unlimited | BM/EN, CRM, analytics |
| Business | $149/mo | Unlimited | Multi-number, priority, custom training |

## Support

- 📧 Email: ops@syncoe.com
- 🐛 Issues: [GitHub](https://github.com/syncoe6368/web-business-app/issues)

## License

MIT © Syncoe
