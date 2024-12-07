import express from 'express';
import cors from 'cors';
import {read_user, login, get_hang_hoa, create_hang_hoa, update_hang_hoa, delete_hang_hoa, get_average_rating, create_danh_gia, get_hang_san_xuat, direct_query, get_danh_gia, create_chi_tiet_hang_hoa, get_chi_tiet_hang_hoa, update_chi_tiet_hang_hoa, get_don_hang } from './src/routes.js'

const app = express();
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
 
 app.use(cors(corsOptions)) 
// APIs
app.post('/query', direct_query);
app.post('/dang-nhap', login);
app.get('/hang-san-xuat', get_hang_san_xuat);
app.get('/hang-hoa', get_hang_hoa);
app.post('/hang-hoa', create_hang_hoa);
app.put('/hang-hoa', update_hang_hoa);
app.delete('/hang-hoa', delete_hang_hoa);
app.post('/chi-tiet-hang-hoa', create_chi_tiet_hang_hoa);
app.get('/chi-tiet-hang-hoa', get_chi_tiet_hang_hoa);
app.put('/chi-tiet-hang-hoa', update_chi_tiet_hang_hoa);
app.post('/get-average-rating', get_average_rating);
app.get('/danh-gia', get_danh_gia);
app.post('/danh-gia', create_danh_gia);
app.get('/nguoi-dung', read_user);
app.get('/don-hang', get_don_hang);

var server = app.listen(5000, function () {
    console.log('Server is running..');
});

