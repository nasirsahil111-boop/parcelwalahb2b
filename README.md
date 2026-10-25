# Parcelwalah Partner Portal (Next.js)

Partner portal for Parcelwalah — built from the approved plan in
`~/workspace/your_files/parcelwalah-partner-portal-plan.md`.

**Partner portal ONLY.** Admin management stays in the existing admin panel
(`admin.html`) — this app does not build a new admin. Admin creates partner
credentials there and gives the partner this portal's link.

## What a partner can do

- **Login** — admin-created accounts only (Firebase Email/Password). No public
  signup.
- **Dashboard** — wallet balance, active/delivered orders, quick actions.
- **Place Order** — pickup (saved locations + add new + save option), drop,
  Google Maps distance (or labelled manual km fallback), city-wise rate card
  pricing (Ratlam / Jaora / Ujjain: ₹35 ≤3 km, ₹45 3–6 km, ₹55 6–10 km; food
  flat ₹35 ≤5 km), wallet balance check with insufficient-balance prompt,
  order confirm → order lands in `b2bRequests` (status `placed`, source
  `Portal`) for the Captain app queue.
- **Order History** — placed / accepted / picked / delivered / cancelled,
  source labelled App / Portal.
- **Wallet** — balance + transactions (prepaid only, no credit).
- **Saved Pickup Locations** — add / delete.
- **Rate Card** — the partner's city rates.
- **COD Settlements** — Collected → Deposited → Settled; captain ledger logic
  from the plan (e.g. COD ₹200 collected → captain earning ₹20 → wallet
  −₹180 owed). Deposit is online-only, no cash handling.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
```

## Demo mode — live se pehle dekh sakein

Login page par **"Demo dekho (fake data)"** button hai. Demo me:

- Koi login nahi chahiye, koi Firebase call nahi hoti — sab data browser me
  local mock data hai.
- Har demo page par banner dikhta hai: "DEMO DATA — ye nakli data hai, asli
  Firebase me kuch save nahi ho raha."
- Poora portal dikhta hai: dashboard, place order, order history, wallet,
  saved locations, rate card, COD settlements — demo data me 3 saved
  locations, har status ke orders, wallet transactions, aur 200/20/−180 wala
  COD settlement example shamil hai.
- **"Demo se bahar jao"** se wapas login page par. Demo me kiye changes sirf
  us session tak rehte hain — reload ya exit par reset ho jate hain.
- Demo code (`app/demo/`, `lib/demo-data.ts`, `components/DemoContext.tsx`)
  kabhi Firebase import nahi karta — is ki jaanch `grep -R "lib/firebase"
  app/demo components/DemoContext.tsx lib/demo-data.ts` se ki ja sakti hai
  (koi match nahi aana chahiye).

## Live mode configure karein

1. `.env.local.example` ko `.env.local` me copy karein aur values bharein
   (Firebase Console → Project settings → Web app; project
   `parcelwalla-66730`). Koi key code me hardcoded nahi hai.
2. Google Maps key ke liye Google Cloud Console me Distance Matrix API
   enable karein + billing on karein, key ko portal domain par restrict
   karein. Key na ho to Place Order me manual km entry dikhegi — us par
   saaf likha hota hai ki ye Maps ka result nahi hai.
3. `npm run dev` se chalaye, admin-created partner account se login karein.

## Go-live checklist (plan phase 5)

- [ ] Firebase Console me Email/Password sign-in enabled
- [ ] `firestore.rules` ko existing rules ke saath **merge** karein
      (replace kabhi nahi — warna Captain app aur customer app toot jayenge)
- [ ] City-wise rate cards save karein (Ratlam / Jaora / Ujjain)
- [ ] Pehla partner admin se banayein (Auth user + `portalUsers` link +
      `merchants` record) aur end-to-end trial karein
- [ ] Captain app update (alag developer leg): Captain app `b2bRequests`
      ko watch kare (status `placed`) taaki Portal orders bhi usi queue me
      dikhen. Band app par push alert ke liye alag push sender chahiye.

## Open items (plan section 8 se)

- Captain earning per order: plan ke example me flat ₹20 hai — flat rahega
  ya slab se, ye tay karna baaki hai.
- Wallet recharge ka tareeka: v1 me UPI payment + admin verify karke credit
  (top-up request flow demo me dikhta hai, live me admin-side credit hota
  hai). Payment gateway se auto-recharge abhi nahi hai.
- Google Maps API key + billing: kis account se banegi, ye tay karna hai.
- Portal ka hosting path (jaise web.parcelwalah.in/partner) tay karna hai.
