'use client';

import { useState, useEffect, useCallback } from 'react';
import { StreamInput } from '@/components/StreamInput';
import { LivePreview } from '@/components/LivePreview';
import { DetectionLog } from '@/components/DetectionLog';
import { AnimalStats } from '@/components/AnimalStats';
import { Detection, AnimalSighting } from '@/lib/types';
import { getDetections, saveDetection, clearDetections, getDetectionStats, generateDetectionId } from '@/lib/storage';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentFrame, setCurrentFrame] = useState<string | null>(null);
  const [currentExplanation, setCurrentExplanation] = useState<string | null>(null);
  const [currentAnimals, setCurrentAnimals] = useState<AnimalSighting[]>([]);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [stats, setStats] = useState({ total: 0, animalCounts: {} as Record<string, number> });
  const [error, setError] = useState<string | null>(null);

  // Load detections from localStorage on mount
  useEffect(() => {
    setDetections(getDetections());
    setStats(getDetectionStats());
  }, []);

  const handleDetect = useCallback(async (youtubeUrl: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentFrame(null);
    setCurrentExplanation(null);
    setCurrentAnimals([]);

    try {
      const response = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtube_url: youtubeUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Detection failed');
      }

      // Update current display
      setCurrentFrame(data.frame_b64);
      setCurrentExplanation(data.explanation);
      setCurrentAnimals(data.animals || []);

      // Create and save detection
      const detection: Detection = {
        id: generateDetectionId(),
        timestamp: data.timestamp,
        youtubeUrl,
        streamTitle: '', // Could extract from URL
        animals: data.animals || [],
        triggered: data.triggered,
        explanation: data.explanation,
        frameB64: data.frame_b64,
        model: data.model,
      };

      saveDetection(detection);
      setDetections(getDetections());
      setStats(getDetectionStats());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Detection error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleClearLog = useCallback(() => {
    clearDetections();
    setDetections([]);
    setStats({ total: 0, animalCounts: {} });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent" />

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-zinc-800/50 backdrop-blur-xl bg-zinc-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <span className="text-2xl">🦁</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Wildlife Detector
                  </h1>
                  <p className="text-sm text-zinc-400">
                    Powered by VibeStream AI
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm text-zinc-400">Real-time</span>
              </div>
            </div>
          </div>
        </header>

        {/* Error banner */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
              <svg className="h-5 w-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-400">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Main grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Input and Preview */}
            <div className="lg:col-span-2 space-y-6">
              <StreamInput onDetect={handleDetect} isLoading={isLoading} />
              <LivePreview
                frameB64={currentFrame}
                explanation={currentExplanation}
                animals={currentAnimals}
                isLoading={isLoading}
              />
            </div>

            {/* Right column - Stats and Log */}
            <div className="space-y-6">
              <AnimalStats stats={stats} />
              <DetectionLog detections={detections} onClear={handleClearLog} />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-800/50 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-500">
                Powered by{' '}
                <a
                  href="https://trio.machinefi.com/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  VibeStream API
                </a>
              </p>
              <p className="text-sm text-zinc-600">
                Built with Next.js + Tailwind CSS
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
