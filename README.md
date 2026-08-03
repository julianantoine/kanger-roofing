# Kanger Roofing — Cincinnati Roofing Website

Marketing website for **Kanger Roofing**, a licensed & insured roofing contractor serving
Greater Cincinnati, Ohio.

## Pages

- `index.html` — home (hero, services grid, storm/insurance section, why us, testimonials, service area)
- `services.html` — detailed services (repair, replacement, storm damage, inspections, gutters, commercial)
- `about.html` — company story and promises
- `estimate.html` — free-estimate scheduling form with a **type-of-estimate dropdown**
  (Roof Replacement, Roof Repair, Storm/Hail Damage Inspection, Insurance Claim Assistance,
  New Construction, Commercial Roofing, Gutters & Downspouts, Full Inspection/Not Sure)

## Chatbot

A zero-dependency rule-based chatbot (`app.js`) in the bottom-right corner. Quick-reply chips
plus free-text intent matching: estimates, emergencies/leaks, storm & insurance claims, service
areas, services, hours, warranty, and human handoff. Every answer routes to the phone number or
estimate form.

## Run locally

```bash
python3 -m http.server 8891
# → http://localhost:8891
```

## Content status

Phone `(513) 555-0188`, email `info@kangerroofing.example`, owner "Mark Kanger", Ohio license
`#OH000000`, reviews, and testimonials are **placeholders** — search the HTML for each to swap.

## Stack

Vanilla HTML / CSS / JS — no build step, no dependencies. Barlow Condensed + Inter via Google
Fonts.
