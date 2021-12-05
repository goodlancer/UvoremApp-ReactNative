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
  Picker,
  ActivityIndicator,
  BackHandler
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from './styles';
import { Image } from 'react-native-elements';
import { BaseColor } from '../../config/color';
import PhoneInput from 'react-native-phone-input';
import CountryPicker, {
  Country,
  CountryCode,
} from 'react-native-country-picker-modal';
import * as Utils from '@utils';
import Toast from 'react-native-easy-toast';
import { AuthActions, apiActions } from '@actions';
import Modal, { ModalContent } from "react-native-modals";
class register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: '',
      firstname: '',
      lastname: 'king',
      gender: 0,
      genderstring: 'Male',
      country: '',
      email: '',
      phonenumber: '+323454566',
      countryCode: '',
      withCountryNameButton: true,
      withFlag: true,
      withEmoji: true,
      withFilter: true,
      withAlphaFilter: false,
      withCallingCode: false,
      dialogVisible: false,
      dialogHeader: "",
      dialogContent: "",
      Loading: false,
      isSubmit: false,
      confirm_password: "",
      indicate: "",
    };
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this))
  }
  componentWillUnmount() {
    if (this.backHandler)
      this.backHandler.remove();
  }
  backAction() {
    if (this.state.Loading) {
      return true
    }
    if (this.state.dialogVisible) {
      this.setState({ dialogVisible: false });
      return true
    }
    if (this.props.navigation.isFocused()) {
      this.setState({ dialogVisible: false })
      return false
    }
  }
  async onSubmit() {
    let {
      name,
      password,
      firstname,
      email,
      confirm_password,
      country
    } = this.state;
    if (
      country == '' ||
      name == '' ||
      password == '' ||
      firstname == '' ||
      password != confirm_password ||
      !Utils.EMAIL_VALIDATE.test(String(email).toLowerCase())
    ) {
      this.setState({ dialogContent: "Please enter your information correctly." })
      this.setState({ dialogHeader: "Warning" })
      this.setState({ dialogVisible: true })
    } else {
      this.props.AuthActions.registration(this.state, (response) => {
        if (response.success) {
          this.setState({ dialogContent: "Your account has just been created." })
          this.setState({ dialogHeader: "Congratulations" })
          this.setState({ dialogVisible: true })
          this.setState({isSubmit: true})
        } else {
          if (response.data == 'exists') {
            this.setState({ dialogContent: "Your email already exist." })
            this.setState({ dialogHeader: "Warning" })
            this.setState({ dialogVisible: true })
          }
        }
      });
    }
  }
  onCountrySelect = (country) => {
    this.setState({ countryCode: country.cca2 });
    this.setState({ country: country.name });
  };
  async hideDialog() {
    await this.setState({ dialogVisible: false })
    if(this.state.isSubmit){
      this.props.navigation.navigate('Loading');
    }
  }
  render() {
    let self = this;
    let {
      phonenumber,
      countryCode,
      country,
      withCountryNameButton,
      withFilter,
      withFlag,
      withEmoji,
      withAlphaFilter,
      withCallingCode,
    } = this.state;
    return (
      <View
        style={{ backgroundColor: 'white', flexDirection: 'column', flex: 1 }}>
        <View
          style={[
            styles.mainlayout,
            { backgroundColor: BaseColor.imgBackgroundColor, height: 130 },
          ]}>
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text style={{ fontSize: 35, fontWeight: 'bold', color: 'white' }}>
              CREATE ACCOUNT
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            {/* <TouchableOpacity
              onPress={() => { this.props.navigation.goBack() }}
              style={{
                width: 100,
                height: 30,
                backgroundColor: BaseColor.backColor,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
                marginTop: 10,
              }}>
              <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'white' }}>
                previous page
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
        <View style={{ flex: 8 }}>
          <ScrollView>
            <View>
            <View>
                <Text style={styles.text}>EMAIL</Text>
              </View>
              <View>
                <TextInput
                  style={styles.textinput}
                  underlineColorAndroid="transparent"
                  placeholder=""
                  placeholderTextColor="#9a73ef"
                  autoCapitalize="none"
                  onChangeText={(text) => self.setState({ email: text })}
                  secureTextEntry={false}
                />
              </View>
              <View>
                <Text style={styles.text}>NAME</Text>
              </View>
              <View>
                <TextInput
                  style={styles.textinput}
                  underlineColorAndroid="transparent"
                  placeholder=""
                  placeholderTextColor="#9a73ef"
                  autoCapitalize="none"
                  onChangeText={(text) => self.setState({ firstname: text })}
                  secureTextEntry={false}
                />
              </View>
              <View>
                <Text style={styles.text}>NICKNAME</Text>
              </View>
              <View>
                <TextInput
                  style={styles.textinput}
                  underlineColorAndroid="transparent"
                  placeholder=""
                  placeholderTextColor="#9a73ef"
                  autoCapitalize="none"
                  onChangeText={(text) => self.setState({ name: text })}
                  secureTextEntry={false}
                />
              </View>
              
              <View>
                <Text style={styles.text}>PASSWORD</Text>
              </View>
              <View>
                <TextInput
                  style={styles.textinput}
                  underlineColorAndroid="transparent"
                  placeholder=""
                  placeholderTextColor="#9a73ef"
                  autoCapitalize="none"
                  onChangeText={(text) => self.setState({ password: text })}
                  secureTextEntry={true}
                />
              </View>
              <View>
                <Text style={styles.text}>CONFIRM PASSWORD</Text>
              </View>
              <View>
                <TextInput
                  style={styles.textinput}
                  underlineColorAndroid="transparent"
                  placeholder=""
                  placeholderTextColor="#9a73ef"
                  autoCapitalize="none"
                  onChangeText={(text) => self.setState({ confirm_password: text })}
                  secureTextEntry={true}
                />
              </View>
              {/* <View>
                <Text style={styles.text}>INDICATE THE NAME OF YOUR SPONSOR</Text>
              </View>
              <View>
                <TextInput
                  style={styles.textinput}
                  underlineColorAndroid="transparent"
                  placeholder=""
                  placeholderTextColor="#9a73ef"
                  autoCapitalize="none"
                  onChangeText={(text) => self.setState({ indicate: text })}
                  secureTextEntry={true}
                />
              </View> */}
              {/* <View>
                <Text style={styles.text}>LAST NAME</Text>
              </View>
              <View>
                <TextInput
                  style={styles.textinput}
                  underlineColorAndroid="transparent"
                  placeholder=""
                  placeholderTextColor="#9a73ef"
                  autoCapitalize="none"
                  onChangeText={(text) => self.setState({ lastname: text })}
                  secureTextEntry={false}
                />
              </View> */}
              {/* <View>
                <Text style={styles.text}>GENDER</Text>
              </View>
              <View>
                <View
                  style={{
                    height: 30,
                    marginLeft: 20,
                    width: '90%',
                    borderColor: BaseColor.primaryColor,
                    borderWidth: 1,
                    borderRadius: 7,
                    justifyContent: 'center',
                  }}>
                  <Picker
                    selectedValue={this.state.genderstring}
                    style={{ height: 30, width: '100%' }}
                    onValueChange={(itemValue, itemIndex) => {
                      this.setState({ gender: itemIndex });
                      this.setState({ genderstring: itemValue });
                    }}>
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Female" value="female" />
                  </Picker>
                </View>
              </View> */}
              <View style={{width: '100%'}}>
                <Text style={{ marginTop: 10, marginBottom: 10,backgroundColor: BaseColor.primaryColor, width: '100%', fontWeight: 'bold', fontSize: 16, textAlign: 'center'}}>SELECT YOUR COUNTRY OF ORIGIN</Text>
              </View>
              <View style={styles.textinput}>
                <CountryPicker
                  {...{
                    countryCode,
                    withFilter,
                    withFlag,
                    withCountryNameButton,
                    withAlphaFilter,
                    withCallingCode,
                    withEmoji,
                    onSelect(country: Country) {
                      self.onCountrySelect(country);
                    },
                  }}
                  false
                />
              </View>
              
              {/* <View>
                <Text style={styles.text}>PHONE NUMBER</Text>
              </View>
              <View>
                <PhoneInput
                  ref={(ref) => {
                    this.phone = ref;
                  }}
                  allowZeroAfterCountryCode={true}
                  initialCountry={"fr"}
                  style={styles.textinput}
                  placeholderTextColor="#9a73ef"
                  value={this.state.phonenumber}
                />
              </View> */}
            </View>
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <TouchableOpacity
                onPress={() => this.onSubmit()}
                style={{
                  width: 200,
                  height: 35,
                  backgroundColor: BaseColor.imgBackgroundColor,
                  alignItems: 'center',
                  borderRadius: 7,
                  justifyContent: 'center',
                  marginBottom: 5
                }}>
                <Text style={{ color: 'white' }}>SUBMIT</Text>
              </TouchableOpacity>
            </View>
            {/* <Text style={{textAlign: 'center', fontSize: 12, marginBottom: 20}}>registering with our app indicates that you accept our terms</Text> */}
            <View style={{ alignItems: 'center', marginTop: 30, marginBottom: 10 }}>
              <Image
                source={require('@assets/images/logo.png')}
                style={{ width: 160, height: 40 }}
              />
            </View>
          </ScrollView>
          <Toast
            ref="toast"
            position="top"
            fadeInDuration={750}
            fadeOutDuration={1000}
            opacity={0.8}
          />
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
                <TouchableOpacity activeOpacity={0.8} style={{ paddingTop: 30, paddingHorizontal: 10, marginBottom: 20 }} onPress={() => this.hideDialog()}>
                  <View style={{ backgroundColor: BaseColor.btnModal, height: 40, borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ textAlign: "center", color: "#fff", fontSize: 20, fontWeight: "bold" }}>Ok</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ModalContent>
          </Modal>
        </View>
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

export default connect(null, mapDispatchToProps)(register);
