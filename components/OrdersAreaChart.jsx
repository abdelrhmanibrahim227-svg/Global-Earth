
'use client'

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'

export default function OrdersAreaChart({ allOrders = [] }) {

    const ordersPerDay = allOrders.reduce((acc, order) => {
        const date = new Date(order.createdAt).toLocaleDateString('en-CA')

        acc[date] = (acc[date] || 0) + 1

        return acc
    }, {})

    const chartData = Object.entries(ordersPerDay)
        .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
        .map(([date, count]) => ({
            date,
            orders: count
        }))

    return (
        <div className="w-full max-w-4xl h-[340px] text-xs">
            <h3 className="text-lg font-medium text-slate-800 mb-4 pt-2">
                <span className="text-slate-500">Orders /</span> Day
            </h3>

            {chartData.length === 0 ? (
                <div className="h-[280px] flex items-center justify-center border border-slate-200 rounded-lg text-slate-400">
                    No orders available yet
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="85%">
                    <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="date" />

                        <YAxis
                            allowDecimals={false}
                            label={{
                                value: 'Orders',
                                angle: -90,
                                position: 'insideLeft'
                            }}
                        />

                        <Tooltip />

                        <Area
                            type="monotone"
                            dataKey="orders"
                            name="Orders"
                            stroke="#4f46e5"
                            fill="#8884d8"
                            fillOpacity={0.2}
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}
