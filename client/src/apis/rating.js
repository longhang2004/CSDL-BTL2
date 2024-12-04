import axios from "../axios";

export const apiGetRatings = (data) => axios({
    url: '/danh-gia',
    method: 'get',
    params: data
});