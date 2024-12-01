export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(" ").join("-");

export const validate = (payLoad, setInvalidFields) => {
    let invalids = 0
    const formatPayLoad =  Object.entries(payLoad)
    for(let arr of formatPayLoad) {
        if(arr[1].trim() === '') {
            invalids++;
            setInvalidFields(prev => ([ ...prev, {name: arr[0], mes: 'Không được để trống'}]))
        }
    }
    for(let arr of formatPayLoad) {
        switch(arr[0]) {
            case 'email':
                const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if(!arr[1].match(regex)) {
                    invalids++;
                    setInvalidFields(prev => ([ ...prev, {name: arr[0], mes: 'Email không hợp lệ'}]))
                }
                break;
                case 'password':
                    if(arr[1].length < 6) {
                        invalids++;
                        setInvalidFields(prev => ([ ...prev, {name: arr[0], mes: 'Mật khẩu phải lớn hơn 6 ký tự'}]))
                    }
                    break;
            default:
                break;
        }
    }
    return invalids
}