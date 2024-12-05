import axios from "../axios";

export const apiGetProducts = () => axios({
    url: '/hang-hoa',
    method: 'get',
});

// {hanghoa_ten, tonkho_min, tonkho_max, giamua_min, giamua_max, giaban_min, giaban_max, hangsanxuat_ten, danhgia_min, danhgia_max, hangsanxuat_diachi, hanghoa_mota}

export const apiGetProductByFilter = ({hanghoa_id, hanghoa_ten, hanghoa_tonkho_min, hanghoa_tonkho_max, hanghoa_giamua_min, hanghoa_giamua_max, hanghoa_giaban_min, hanghoa_giaban_max, hangsanxuat_ten, hanghoa_danhgia_min, hanghoa_danhgia_max, hangsanxuat_diachi, hanghoa_mota, sort_by, sort_dir, loai_hang_hoa}) => axios({
    url: '/hang-hoa',
    method: 'get',
    params: {hanghoa_id, hanghoa_ten, hanghoa_tonkho_min, hanghoa_tonkho_max, hanghoa_giamua_min, hanghoa_giamua_max, hanghoa_giaban_min, hanghoa_giaban_max, hangsanxuat_ten, hanghoa_danhgia_min, hanghoa_danhgia_max, hangsanxuat_diachi, hanghoa_mota, sort_dir, sort_by, loai_hang_hoa}
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

export const apiCreateProductDetail = (data) => axios({
    url: '/chi-tiet-hang-hoa',
    method: 'post',
    data
});

export const apiGetProductDetail = ({LoaiHangHoa, MaHangHoa}) => axios({
    url: '/chi-tiet-hang-hoa',
    method: 'get',
    params: {LoaiHangHoa, MaHangHoa}
});

export const apiUpdateProductDetail = (data) => axios({
    url: '/chi-tiet-hang-hoa',
    method: 'put',
    data
});

export const apiGetManufacturers = () => axios({
    url: '/hang-san-xuat',
    method: 'get',
});