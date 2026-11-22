
'use client'

import { useEffect, useMemo, useState } from "react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import Loading from "@/components/Loading"
import {
    Search,
    Pencil,
    Trash2,
    X,
    Save,
    RefreshCw,
    Package,
    CheckCircle,
    AlertCircle,
    ImagePlus
} from "lucide-react"

export default function StoreManageProducts() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'ج.م'

    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [store, setStore] = useState(null)
    const [categories, setCategories] = useState([])

    const [updatingIds, setUpdatingIds] = useState([])
    const [deletingIds, setDeletingIds] = useState([])

    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')

    const [editingProduct, setEditingProduct] = useState(null)
    const [saving, setSaving] = useState(false)

    const [form, setForm] = useState({
        name: '',
        description: '',
        mrp: '',
        price: '',
        categoryId: '',
        images: ''
    })

    const formatMoney = (value) =>
        `${Number(value || 0).toLocaleString('en-EG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })} ${currency}`

    // تحميل بيانات المتجر والمنتجات والتصنيفات
    const fetchProducts = async () => {
        try {
            setLoading(true)

            const [storeResponse, productsResponse, categoriesResponse] =
                await Promise.all([
                    fetch('/api/store', { cache: 'no-store' }),
                    fetch('/api/products', { cache: 'no-store' }),
                    fetch('/api/categories', { cache: 'no-store' })
                ])

            const storeData = await storeResponse.json()
            const productsData = await productsResponse.json()
            const categoriesData = await categoriesResponse.json()

            if (!storeResponse.ok) {
                throw new Error(storeData.message || storeData.error || 'تعذر تحميل المتجر')
            }

            if (!productsResponse.ok) {
                throw new Error(productsData.message || productsData.error || 'تعذر تحميل المنتجات')
            }

            if (!categoriesResponse.ok) {
                throw new Error(categoriesData.message || categoriesData.error || 'تعذر تحميل التصنيفات')
            }

            if (!storeData.store?.id) {
                setStore(null)
                setProducts([])
                return
            }

            const currentStore = storeData.store
            setStore(currentStore)

            const allProducts = Array.isArray(productsData)
                ? productsData
                : productsData.products

            if (!Array.isArray(allProducts)) {
                throw new Error('بيانات المنتجات غير صحيحة')
            }

            setProducts(
                allProducts.filter(
                    product => product.storeId === currentStore.id
                )
            )

            setCategories(
                Array.isArray(categoriesData.categories)
                    ? categoriesData.categories
                    : []
            )

        } catch (error) {
            console.error('MANAGE PRODUCTS ERROR:', error)
            toast.error(error.message || 'حدث خطأ أثناء تحميل البيانات')
        } finally {
            setLoading(false)
        }
    }

    // فتح نافذة تعديل المنتج
    const openEditModal = (product) => {
        let images = []

        if (Array.isArray(product.images)) {
            images = product.images
        } else if (typeof product.images === 'string') {
            try {
                const parsed = JSON.parse(product.images)
                images = Array.isArray(parsed) ? parsed : [product.images]
            } catch {
                images = [product.images]
            }
        }

        setForm({
            name: product.name || '',
            description: product.description || '',
            mrp: String(product.mrp ?? ''),
            price: String(product.price ?? ''),
            categoryId: product.categoryId || '',
            images: images.join('\n')
        })

        setEditingProduct(product)
    }

    // تحديث قيم النموذج
    const updateForm = (field, value) => {
        setForm(current => ({
            ...current,
            [field]: value
        }))
    }

    // حفظ تعديلات المنتج
    const saveProduct = async (event) => {
        event.preventDefault()

        if (!editingProduct || saving) return

        if (!form.name.trim()) {
            toast.error('اكتب اسم المنتج')
            return
        }

        const mrp = Number(form.mrp)
        const price = Number(form.price)

        if (
            form.mrp === '' ||
            form.price === '' ||
            !Number.isFinite(mrp) ||
            !Number.isFinite(price) ||
            mrp < 0 ||
            price < 0
        ) {
            toast.error('تأكد من صحة الأسعار')
            return
        }

        const images = form.images
            .split('\n')
            .map(image => image.trim())
            .filter(Boolean)

        setSaving(true)

        try {
            const response = await fetch(
                `/api/products/${encodeURIComponent(editingProduct.id)}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: form.name.trim(),
                        description: form.description,
                        mrp,
                        price,
                        categoryId: form.categoryId || null,
                        images
                    })
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || data.error || 'تعذر تعديل المنتج')
            }

            setProducts(current =>
                current.map(product =>
                    product.id === editingProduct.id
                        ? { ...product, ...data.product }
                        : product
                )
            )

            setEditingProduct(null)
            toast.success('تم تحديث بيانات المنتج والأسعار بنجاح')

        } catch (error) {
            console.error('SAVE PRODUCT ERROR:', error)
            toast.error(error.message || 'فشل تحديث المنتج')
        } finally {
            setSaving(false)
        }
    }

    // تغيير حالة توفر المنتج
    const toggleStock = async (productId, inStock) => {
        if (updatingIds.includes(productId)) return

        setUpdatingIds(current => [...current, productId])

        try {
            const response = await fetch(
                `/api/products/${encodeURIComponent(productId)}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ inStock })
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || data.error || 'تعذر تحديث حالة المنتج')
            }

            setProducts(current =>
                current.map(product =>
                    product.id === productId
                        ? {
                            ...product,
                            inStock: data.product?.inStock ?? inStock
                        }
                        : product
                )
            )

            toast.success(
                inStock ? 'المنتج متاح للبيع الآن' : 'تم تسجيل المنتج كنافد'
            )

        } catch (error) {
            console.error('UPDATE STOCK ERROR:', error)
            toast.error(error.message || 'فشل تحديث الحالة')
        } finally {
            setUpdatingIds(current =>
                current.filter(id => id !== productId)
            )
        }
    }

    // حذف المنتج
    const deleteProduct = async (product) => {
        const confirmed = window.confirm(
            `هل أنت متأكد من حذف المنتج "${product.name}"؟\nلا يمكن التراجع عن هذا الإجراء.`
        )

        if (!confirmed || deletingIds.includes(product.id)) return

        setDeletingIds(current => [...current, product.id])

        try {
            const response = await fetch(
                `/api/products/${encodeURIComponent(product.id)}`,
                {
                    method: 'DELETE'
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || data.error || 'تعذر حذف المنتج')
            }

            setProducts(current =>
                current.filter(item => item.id !== product.id)
            )

            toast.success('تم حذف المنتج بنجاح')

        } catch (error) {
            console.error('DELETE PRODUCT ERROR:', error)
            toast.error(error.message || 'فشل حذف المنتج')
        } finally {
            setDeletingIds(current =>
                current.filter(id => id !== product.id)
            )
        }
    }

    // البحث والتصفية
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch =
                (product.name || '').toLowerCase().includes(search.toLowerCase()) ||
                (product.category || '').toLowerCase().includes(search.toLowerCase())

            const matchesFilter =
                filter === 'all' ||
                (filter === 'available' && product.inStock) ||
                (filter === 'out' && !product.inStock)

            return matchesSearch && matchesFilter
        })
    }, [products, search, filter])

    useEffect(() => {
        fetchProducts()
    }, [])

    if (loading) return <Loading />

    return (
        <div className="w-full space-y-6 text-right" dir="rtl">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-blue-600 mb-1">
                        GLOBAL EARTH
                    </p>

                    <h1 className="text-2xl font-bold text-slate-800">
                        إدارة المنتجات
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                        تحكم كامل في المنتجات والأسعار والمخزون
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {store && (
                        <div className="text-sm text-slate-600 bg-white border rounded-lg px-4 py-2">
                            المتجر: <strong>{store.name}</strong>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={fetchProducts}
                        className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2.5 rounded-lg hover:bg-slate-700"
                    >
                        <RefreshCw size={16} />
                        تحديث
                    </button>
                </div>
            </div>

            {!store ? (
                <div className="bg-white border rounded-xl p-8 text-center">
                    <Package size={40} className="mx-auto text-slate-400 mb-3" />

                    <h2 className="text-lg font-semibold text-slate-700">
                        لم يتم العثور على متجر
                    </h2>

                    <p className="text-sm text-slate-500 mt-2">
                        يرجى إنشاء المتجر أولًا حتى تتمكن من إدارة المنتجات.
                    </p>
                </div>
            ) : (
                <>
                    {/* Statistics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white border rounded-xl p-5">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-slate-500">
                                    إجمالي المنتجات
                                </p>
                                <Package className="text-blue-500" size={22} />
                            </div>

                            <p className="text-2xl font-bold text-slate-800 mt-3">
                                {products.length}
                            </p>
                        </div>

                        <div className="bg-white border rounded-xl p-5">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-slate-500">
                                    متاحة للبيع
                                </p>
                                <CheckCircle className="text-green-600" size={22} />
                            </div>

                            <p className="text-2xl font-bold text-green-600 mt-3">
                                {products.filter(product => product.inStock).length}
                            </p>
                        </div>

                        <div className="bg-white border rounded-xl p-5">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-slate-500">
                                    نافدة أو موقوفة
                                </p>
                                <AlertCircle className="text-red-500" size={22} />
                            </div>

                            <p className="text-2xl font-bold text-red-500 mt-3">
                                {products.filter(product => !product.inStock).length}
                            </p>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white border rounded-xl p-4 flex flex-wrap gap-3 items-center justify-between">
                        <div className="relative flex-1 min-w-[220px]">
                            <Search
                                size={18}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={event => setSearch(event.target.value)}
                                placeholder="ابحث باسم المنتج أو التصنيف..."
                                className="w-full border rounded-lg py-2.5 pr-10 pl-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <select
                            value={filter}
                            onChange={event => setFilter(event.target.value)}
                            className="border rounded-lg px-4 py-2.5 outline-none bg-white"
                        >
                            <option value="all">كل المنتجات</option>
                            <option value="available">المتاحة للبيع</option>
                            <option value="out">النافدة والموقوفة</option>
                        </select>
                    </div>

                    {/* Products Table */}
                    <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
                        <table className="w-full min-w-[1000px] text-right text-sm">

                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    <th className="px-4 py-4">المنتج</th>
                                    <th className="px-4 py-4">التصنيف</th>
                                    <th className="px-4 py-4">السعر الأصلي</th>
                                    <th className="px-4 py-4">سعر البيع</th>
                                    <th className="px-4 py-4">حالة التوفر</th>
                                    <th className="px-4 py-4">الإجراءات</th>
                                </tr>
                            </thead>

                            <tbody className="text-slate-700">
                                {filteredProducts.map(product => {
                                    const images = Array.isArray(product.images)
                                        ? product.images
                                        : []

                                    const imageUrl = images[0]
                                    const updating = updatingIds.includes(product.id)
                                    const deleting = deletingIds.includes(product.id)

                                    return (
                                        <tr
                                            key={product.id}
                                            className="border-t hover:bg-slate-50"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3 min-w-48">
                                                    {imageUrl ? (
                                                        <Image
                                                            width={48}
                                                            height={48}
                                                            unoptimized
                                                            className="w-12 h-12 object-contain rounded-lg border p-1"
                                                            src={imageUrl}
                                                            alt={product.name || 'Product'}
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                                                            <ImagePlus size={18} />
                                                        </div>
                                                    )}

                                                    <div>
                                                        <p className="font-semibold">
                                                            {product.name}
                                                        </p>
                                                        <p className="text-xs text-slate-400 mt-1">
                                                            {product.description || 'بدون وصف'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3">
                                                {product.category || '-'}
                                            </td>

                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {formatMoney(product.mrp)}
                                            </td>

                                            <td className="px-4 py-3 font-bold whitespace-nowrap">
                                                {formatMoney(product.price)}
                                            </td>

                                            <td className="px-4 py-3">
                                                <label className={`inline-flex items-center gap-2 ${updating ? 'opacity-50' : 'cursor-pointer'}`}>
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={Boolean(product.inStock)}
                                                        disabled={updating}
                                                        onChange={event =>
                                                            toggleStock(
                                                                product.id,
                                                                event.target.checked
                                                            )
                                                        }
                                                    />

                                                    <span className="w-10 h-5 bg-slate-300 rounded-full relative peer-checked:bg-green-600 after:content-[''] after:absolute after:top-1 after:right-1 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-transform peer-checked:after:-translate-x-5" />

                                                    <span className={`text-xs font-medium ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                                                        {updating
                                                            ? 'جارٍ التحديث'
                                                            : product.inStock
                                                                ? 'متاح'
                                                                : 'نافد / موقوف'}
                                                    </span>
                                                </label>
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(product)}
                                                        className="flex items-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg"
                                                    >
                                                        <Pencil size={15} />
                                                        تعديل
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={deleting}
                                                        onClick={() => deleteProduct(product)}
                                                        className="flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg disabled:opacity-50"
                                                    >
                                                        <Trash2 size={15} />
                                                        {deleting ? 'جارٍ الحذف' : 'حذف'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}

                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-12 text-center text-slate-500"
                                        >
                                            لا توجد منتجات مطابقة للبحث.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <p className="text-xs text-slate-400">
                        عدد المنتجات المعروضة: {filteredProducts.length} من {products.length}
                    </p>
                </>
            )}

            {/* Edit Product Modal */}
            {editingProduct && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">

                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    تعديل المنتج
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">
                                    {editingProduct.name}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setEditingProduct(null)}
                                className="p-2 rounded-lg hover:bg-slate-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={saveProduct} className="p-6 space-y-4">

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    اسم المنتج
                                </label>
                                <input
                                    required
                                    value={form.name}
                                    onChange={event => updateForm('name', event.target.value)}
                                    className="w-full border rounded-lg p-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    وصف المنتج
                                </label>
                                <textarea
                                    rows={3}
                                    value={form.description}
                                    onChange={event => updateForm('description', event.target.value)}
                                    className="w-full border rounded-lg p-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        السعر الأصلي ({currency})
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        required
                                        value={form.mrp}
                                        onChange={event => updateForm('mrp', event.target.value)}
                                        className="w-full border rounded-lg p-3 outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        سعر البيع ({currency})
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        required
                                        value={form.price}
                                        onChange={event => updateForm('price', event.target.value)}
                                        className="w-full border rounded-lg p-3 outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    التصنيف
                                </label>

                                <select
                                    value={form.categoryId}
                                    onChange={event => updateForm('categoryId', event.target.value)}
                                    className="w-full border rounded-lg p-3 outline-none bg-white focus:border-blue-500"
                                >
                                    <option value="">بدون تصنيف</option>

                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    روابط الصور
                                </label>

                                <textarea
                                    rows={4}
                                    value={form.images}
                                    onChange={event => updateForm('images', event.target.value)}
                                    placeholder="ضع رابط كل صورة في سطر منفصل"
                                    className="w-full border rounded-lg p-3 outline-none focus:border-blue-500 text-left"
                                    dir="ltr"
                                />

                                <p className="text-xs text-slate-400 mt-1">
                                    اكتب رابط كل صورة في سطر مستقل. اترك الحقل فارغًا لحذف جميع صور المنتج.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-4 border-t">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700 disabled:opacity-50"
                                >
                                    <Save size={17} />
                                    {saving ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
                                </button>

                                <button
                                    type="button"
                                    disabled={saving}
                                    onClick={() => setEditingProduct(null)}
                                    className="px-6 py-3 border rounded-lg hover:bg-slate-50"
                                >
                                    إلغاء
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}