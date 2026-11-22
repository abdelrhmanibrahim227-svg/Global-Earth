import { createSlice } from '@reduxjs/toolkit'

const productSlice = createSlice({
    name: 'product',
    initialState: {
        list: [],
    },
    reducers: {
        setProduct: (state, action) => {
            state.list = Array.isArray(action.payload)
                ? action.payload
                : []
        },
        clearProduct: (state) => {
            state.list = []
        },
    },
})

export const { setProduct, clearProduct } = productSlice.actions

export default productSlice.reducer