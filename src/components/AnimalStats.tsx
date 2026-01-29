'use client';

interface AnimalStatsProps {
    stats: { total: number; animalCounts: Record<string, number> };
}

export function AnimalStats({ stats }: AnimalStatsProps) {
    const sortedAnimals = Object.entries(stats.animalCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8);

    const totalAnimals = Object.values(stats.animalCounts).reduce((sum, count) => sum + count, 0);

    // Animal emoji mapping
    const getEmoji = (animal: string): string => {
        const emojiMap: Record<string, string> = {
            elephant: '🐘', lion: '🦁', tiger: '🐅', bear: '🐻', deer: '🦌',
            wolf: '🐺', fox: '🦊', eagle: '🦅', bird: '🐦', owl: '🦉',
            buffalo: '🦬', zebra: '🦓', giraffe: '🦒', hippo: '🦛', crocodile: '🐊',
            snake: '🐍', monkey: '🐒', gorilla: '🦍', leopard: '🐆', duck: '🦆',
            rabbit: '🐰', fish: '🐟', turtle: '🐢', frog: '🐸', whale: '🐋',
            dolphin: '🐬', shark: '🦈', horse: '🐴', cow: '🐄', pig: '🐷',
        };
        return emojiMap[animal.toLowerCase()] || '🦎';
    };

    return (
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-6 border border-zinc-700/50 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-zinc-100">Wildlife Stats</h2>
                    <p className="text-sm text-zinc-400">Detection summary</p>
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                    <p className="text-3xl font-bold text-emerald-400">{stats.total}</p>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Total Scans</p>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                    <p className="text-3xl font-bold text-amber-400">{totalAnimals}</p>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Animals Found</p>
                </div>
            </div>

            {/* Top species */}
            {sortedAnimals.length > 0 ? (
                <div className="space-y-2">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Top Species</p>
                    {sortedAnimals.map(([animal, count]) => {
                        const percentage = totalAnimals > 0 ? (count / totalAnimals) * 100 : 0;
                        return (
                            <div key={animal} className="flex items-center gap-3">
                                <span className="text-xl">{getEmoji(animal)}</span>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-zinc-300">{animal}</span>
                                        <span className="text-xs text-zinc-500">{count}</span>
                                    </div>
                                    <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-6">
                    <p className="text-zinc-500 text-sm">No species detected yet</p>
                </div>
            )}
        </div>
    );
}
