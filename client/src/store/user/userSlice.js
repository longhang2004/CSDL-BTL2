import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        username: "", // Data of the current user
        password: "", // Access token   
        isLoading: false
      },
    reducers: {
        login: (state, action) => { 
            state.isLoggedIn = action.payload.isLoggedIn
            state.username = action.payload.username
            state.password = action.payload.password
        },
        logout: (state, action) => { 
            state.isLoggedIn = false
            state.username = ""
            state.password = ""
        }
    }
    // extraReducers: (builder) => {
    //     builder.addCase(actions.getCurrent.pending, (state) => {
    //         state.isLoading = true;
    //     })
    //     builder.addCase(actions.getCurrent.fulfilled, (state, action) => {
    //         state.isLoading = false;
    //         state.current = action.payload;
    //     });

    //     builder.addCase(actions.getCurrent.rejected, (state, action) => {
    //         state.isLoading = false;
    //         state.current = null;
    //     });
    // },
});

export const { login, logout } = userSlice.actions

export default userSlice.reducer