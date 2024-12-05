import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';

import { persistReducer, persistStore } from 'redux-persist';
import userSlice from './user/userSlice'

const commonConfig = {
  key: 'shop/user',
  storage
};

const userConfig = {
    ...commonConfig,
    whitelist: ['isLoggedIn', 'username', 'password']
};

export const store = configureStore({
  reducer: {  
    user: persistReducer(userConfig, userSlice)
  },
});

export const persistor = persistStore(store)
