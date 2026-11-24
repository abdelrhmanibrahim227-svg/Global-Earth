// app/api/auth/social/[provider]/callback/route.js
import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { findOrCreateSocialUser, getOrigin, getProvider } from "@/lib/oauth";
import { sendWelcomeEmail } from "@/lib/notify";
import { safeNext } from "@/lib/safeNext";

export const runtime = "nodejs";

export async function GET(request, { params }) {
    const { provider: providerName } = await params;
    const origin = getOrigin(request);
    const provider = getProvider(providerName, origin);

    const finish = (target) => {
        const response = NextResponse.redirect(target);
        response.cookies.delete("oauth_state");
        response.cookies.delete("oauth_next");
        return response;
    };
    const fail = (code) => finish(`${origin}/login?error=${code}`);

    if (!provider || !provider.clientId || !provider.clientSecret) {
        return fail("provider_not_configured");
    }

    const search = request.nextUrl.searchParams;

    if (search.get("error")) return fail("access_denied");

    const code = search.get("code");
    const state = search.get("state");
    const savedState = request.cookies.get("oauth_state")?.value;

    if (!code || !state || !savedState || state !== savedState) {
        return fail("state_mismatch");
    }

    try {
        const accessToken = await provider.exchangeCode(code);
        const profile = await provider.getProfile(accessToken);

        if (!profile.email) return fail("no_email");
        if (!profile.verified) return fail("email_not_verified");

        const { user, isNew } = await findOrCreateSocialUser(profile);

        await createSession(user.id);

        if (isNew) {
            await sendWelcomeEmail({ name: user.name, email: user.email });
        }

        const next = safeNext(request.cookies.get("oauth_next")?.value);
        return finish(`${origin}${next}`);

    } catch (error) {
        console.error(`${providerName} OAuth error:`, error);
        return fail("oauth_failed");
    }
}
