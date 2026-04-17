'use server';

import { NextResponse } from 'next/server';
import { aiSecurityChatbot } from '@/ai/flows/ai-security-chatbot';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question = String(body.question || '').trim();

    if (!question) {
      return NextResponse.json({ error: 'Question is required.' }, { status: 400 });
    }

    const result = await aiSecurityChatbot({ question });
    return NextResponse.json({ answer: result.answer });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json({ error: 'Unable to process chatbot request.' }, { status: 500 });
  }
}
