import Main from './components/Main'

interface PageProps {
    params: Promise<{ id: string }> | { id: string };
}

export default async function SellerVerificationDetailPage({ params }: PageProps) {
    // Await params if it's a promise (Next.js 15+ compatible)
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    return (
        <Main id={id} />
    )
}
