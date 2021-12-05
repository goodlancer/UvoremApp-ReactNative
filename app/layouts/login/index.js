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
  TextInput,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  BackHandler,
  Linking
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from './styles';
import { Image } from 'react-native-elements';
import { BaseColor } from '../../config/color';
import { apiActions, AuthActions } from '../../actions';
import * as Utils from '@utils';
import Toast from 'react-native-easy-toast';
import Modal, { ModalContent } from "react-native-modals";

class login extends Component {
  constructor(props) {
    super(props);
    var width = Dimensions.get('window').width;
    var height = Dimensions.get('window').height;
    this.state = {
      email: '',
      width: width,
      height: height - 20,
      password: '',
      loading: false,
      data: null,
      reset_email: "",
      dialogVisible: false,
      dialogHeader: "",
      dialogContent: "",
      Loading: false,
      isOneButton: true
    };
    this.backHandler = null;
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this))
  }
  backAction() {
    if (this.state.Loading) {
      return true
    }
    if (this.state.dialogVisible) {
      this.setState({ dialogVisible: false })
      return true
    }
    if (this.props.navigation.isFocused()) {
      this.setState({ dialogVisible: false })
      return false
    }
  }
  SignIn() {
    this.setState({ Loading: true })
    const { email, password } = this.state;
    const { navigation } = this.props;
    if (!Utils.EMAIL_VALIDATE.test(String(email).toLowerCase()) || password == '') {
      this.setState({ dialogHeader: "Warning" })
      this.setState({ dialogContent: "Please enter your password and e-mail correctly." })
      this.setState({ dialogVisible: true })
      this.setState({ Loading: false })
      return
    }

    this.props.AuthActions.authentication(true, this.state, (response) => {
      this.setState({ Loading: false })
      console.log(response)
      if (response.success) {
        this.setState({ data: response.data.user })
        navigation.navigate("Loading");
      } else if (response.data == "deActive") {
        this.setState({ dialogHeader: "Warning" })
        this.setState({ dialogContent: "Your account has been blocked by an administrator." })
        this.setState({ dialogVisible: true })
        this.setState({ Loading: false })
      } else {
        this.setState({ dialogHeader: "Warning" })
        this.setState({ dialogContent: "Please enter your password and e-mail correctly." })
        this.setState({ dialogVisible: true })
        this.setState({ Loading: false })
      }
    });
  }

  createAccount() {
    const { navigation } = this.props;
    navigation.navigate("register");
  }

  resetPassword() {
    this.setState({ Loading: true });
    var email = this.state.reset_email;
    if (!Utils.EMAIL_VALIDATE.test(String(email).toLowerCase())) {
      this.setState({ dialogHeader: "Warning" })
      this.setState({ dialogContent: "Please enter your email address correctly." })
      this.setState({ isOneButton: true })
      this.setState({ dialogVisible: true })
      this.setState({ Loading: false });
      return
    }
    var password = this.getRandomString(7);
    var data = {
      email: email,
      password: password
    }
    this.props.AuthActions.checkemail(data, (response) => {
      if (response.success) {
        this.setState({ dialogHeader: "Warning" })
        this.setState({ dialogContent: "Are you sure you want a new password?" })
        this.setState({ isOneButton: false })
        this.setState({ dialogVisible: true })
        this.setState({ Loading: false })
      } else {
        this.setState({ dialogHeader: "Warning" })
        this.setState({ dialogContent: "Non-compliant email to renew your password." })
        this.setState({ isOneButton: true })
        this.setState({ dialogVisible: true })
        this.setState({ Loading: false })
      }
    })
  }

  async submitResetPass() {
    this.setState({ Loading: true });
    var email = this.state.reset_email;
    var password = this.getRandomString(7);
    var data = {
      email: email,
      password: password
    }
    await this.setState({ dialogVisible: false });
    this.setState({ isOneButton: true });
    this.props.AuthActions.resetPassword(data, (response) => {
      this.setState({ Loading: false });
      if (response.success) {
        if (response.state) {
          this.setState({ dialogHeader: "E-MAIL VERIFICATION" })
          this.setState({ dialogContent: "Please check your mailbox." })
          this.setState({ dialogVisible: true })
        } else {
          this.setState({ dialogHeader: "Warning" })
          this.setState({ dialogContent: "It is necessary to wait 24 hours after your previous request." })
          this.setState({ dialogVisible: true })
        }
      } else {
        this.setState({ dialogHeader: "Warning" })
        this.setState({ dialogContent: "Non-compliant email to renew your password." })
        this.setState({ dialogVisible: true })
      }
    })
  }

  getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }
  hideDialog() {
    this.setState({ dialogVisible: false })
  }

  render() {
    const { Loading, width, height, isOneButton } = this.state
    const { navigation } = this.props;
    return (
      <View
        style={{
          backgroundColor: 'white',
          flexDirection: 'column',
          flex: 1,
        }}>
        <Toast
          ref="toast"
          position="top"
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
        />
        {Loading ?
          <View style={{ position: 'absolute', width: width, height: "100%", opacity: 0.5, backgroundColor: 'white', zIndex: 100 }}></View>
          : null
        }
        <ScrollView style={{ width: '100%', height: '100%', paddingRight: 20, paddingLeft: 20 }}>
          <View style={{ flex: 1, alignItems: 'center', marginTop: 10 }}>
            <Image
              source={require('@assets/images/logo.png')}
              style={{ width: 220, height: 60 }}
            />
            <Text style={{ fontWeight: 'bold', fontSize: 12, textAlign: 'center', color: 'black' }}>
              SELL YOUR DRAWING PAINTING AND ART IN 1 HOUR
            </Text>
            <Text style={{ fontWeight: 'bold', fontSize: 12, textAlign: 'center', color: 'black' }}>FIND THE BEST ARTIST OFFERS EVERYDAY</Text>
          </View>
          <View
            style={{ flex: 2, flexDirection: 'column', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('helper')}
              style={{
                backgroundColor: BaseColor.electronicColor,
                height: 30,
                width: 150,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 7,
                marginTop: 5
              }}>
              <Text style={{ color: BaseColor.primaryColor, fontSize: 18 }}>How it works?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.createAccount()}
              style={{
                backgroundColor: BaseColor.primaryColor,
                height: 40,
                width: 200,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 7,
                marginTop: 50
              }}>
              <Text style={{ color: 'white', fontSize: 20 }}>CREATE ACCOUNT</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 30 }}>
              ACCOUNT LOGIN
            </Text>
            <Text style={{ fontWeight: 'bold', fontSize: 11, marginTop: 20 }}>
              EMAIL
            </Text>
            <TextInput
              style={styles.textinput}
              underlineColorAndroid="transparent"
              placeholder=""
              autoCapitalize="none"
              onChangeText={(text) => this.setState({ email: text })}
            />
            <Text style={{ fontWeight: 'bold', fontSize: 11, marginTop: 20 }}>
              PASSWORD
            </Text>
            <TextInput
              style={styles.textinput}
              underlineColorAndroid="transparent"
              placeholder=""
              autoCapitalize="none"
              secureTextEntry={true}
              onChangeText={(text) => this.setState({ password: text })}
            />
            <TouchableOpacity
              onPress={() => this.SignIn()}
              style={{
                backgroundColor: BaseColor.imgBackgroundColor,
                height: 30,
                width: 150,
                marginTop: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 7,
              }}>
              <Text style={{ color: 'white', fontSize: 12 }}>SUBMIT</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}></View>

          <Text style={{ fontSize: 11, fontWeight: 'bold', marginTop: 50 }}>EMAIL</Text>
          <View style={{ alignItems: 'center' }}>
            <TextInput
              style={[styles.textinput]}
              underlineColorAndroid="transparent"
              placeholder=""
              autoCapitalize="none"
              onChangeText={(text) => this.setState({ reset_email: text })}
            />
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <TouchableOpacity
              onPress={() => this.resetPassword()}
              style={{
                backgroundColor: BaseColor.imgBackgroundColor,
                height: 25,
                width: 110,
                marginTop: 10,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 7,
              }}>
              <Text style={{ color: 'white', fontSize: 11 }}>RESET PASSWORD</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', flex: 1, marginTop: 30 }}>
            <View style={styles.footer}>
              <TouchableOpacity onPress={() => { Linking.openURL(`${Utils.SERVER_HOST}/Disclaimer.htm`) }}>
                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Disclaimer</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.footer}>
              <TouchableOpacity onPress={() => { Linking.openURL(`${Utils.SERVER_HOST}/Privacy Policy.htm`) }}>
                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>
                  Privacy Policy
              </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.footer}>
              <TouchableOpacity onPress={() => { Linking.openURL(`${Utils.SERVER_HOST}/Terms & Conditions.htm`) }}>
                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>
                  Terms & Conditions
              </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        {this.state.Loading ?
          <ActivityIndicator
            size="large"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center"
            }}
            color={BaseColor.primaryColor}
          /> : null
        }

        <Modal
          visible={!!this.state.dialogVisible}
          swipeThreshold={100}
          modalStyle={{ backgroundColor: "transparent" }}
          onSwipeOut={(event) => { this.setState({ dialogVisible: true }); }}
          onTouchOutside={() => { this.setState({ dialogVisible: true }); }}
        >

          <ModalContent style={{ width: 300, height: 380, paddingVertical: 25, paddingHorizontal: 25, backgroundColor: "transparent" }}>
            <View style={{ borderWidth: 5, paddingHorizontal: 10, paddingVertical: 20, borderRadius: 30, borderColor: "#fff", backgroundColor: "#00549a" }}>
              <Text style={{ fontSize: 25, marginTop: 20, marginBottom: 30, textAlign: "center", color: "#fff" }}>{this.state.dialogHeader}</Text>
              <Text style={{ color: "#fff", textAlign: "center", fontSize: 18, paddingHorizontal: 15 }}>{this.state.dialogContent}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity activeOpacity={0.8} style={{ paddingTop: 30, paddingHorizontal: 10, marginBottom: 20 }} onPress={() => this.hideDialog()}>
                  {isOneButton ?
                    <View style={{ backgroundColor: BaseColor.btnModal, height: 40, width: 200, borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
                      <Text style={{ textAlign: "center", color: "#fff", fontSize: 20, fontWeight: "bold" }}>Ok</Text>
                    </View>
                    :
                    <View style={{ backgroundColor: BaseColor.btnModal, height: 40, width: 100, borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
                      <Text style={{ textAlign: "center", color: "#fff", fontSize: 20, fontWeight: "bold" }}>Cancel</Text>
                    </View>
                  }
                </TouchableOpacity>
                {isOneButton == false ?
                  <TouchableOpacity activeOpacity={0.8} style={{ paddingTop: 30, paddingHorizontal: 10, marginBottom: 20 }} onPress={() => this.submitResetPass()}>
                    <View style={{ backgroundColor: BaseColor.btnModal, height: 40, width: 100, borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
                      <Text style={{ textAlign: "center", color: "#fff", fontSize: 20, fontWeight: "bold" }}>Ok</Text>
                    </View>
                  </TouchableOpacity>
                  : null
                }
              </View>
            </View>
          </ModalContent>
        </Modal>
      </View>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    AuthActions: bindActionCreators(AuthActions, dispatch),
    apiActions: bindActionCreators(apiActions, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(login);
