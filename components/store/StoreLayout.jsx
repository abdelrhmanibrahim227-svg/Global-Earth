
'use client'

import { useEffect, useState } from "react"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon, BellRing, CheckCircle } from "lucide-react"
import SellerNavbar from "./StoreNavbar"
import SellerSidebar from "./StoreSidebar"

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/")

    const rawData = window.atob(base64)
    return Uint8Array.from(rawData, char => char.charCodeAt(0))
}

const StoreLayout = ({ children }) => {
    const [isSeller, setIsSeller] = useState(false)
    const [loading, setLoading] = useState(true)
    const [storeInfo, setStoreInfo] = useState(null)

    const [pushLoading, setPushLoading] = useState(false)
    const [pushEnabled, setPushEnabled] = useState(false)
    const [pushMessage, setPushMessage] = useState("")

    useEffect(() => {
        const fetchStore = async () => {
            try {
                const response = await fetch("/api/store", {
                    cache: "no-store",
                })
                const data = await response.json()

                if (!response.ok || !data.store) {
                    setIsSeller(false)
                    return
                }

                setStoreInfo(data.store)
                setIsSeller(true)
            } catch (error) {
                console.error("STORE LAYOUT ERROR:", error)
                setIsSeller(false)
            } finally {
                setLoading(false)
            }
        }

        fetchStore()
    }, [])

    useEffect(() => {
        const checkSubscription = async () => {
            if (!("serviceWorker" in navigator) || !("PushManager" in window)) return

            try {
                const registration = await navigator.serviceWorker.getRegistration("/")
                if (!registration) return

                const subscription = await registration.pushManager.getSubscription()
                setPushEnabled(!!subscription)
            } catch (error) {
                console.error("PUSH CHECK ERROR:", error)
            }
        }

        checkSubscription()
    }, [])

    const enableNotifications = async () => {
        setPushLoading(true)
        setPushMessage("")

        try {
            if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
                throw new Error("المتصفح لا يدعم إشعارات الويب")
            }

            if (!("Notification" in window)) {
                throw new Error("خدمة الإشعارات غير متاحة في هذا المتصفح")
            }

            if (!window.isSecureContext) {
                throw new Error("افتح الموقع من رابط HTTPS لتفعيل الإشعارات")
            }

            const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

            if (!publicKey) {
                throw new Error("مفتاح الإشعارات العام غير موجود في إعدادات الموقع")
            }

            // افحص الصلاحية الحالية قبل طلبها مرة أخرى
            let permission = Notification.permission

            console.log("CURRENT NOTIFICATION PERMISSION:", permission)

            if (permission !== "granted" && permission !== "denied") {
                permission = await Notification.requestPermission()
            }

            if (permission !== "granted") {
                throw new Error(
                    `صلاحية الإشعارات الحالية: ${permission}. اسمح للموقع بالإشعارات من إعدادات المتصفح ثم أعد المحاولة.`
                )
            }

            const registration = await navigator.serviceWorker.register("/sw.js", {
                scope: "/",
            })

            await navigator.serviceWorker.ready

            let subscription = await registration.pushManager.getSubscription()

            if (!subscription) {
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicKey),
                })
            }

            const response = await fetch("/api/push/subscribe", {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(subscription),
            })

            const responseText = await response.text()
            let data

            try {
                data = JSON.parse(responseText)
            } catch {
                console.error("PUSH SUBSCRIBE NON-JSON RESPONSE:", responseText)
                throw new Error("الخادم أعاد استجابة غير متوقعة أثناء حفظ اشتراك الجهاز")
            }

            if (!response.ok) {
                throw new Error(data.message || "فشل حفظ اشتراك الجهاز")
            }

            setPushEnabled(true)
            setPushMessage("تم تفعيل إشعارات الطلبات على هذا الجهاز بنجاح")
        } catch (error) {
            console.error("ENABLE PUSH ERROR:", error)
            setPushMessage(error.message || "حدث خطأ أثناء تفعيل الإشعارات")
        } finally {
            setPushLoading(false)
        }
    }

    if (loading) return <Loading />

    return isSeller ? (
        <div className="flex flex-col h-screen">
            <SellerNavbar storeInfo={storeInfo} />

            <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
                <SellerSidebar storeInfo={storeInfo} />

                <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
                    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h3 className="font-semibold text-slate-800">
                                    إشعارات الطلبات
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    استقبل إشعارًا على هذا الجهاز عند وصول طلب جديد.
                                </p>
                            </div>

                            <button
                                onClick={enableNotifications}
                                disabled={pushLoading || pushEnabled}
                                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
                                    pushEnabled
                                        ? "bg-green-600"
                                        : "bg-slate-800 hover:bg-slate-700"
                                } disabled:cursor-not-allowed disabled:opacity-80`}
                            >
                                {pushLoading ? (
                                    <span>جاري التفعيل...</span>
                                ) : pushEnabled ? (
                                    <>
                                        <CheckCircle size={18} />
                                        الإشعارات مفعلة
                                    </>
                                ) : (
                                    <>
                                        <BellRing size={18} />
                                        تفعيل الإشعارات
                                    </>
                                )}
                            </button>
                        </div>

                        {pushMessage && (
                            <p className="mt-3 text-sm text-slate-600">
                                {pushMessage}
                            </p>
                        )}
                    </div>

                    {children}
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">
                You are not authorized to access this page
            </h1>

            <Link
                href="/"
                className="bg-slate-700 text-white flex items-center gap-2 mt-8 p-2 px-6 max-sm:text-sm rounded-full"
            >
                Go to home <ArrowRightIcon size={18} />
            </Link>
        </div>
    )
}

export default StoreLayout
