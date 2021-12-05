/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import App from "./navigation";
import { store, persistor } from "@store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import React, { Component } from 'react';
import appsFlyer from 'react-native-appsflyer';
appsFlyer.initSdk(
  {
    devKey: 'hZyJftncwPJsqEVkZkmrim',
    isDebug: false,
    appId: null,
  },
  (result) => {
    console.log(result, "result");
  },
  (error) => {
    console.error(error);
  }
);
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Button,
  TouchableOpacity
} from 'react-native';
export default class index extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    );
  }
};