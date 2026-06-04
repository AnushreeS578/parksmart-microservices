import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0
};

const notificationSlice = createSlice({

  name: "notification",

  initialState,

  reducers: {

    setNotificationCount: (
      state,
      action
    ) => {

      state.count =
        action.payload;
    }
  }
});

export const {
  setNotificationCount
} = notificationSlice.actions;

export default notificationSlice.reducer;