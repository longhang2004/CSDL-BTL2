import axios from "../axios";

export const apiGetUsers = () => axios({
    url: '/nguoi-dung',
    method: 'get',
});