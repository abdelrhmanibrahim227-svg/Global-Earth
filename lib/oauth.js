// lib/oauth.js  (server only) - Google & Facebook OAuth helpers, no extra packages needed.
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

export function getOrigin(request) {
    return (process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin).replace(/\/$/, "");
}

export function getProvider(name, origin) {
    const redirectUri = `${origin}/api/auth/social/${name}/callback`;

    if (name === "google") {
        return {
            name,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            redirectUri,
            authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
            scope: "openid email profile",
            extraParams: { prompt: "select_account" },

            async exchangeCode(code) {
                const res = await fetch("https://oauth2.googleapis.com/token", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({
                        code,
                        client_id: this.clientId,
                        client_secret: this.clientSecret,
                        redirect_uri: redirectUri,
                        grant_type: "authorization_code",
                    }),
                });
                if (!res.ok) throw new Error("Google token exchange failed");
                return (await res.json()).access_token;
            },

            async getProfile(accessToken) {
                const res = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (!res.ok) throw new Error("Google profile request failed");
                const p = await res.json();
                return {
                    email: p.email,
                    verified: p.email_verified === true,
                    name: p.name,
                    image: p.picture || "",
                };
            },
        };
    }

    if (name === "facebook") {
        return {
            name,
            clientId: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            redirectUri,
            authUrl: "https://www.facebook.com/v21.0/dialog/oauth",
            scope: "email,public_profile",
            extraParams: {},

            async exchangeCode(code) {
                const url = new URL("https://graph.facebook.com/v21.0/oauth/access_token");
                url.search = new URLSearchParams({
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    redirect_uri: redirectUri,
                    code,
                }).toString();
                const res = await fetch(url);
                if (!res.ok) throw new Error("Facebook token exchange failed");
                return (await res.json()).access_token;
            },

            async getProfile(accessToken) {
                const url = new URL("https://graph.facebook.com/me");
                url.search = new URLSearchParams({
                    fields: "id,name,email,picture.width(200).height(200)",
                    access_token: accessToken,
                }).toString();
                const res = await fetch(url);
                if (!res.ok) throw new Error("Facebook profile request failed");
                const p = await res.json();
                return {
                    email: p.email,
                    verified: Boolean(p.email), // Facebook only returns confirmed emails
                    name: p.name,
                    image: p.picture?.data?.url || "",
                };
            },
        };
    }

    return null;
}

// Finds the user by email (linking the social account) or creates a new one.
export async function findOrCreateSocialUser({ email, name, image }) {
    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = await prisma.user.findUnique({
        where: { email: normalizedEmail },
    });
    if (existing) return { user: existing, isNew: false };

    const user = await prisma.user.create({
        data: {
            id: randomUUID(),
            name: String(name || normalizedEmail.split("@")[0]).slice(0, 100),
            email: normalizedEmail,
            image: image || "",
        },
    });

    return { user, isNew: true };
}
