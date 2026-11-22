
'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    UserRound,
    Mail,
    CalendarDays,
    Package,
    Save,
    ArrowLeft,
    Loader2,
    ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AccountPage() {
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let active = true;

        async function loadProfile() {
            try {
                const response = await fetch("/api/account/profile", {
                    cache: "no-store",
                });

                if (response.status === 401) {
                    router.replace("/login");
                    return;
                }

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Unable to load account");
                }

                if (active) {
                    setUser(data.user);
                    setName(data.user.name || "");
                }
            } catch (error) {
                toast.error(error.message || "Something went wrong");
            } finally {
                if (active) setLoading(false);
            }
        }

        loadProfile();

        return () => {
            active = false;
        };
    }, [router]);

    const handleSave = async (e) => {
        e.preventDefault();

        const cleanName = name.trim();

        if (cleanName.length < 2 || cleanName.length > 60) {
            toast.error("Name must be between 2 and 60 characters");
            return;
        }

        if (cleanName === user?.name) {
            toast("No changes to save");
            return;
        }

        setSaving(true);

        try {
            const response = await fetch("/api/account/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: cleanName }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to update profile");
            }

            setUser(data.user);
            setName(data.user.name);

            toast.success("Your profile has been updated");

            router.refresh();
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-cyan-600" size={36} />
            </div>
        );
    }

    if (!user) return null;

    const createdDate = new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-600 mb-4 transition"
                        >
                            <ArrowLeft size={16} />
                            Back to Store
                        </Link>

                        <h1 className="text-3xl font-bold text-slate-900">
                            My Account
                        </h1>

                        <p className="text-slate-500 mt-2">
                            Manage your personal information and account details.
                        </p>
                    </div>

                    <Link
                        href="/orders"
                        className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-cyan-600 text-white px-5 py-3 rounded-xl transition"
                    >
                        <Package size={19} />
                        My Orders
                    </Link>
                </div>

                {/* Account Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Profile Card */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">

                        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                            <div className="w-16 h-16 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                                <UserRound size={32} />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Personal Information
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    Update your account name.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSave} className="mt-7 space-y-6">

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Full Name
                                </label>

                                <div className="relative">
                                    <UserRound
                                        size={19}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        maxLength={60}
                                        minLength={2}
                                        required
                                        className="w-full border border-slate-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition text-slate-800"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email Address
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={19}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="email"
                                        value={user.email}
                                        readOnly
                                        disabled
                                        className="w-full border border-slate-200 rounded-xl pl-12 pr-4 py-3 bg-slate-50 text-slate-500 cursor-not-allowed"
                                    />
                                </div>

                                <p className="text-xs text-slate-400 mt-2">
                                    Your email address cannot be changed.
                                </p>
                            </div>

                            {/* Save */}
                            <div className="pt-3">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 text-white font-semibold px-7 py-3 rounded-xl transition"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Account Details */}
                    <div className="space-y-6">

                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <h3 className="font-bold text-slate-900 mb-5">
                                Account Details
                            </h3>

                            <div className="space-y-5">

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                                        <CalendarDays size={19} />
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Member Since
                                        </p>
                                        <p className="text-sm font-semibold text-slate-800 mt-1">
                                            {createdDate}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                        <ShieldCheck size={19} />
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Account Status
                                        </p>
                                        <p className="text-sm font-semibold text-green-600 mt-1">
                                            Active
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-2xl p-6 text-white">
                            <Package size={28} className="text-cyan-400 mb-4" />

                            <h3 className="font-bold text-lg">
                                Your Orders
                            </h3>

                            <p className="text-sm text-slate-300 mt-2 leading-6">
                                Track your purchases and view your order history.
                            </p>

                            <Link
                                href="/orders"
                                className="inline-block mt-5 text-cyan-400 hover:text-white font-semibold text-sm transition"
                            >
                                View Orders →
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
