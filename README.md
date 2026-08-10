# 🛍️ UnRetail 

> **The Decentralized Engine for Local Thrift & Circular Fashion**  
> Bringing fragmented, offline thrift store inventories into a real-time, unified online marketplace.

---

## 📌 Project Overview

**UnRetail** bridges the gap between independent, brick-and-mortar thrift shops and digital shoppers. The platform addresses the single-stock, 1-of-1 inventory problem native to secondhand fashion through a dual-portal architecture:

1. **Merchant Portal:** A high-speed, mobile-first inventory desk enabling physical shop owners to list items in under 60 seconds and synchronize in-store offline sales in real time.
2. **Customer Portal:** A high-performance discovery feed featuring sub-50ms typo-tolerant search, instant multi-attribute filtering (size, era, condition grade, location), and multi-vendor checkout.

---

## 🏗️ Tech Stack & Architecture

```text
                                 ┌───────────────────────────┐
                                 │     NEXT.JS APP ROUTER    │
                                 │       (Vercel Edge)       │
                                 └─────────────┬─────────────┘
                                               │
                      ┌────────────────────────┴────────────────────────┐
                      ▼                                                 ▼
        ┌───────────────────────────┐                     ┌───────────────────────────┐
        │   SUPABASE (PostgreSQL)   │                     │    MEILISEARCH ENGINE     │
        │ - Auth (Google OAuth)     │ ──(DB Webhook)───►  │ - Sub-50ms Search Bar    │
        │ - Database & RLS Security │                     │ - Multi-Attribute Filters │
        └───────────────────────────┘                     └───────────────────────────┘
                      │
                      ▼
        ┌───────────────────────────┐
        │      STRIPE CONNECT       │
        │ - Split Vendor Payouts    │
        │ - Automated Platform Cut  │
        └───────────────────────────┘
