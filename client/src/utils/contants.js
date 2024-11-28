import path from './path'
import icons from './icons'

export const navigation = [
]
const { AiOutlineDashboard, MdOutlineGroups, RiProductHuntLine, TbFileInvoice} = icons;
export const adminSidebar = [
    {
        id: 1,
        type: 'SINGLE',
        text: 'Tổng quan',
        path: `/${path.ADMIN}/${path.DASHBOARD}`,
        icon: <AiOutlineDashboard size={20}/>
    },
    {
        id: 2,
        type: 'SINGLE',
        text: 'Quản lý tài khoản',
        path: `/${path.ADMIN}/${path.MANAGE_USERS}`,
        icon: <MdOutlineGroups size={20}/>
    },
    {
        id: 3,
        type: 'PARENT',
        text: 'Quản lý sản phẩm',
        icon: <RiProductHuntLine size={20}/>,
        submenu: [
            {
                text: 'Tạo sản phẩm',
                path: `/${path.ADMIN}/${path.CREATE_PRODUCT}`
            },
            {
                text: 'Chỉnh sửa sản phẩm',
                path: `/${path.ADMIN}/${path.MANAGE_PRODUCTS}`
            }
        ]
    },
    {
        id: 4,
        type: 'SINGLE',
        text: 'Quản lý đơn hàng',
        path: `/${path.ADMIN}/${path.MANAGE_ORDERS}`,
        icon: <TbFileInvoice size={20}/> 
    },
]