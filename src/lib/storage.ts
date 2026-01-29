// Detection storage utilities using localStorage

import { Detection } from './types';

const STORAGE_KEY = 'wildlife_detections';
const MAX_DETECTIONS = 100;

export function getDetections(): Detection[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function saveDetection(detection: Detection): void {
    if (typeof window === 'undefined') return;

    const detections = getDetections();
    detections.unshift(detection); // Add to beginning

    // Keep only the most recent detections
    const trimmed = detections.slice(0, MAX_DETECTIONS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function clearDetections(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}

export function getDetectionStats(): { total: number; animalCounts: Record<string, number> } {
    const detections = getDetections();
    const animalCounts: Record<string, number> = {};

    detections.forEach(detection => {
        detection.animals.forEach(animal => {
            animalCounts[animal.name] = (animalCounts[animal.name] || 0) + (animal.count || 1);
        });
    });

    return {
        total: detections.length,
        animalCounts,
    };
}

export function generateDetectionId(): string {
    return `det_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
