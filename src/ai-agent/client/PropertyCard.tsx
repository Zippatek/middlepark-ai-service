'use client'

// ─────────────────────────────────────────────────────────────────────────────
// PropertyCard — Inline property card rendered inside the chat window
// Version 1.0 | Zippatek Digital Ltd | April 2026
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { MapPin, BedDouble, ArrowRight, CheckCircle2 } from 'lucide-react'
import type { PropertyCardInfo } from './useChat'

function formatNaira(amount: number): string {
  if (amount >= 1_000_000_000) return `₦${(amount / 1_000_000_000).toFixed(1)}B`
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(0)}M`
  return `₦${amount.toLocaleString('en-NG')}`
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  'for-sale': { label: 'For Sale', color: '#286B38' },
  'off-plan': { label: 'Off-Plan', color: '#5A5B5F' },
  'completed': { label: 'Ready', color: '#286B38' },
  'sold-out': { label: 'Sold Out', color: '#ED1B24' },
  'coming-soon': { label: 'Coming Soon', color: '#5A5B5F' },
}

interface PropertyCardProps {
  card: PropertyCardInfo
}

export function PropertyCard({ card }: PropertyCardProps) {
  const statusConfig = STATUS_CONFIG[card.status] || STATUS_CONFIG['for-sale']

  return (
    <div
      className="rounded-lg overflow-hidden border border-[#E8EDE9] bg-white"
      style={{ boxShadow: '0 2px 12px rgba(40, 107, 56, 0.08)' }}
    >
      {/* Image */}
      <div className="relative h-28 bg-[#F0F4F1]">
        {card.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={card.image}
            alt={card.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const el = e.currentTarget as HTMLImageElement
              el.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C8D9CC" strokeWidth="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
        )}

        {/* Status pill */}
        <span
          className="absolute top-2 left-2 text-white text-[10px] font-semibold px-2 py-0.5 rounded-sm"
          style={{ backgroundColor: statusConfig.color }}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="text-[11px] font-semibold text-[#286B38] mb-0.5 tracking-wide uppercase">
          {card.id}
        </p>
        <h4 className="text-sm font-semibold text-[#5A5B5F] leading-tight mb-1.5">
          {card.name}
        </h4>

        <div className="flex items-center gap-1 text-[#8A8B8F] mb-1.5">
          <MapPin size={11} strokeWidth={1.5} className="text-green" />
          <span className="text-[11px]">{card.location}</span>
        </div>

        <div className="flex items-center gap-1 text-[#8A8B8F] mb-2">
          <BedDouble size={11} strokeWidth={1.5} className="text-green" />
          <span className="text-[11px]">
            {[...new Set(card.bedrooms)].join('/')} Bed
          </span>
        </div>

        {/* Price */}
        <p className="text-[#286B38] font-bold text-sm mb-2">
          From {formatNaira(card.priceFrom)}
        </p>

        {/* Certifications row */}
        <div className="flex items-center gap-1 mb-3">
          <CheckCircle2 size={10} strokeWidth={2} className="text-green" />
          <span className="text-[10px] text-[#8A8B8F]">AGIS Verified · FCDA Approved</span>
        </div>

        {/* CTA */}
        <Link
          href={`/developments/${card.slug}`}
          className="flex items-center justify-between w-full px-3 py-2 rounded-sm text-xs font-semibold text-white transition-all duration-150"
          className="bg-green"
        >
          View Development
          <ArrowRight size={12} strokeWidth={2} />
        </Link>
      </div>
    </div>
  )
}
