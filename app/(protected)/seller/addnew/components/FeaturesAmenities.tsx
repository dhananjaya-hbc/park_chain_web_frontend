import { useState } from 'react';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';

export default function FeaturesAmenities() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const documentFiles = {
    nicFront: null,
    nicBack: null,
    selfie: null,
    legalDocument: null,
    utilityBill: null,
  };
  const formValues = {
    name: '',
    email: '',
    phone: '',
    address: '',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    /* ... validation ... */
    setLoading(true);

    try {
        // 1. Upload all files to Cloudinary concurrently
        const uploadPromises: Promise<string>[] = [];
        const fileNames: string[] = [];

        // Helper to push files into upload queue
        const queueUpload = (file: File | null, name: string) => {
            if (file) {
                uploadPromises.push(uploadToCloudinary(file));
                fileNames.push(name);
            }
        };

        queueUpload(documentFiles.nicFront, 'nicFrontUrl');
        queueUpload(documentFiles.nicBack, 'nicBackUrl');
        queueUpload(documentFiles.selfie, 'selfieUrl');
        queueUpload(documentFiles.legalDocument, 'legalDocumentUrl');
        queueUpload(documentFiles.utilityBill, 'utilityBillUrl');

        const uploadedUrls = await Promise.all(uploadPromises);
        
        // Map the returned URLs back to their corresponding names
        const documentUrls = fileNames.reduce((acc, name, index) => {
            acc[name] = uploadedUrls[index];
            return acc;
        }, {} as Record<string, string>);

        // 2. Prepare JSON payload for your backend
        const payloadData = {
            ...formValues,
            ...documentUrls, // Now contains Cloudinary URLs instead of File objects
            sellerEmail: localStorage.getItem('seller_email'),
            sellerWallet: localStorage.getItem('seller_wallet'),
        };

        // 3. Send JSON to your separate backend
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/seller/kyc`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(payloadData),
        });

        if (!response.ok) {
            throw new Error('Failed to submit form');
        }

        /* ... handle response ... */
    } catch (submitError) {
        if (submitError instanceof Error) {
            setError(submitError.message);
        } else {
            setError('An unexpected error occurred');
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-4">Features & Amenities</h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {["CCTV", "24/7 Security", "Covered"].map((feature) => (
          <label key={feature} className="flex items-center justify-between border rounded-lg p-3"><span className="text-sm">{feature}</span><input type="checkbox" /></label>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <button type="submit" disabled={loading} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}