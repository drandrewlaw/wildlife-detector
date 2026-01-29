// Types for the Wildlife Detector app

export interface Detection {
    id: string;
    timestamp: string;
    youtubeUrl: string;
    streamTitle: string;
    animals: AnimalSighting[];
    triggered: boolean;
    explanation: string;
    frameB64?: string;
    model: string;
}

export interface AnimalSighting {
    name: string;
    confidence: 'high' | 'medium' | 'low';
    count?: number;
}

export interface VibeStreamCheckResponse {
    triggered: boolean;
    explanation: string;
    model: string;
    frame_b64: string | null;
}

export interface VibeStreamWatchRequest {
    youtube_url: string;
    condition: string;
    webhook_url: string;
    interval_seconds?: number;
    model?: string;
}

export interface VibeStreamJob {
    id: string;
    status: 'running' | 'stopped';
    youtube_url: string;
    condition: string;
}
