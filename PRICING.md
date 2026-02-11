# ROLO Pricing Strategy

## Tiers

### Free
**$0/month**
- 25 contacts
- Basic contact management
- Manual notes
- Cadence tracking
- CSV import (one-time, up to 25)

*Goal: Let users experience the core value and hit the contact limit naturally.*

---

### Pro
**$15/month** (or $144/year - save 20%)
- Unlimited contacts
- AI-powered summaries
- Custom tags (up to 10)
- Full CSV import
- Action item extraction
- Priority support

*Goal: Core product for serious networkers. AI features justify the price.*

---

### Business
**$29/month** (or $279/year - save 20%)
- Everything in Pro
- Email digest notifications
- AI-drafted outreach messages
- Unlimited tags
- Advanced analytics
- API access (future)
- Team features (future)

*Goal: Power users who want automation and time savings.*

---

## Cost Analysis

### Infrastructure (Monthly)
| Service | Free Tier | At Scale (1k users) |
|---------|-----------|---------------------|
| Supabase | $0 (up to 500MB) | $25-50 |
| Vercel | $0 (hobby) | $20-50 |
| Domain | ~$1 | ~$1 |
| **Total** | **~$1** | **~$75-100** |

### Per-User Variable Costs
| Feature | Cost per User/Month |
|---------|---------------------|
| AI Summaries (avg 50 contacts, 2 regenerations) | $0.50-1.50 |
| AI Drafts (10 drafts/month) | $0.30-0.80 |
| Email sending (30 emails/month) | $0.03-0.10 |
| Database storage | $0.05-0.10 |
| **Total (light user)** | **~$0.50** |
| **Total (heavy user)** | **~$2.50-3.00** |

### Margin Analysis
| Tier | Price | Est. Cost | Gross Margin |
|------|-------|-----------|--------------|
| Free | $0 | $0.10 | -$0.10 |
| Pro | $15 | $1.50 | $13.50 (90%) |
| Business | $29 | $3.00 | $26.00 (90%) |

*Note: Heavy AI users on Pro could cost $3-4, reducing margin to ~75%. Still healthy.*

---

## Conversion Funnel

```
Free Users (25 contact limit)
    ↓ ~10% convert when they hit limit
Pro Users ($15/mo)
    ↓ ~20% upgrade when email features launch
Business Users ($29/mo)
```

### Key Upgrade Triggers
1. **Free → Pro**: Hitting 25 contact limit, wanting AI summaries
2. **Pro → Business**: Wanting email automation, drafts, notifications

---

## Pricing Psychology

### Why These Price Points
- **$15 Pro**: Under the "I'll expense it" threshold, comparable to Dex/Netflix
- **$29 Business**: Still impulse-friendly, signals premium value
- **Annual discount (20%)**: Improves cash flow, reduces churn

### Anchoring
- Show Business tier first to anchor high
- Pro feels like a deal by comparison
- Free tier exists to acquire users, not to serve them forever

---

## Future Considerations

### Usage-Based Pricing (Alternative)
Could switch to contact-based pricing if simpler:
- Free: 25 contacts
- $10/mo: 100 contacts + AI
- $20/mo: 500 contacts + AI + email
- $35/mo: Unlimited + everything

### Team Pricing (Future)
- $25/seat/month (min 3 seats)
- Shared contacts, warm intros, admin controls

### Enterprise (Future)
- Custom pricing
- SSO, dedicated support, SLAs
- CRM integrations

---

## Implementation Notes

### Tech Stack for Billing
- **Stripe** for payments and subscriptions
- **Supabase** row-level security to gate features
- Store `subscription_tier` on user profile
- Webhook to handle subscription changes

### Feature Gating
```
Free: contacts.count <= 25, no AI endpoints
Pro: unlimited contacts, AI enabled, email disabled
Business: all features enabled
```

---

## Competitive Landscape

| Product | Price | Notes |
|---------|-------|-------|
| Dex | $12/mo | Personal CRM, similar features |
| Clay | $20/mo+ | More enterprise-focused |
| Folk | $20/mo | Team-oriented |
| Monica | Free/OSS | Self-hosted, no AI |
| Notion | $10/mo | General tool, not CRM-specific |
| Superhuman | $30/mo | Email-focused, premium positioning |

**Our positioning**: More affordable than Clay/Folk, more powerful than Dex, AI-native.
