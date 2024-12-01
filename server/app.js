import express from 'express';
import { login, get_hang_hoa, create_hang_hoa, update_hang_hoa, delete_hang_hoa, get_average_rating, create_danh_gia, get_hang_san_xuat } from './src/routes.js'

const app = express();
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

// APIs
app.post('/dang-nhap', login);
app.get('/hang-san-xuat', get_hang_san_xuat);
app.get('/hang-hoa', get_hang_hoa);
app.post('/hang-hoa', create_hang_hoa);
app.put('/hang-hoa', update_hang_hoa);
app.delete('/hang-hoa', delete_hang_hoa);
app.post('/get-average-rating', get_average_rating);
app.post('/danh-gia', create_danh_gia);

var server = app.listen(5000, function () {
    console.log('Server is running..');
});

