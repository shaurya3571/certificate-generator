Certificate Generator
What it does
A certificate-generation platform where organizers can create events, upload participants, generate certificates, email them, and participants can access/verify their certificates.
Tech Stack
Frontend: React + Next.js + TypeScript
Backend: Next.js API Routes + Node.js
Database/Auth: Supabase
Email: Resend
PDF: pdf-lib
CSV: Papa Parse
ZIP: JSZip
Deployment: Vercel
Main Features
Organizer signup/login
Event creation
Classic/Modern certificate templates
CSV participant upload
Participant preview
Bulk certificate generation
Unique certificate IDs
ZIP download
Certificate email
Participant login/dashboard
Event-wise certificate grouping
Certificate download
Public certificate verification
RLS/security
Duplicate participant protection
Certificate ID
Format:
CERT-YYYY-XXXXXX
Example:
Certificate Generator
What it does
A certificate-generation platform where organizers can create events, upload participants, generate certificates, email them, and participants can access/verify their certificates.
Tech Stack
Frontend: React + Next.js + TypeScript
Backend: Next.js API Routes + Node.js
Database/Auth: Supabase
Email: Resend
PDF: pdf-lib
CSV: Papa Parse
ZIP: JSZip
Deployment: Vercel
Main Features
Organizer signup/login
Event creation
Classic/Modern certificate templates
CSV participant upload
Participant preview
Bulk certificate generation
Unique certificate IDs
ZIP download
Certificate email
Participant login/dashboard
Event-wise certificate grouping
Certificate download
Public certificate verification
RLS/security
Duplicate participant protection
Certificate ID
Format:
CERT-YYYY-XXXXXX
Example:
CERT-2026-305NDF
Local Setup
npm install
npm run dev
Then:
http://localhost:3000
Production
Deployment:
Vercel
Supabase provides:
Authentication
PostgreSQL database
Row Level Security
Resend provides:
Certificate email delivery
Local Setup
npm install
npm run dev
Then:
http://localhost:3000
Production
Deployment:
Vercel
Supabase provides:
Authentication
PostgreSQL database
Row Level Security
Resend provides:
Certificate email delivery