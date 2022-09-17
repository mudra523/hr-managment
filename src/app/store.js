import { configureStore } from "@reduxjs/toolkit";
import authTokenReducer from "../features/authTokenSlice";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";

const reducers = combineReducers({
  token: authTokenReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
  reducer: persistedReducer,
  //   devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

// export default configureStore({
//   reducer: {
//     token: authTokenReducer,
//   },
// });
