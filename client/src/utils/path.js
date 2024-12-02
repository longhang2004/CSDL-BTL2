const path = {
    PUBLIC: '/',
    HOME: '',
    ALL: '*',
    LOGIN: 'login',
    PRODUCT: ':category',
    DETAIL_PRODUCT: 'product/:productId', 
    FINAL_REGISTER: 'finalRegister/:status',
    RESET_PASSWORD: 'reset-password/:token',
    DETAIL_CART: '/detail-cart',
    CHECKOUT: '/checkout',
    PAYMENT_RESULT: '/payment-result/:orderCode',


    // ADMIN
    ADMIN: '/',
    DASHBOARD: 'dasboard',
    MANAGE_USERS: 'manage-users',
    MANAGE_PRODUCTS: '/manage-products',
    MANAGE_ORDERS: 'manage-orders',
    CREATE_PRODUCT: '/create-product',

    // MEMBER
    MEMBER: 'member',
    PERSONAL: 'personal',
}

export default path;
