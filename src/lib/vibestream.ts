// VibeStream API Client
// API Docs: https://iotex.mintlify.app/introduction

const VIBESTREAM_API_URL = 'https://vibestream.machinefi.com';

export interface CheckOnceRequest {
    youtube_url: string;
    condition: string;
    model?: string;
    include_frame?: boolean;
}

export interface CheckOnceResponse {
    triggered: boolean;
    explanation: string;
    model: string;
    frame_b64: string | null;
}

export interface WatchRequest {
    youtube_url: string;
    condition: string;
    webhook_url: string;
    interval_seconds?: number;
    model?: string;
}

export interface WatchResponse {
    job_id: string;
    status: string;
    message: string;
}

/**
 * Single frame capture and analysis - synchronous
 */
export async function checkOnce(request: CheckOnceRequest): Promise<CheckOnceResponse> {
    const response = await fetch(`${VIBESTREAM_API_URL}/check-once`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            youtube_url: request.youtube_url,
            condition: request.condition,
            model: request.model || 'gemini-2.5-flash',
            include_frame: request.include_frame ?? true,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`VibeStream API error: ${response.status} - ${error}`);
    }

    return response.json();
}

/**
 * Start continuous monitoring - async with webhooks
 */
export async function startWatch(request: WatchRequest): Promise<WatchResponse> {
    const response = await fetch(`${VIBESTREAM_API_URL}/watch`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            youtube_url: request.youtube_url,
            condition: request.condition,
            webhook_url: request.webhook_url,
            interval_seconds: request.interval_seconds || 30,
            model: request.model || 'gemini-2.5-flash',
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`VibeStream API error: ${response.status} - ${error}`);
    }

    return response.json();
}

/**
 * Get list of active monitoring jobs
 */
export async function getJobs(): Promise<{ jobs: Array<{ id: string; status: string }> }> {
    const response = await fetch(`${VIBESTREAM_API_URL}/jobs`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.status}`);
    }

    return response.json();
}

/**
 * Cancel a monitoring job
 */
export async function cancelJob(jobId: string): Promise<void> {
    const response = await fetch(`${VIBESTREAM_API_URL}/jobs/${jobId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`Failed to cancel job: ${response.status}`);
    }
}
