import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path?.join('/') || '';
  const url = new URL(request.url);
  const targetUrl = `${API_URL}/${path}${url.search}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...Object.fromEntries(request.headers.entries()),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from backend' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path?.join('/') || '';
  const url = new URL(request.url);
  const targetUrl = `${API_URL}/${path}${url.search}`;

  try {
    const body = await request.json();
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...Object.fromEntries(request.headers.entries()),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from backend' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path?.join('/') || '';
  const url = new URL(request.url);
  const targetUrl = `${API_URL}/${path}${url.search}`;

  try {
    const body = await request.json();
    const response = await fetch(targetUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...Object.fromEntries(request.headers.entries()),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from backend' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path?.join('/') || '';
  const url = new URL(request.url);
  const targetUrl = `${API_URL}/${path}${url.search}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...Object.fromEntries(request.headers.entries()),
      },
    });

    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      }
      return new NextResponse(null, { status: response.status });
    }
    
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: response.status }
    );
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from backend' },
      { status: 500 }
    );
  }
}