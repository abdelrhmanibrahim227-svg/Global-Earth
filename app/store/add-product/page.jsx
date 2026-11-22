
'use client'

import { assets } from "@/assets/assets"
import Image from "next/image"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

export default function StoreAddProduct() {
    const [images, setImages] = useState({
        1: null,
        2: null,
        3: null,
        4: null
    })

    const [categories, setCategories] = useState([])
    const [loadingCategories, setLoadingCategories] = useState(true)

    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: "",
        price: "",
        category: "",
        categoryId: ""
    })

    const [storeId, setStoreId] = useState("")
    const [loading, setLoading] = useState(false)
    const [loadingStore, setLoadingStore] = useState(true)

    // Load categories from database
    useEffect(() => {
        let cancelled = false

        async function fetchCategories() {
            try {
                const response = await fetch("/api/categories", {
                    cache: "no-store"
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to load categories"
                    )
                }

                if (!cancelled) {
                    setCategories(data.categories || [])
                }
            } catch (error) {
                if (!cancelled) {
                    toast.error(error.message || "Failed to load categories")
                }
            } finally {
                if (!cancelled) {
                    setLoadingCategories(false)
                }
            }
        }

        fetchCategories()

        return () => {
            cancelled = true
        }
    }, [])

    // Get the logged-in owner's store
    useEffect(() => {
        let cancelled = false

        async function fetchStore() {
            try {
                const response = await fetch("/api/store", {
                    cache: "no-store"
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to load store"
                    )
                }

                if (!data.store) {
                    throw new Error(
                        "No store found. Create a store first."
                    )
                }

                if (!cancelled) {
                    setStoreId(data.store.id)
                }
            } catch (error) {
                if (!cancelled) {
                    toast.error(error.message || "Failed to load store")
                }
            } finally {
                if (!cancelled) {
                    setLoadingStore(false)
                }
            }
        }

        fetchStore()

        return () => {
            cancelled = true
        }
    }, [])

    const onChangeHandler = (e) => {
        const { name, value } = e.target

        if (name === "categoryId") {
            const selectedCategory = categories.find(
                category => category.id === value
            )

            setProductInfo(previous => ({
                ...previous,
                categoryId: value,
                category: selectedCategory?.name || ""
            }))

            return
        }

        setProductInfo(previous => ({
            ...previous,
            [name]: value
        }))
    }

    const onImageChange = (e, key) => {
        const file = e.target.files?.[0]

        if (!file) return

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file")
            e.target.value = ""
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must not exceed 5MB")
            e.target.value = ""
            return
        }

        setImages(previous => ({
            ...previous,
            [key]: file
        }))
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        if (loading) return

        if (!storeId) {
            toast.error("Store not loaded. Please refresh the page.")
            return
        }

        const mrp = Number(productInfo.mrp)
        const price = Number(productInfo.price)

        if (
            !productInfo.name.trim() ||
            !productInfo.description.trim() ||
            !productInfo.categoryId
        ) {
            toast.error("Please complete all required fields.")
            return
        }

        if (
            !Number.isFinite(mrp) ||
            !Number.isFinite(price) ||
            mrp <= 0 ||
            price <= 0 ||
            price > mrp
        ) {
            toast.error("Please enter valid prices.")
            return
        }

        const selectedImages = Object.values(images).filter(Boolean)

        setLoading(true)

        try {
            const imageUrls = []

            // Upload images
            for (const file of selectedImages) {
                const formData = new FormData()
                formData.append("file", file)

                const uploadResponse = await fetch(
                    "/api/upload-product-image",
                    {
                        method: "POST",
                        body: formData
                    }
                )

                const uploadData = await uploadResponse.json()

                if (!uploadResponse.ok) {
                    throw new Error(
                        uploadData.error ||
                        uploadData.message ||
                        "Failed to upload image."
                    )
                }

                imageUrls.push(uploadData.url)
            }

            // Save product
            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: productInfo.name.trim(),
                    description: productInfo.description.trim(),
                    mrp,
                    price,
                    category: productInfo.category,
                    categoryId: productInfo.categoryId,
                    images: imageUrls,
                    storeId
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    data.message ||
                    "Failed to add product."
                )
            }

            setProductInfo({
                name: "",
                description: "",
                mrp: "",
                price: "",
                category: "",
                categoryId: ""
            })

            setImages({
                1: null,
                2: null,
                3: null,
                4: null
            })

            e.target.reset()

            toast.success(
                imageUrls.length
                    ? "Product and images saved successfully!"
                    : "Product added successfully!"
            )

        } catch (error) {
            console.error("ADD PRODUCT ERROR:", error)
            toast.error(error.message || "Failed to add product.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form
            onSubmit={onSubmitHandler}
            className="text-slate-500 mb-28"
        >
            <h1 className="text-2xl">
                Add New{" "}
                <span className="text-slate-800 font-medium">
                    Products
                </span>
            </h1>

            <p className="mt-7">Product Images</p>

            <div className="flex gap-3 mt-4">
                {Object.keys(images).map((key) => (
                    <label
                        key={key}
                        htmlFor={`images${key}`}
                        className="cursor-pointer"
                    >
                        <Image
                            width={300}
                            height={300}
                            className="h-15 w-auto border border-slate-200 rounded"
                            src={
                                images[key]
                                    ? URL.createObjectURL(images[key])
                                    : assets.upload_area
                            }
                            alt={`Product image ${key}`}
                            unoptimized
                        />

                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            id={`images${key}`}
                            onChange={(e) => onImageChange(e, key)}
                            hidden
                        />
                    </label>
                ))}
            </div>

            <label className="flex flex-col gap-2 my-6">
                Name

                <input
                    type="text"
                    name="name"
                    onChange={onChangeHandler}
                    value={productInfo.name}
                    placeholder="Enter product name"
                    className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded"
                    required
                />
            </label>

            <label className="flex flex-col gap-2 my-6">
                Description

                <textarea
                    name="description"
                    onChange={onChangeHandler}
                    value={productInfo.description}
                    placeholder="Enter product description"
                    rows={5}
                    className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded resize-none"
                    required
                />
            </label>

            <div className="flex gap-5">
                <label className="flex flex-col gap-2">
                    Actual Price ($)

                    <input
                        type="number"
                        name="mrp"
                        min="0.01"
                        step="0.01"
                        onChange={onChangeHandler}
                        value={productInfo.mrp}
                        placeholder="0"
                        className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded"
                        required
                    />
                </label>

                <label className="flex flex-col gap-2">
                    Offer Price ($)

                    <input
                        type="number"
                        name="price"
                        min="0.01"
                        step="0.01"
                        onChange={onChangeHandler}
                        value={productInfo.price}
                        placeholder="0"
                        className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded"
                        required
                    />
                </label>
            </div>

            <label className="flex flex-col gap-2 w-full max-w-sm my-6">
                Category

                <select
                    name="categoryId"
                    onChange={onChangeHandler}
                    value={productInfo.categoryId}
                    className="w-full p-2 px-4 outline-none border border-slate-200 rounded"
                    required
                    disabled={loadingCategories}
                >
                    <option value="">
                        {loadingCategories
                            ? "Loading categories..."
                            : categories.length
                                ? "Select a category"
                                : "No categories available"}
                    </option>

                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </label>

            <br />

            <button
                type="submit"
                disabled={
                    loading ||
                    loadingStore ||
                    loadingCategories ||
                    !storeId ||
                    categories.length === 0
                }
                className="bg-slate-800 text-white px-6 mt-7 py-2 hover:bg-slate-900 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loadingStore
                    ? "Loading Store..."
                    : loadingCategories
                        ? "Loading Categories..."
                        : loading
                            ? "Adding Product..."
                            : "Add Product"}
            </button>
        </form>
    )
}
