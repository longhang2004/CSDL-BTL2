import express from 'express';
const app = express();
import { read_nguoi_dung, read_hang_hoa, get_average_rating, check_login } from './src/routes.js'

// Middleware để xử lý JSON trong request body
app.use(express.json());

// APIs
app.get('/nguoi-dung', read_nguoi_dung);
app.get('/hang-hoa', read_hang_hoa);
app.get('/average-rating/:maHangHoa', get_average_rating);
app.post('/login', check_login);  // API mới cho đăng nhập

var server = app.listen(5000, function () {
    console.log('Server is running..');
});