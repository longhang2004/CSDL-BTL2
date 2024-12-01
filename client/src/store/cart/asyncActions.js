import { createAsyncThunk } from '@reduxjs/toolkit';
import * as apis from '../../apis';

export const getCart = createAsyncThunk('cart/getCart', async (data, { rejectedWithValue }) => {
    const response = await apis.apiFetchUserCart(data.id);
    if(!response.success) return rejectedWithValue(response.data);
    return response.cartData;
})

export const addToCart = createAsyncThunk('cart/addToCart', async (data, { rejectedWithValue }) => {
    const response = await apis.apiAddToUserCart(data);
    if(!response.success) return rejectedWithValue(response.data);
    return response.cartData;
})

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (data, { rejectedWithValue }) => {
    const response = await apis.apiDeleteProductFromUserCart(data);
    if(!response.success) return rejectedWithValue(response.data);
    return response.cartData;
})

export const updateCart = createAsyncThunk('cart/updateCart', async (data, { rejectedWithValue }) => {
    const response = await apis.apiChangeUserCartProductQuantity(data);
    if(!response.success) return rejectedWithValue(response.data);
    return response.cartData;
})