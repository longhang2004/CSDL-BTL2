import {createSlice} from '@reduxjs/toolkit';
import * as actions from './asyncActions';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        setCart: (state, action) => {
        state.cart = action.payload;
        },
    },
    extraReducers: (builder) => {
        //get cart
        builder.addCase(actions.getCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        });
    
        builder.addCase(actions.getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        });
    
        builder.addCase(actions.getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        });
        //add to cart
        builder.addCase(actions.addToCart.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });

        builder.addCase(actions.addToCart.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cart = action.payload;
        });

        builder.addCase(actions.addToCart.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        //remove from cart
        builder.addCase(actions.removeFromCart.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });

        builder.addCase(actions.removeFromCart.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cart = action.payload;
        });

        builder.addCase(actions.removeFromCart.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });
        //update cart
        builder.addCase(actions.updateCart.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });

        builder.addCase(actions.updateCart.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cart = action.payload;
        });

        builder.addCase(actions.updateCart.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message
        });
    },
});

export const {setCart} = cartSlice.actions;

export default cartSlice.reducer;