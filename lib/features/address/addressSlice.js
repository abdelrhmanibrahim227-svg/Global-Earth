
import { createSlice } from '@reduxjs/toolkit'

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        list: [],
    },
    reducers: {
        addAddress: (state, action) => {
            const address = action.payload

            // Keep the original database ID.
            if (!address?.id) return

            const existingIndex = state.list.findIndex(
                item => item.id === address.id
            )

            if (existingIndex !== -1) {
                state.list[existingIndex] = address
            } else {
                state.list.push(address)
            }
        },

        deleteAddress: (state, action) => {
            state.list = state.list.filter(
                address => address.id !== action.payload
            )
        },
    }
})

export const { addAddress, deleteAddress } = addressSlice.actions

export default addressSlice.reducer
