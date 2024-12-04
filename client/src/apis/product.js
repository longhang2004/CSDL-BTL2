import axios from "../axios";

export const apiGetProducts = (data) => axios({
    url: '/hang-hoa',
    method: 'get',
    params: data
});

export const apiCreateProduct = (data) => axios({
    url: '/hang-hoa',
    method: 'post',
    data
});

export const apiUpdateProduct = (data) => axios({
    url: '/hang-hoa',
    method: 'put',
    data
});

export const apiDeleteProduct = (data) => axios({
    url: 'hang-hoa',
    method: 'delete',
    data
});

export const apiGetManufacturers = () => axios({
    url: '/hang-san-xuat',
    method: 'get',
});