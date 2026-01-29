import { NextRequest, NextResponse } from 'next/server';
import { checkOnce } from '@/lib/vibestream';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { youtube_url } = body;

        if (!youtube_url) {
            return NextResponse.json(
                { error: 'youtube_url is required' },
                { status: 400 }
            );
        }

        // Wildlife-specific detection condition
        const condition = `Analyze this image for wildlife. 
    1. Are there any animals visible? If yes, list each species you can identify.
    2. For each animal, estimate the count if there are multiple.
    3. Rate your confidence for each identification as 'high', 'medium', or 'low'.
    4. Describe the animals' behavior briefly.
    
    If no animals are visible, say "No wildlife detected" and describe what you see instead.`;

        const result = await checkOnce({
            youtube_url,
            condition,
            include_frame: true,
            model: 'gemini-2.5-flash',
        });

        // Parse the explanation to extract animal info
        const animals = parseAnimals(result.explanation);

        return NextResponse.json({
            success: true,
            triggered: result.triggered,
            explanation: result.explanation,
            animals,
            frame_b64: result.frame_b64,
            model: result.model,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Detection error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Detection failed' },
            { status: 500 }
        );
    }
}

// Helper function to parse animal mentions from the explanation
function parseAnimals(explanation: string): Array<{ name: string; confidence: string; count?: number }> {
    const animals: Array<{ name: string; confidence: string; count?: number }> = [];

    // Common wildlife keywords to look for
    const wildlifeKeywords = [
        'elephant', 'lion', 'tiger', 'bear', 'deer', 'wolf', 'fox', 'eagle', 'hawk',
        'buffalo', 'zebra', 'giraffe', 'hippo', 'crocodile', 'alligator', 'snake',
        'bird', 'owl', 'heron', 'crane', 'duck', 'goose', 'swan', 'pelican',
        'monkey', 'gorilla', 'chimpanzee', 'baboon', 'leopard', 'cheetah', 'jaguar',
        'rhino', 'wildebeest', 'antelope', 'gazelle', 'impala', 'warthog', 'boar',
        'rabbit', 'hare', 'squirrel', 'raccoon', 'skunk', 'beaver', 'otter',
        'seal', 'dolphin', 'whale', 'shark', 'fish', 'turtle', 'frog', 'lizard',
        'coyote', 'moose', 'elk', 'caribou', 'bison', 'horse', 'cow', 'pig',
        'cat', 'dog', 'chicken', 'turkey', 'pheasant', 'quail', 'grouse'
    ];

    const lowerExplanation = explanation.toLowerCase();

    for (const animal of wildlifeKeywords) {
        if (lowerExplanation.includes(animal)) {
            // Determine confidence based on language used
            let confidence = 'medium';
            if (lowerExplanation.includes(`definitely ${animal}`) ||
                lowerExplanation.includes(`clearly ${animal}`) ||
                lowerExplanation.includes('high confidence')) {
                confidence = 'high';
            } else if (lowerExplanation.includes(`possibly ${animal}`) ||
                lowerExplanation.includes(`might be`) ||
                lowerExplanation.includes('low confidence')) {
                confidence = 'low';
            }

            animals.push({
                name: animal.charAt(0).toUpperCase() + animal.slice(1),
                confidence,
            });
        }
    }

    return animals;
}
