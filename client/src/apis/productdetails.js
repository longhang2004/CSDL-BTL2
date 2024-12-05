import axios from "../axios";

export const apiGetProductDetail = (maHangHoa) => axios({
    url: `/san-pham/${maHangHoa}`,
    method: 'get'
});
