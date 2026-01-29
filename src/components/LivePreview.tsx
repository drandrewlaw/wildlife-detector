'use client';

interface LivePreviewProps {
    frameB64: string | null;
    explanation: string | null;
    animals: Array<{ name: string; confidence: string; count?: number }>;
    isLoading: boolean;
}

export function LivePreview({ frameB64, explanation, animals, isLoading }: LivePreviewProps) {
    if (isLoading) {
        return (
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-6 border border-zinc-700/50 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25 animate-pulse">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-zinc-100">Live Preview</h2>
                        <p className="text-sm text-zinc-400">Capturing frame...</p>
                    </div>
                </div>
                <div className="aspect-video bg-zinc-800 rounded-xl animate-pulse flex items-center justify-center">
                    <div className="text-center">
                        <svg className="h-16 w-16 text-zinc-600 mx-auto animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p className="mt-4 text-zinc-500">Analyzing stream...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!frameB64 && !explanation) {
        return (
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-6 border border-zinc-700/50 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-zinc-100">Live Preview</h2>
                        <p className="text-sm text-zinc-400">Enter a stream URL and click Scan</p>
                    </div>
                </div>
                <div className="aspect-video bg-zinc-800/50 rounded-xl border-2 border-dashed border-zinc-700 flex items-center justify-center">
                    <div className="text-center p-8">
                        <svg className="h-16 w-16 text-zinc-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p className="mt-4 text-zinc-500">No preview yet</p>
                        <p className="text-xs text-zinc-600 mt-1">Enter a YouTube livestream URL above</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-6 border border-zinc-700/50 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-zinc-100">Live Preview</h2>
                    <p className="text-sm text-zinc-400">Latest captured frame</p>
                </div>
                {animals.length > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                        <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-emerald-400">{animals.length} species detected</span>
                    </div>
                )}
            </div>

            {/* Frame display */}
            {frameB64 && (
                <div className="relative mb-4">
                    <img
                        src={`data:image/jpeg;base64,${frameB64}`}
                        alt="Captured frame"
                        className="w-full rounded-xl border border-zinc-700"
                    />
                    {/* Animal tags overlay */}
                    {animals.length > 0 && (
                        <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                            {animals.map((animal, idx) => (
                                <span
                                    key={idx}
                                    className={`px-2 py-1 text-xs font-medium rounded-lg backdrop-blur-sm ${animal.confidence === 'high'
                                            ? 'bg-emerald-500/80 text-white'
                                            : animal.confidence === 'medium'
                                                ? 'bg-amber-500/80 text-white'
                                                : 'bg-zinc-500/80 text-white'
                                        }`}
                                >
                                    {animal.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* AI Analysis */}
            {explanation && (
                <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
                    <div className="flex items-center gap-2 mb-2">
                        <svg className="h-4 w-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span className="text-sm font-medium text-purple-400">AI Analysis</span>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed">{explanation}</p>
                </div>
            )}
        </div>
    );
}
