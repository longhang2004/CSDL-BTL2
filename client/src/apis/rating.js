import axios from "../axios";

export const apiGetRatings = (data) => axios({
    url: '/danh-gia',
    method: 'get',
    params: data
});

export const apiGetAverageRating = (data) => axios({
    url: '/get-average-rating',
    method: 'post',
    data
});