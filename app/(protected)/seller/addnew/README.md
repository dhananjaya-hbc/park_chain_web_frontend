# Seller Add New + KYC Backend Wiring

This folder now supports real KYC submission from UI to:

- Cloudinary for document/image upload
- Neon PostgreSQL for structured KYC data storage

## Flow

1. Seller opens Add New page.
2. KYC modal collects identity, property, and document data.
3. Submit sends `multipart/form-data` to `POST /api/seller/kyc`.
4. Route uploads files to Cloudinary and gets secure URLs.
5. Route inserts one row into `seller_kyc_submissions` in Neon.
6. UI switches to `pending_review` state on success.

## Required Environment Variables

Add to `.env.local`:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
```

## Table

The route auto-creates this table on first submit:

- `seller_kyc_submissions`

It stores seller details, land info, all Cloudinary URLs, status, and timestamp.

## Files Used

- `app/(protected)/seller/addnew/components/KycModal.tsx`
- `app/(protected)/seller/addnew/components/Step1Identity.tsx`
- `app/(protected)/seller/addnew/components/Step2LandDetails.tsx`
- `app/(protected)/seller/addnew/components/Step3Documents.tsx`
- `app/(protected)/seller/addnew/components/kycTypes.ts`
- `app/(protected)/seller/addnew/page.tsx`
- `app/api/seller/kyc/route.ts`
- `lib/server/cloudinary.ts`
- `lib/server/db.ts`
- `app/(auth)/login/page.tsx`

## Notes

- This implementation keeps KYC status in local storage (`seller_kyc_status`) for page refreshes.
- Seller email/wallet are attached from local storage when available.
- Admin verification pages still use mock data today. You can later connect them to this table.
