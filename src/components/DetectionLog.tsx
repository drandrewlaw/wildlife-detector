'use client';

import { Detection } from '@/lib/types';

interface DetectionLogProps {
    detections: Detection[];
    onClear: () => void;
}

export function DetectionLog({ detections, onClear }: DetectionLogProps) {
    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-6 border border-zinc-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-zinc-100">Detection Log</h2>
                        <p className="text-sm text-zinc-400">{detections.length} scans recorded</p>
                    </div>
                </div>
                {detections.length > 0 && (
                    <button
                        onClick={onClear}
                        className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {detections.length === 0 ? (
                <div className="text-center py-12 px-4">
                    <svg className="h-12 w-12 text-zinc-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="mt-4 text-zinc-500">No detections yet</p>
                    <p className="text-xs text-zinc-600 mt-1">Scan a livestream to start logging wildlife</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {detections.map((detection) => (
                        <div
                            key={detection.id}
                            className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50 hover:border-zinc-600 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                {/* Thumbnail */}
                                {detection.frameB64 && (
                                    <img
                                        src={`data:image/jpeg;base64,${detection.frameB64}`}
                                        alt="Detection frame"
                                        className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
                                    />
                                )}

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs text-zinc-500">{formatDate(detection.timestamp)}</span>
                                        <span className="text-zinc-600">•</span>
                                        <span className="text-xs text-zinc-500">{formatTime(detection.timestamp)}</span>
                                    </div>

                                    {/* Animals */}
                                    {detection.animals.length > 0 ? (
                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                            {detection.animals.map((animal, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`px-2 py-0.5 text-xs font-medium rounded ${animal.confidence === 'high'
                                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                            : animal.confidence === 'medium'
                                                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                                                : 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30'
                                                        }`}
                                                >
                                                    {animal.name}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-zinc-500 italic">No wildlife detected</span>
                                    )}

                                    {/* Explanation preview */}
                                    <p className="text-xs text-zinc-400 line-clamp-2">
                                        {detection.explanation}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
