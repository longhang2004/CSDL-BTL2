import { createAsyncThunk } from '@reduxjs/toolkit';
import * as apis from '../../apis';

export const getProductList = createAsyncThunk('product/getProductList', async ({category, page, sortField, sortOrder, pageSize}, {rejectWithValue}) => {
    const response = await apis.apiFetchProductByPage(category, page, sortField, sortOrder, pageSize);
    if(!response.success) return rejectWithValue(response.data)
    return response.productData;
})
