import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy('GET', req, params.path);
}
export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy('POST', req, params.path);
}
export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy('PUT', req, params.path);
}
export async function PATCH(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy('PATCH', req, params.path);
}
export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy('DELETE', req, params.path);
}

async function proxy(method: string, req: NextRequest, pathParts: string[]) {
  const API_URL = process.env.API_URL || 'http://localhost:8000';
  const url = new URL(req.url);
  const target = `${API_URL}/${pathParts.join('/')}${url.search}`;

  const headers = new Headers();
  req.headers.forEach((v,k)=>{
    if (!['host','connection','content-length'].includes(k.toLowerCase())) headers.set(k, v);
  });
  // Forward auth token if present
  const auth = req.headers.get('authorization');
  if (auth) headers.set('authorization', auth);

  const body = ['GET','HEAD'].includes(method) ? undefined : await req.arrayBuffer();

  const resp = await fetch(target, { method, headers, body, redirect:'manual' });
  const resHeaders = new Headers(resp.headers);
  resHeaders.set('x-proxied-by','skinzai');
  return new NextResponse(resp.body, { status: resp.status, headers: resHeaders });
}
