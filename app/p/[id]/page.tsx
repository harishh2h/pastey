import { initSchema } from '@/lib/db';
import { fetchPaste } from '@/lib/paste-service';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { CopyButton } from './copy-button';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PastePage({ params }: PageProps) {
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black text-black">Paste View</h1>
          <CopyButton content={paste.content} />
        </div>
        <div className="border-4 border-black rounded-2xl bg-white p-6">
          <pre className="whitespace-pre-wrap font-mono text-sm break-words text-black">{paste.content}</pre>
        </div>
      </div>
    </div>
  );
}
