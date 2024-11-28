import {createSlice} from '@reduxjs/toolkit';
import * as actions from './asyncActions';

const productListSlice = createSlice({
    name: 'productList',
    initialState: {
        productList: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        setProductList: (state, action) => {
        state.productList = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(actions.getProductList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        });
    
        builder.addCase(actions.getProductList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload;
        });
    
        builder.addCase(actions.getProductList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        });
    },
});

export const {setProductList} = productListSlice.actions;

export default productListSlice.reducer;

// const getProductSlide = createSlice({
//     name: 'product',
//     initialState: {
//         product: null,
//         isLoading: false,
//         error: null,
//     },
//     reducers: {
//         setProduct: (state, action) => {
//         state.product = action.payload;
//         },
//     },
//     extraReducers: (builder) => {
//         builder.addCase(actions.getProduct.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//         });
    
//         builder.addCase(actions.getProduct.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.product = action.payload;
//         });
    
//         builder.addCase(actions.getProduct.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.error.message;
//         });
//     },
// });