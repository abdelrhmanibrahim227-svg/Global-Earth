import Image from 'next/image'
import { ImageOff } from 'lucide-react'

// Safe image: handles missing images, remote URLs and static imports.
// Parent must be `relative` with a fixed size / aspect ratio.
export default function ProductImage({
    src,
    alt = '',
    sizes = '(max-width: 640px) 50vw, 25vw',
    priority = false,
    className = '',
}) {
    if (!src) {
        return (
            <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                <ImageOff size={36} />
            </div>
        )
    }

    const isRemote = typeof src === 'string' && /^https?:\/\//.test(src)

    return (
        <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            unoptimized={isRemote}
            className={className}
        />
    )
}
