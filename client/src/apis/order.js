import axios from "../axios";

export const apiGetOrders = () => axios({
    url: '/don-hang',
    method: 'get',
});