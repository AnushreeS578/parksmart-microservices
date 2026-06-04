import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  role: "",
  token: ""
};

const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {

    setUser: (state, action) => {

      state.username =
        action.payload.username;

      state.role =
        action.payload.role;

      state.token =
        action.payload.token;
    }
  }
});

export const { setUser } =
  userSlice.actions;

export default userSlice.reducer;