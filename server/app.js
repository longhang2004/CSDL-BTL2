import express from 'express';
import cors from 'cors';
import { read_user, login, get_hang_hoa, create_hang_hoa, update_hang_hoa, delete_hang_hoa, get_average_rating, create_danh_gia, get_hang_san_xuat, direct_query, get_danh_gia, create_user, update_user, delete_user, get_product_detail } from './src/routes.js'

const app = express();
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(cors({
    origin: 'http://localhost:3000', // Chỉ cho phép truy cập từ localhost:3000
}));
// APIs
app.post('/query', direct_query);
app.post('/dang-nhap', login);
app.get('/hang-san-xuat', get_hang_san_xuat);
app.get('/hang-hoa', get_hang_hoa);
app.post('/hang-hoa', create_hang_hoa);
app.put('/hang-hoa', update_hang_hoa);
app.delete('/hang-hoa', delete_hang_hoa);
app.post('/get-average-rating', get_average_rating);
app.get('/danh-gia', get_danh_gia);
app.post('/danh-gia', create_danh_gia);
app.get('/nguoi-dung', read_user);

app.post('/nguoi-dung', create_user);
app.put('/nguoi-dung/:MaNguoiDung', update_user);
app.delete('/nguoi-dung/:MaNguoiDung', delete_user);

app.get('/san-pham/:maHangHoa', get_product_detail);

var server = app.listen(5000, function () {
    console.log('Server is running..');
});
