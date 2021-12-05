import AsyncStorage from "@react-native-community/async-storage";
import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import logger from "redux-logger";
import rootReducer from "../reducers";

/**
 * Redux Setting
 */
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  timeout: 100000
};

let middleware = [thunk];
if (process.env.NODE_ENV === `development`) {
  middleware.push(logger);
}

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer, applyMiddleware(...middleware));
const persistor = persistStore(store);
const SetPrefrence = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, String(value));
  } catch (error) {
  }
}
const GetPrefrence = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key)
    return value;
  } catch (error) {
    return null;
  }
}
export { store, persistor, SetPrefrence, GetPrefrence };
