# MiddlePark AI Agent System

> **AI-powered property enquiry and customer service layer for MiddlePark Properties Limited**
> Built by Zippatek Digital Ltd | Version 1.0 | April 2026

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [About MiddlePark Properties Limited](#2-about-middlepark-properties-limited)
3. [The Developments Portfolio](#3-the-developments-portfolio)
4. [AI Agent Architecture](#4-ai-agent-architecture)
5. [Conversation Flow](#5-conversation-flow)
6. [Handoff Protocol (AI → Human)](#6-handoff-protocol-ai--human)
7. [Admin Dashboard](#7-admin-dashboard)
8. [AI Knowledge Base](#8-ai-knowledge-base)
9. [Directory Structure](#9-directory-structure)
10. [Tech Stack](#10-tech-stack)
11. [Setup & Running](#11-setup--running)
12. [Environment Variables](#12-environment-variables)
13. [Deployment Note](#13-deployment-note)

---

## 1. System Overview

The MiddlePark AI Agent is a **three-part system**:

| Layer | What it is | Who sees it |
|---|---|---|
| **Chat Widget** | Floating chat bubble embedded on the public website | Website visitors / potential buyers |
| **AI Backend** | API routes + LLM integration (Google Gemini / OpenAI GPT-4o) | Server-side only |
| **Admin Dashboard** | Full CS/admin interface to monitor and take over conversations | MiddlePark sales team and customer service staff |

### The Core Loop

```
Visitor opens widget
     ↓
AI greets visitor, qualifies interest (budget, unit type, location)
     ↓
AI answers questions, shows matching properties, collects contact info
     ↓
[Either] AI resolves enquiry fully and logs it
     ↓
[Or] AI flags conversation for human takeover → notifies admin dashboard
     ↓
CS agent joins conversation in real-time from the dashboard
     ↓
CS agent closes the lead or escalates to senior sales team
```

---

## 2. About MiddlePark Properties Limited

**MiddlePark Properties Limited** is a real estate development company headquartered in **Abuja, Nigeria**. The company develops carefully planned, title-verified residential estates across Abuja's most sought-after neighbourhoods.

### Core Values

- **Title First**: Every plot is AGIS-verified and FCDA-approved before any unit is sold or advertised.
- **Quality on Delivery**: MiddlePark does not compromise on finishing — every unit is delivered to the same standard shown in renders.
- **Transparency**: Payment plans are clear. Milestones are communicated to buyers at every stage.
- **Trust**: No off-plan unit is sold unless the land title is clean and registered.

### Certifications (Always Mention)

- ✓ **AGIS Title Verified** — Abuja Geographic Information Systems — all plots are registered.
- ✓ **FCDA Approved** — Federal Capital Development Authority development permit in place.
- ✓ **MiddlePark Quality Seal** — Internal QA checklist passed before any handover.

### Company Contacts

| Role | Contact |
|---|---|
| General Enquiries | info@middleparkproperties.ng |
| Sales Team | sales@middleparkproperties.ng |
| Phone | +234 (0)9 000 0000 |
| WhatsApp | +234 800 000 0000 |
| Head Office | Plot 123, Wuse Zone 5, Abuja, FCT, Nigeria |
| Lekki Liaison Office | 4 Admiralty Way, Lekki Phase 1, Lagos |

### Competitors (Context Only — Never Mention to Customers)

MiddlePark operates in the same market as Cosgrove, Urban Shelter, and Bilaad Realty. The differentiator is title integrity and post-sale client service quality.

---

## 3. The Developments Portfolio

### Active Developments

---

#### MP-ABJ-0012 — Dakibiyu Estate Phase 2
- **Location**: Dakibiyu, near Wuye Axis, Abuja FCT
- **Status**: For Sale (Off-Plan & Ready Units Available)
- **Unit Types**:
  - 4-Bedroom Terrace Duplex | 280 SQM | From ₦85,000,000
- **Total Units**: 24 | **Available**: 11
- **Amenities**: Perimeter security fence, solar-powered street lighting, paved internal roads, CCTV, borehole water supply, landscaped green areas
- **Payment Plans**:
  - 30% deposit + construction-stage milestones
  - Outright payment discount available
- **Certifications**: AGIS Title Verified, FCDA Approved, MiddlePark Quality Seal
- **Completion**: Q3 2026 (projected)
- **Slug**: `dakibiyu-estate-phase-2`

---

#### MP-ABJ-0009 — Katampe Heights
- **Location**: Katampe Extension, Abuja FCT
- **Status**: Off-Plan (Selling Fast)
- **Unit Types**:
  - 4-Bedroom Detached Duplex | 320 SQM | From ₦135,000,000
- **Total Units**: 12 | **Available**: 5
- **Amenities**: 24/7 security, solar energy backup, landscaped gardens, car park (2 per unit), club house, swimming pool
- **Payment Plans**:
  - 40% deposit, balance over 18 months
- **Certifications**: AGIS Title Verified, FCDA Approved
- **Completion**: Q1 2027 (projected)
- **Slug**: `katampe-heights`

---

#### MP-ABJ-0014 — Apo Signature Residences
- **Location**: Apo Resettlement, Abuja FCT
- **Status**: For Sale (Ready Units)
- **Unit Types**:
  - 3-Bedroom Semi-Detached Bungalow | 180 SQM | From ₦55,000,000
- **Total Units**: 30 | **Available**: 18
- **Amenities**: Gated entrance with guard post, perimeter fence, electricity transformer, internal roads
- **Payment Plans**:
  - 25% deposit + 4 milestone payments
  - Outright payment: 5% discount
- **Certifications**: AGIS Title Verified, FCDA Approved, MiddlePark Quality Seal
- **Completion**: Ready for Handover
- **Slug**: `apo-signature-residences`

---

### Coming Soon / Pipeline

| Development | Location | Estimated Launch |
|---|---|---|
| Maitama Villa Collection | Maitama District, Abuja | Q3 2026 |
| Gwarinpa First Avenue Terrace | Gwarinpa, Abuja | Q4 2026 |

---

## 4. AI Agent Architecture

```
middlepark-website/
└── ai-agent/
    ├── README.md                  ← This file
    ├── client/                    ← Chat widget (embeds on public site)
    │   ├── ChatWidget.tsx         ← Floating widget button + panel
    │   ├── ChatWindow.tsx         ← Message thread UI
    │   ├── MessageBubble.tsx      ← Individual message component
    │   ├── PropertyCard.tsx       ← Inline property card in chat
    │   └── useChat.ts             ← Client-side chat state hook
    ├── server/                    ← API routes and AI logic
    │   ├── api/
    │   │   ├── chat/route.ts      ← POST /api/ai-agent/chat (LLM call)
    │   │   ├── conversations/     ← GET/PATCH conversations (admin)
    │   │   └── handoff/route.ts   ← POST /api/ai-agent/handoff (trigger human)
    │   ├── agent.ts               ← System prompt + AI orchestration
    │   ├── knowledge.ts           ← Static property knowledge base
    │   └── types.ts               ← AI agent type definitions
    └── dashboard/                 ← Admin/CS interface
        ├── page.tsx               ← Dashboard entry page
        ├── ConversationList.tsx   ← Left panel: all conversations
        ├── ConversationDetail.tsx ← Right panel: active chat thread
        ├── AgentInput.tsx         ← CS agent reply box
        └── ConversationBadge.tsx  ← Status pill (AI / Human / Resolved)
```

---

## 5. Conversation Flow

### Stage 1 — Greeting & Qualification
The AI opens with a warm, brand-appropriate greeting. It then qualifies the visitor:
1. Are you buying for yourself or as an investment?
2. What's your budget range?
3. Which area(s) of Abuja interest you?
4. How many bedrooms are you looking for?

### Stage 2 — Property Matching
Based on qualifications, the AI presents matching developments as **inline property cards** inside the chat window. Each card shows:
- Development name and ID
- Location and status
- Price from
- "View Full Details →" link

### Stage 3 — Deep Questions
The AI answers specific questions about:
- Payment plan structure
- Title verification and certifications
- Construction timeline
- Unit specifications and amenities
- Site visit booking

### Stage 4 — Lead Capture
Before ending or escalating, the AI collects:
- Full name
- Phone number (WhatsApp preferred)
- Email address
- Which development(s) they're interested in

### Stage 5 — Resolution or Handoff
- **Resolved**: AI logs the enquiry and tells the customer a sales agent will follow up within 24 hours.
- **Escalated**: AI tells the customer "Let me connect you with one of our team members" and triggers the handoff protocol.

---

## 6. Handoff Protocol (AI → Human)

The AI triggers a handoff when:
- Customer explicitly asks to "speak to a person / agent / human"
- AI cannot confidently answer a specific question (pricing exceptions, custom payment plan negotiations, legal questions)
- Conversation reaches 10+ turns without a resolution
- Customer expresses frustration or uses escalation cues ("this is not helpful", "I need someone real", etc.)

### What Happens on Handoff

1. AI sends a handoff signal via `POST /api/ai-agent/handoff`
2. Admin dashboard receives a **real-time notification** (socket or polling)
3. Conversation is flagged as `status: "waiting_for_human"` with a visual alert
4. CS agent clicks "Take Over" in the dashboard
5. Conversation status changes to `status: "human_active"`
6. Customer sees: *"You're now chatting with [Agent Name] from the MiddlePark team."*
7. CS agent can read full AI conversation history and reply directly

---

## 7. Admin Dashboard

### Access

The admin dashboard is at `/ai-agent/dashboard` — this will be protected by simple password auth (expandable to NextAuth session later).

### Dashboard Panels

**Left Panel — Conversation List**
- Lists all active conversations, sorted by last message
- Filter tabs: All | AI Active | Waiting for Human | Human Active | Resolved
- Each item shows: visitor name (or "Anonymous Visitor"), last message snippet, timestamp, status badge, unread count

**Right Panel — Conversation Detail**
- Full message thread (AI messages in green, visitor in white, agent messages in blue)
- Conversation metadata: visitor contact details, device, start time, development interest
- Action buttons: "Take Over", "Mark Resolved", "Add Note"
- Agent reply input box (only active when status is `human_active`)

### Status System

| Status | Color | Meaning |
|---|---|---|
| `ai_active` | Mint / Green | AI is handling the conversation |
| `waiting_for_human` | Amber | AI escalated; waiting for CS agent |
| `human_active` | Forest Green | CS agent is live in this conversation |
| `resolved` | Charcoal | Conversation closed |

---

## 8. AI Knowledge Base

The AI system prompt (`server/agent.ts`) contains:
- Full company overview and contact details
- All development names, IDs, prices, locations, unit types, amenities
- Payment plan structures
- Certification information (AGIS, FCDA, MiddlePark Quality Seal)
- Brand voice rules (no "luxury", no "premium", no "world-class")
- Escalation trigger conditions
- Response format instructions (concise, helpful, authentic Nigerian real estate tone)

The knowledge base is updated by editing `server/knowledge.ts` — no retraining needed.

---

## 9. Directory Structure

```
ai-agent/
├── README.md                 ← You are here
├── client/
│   ├── ChatWidget.tsx
│   ├── ChatWindow.tsx
│   ├── MessageBubble.tsx
│   ├── PropertyCard.tsx
│   └── useChat.ts
├── server/
│   ├── agent.ts              ← LLM system prompt & orchestration
│   ├── knowledge.ts          ← Property + company knowledge
│   ├── types.ts
│   └── api/
│       ├── chat/
│       │   └── route.ts
│       ├── conversations/
│       │   └── route.ts
│       └── handoff/
│           └── route.ts
└── dashboard/
    ├── page.tsx
    ├── ConversationList.tsx
    ├── ConversationDetail.tsx
    ├── AgentInput.tsx
    └── ConversationBadge.tsx
```

---

## 10. Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| LLM | Google Gemini 1.5 Flash / OpenAI GPT-4o | Fast response, property context fits in context window |
| Realtime | Server-Sent Events (SSE) or polling (every 3s) | Lightweight, no WebSocket infra needed initially |
| Storage | In-memory (dev) → Postgres/Supabase (prod) | Simple to start, easy to migrate |
| Widget | React (embedded in Next.js public pages) | Shares codebase with main site |
| Dashboard | Next.js page (`/ai-agent/dashboard`) | Same repo, same design system |
| Auth (Dashboard) | Simple token or NextAuth session | Expandable later |

---

## 11. Setup & Running

### Prerequisites

```bash
# From the middlepark-website root:
npm install
```

The AI agent uses the same `node_modules` as the main Next.js project. No separate install needed.

### Running Locally

```bash
npm run dev
# Widget is embedded in the public pages
# Dashboard: http://localhost:3000/ai-agent/dashboard
# API: http://localhost:3000/api/ai-agent/chat
```

### Environment Variables Required

See section 12.

---

## 12. Environment Variables

Add these to your `.env.local` in the project root:

```env
# AI Provider (pick one)
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
# OR
OPENAI_API_KEY=your_openai_api_key_here

# Which model to use
AI_PROVIDER=gemini   # or: openai

# Admin dashboard password (temporary — replace with NextAuth later)
AGENT_DASHBOARD_PASSWORD=your_secure_password_here

# Optional: Conversation persistence (if using Supabase)
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

---

## 13. Deployment Note

This entire `ai-agent/` directory is designed to be **ejected** from this Next.js project later into its own standalone service (e.g., a separate Next.js app, a FastAPI service, or a dedicated AI platform).

To eject:
1. Copy `ai-agent/` to a new project root
2. Move `server/api/` routes to the new project's API layer
3. Expose the chat API as a public endpoint
4. Update the widget's `API_URL` environment variable to point to the new service
5. Remove the widget embed from this project's public pages

Everything is built with ejection in mind — no tight coupling to this project's internals.

---

*MiddlePark AI Agent System v1.0 | Zippatek Digital Ltd | Abuja, Nigeria | April 2026*
