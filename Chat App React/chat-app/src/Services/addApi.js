import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// define a service user a base url
const addApi = createApi({
  reducerPath: "appApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/",
  }),
  endpoints: (builder) => ({
    signupUser: builder.mutation({
      // creating the user
      query: (user) => ({
        url: "/users",
        method: "POST",
        body: user,
      }),
    }),
    loginUser: builder.mutation({
      // creating the user
      query: (user) => ({
        url: "/users/login",
        method: "POST",
        body: user,
      }),
    }),
    logoutUser: builder.mutation({
      query: (payload) => ({
        url: "/logout",
        method: "DELETE",
        body: payload,
      }),
    }),
  }),
});
export const {
  useSignupUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
} = addApi;

export default addApi;
