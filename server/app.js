import express from 'express';
const app = express();
import { 
    read_nguoi_dung, read_hang_hoa, get_average_rating, check_login,
    create_user, read_user, update_user, delete_user,
    get_product_reviews, get_product_detail 
} from './src/routes.js'

// Middleware để xử lý JSON trong request body
app.use(express.json());

// APIs
app.get('/nguoi-dung', read_nguoi_dung);
app.get('/hang-hoa', read_hang_hoa);
app.get('/average-rating/:maHangHoa', get_average_rating);
app.post('/login', check_login);  // API mới cho đăng nhập
app.post('/users', create_user);
app.get('/users/:MaNguoiDung', read_user);
app.put('/users/:MaNguoiDung', update_user);
app.delete('/users/:MaNguoiDung', delete_user);
app.get('/products/:maHangHoa/reviews', get_product_reviews);
app.get('/products/:maHangHoa', get_product_detail);

var server = app.listen(5000, function () {
    console.log('Server is running..');
});