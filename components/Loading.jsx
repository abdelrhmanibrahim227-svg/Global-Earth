
'use client'

const Loading = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-transparent">
            <div className="flex flex-col items-center gap-4" role="status" aria-label="Loading">
                <svg
                    viewBox="0 0 180 100"
                    width="180"
                    height="100"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* حرف G */}
                    <path
                        className="draw-g"
                        pathLength="100"
                        d="M 76 25
                           A 32 32 0 1 0 78 57
                           L 78 45
                           L 61 45"
                        fill="none"
                        stroke="#56D4E9"
                        strokeWidth="9"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                    />

                    {/* حرف L */}
                    <path
                        className="draw-l"
                        pathLength="100"
                        d="M 108 17 L 108 78 L 153 78"
                        fill="none"
                        stroke="#1029e2"
                        strokeWidth="9"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                    />
                </svg>

                <span className="text-xs tracking-[6px] text-slate-400">
                    GLOBAL EARTH
                </span>
            </div>

            <style jsx>{`
                .draw-g {
                    stroke-dasharray: 100;
                    stroke-dashoffset: 100;
                    animation: drawG 4s ease-in-out infinite;
                }

                .draw-l {
                    stroke-dasharray: 100;
                    stroke-dashoffset: 100;
                    animation: drawL 4s ease-in-out infinite;
                }

                @keyframes drawG {
                    0% {
                        stroke-dashoffset: 100;
                        opacity: 1;
                    }
                    30% {
                        stroke-dashoffset: 0;
                        opacity: 1;
                    }
                    85% {
                        stroke-dashoffset: 0;
                        opacity: 1;
                    }
                    100% {
                        stroke-dashoffset: 100;
                        opacity: 0;
                    }
                }

                @keyframes drawL {
                    0%, 30% {
                        stroke-dashoffset: 100;
                        opacity: 0;
                    }
                    35% {
                        opacity: 1;
                    }
                    65% {
                        stroke-dashoffset: 0;
                        opacity: 1;
                    }
                    85% {
                        stroke-dashoffset: 0;
                        opacity: 1;
                    }
                    100% {
                        stroke-dashoffset: 100;
                        opacity: 0;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .draw-g, .draw-l {
                        animation: none;
                        stroke-dashoffset: 0;
                    }
                }
            `}</style>
        </div>
    )
}

export default Loading
