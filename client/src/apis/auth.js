import axios from '../axios';

export const apiLogin = (data) => axios({
    url: '/dang-nhap', 
    method:'post',
    data
})