// ─────────────────────────────────────────────────────────────────────────────
// MIDDLEPARK AI AGENT — PROPERTY KNOWLEDGE BASE
// This file is the single source of truth for the AI's property knowledge.
// Update this file when new developments are added or details change.
// Version 1.0 | Zippatek Digital Ltd | April 2026
// ─────────────────────────────────────────────────────────────────────────────

import type { PropertyCardData } from './types'

// ─── COMPANY INFORMATION ──────────────────────────────────────────────────────

export const COMPANY_INFO = {
  name: 'MiddlePark Properties Limited',
  tagline: 'Building Places. Building Lives.',
  description:
    'MiddlePark Properties Limited is a real estate development company based in Abuja, Nigeria. ' +
    'We develop carefully planned, title-verified residential estates across Abuja\'s most sought-after neighbourhoods. ' +
    'Every unit is designed to last. Every title is clean.',
  certifications: [
    'AGIS Title Verified — All plots are registered with the Abuja Geographic Information Systems.',
    'FCDA Approved — Federal Capital Development Authority development permit is in place before any sale.',
    'MiddlePark Quality Seal — Our internal quality checklist is passed before any unit is handed over.',
  ],
  contacts: {
    generalEmail: 'info@middleparkproperties.ng',
    salesEmail: 'sales@middleparkproperties.ng',
    phone: '+234 (0)9 000 0000',
    whatsapp: '+234 800 000 0000',
    offices: [
      {
        name: 'Head Office',
        address: 'Plot 123, Wuse Zone 5, Abuja, FCT, Nigeria',
        hours: 'Mon–Fri: 8am–6pm | Sat: 9am–3pm',
      },
      {
        name: 'Lagos Liaison Office',
        address: '4 Admiralty Way, Lekki Phase 1, Lagos',
        hours: 'Mon–Fri: 9am–5pm',
      },
    ],
  },
  socialMedia: {
    instagram: '@middleparkproperties',
    twitter: '@middleparkng',
    facebook: 'MiddlePark Properties Limited',
  },
}

// ─── DEVELOPMENTS KNOWLEDGE BASE ─────────────────────────────────────────────

export interface KnowledgeDevelopment {
  id: string
  name: string
  slug: string
  status: 'for-sale' | 'off-plan' | 'completed' | 'sold-out' | 'coming-soon'
  location: string
  neighborhood: string
  priceFrom: number
  priceTo?: number
  unitTypes: {
    name: string
    bedrooms: number
    bathrooms: number
    size: string
    price: number
    available: number
    total: number
  }[]
  totalUnits: number
  availableUnits: number
  amenities: string[]
  paymentPlan: {
    depositPercent: number
    balanceTermMonths?: number
    outright_discount?: string
    milestones?: string[]
    note?: string
  }
  certifications: string[]
  completionDate?: string
  highlights: string[]
  siteVisitAvailable: boolean
}

export const DEVELOPMENTS: KnowledgeDevelopment[] = [
  {
    id: 'MP-ABJ-0012',
    name: 'Dakibiyu Estate Phase 2',
    slug: 'dakibiyu-estate-phase-2',
    status: 'for-sale',
    location: 'Dakibiyu, near Wuye Axis, Abuja FCT',
    neighborhood: 'Dakibiyu / Wuye',
    priceFrom: 85_000_000,
    unitTypes: [
      {
        name: '4-Bedroom Terrace Duplex',
        bedrooms: 4,
        bathrooms: 4,
        size: '280 SQM',
        price: 85_000_000,
        available: 11,
        total: 24,
      },
    ],
    totalUnits: 24,
    availableUnits: 11,
    amenities: [
      'Perimeter security fence',
      'Solar-powered street lighting',
      'Paved internal roads',
      'CCTV surveillance',
      'Borehole water supply',
      'Landscaped green areas',
      'Dedicated car parking (2 per unit)',
    ],
    paymentPlan: {
      depositPercent: 30,
      milestones: [
        '30% deposit on allocation',
        '25% at foundation completion',
        '25% at roofing stage',
        '20% at finishing / before handover',
      ],
      outright_discount: '3% discount for outright payment',
      note: 'Flexible instalment options available for qualified buyers. Speak to our sales team.',
    },
    certifications: ['AGIS Title Verified', 'FCDA Approved', 'MiddlePark Quality Seal'],
    completionDate: 'Q3 2026 (Projected)',
    highlights: [
      'Title verified before ground was broken — no risks on your investment',
      'Phase 1 of Dakibiyu Estate fully sold out and handed over successfully',
      'Terrace layout offers privacy with shared perimeter security',
      '4 bedrooms — suitable for growing families or rental investment',
      'Close to Wuye market, major arterial roads, and Abuja city centre',
    ],
    siteVisitAvailable: true,
  },
  {
    id: 'MP-ABJ-0009',
    name: 'Katampe Heights',
    slug: 'katampe-heights',
    status: 'off-plan',
    location: 'Katampe Extension, Abuja FCT',
    neighborhood: 'Katampe',
    priceFrom: 135_000_000,
    unitTypes: [
      {
        name: '4-Bedroom Detached Duplex',
        bedrooms: 4,
        bathrooms: 5,
        size: '320 SQM',
        price: 135_000_000,
        available: 5,
        total: 12,
      },
    ],
    totalUnits: 12,
    availableUnits: 5,
    amenities: [
      '24/7 security with CCTV',
      'Solar energy backup (common areas)',
      'Professionally landscaped gardens',
      'Covered car park — 2 spaces per unit',
      'Club house',
      'Swimming pool',
      'Children\'s play area',
      'Visitor parking',
    ],
    paymentPlan: {
      depositPercent: 40,
      balanceTermMonths: 18,
      milestones: [
        '40% deposit on allocation',
        '30% at foundation and roofing',
        '30% at finishing stage',
      ],
      note: 'Katampe Heights is a limited release of 12 units only. Only 5 remain. Early buyers lock in current pricing.',
    },
    certifications: ['AGIS Title Verified', 'FCDA Approved'],
    completionDate: 'Q1 2027 (Projected)',
    highlights: [
      'Katampe Extension is one of Abuja\'s most prestigious residential addresses',
      'Only 12 units — exclusive, low-density development',
      'Full detached — no shared walls, complete privacy',
      'Swimming pool and club house included in the estate',
      'Strong capital appreciation — Katampe values have grown consistently',
    ],
    siteVisitAvailable: true,
  },
  {
    id: 'MP-ABJ-0014',
    name: 'Apo Signature Residences',
    slug: 'apo-signature-residences',
    status: 'completed',
    location: 'Apo Resettlement, Abuja FCT',
    neighborhood: 'Apo',
    priceFrom: 55_000_000,
    unitTypes: [
      {
        name: '3-Bedroom Semi-Detached Bungalow',
        bedrooms: 3,
        bathrooms: 3,
        size: '180 SQM',
        price: 55_000_000,
        available: 18,
        total: 30,
      },
    ],
    totalUnits: 30,
    availableUnits: 18,
    amenities: [
      'Gated entrance with 24/7 guard post',
      'Perimeter fence',
      'Dedicated electricity transformer (estate supply)',
      'Paved internal roads',
      'Drainage system',
      'Waste management',
    ],
    paymentPlan: {
      depositPercent: 25,
      milestones: [
        '25% deposit on allocation',
        '25% within 3 months',
        '25% within 6 months',
        '25% on handover',
      ],
      outright_discount: '5% discount for full outright payment',
      note: 'Units are ready for immediate handover. Outright payment buyers can move in within 30 days of purchase.',
    },
    certifications: ['AGIS Title Verified', 'FCDA Approved', 'MiddlePark Quality Seal'],
    completionDate: 'Ready for Handover',
    highlights: [
      'Completed and ready — no waiting, no construction risk',
      'Apo is well-connected — close to Gwarinpa, airport road, and Garki',
      '3-bedroom bungalow — ideal for young families or rental investment',
      'Starting price of ₦55M makes this MiddlePark\'s most accessible offering',
      'MiddlePark Quality Seal — inspected and certified before listing',
    ],
    siteVisitAvailable: true,
  },
]

// Coming soon — not yet listed with prices
export const PIPELINE_DEVELOPMENTS = [
  {
    name: 'Maitama Villa Collection',
    location: 'Maitama District, Abuja',
    estimatedLaunch: 'Q3 2026',
    note: 'Register interest to be notified first when this development launches.',
  },
  {
    name: 'Gwarinpa First Avenue Terrace',
    location: 'Gwarinpa, Abuja',
    estimatedLaunch: 'Q4 2026',
    note: 'Register interest to be notified first when this development launches.',
  },
]

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

/** Format price as Nigerian Naira string */
export function formatNaira(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `₦${(amount / 1_000_000_000).toFixed(1)}B`
  }
  if (amount >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(0)}M`
  }
  return `₦${amount.toLocaleString('en-NG')}`
}

/** Find matching developments based on basic filters */
export function matchDevelopments(filters: {
  budgetMax?: number
  bedrooms?: number
  neighborhood?: string
  status?: string
}): KnowledgeDevelopment[] {
  return DEVELOPMENTS.filter((dev) => {
    if (dev.status === 'sold-out') return false
    if (filters.budgetMax && dev.priceFrom > filters.budgetMax) return false
    if (filters.bedrooms) {
      const hasBedroom = dev.unitTypes.some((u) => u.bedrooms === filters.bedrooms)
      if (!hasBedroom) return false
    }
    if (filters.neighborhood) {
      const match = dev.neighborhood
        .toLowerCase()
        .includes(filters.neighborhood.toLowerCase())
      if (!match) return false
    }
    return true
  })
}

/** Convert a development to a PropertyCardData for the chat widget */
export function toPropertyCard(dev: KnowledgeDevelopment): PropertyCardData {
  return {
    id: dev.id,
    name: dev.name,
    slug: dev.slug,
    location: dev.location,
    status: dev.status,
    priceFrom: dev.priceFrom,
    bedrooms: dev.unitTypes.map((u) => u.bedrooms),
    image: `/images/dev-${dev.slug.split('-')[0]}-1.jpg`,
  }
}

/** Full knowledge string for AI system prompt */
export function buildKnowledgeString(): string {
  const devStrings = DEVELOPMENTS.map((dev) => `
DEVELOPMENT: ${dev.name} (${dev.id})
  Location: ${dev.location}
  Status: ${dev.status}
  Price From: ${formatNaira(dev.priceFrom)}
  Unit Types: ${dev.unitTypes.map((u) => `${u.name} — ${u.size} — ${formatNaira(u.price)} — ${u.available}/${u.total} available`).join('; ')}
  Amenities: ${dev.amenities.join(', ')}
  Payment Plan: ${dev.paymentPlan.depositPercent}% deposit. ${dev.paymentPlan.milestones?.join(', ') || ''}. ${dev.paymentPlan.note || ''}
  Certifications: ${dev.certifications.join(', ')}
  Completion: ${dev.completionDate || 'TBD'}
  Highlights: ${dev.highlights.join(' | ')}
  Site Visit: ${dev.siteVisitAvailable ? 'Available — customer can book via the website or ask agent' : 'Not currently available'}
  URL Slug: /developments/${dev.slug}
`).join('\n---\n')

  const pipelineStrings = PIPELINE_DEVELOPMENTS.map(
    (p) => `${p.name} — ${p.location} — Estimated Launch: ${p.estimatedLaunch}. ${p.note}`,
  ).join('\n')

  return `
## COMPANY
${COMPANY_INFO.name} | ${COMPANY_INFO.description}
Certifications: ${COMPANY_INFO.certifications.join(' | ')}
Sales Email: ${COMPANY_INFO.contacts.salesEmail}
Phone: ${COMPANY_INFO.contacts.phone}
WhatsApp: ${COMPANY_INFO.contacts.whatsapp}

## CURRENT DEVELOPMENTS
${devStrings}

## PIPELINE (COMING SOON)
${pipelineStrings}
`
}
