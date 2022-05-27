import { createSlice } from "@reduxjs/toolkit";
import addApi from "../Services/addApi";
export const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addNotification: (state, { payload }) => {},
    resetNotification: (state, { payload }) => {},
  },
  extraReducers: (builder) => {
    //   save user after signup
    builder.addMatcher(
      addApi.endpoints.signupUser.matchFulfilled,
      (state, { payload }) => payload
    );
    //save user after login
    builder.addMatcher(
      addApi.endpoints.loginUser.matchFulfilled,
      (state, { payload }) => payload
    );
    //destroy user after logout
    builder.addMatcher(addApi.endpoints.logoutUser.matchFulfilled, () => null);
  },
});

export const { addNotification, resetNotification } = userSlice.actions;
export default userSlice.reducer;
