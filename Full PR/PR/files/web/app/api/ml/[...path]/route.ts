import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) { return proxy('GET', req, params.path); }
export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) { return proxy('POST', req, params.path); }
async function proxy(method: string, req: NextRequest, pathParts: string[]) {
  const ML_URL = process.env.ML_URL || process.env.NEXT_PUBLIC_ML_URL || 'http://localhost:8088';
  const url = new URL(req.url);
  const target = `${ML_URL}/${pathParts.join('/')}${url.search}`;
  const headers = new Headers(); req.headers.forEach((v,k)=>{ if (!['host','connection','content-length'].includes(k.toLowerCase())) headers.set(k, v); });
  const body = ['GET','HEAD'].includes(method) ? undefined : await req.arrayBuffer();
  const resp = await fetch(target, { method, headers, body, redirect:'manual' });
  const resHeaders = new Headers(resp.headers); resHeaders.set('x-proxied-ml','skinzai');
  return new NextResponse(resp.body, { status: resp.status, headers: resHeaders });
}
