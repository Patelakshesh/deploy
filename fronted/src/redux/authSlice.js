import {createSlice} from '@reduxjs/toolkit'


const authSlice = createSlice({
    name: 'auth',
    initialState:{
        loading: false,
        addLoading: false,
        editLoading: false,
        deleteLoading: false
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setAddLoading: (state, action) => {
            state.addLoading = action.payload
        },
        setEditLoading: (state, action) => {
            state.editLoading = action.payload
        },
        setDeleteLoading: (state, action) => {
            state.deleteLoading = action.payload
        },
    }
})

export const {setLoading, setAddLoading, setEditLoading, setDeleteLoading} = authSlice.actions;
export default authSlice.reducer;