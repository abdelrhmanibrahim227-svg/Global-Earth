// app/api/auth/social/[provider]/route.js
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getOrigin, getProvider } from "@/lib/oauth";
import { safeNext } from "@/lib/safeNext";

export const runtime = "nodejs";

export async function GET(request, { params }) {
    const { provider: providerName } = await params;
    const origin = getOrigin(request);
    const provider = getProvider(providerName, origin);

    if (!provider) {
        return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
    }

    if (!provider.clientId || !provider.clientSecret) {
        return NextResponse.redirect(`${origin}/login?error=provider_not_configured`);
    }

    const state = randomUUID();
    const next = safeNext(request.nextUrl.searchParams.get("next"));

    const url = new URL(provider.authUrl);
    url.search = new URLSearchParams({
        client_id: provider.clientId,
        redirect_uri: provider.redirectUri,
        response_type: "code",
        scope: provider.scope,
        state,
        ...provider.extraParams,
    }).toString();

    const response = NextResponse.redirect(url);
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 600,
    };

    response.cookies.set("oauth_state", state, cookieOptions);
    response.cookies.set("oauth_next", next, cookieOptions);

    return response;
}
