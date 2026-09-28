import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300; // Allow up to 5 minutes for AI generation
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
    return proxyRequest(request, params.path);
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
    return proxyRequest(request, params.path);
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
    return proxyRequest(request, params.path);
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
    return proxyRequest(request, params.path);
}

export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
    return proxyRequest(request, params.path);
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        },
    });
}

async function proxyRequest(request: NextRequest, pathSegments: string[]) {
    try {
        const path = (pathSegments || []).join("/");
        const url = new URL(request.url);
        const backendBase = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8000";
        const targetUrl = `${backendBase}/api/${path}${url.search}`;

        const headers = new Headers();
        request.headers.forEach((value, key) => {
            const lower = key.toLowerCase();
            if (!["host", "connection", "content-length"].includes(lower)) {
                headers.set(key, value);
            }
        });

        const hasBody = !["GET", "HEAD", "OPTIONS"].includes(request.method);
        const body = hasBody ? await request.arrayBuffer() : undefined;

        const response = await fetch(targetUrl, {
            method: request.method,
            headers,
            body,
            cache: "no-store",
        });

        const responseBody = await response.arrayBuffer();

        const responseHeaders = new Headers();
        response.headers.forEach((value, key) => {
            const lower = key.toLowerCase();
            if (!["content-encoding", "transfer-encoding"].includes(lower)) {
                responseHeaders.set(key, value);
            }
        });

        return new NextResponse(responseBody, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        });
    } catch (err: any) {
        return NextResponse.json(
            { detail: `Backend gateway error: ${err.message || String(err)}` },
            { status: 502 }
        );
    }
}
