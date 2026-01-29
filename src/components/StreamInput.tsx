'use client';

import { useState } from 'react';

interface StreamInputProps {
    onDetect: (url: string) => void;
    isLoading: boolean;
}

export function StreamInput({ onDetect, isLoading }: StreamInputProps) {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const validateYoutubeUrl = (url: string): boolean => {
        const patterns = [
            /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
            /^https?:\/\/youtu\.be\/[\w-]+/,
            /^https?:\/\/(www\.)?youtube\.com\/live\/[\w-]+/,
        ];
        return patterns.some(pattern => pattern.test(url));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!url.trim()) {
            setError('Please enter a YouTube URL');
            return;
        }

        if (!validateYoutubeUrl(url)) {
            setError('Please enter a valid YouTube URL');
            return;
        }

        onDetect(url);
    };

    // Example wildlife streams
    const exampleStreams = [
        { name: 'Namibia Watering Hole', url: 'https://www.youtube.com/watch?v=uXNU0XgGZhs' },
        { name: 'African Wildlife', url: 'https://www.youtube.com/watch?v=ydYDqZQpim8' },
    ];

    return (
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-6 border border-zinc-700/50 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-zinc-100">Livestream Input</h2>
                    <p className="text-sm text-zinc-400">Enter a YouTube wildlife livestream URL</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        disabled={isLoading}
                    />
                    {error && (
                        <p className="mt-2 text-sm text-red-400">{error}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Scanning for Wildlife...</span>
                        </>
                    ) : (
                        <>
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span>Scan Now</span>
                        </>
                    )}
                </button>
            </form>

            {/* Example streams */}
            <div className="mt-4 pt-4 border-t border-zinc-700">
                <p className="text-xs text-zinc-500 mb-2">Try these wildlife streams:</p>
                <div className="flex flex-wrap gap-2">
                    {exampleStreams.map((stream) => (
                        <button
                            key={stream.url}
                            onClick={() => setUrl(stream.url)}
                            className="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg border border-zinc-600 transition-colors"
                        >
                            {stream.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
