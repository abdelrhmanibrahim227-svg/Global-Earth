import {
    Truck,
    ShieldCheck,
    RotateCcw,
    Headset,
    Banknote,
    BadgeCheck,
} from 'lucide-react'

const items = [
    {
        icon: BadgeCheck,
        title: '100% Authentic',
        text: 'Original products from trusted brands',
    },
    {
        icon: Truck,
        title: 'Fast Delivery',
        text: 'Shipping to all Egyptian governorates',
    },
    {
        icon: Banknote,
        title: 'Cash on Delivery',
        text: 'Pay when your order arrives',
    },
    {
        icon: ShieldCheck,
        title: 'Secure Payment',
        text: 'Your data is always protected',
    },
    {
        icon: RotateCcw,
        title: 'Easy Returns',
        text: 'Hassle-free return policy',
    },
    {
        icon: Headset,
        title: 'Dedicated Support',
        text: 'Real people ready to help',
    },
]

const TrustBar = () => {
    return (
        <section className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-2 gap-3 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm sm:p-6 md:grid-cols-3 lg:grid-cols-6">
                {items.map(({ icon: Icon, title, text }) => (
                    <div
                        key={title}
                        className="flex flex-col items-center gap-2 rounded-2xl p-3 text-center transition hover:bg-cyan-50"
                    >
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#030a12] text-cyan-300">
                            <Icon size={20} />
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">
                            {title}
                        </h3>
                        <p className="text-xs leading-snug text-slate-500">
                            {text}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default TrustBar
