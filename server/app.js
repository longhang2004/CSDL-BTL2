import express from 'express';
const app = express();
import{read_nguoi_dung, read_hang_hoa} from './src/routes.js'

// APIs
app.get('/nguoi-dung', read_nguoi_dung);
app.get('/hang-hoa', read_hang_hoa);


var server = app.listen(5000, function () {
    console.log('Server is running..');
});