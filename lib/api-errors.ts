import { NextResponse } from 'next/server';

export function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function notFound(message = 'Not Found') {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function badRequest(message = 'Bad Request') {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function rateLimited(plan = 'free') {
  return NextResponse.json(
    { error: `Rate limit exceeded for ${plan} plan` },
    { status: 429 }
  );
}

export function serverError(message = 'Internal Server Error') {
  return NextResponse.json({ error: message }, { status: 500 });
}

export function notionDisconnected() {
  return NextResponse.json(
    {
      error: 'Notion disconnected or token expired',
      message: 'Please reconnect your Notion workspace in the dashboard.',
      action: 'reconnect_notion'
    },
    { status: 401 }
  );
}
