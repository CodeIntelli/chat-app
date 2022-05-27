import { configureStore } from "@reduxjs/toolkit";
import useSlice from "./features/userSlice";
import addApi from "./Services/addApi";

// persist our store

import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import userSlice from "./features/userSlice";

const reducers = combineReducers({
  user: userSlice,
  [addApi.reducerPath]: addApi.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  blackList: [addApi.reducerPath],
};

const persistedReducer = persistReducer(persistConfig, reducers);

// creating the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk, addApi.middleware],
});

export default store;
