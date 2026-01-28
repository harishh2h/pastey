'use client';

import { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [showTtl, setShowTtl] = useState(false);
  const [showMaxViews, setShowMaxViews] = useState(false);
  const [ttlSeconds, setTtlSeconds] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pasteUrl, setPasteUrl] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError('');
    setPasteUrl('');
    setLoading(true);
    try {
      const body: Record<string, unknown> = { content };
      if (ttlSeconds) {
        const ttl = parseInt(ttlSeconds, 10);
        if (isNaN(ttl) || ttl < 1) {
          setError('TTL must be an integer >= 1');
          setLoading(false);
          return;
        }
        body.ttl_seconds = ttl;
      }
      if (maxViews) {
        const views = parseInt(maxViews, 10);
        if (isNaN(views) || views < 1) {
          setError('Max views must be an integer >= 1');
          setLoading(false);
          return;
        }
        body.max_views = views;
      }
      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to create paste');
        setLoading(false);
        return;
      }
      setPasteUrl(data.url);
      setContent('');
      setTtlSeconds('');
      setMaxViews('');
      setShowTtl(false);
      setShowMaxViews(false);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-black mb-2 text-black">PASTEY</h1>
          <p className="text-lg sm:text-xl font-medium text-black">paste & go</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="w-full md:flex-[0.7]">
              <label htmlFor="content" className="block font-bold mb-3 text-black text-base sm:text-lg">
                Paste content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full border-4 border-black rounded-2xl p-3 sm:p-4 font-mono text-sm resize-y min-h-[200px] sm:min-h-[300px] focus:outline-none focus:ring-0 bg-white text-black"
                placeholder=""
              />
            </div>
            <div className="w-full md:flex-[0.3] space-y-4 mt-0 md:mt-[39px]">
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowTtl(!showTtl);
                    if (showTtl) {
                      setTtlSeconds('');
                    }
                  }}
                  className="border-4 border-black rounded-xl bg-white text-black px-3 sm:px-4 py-2 sm:py-3 font-bold hover:bg-black hover:text-white transition-colors w-full text-left text-sm sm:text-base"
                >
                  {showTtl ? '−' : '+'} Time-based Expiry
                </button>
                {showTtl && (
                  <input
                    id="ttl"
                    type="number"
                    min="1"
                    value={ttlSeconds}
                    onChange={(e) => setTtlSeconds(e.target.value)}
                    className="w-full border-4 border-black rounded-xl p-2 sm:p-3 focus:outline-none bg-white text-black font-bold text-sm sm:text-base"
                    placeholder="Seconds (e.g. 60)"
                  />
                )}
              </div>
              <div className="flex flex-col gap-2 mt-0 md:mt-[43px]">
                <button
                  type="button"
                  onClick={() => {
                    setShowMaxViews(!showMaxViews);
                    if (showMaxViews) {
                      setMaxViews('');
                    }
                  }}
                  className="border-4 border-black rounded-xl bg-white text-black px-3 sm:px-4 py-2 sm:py-3 font-bold hover:bg-black hover:text-white transition-colors w-full text-left text-sm sm:text-base"
                >
                  {showMaxViews ? '−' : '+'} View Count Limit
                </button>
                {showMaxViews && (
                  <input
                    id="maxViews"
                    type="number"
                    min="1"
                    value={maxViews}
                    onChange={(e) => setMaxViews(e.target.value)}
                    className="w-full border-4 border-black rounded-xl p-2 sm:p-3 focus:outline-none bg-white text-black font-bold text-sm sm:text-base"
                    placeholder="Views (e.g. 5)"
                  />
                )}
              </div>
            </div>
          </div>
          {error && (
            <div className="mb-6 p-3 sm:p-4 bg-red-100 border-3 border-black rounded-xl text-black font-bold text-sm sm:text-base">
              {error}
            </div>
          )}
          {pasteUrl && (
            <div className="mb-6 p-3 sm:p-4 bg-[#00f59b] border-3 border-black rounded-xl">
              <p className="font-bold mb-2 text-black text-sm sm:text-base">Paste created!</p>
              <a
                href={pasteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline break-all font-semibold text-sm sm:text-base"
              >
                {pasteUrl}
              </a>
            </div>
          )}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto border-4 border-black rounded-xl bg-[#00f59b] text-black px-8 sm:px-12 py-3 sm:py-4 font-bold text-base sm:text-lg hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Paste'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
