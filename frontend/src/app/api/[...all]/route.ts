import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL =
    process.env.BACKEND_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;

const JSON_HEADERS = { "Content-Type": "application/json" };
const RATE_LIMIT_WINDOW_MS =
    Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX ?? 120);
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextRequest) {
    const forwardedFor = req.headers.get("x-forwarded-for");
    if (forwardedFor) {
        return forwardedFor.split(",")[0]?.trim();
    }

    return req.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(key: string) {
    const now = Date.now();
    const current = rateLimitStore.get(key);

    if (!current || current.resetAt <= now) {
        rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return { allowed: true, retryAfter: 0 };
    }

    if (current.count >= RATE_LIMIT_MAX) {
        const retryAfter = Math.ceil((current.resetAt - now) / 1000);
        return { allowed: false, retryAfter };
    }

    current.count += 1;
    return { allowed: true, retryAfter: 0 };
}

function isBrowserRequest(req: NextRequest) {
    return req.headers.get("accept")?.includes("text/html");
}

function unauthorizedResponse(req: NextRequest) {
    if (isBrowserRequest(req)) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

async function proxyRequest(req: NextRequest) {
    if (!BACKEND_BASE_URL) {
        return NextResponse.json(
            { message: "Backend base URL not configured" },
            { status: 500, headers: JSON_HEADERS }
        );
    }

    const ipKey = `ip:${getClientIp(req)}`;
    const ipLimit = checkRateLimit(ipKey);
    if (!ipLimit.allowed) {
        return NextResponse.json(
            { message: "Too many requests" },
            {
                status: 429,
                headers: {
                    ...JSON_HEADERS,
                    "Retry-After": String(ipLimit.retryAfter),
                },
            }
        );
    }

    const { userId, getToken } = getAuth(req);
    if (!userId) {
        return unauthorizedResponse(req);
    }

    const userLimit = checkRateLimit(`user:${userId}`);
    if (!userLimit.allowed) {
        return NextResponse.json(
            { message: "Too many requests" },
            {
                status: 429,
                headers: {
                    ...JSON_HEADERS,
                    "Retry-After": String(userLimit.retryAfter),
                },
            }
        );
    }

    const token = await getToken();
    if (!token) {
        return unauthorizedResponse(req);
    }

    const apiPath = req.nextUrl.pathname.replace(/^\/api/, "") || "/";
    const search = req.nextUrl.search;
    const baseUrl = BACKEND_BASE_URL.replace(/\/$/, "");
    const targetUrl = `${baseUrl}${apiPath}${search}`;

    const headers = new Headers(req.headers);
    headers.delete("authorization");
    headers.delete("connection");
    headers.delete("content-length");
    headers.delete("cookie");
    headers.delete("host");
    headers.set("Authorization", `Bearer ${token}`);

    const method = req.method.toUpperCase();
    const body = method === "GET" || method === "HEAD" ? undefined : await req.arrayBuffer();

    try {
        const backendRes = await fetch(targetUrl, {
            method,
            headers,
            body,
            redirect: "manual",
        });

        const responseHeaders = new Headers(backendRes.headers);
        responseHeaders.delete("content-encoding");

        return new NextResponse(backendRes.body, {
            status: backendRes.status,
            headers: responseHeaders,
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Proxy request failed" },
            { status: 502, headers: JSON_HEADERS }
        );
    }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const HEAD = proxyRequest;
export const OPTIONS = proxyRequest;
