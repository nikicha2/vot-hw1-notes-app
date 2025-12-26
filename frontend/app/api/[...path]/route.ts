import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://notes-backend:8000';

async function proxyRequest(
  request: NextRequest,
  path: string[],
  method: string
) {
  // Reconstruct path and preserve trailing slash
  let pathString = path.join('/');
  if (!pathString.endsWith('/')) pathString += '/';

  const url = new URL(request.url);
  const queryString = url.searchParams.toString();
  const backendUrl = `${BACKEND_URL}/api/${pathString}${queryString ? `?${queryString}` : ''}`;

  // Forward headers (exclude hop-by-hop headers)
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (!['host', 'content-length'].includes(lower)) {
      headers[lower] = value;
    }
  });

  let body: BodyInit | undefined;

  if (!['GET', 'DELETE'].includes(method)) {
    const contentType = request.headers.get('content-type') || '';

    // multipart/form-data
    if (contentType.includes('multipart/form-data')) {
      body = await request.formData();
      // Let fetch handle boundary
      delete headers['content-type'];
      console.log('[PROXY] multipart/form-data body prepared');
    }
    // JSON
    else if (contentType.includes('application/json')) {
      body = await request.text(); // safer than request.json()
      headers['content-type'] = 'application/json';
      console.log('[PROXY] JSON body:', body);
    }
    // x-www-form-urlencoded
    else if (contentType.includes('application/x-www-form-urlencoded')) {
      body = await request.text();
      headers['content-type'] = 'application/x-www-form-urlencoded';
      console.log('[PROXY] urlencoded body:', body);
    }
    // fallback: binary/text
    else {
      body = await request.arrayBuffer();
      if (contentType) headers['content-type'] = contentType;
      console.log('[PROXY] raw body (arrayBuffer) used');
    }
  }

  console.log('[PROXY] Forwarding request:', method, backendUrl);
  console.log('[PROXY] Forwarding headers:', JSON.stringify(headers, null, 2));

  try {
    const response = await fetch(backendUrl, { method, headers, body });

    // Forward response as-is
    const responseBody = await response.arrayBuffer();
    const responseHeaders = new Headers(response.headers);

    return new NextResponse(responseBody, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend' },
      { status: 500 }
    );
  }
}

/* =======================
   HTTP Method Handlers
   ======================= */
export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(req, path, 'GET');
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(req, path, 'POST');
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(req, path, 'PUT');
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(req, path, 'PATCH');
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(req, path, 'DELETE');
}
