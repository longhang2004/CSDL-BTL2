import express from 'express';
import { login, get_hang_hoa, create_hang_hoa, update_hang_hoa, delete_hang_hoa } from './src/routes.js'

const app = express();
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

// APIs
app.post('/dang-nhap', login);
app.get('/hang-hoa', get_hang_hoa);
app.post('/hang-hoa', create_hang_hoa);
app.put('/hang-hoa', update_hang_hoa);
app.delete('/hang-hoa', delete_hang_hoa);

var server = app.listen(5000, function () {
    console.log('Server is running..');
});

