/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Button,
  TouchableOpacity,
  BackHandler,
  Platform,
  TouchableHighlight
} from 'react-native';
import { Image } from 'react-native-elements';
import { BaseColor } from '../../config/color';
import Modal, { ModalContent } from "react-native-modals";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { AuthActions, apiActions } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { store, SetPrefrence, GetPrefrence } from "@store";
import styles from './styles';
import PushNotification from "react-native-push-notification";
// import {
//   shareOnFacebook,
//   shareOnTwitter,
// } from 'react-native-social-share';
// import { ShareDialog } from 'react-native-fbsdk';
class main extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dialogVisible: false,
      userId: store.getState().auth.login.data.user.id,
    }
    this.backHandler = null;

  }

  componentDidMount() {
    this.serverConnect();
    const self = this;
    PushNotification.configure({
      senderID: 20757040903,
      onRegister: async function (token) {
        await SetPrefrence('device_token', token.token);
        self.props.AuthActions.device_token(Platform.OS);
      },
      onNotification: function (notification) {
        try { self.onRefresh() } catch (error) { };
        //notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      onAction: function (notification) {
        // console.log("ACTION:", notification.action);
        // console.log("NOTIFICATION:", notification);
      },
      onRegistrationError: function (err) {
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this))
  }

  async onRefresh() {
    let notification = await GetPrefrence('notification');
    if (notification == 'false') return this.props.actions.AuthActions.remove_token(Platform.OS);
    this.props.AuthActions.device_token(Platform.OS);
  }
  serverConnect() {
    const self = this;
    setTimeout(() => {
      try {
        self.props.apiActions.connectServer(this.state.userId, (response) => {
          if (response.success) {
            self.serverConnect();
          }
        })
      } catch (err) {

      }
    }, 60000);
  }

  componentWillUnmount() {
    if (this.backHandler)
      this.backHandler.remove();
  }

  backAction() {
    if (this.props.navigation.isFocused()) {
      this.setState({ dialogVisible: true })
      return true
    }
  }

  hideDialog() {
    this.setState({ dialogVisible: false })
  }

  async exitApp() {
    await this.setState({ dialogVisible: false });
    this.LogOut();
    // BackHandler.exitApp();
  }

  LogOut() {
    this.props.AuthActions.authentication(false, null, response => {
      if (response.success) {
        this.props.navigation.navigate("Loading");
      } else {
      }
    });
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
        <View style={{ flex: 1.2, backgroundColor: 'white' }}>
          <View style={{ alignContent: 'center', alignItems: 'center', marginTop: 10 }}>
            <Image
              source={require('@assets/images/logo.png')}
              style={{ width: 200, height: 50 }}
            />

          </View>
          <View style={{ alignItems: 'center', marginTop: 5 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 12, textAlign: 'center', color: 'black' }}>
              SELL YOUR DRAWING PAINTING AND ART IN 1 HOUR
            </Text>
            <Text style={{ fontWeight: 'bold', fontSize: 12, textAlign: 'center', color: 'black' }}>FIND THE BEST ARTIST OFFERS EVERYDAY</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('helper')}
              style={{
                backgroundColor: BaseColor.electronicColor,
                height: 30,
                width: 150,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 7,
              }}>
              <Text style={{ color: BaseColor.primaryColor, fontSize: 18 }}>How it works?</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={{ flex: 1, paddingBottom: 3 }} onPress={() => navigation.navigate("purchaseMain")}>
          <View style={[styles.mainlayout, { backgroundColor: BaseColor.purchaseColor }]}  >
            <Text style={{ fontSize: 50, fontWeight: 'bold', color: 'white' }}>
              PURCHASE
          </Text>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: BaseColor.accountSettingColor }}>
              INCREASE THE VALUE OF YOUR ARTISTIC COLLECTION
          </Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
              BEST ARTWORKS OF THE DAY
          </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, paddingBottom: 3 }} onPress={() => navigation.navigate("sell")}>
          <View style={[styles.mainlayout, { backgroundColor: BaseColor.sellColor }]} >
            <Text style={{ fontSize: 50, fontWeight: 'bold', color: 'white' }}>
              SELL
          </Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
              AN ARTISTIC WORK
          </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, paddingBottom: 3 }} onPress={() => navigation.navigate("previousOffers")}>
          <View style={[styles.mainlayout, { backgroundColor: BaseColor.previousColor }]} >
            <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
              PREVIOUS OFFERS PUBLISHED
          </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[{ flex: 1 }]} onPress={() => navigation.navigate("accountSetting")}>
          <View style={[styles.mainlayout, { backgroundColor: BaseColor.accountSettingColor }]} >
            <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
              ACCOUNT SETTING
          </Text>
          </View>
        </TouchableOpacity>
        <Modal
          visible={!!this.state.dialogVisible}
          swipeThreshold={100}
          modalStyle={{ backgroundColor: "transparent" }}
          onSwipeOut={(event) => { this.setState({ dialogVisible: true }); }}
          onTouchOutside={() => { this.setState({ dialogVisible: true }); }}
        >
          <ModalContent style={{ width: 350, height: 380, paddingVertical: 25, paddingHorizontal: 25, backgroundColor: "transparent" }}>
            <View style={{ borderWidth: 5, paddingHorizontal: 10, paddingVertical: 20, borderRadius: 30, borderColor: "#fff", backgroundColor: "#00549a" }}>
              <Text style={{ fontSize: 30, marginTop: 20, marginBottom: 30, textAlign: "center", color: "#fff" }}>Warning</Text>
              <Text style={{ color: "#fff", textAlign: "center", fontSize: 18, paddingHorizontal: 15 }}>Log out of account?</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity activeOpacity={0.8} style={{ paddingTop: 30, paddingHorizontal: 10, marginBottom: 20 }} onPress={() => this.hideDialog()}>
                  <View style={{ backgroundColor: BaseColor.btnModal, height: 40, width: 80, borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ textAlign: "center", color: "#fff", fontSize: 20, fontWeight: "bold" }}>Cancel</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={{ paddingTop: 30, paddingHorizontal: 10, marginBottom: 20 }} onPress={() => this.exitApp()}>
                  <View style={{ backgroundColor: BaseColor.btnModal, height: 40, width: 80, borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ textAlign: "center", color: "#fff", fontSize: 20, fontWeight: "bold" }}>Ok</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ModalContent>
        </Modal>
      </View>
    );
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    AuthActions: bindActionCreators(AuthActions, dispatch),
    apiActions: bindActionCreators(apiActions, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(main);