import { initSchema } from '@/lib/db';
import { fetchPaste } from '@/lib/paste-service';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PastePage({ params }: PageProps): Promise<JSX.Element> {
  // Schema is initialized at app startup, but keep as fallback for safety
  await initSchema();
  const { id } = await params;
  const headersList = await headers();
  const testTimeHeader = headersList.get('x-test-now-ms');
  const paste = await fetchPaste(id, { testTimeHeader });
  if (!paste) {
    notFound();
  }
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black mb-6 text-black">Paste View</h1>
        <div className="border-4 border-black rounded-2xl bg-white p-6">
          <pre className="whitespace-pre-wrap font-mono text-sm break-words text-black">{paste.content}</pre>
        </div>
      </div>
    </div>
  );
}
