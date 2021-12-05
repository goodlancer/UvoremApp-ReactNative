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
   TouchableWithoutFeedbackBase,
   BackHandler
} from 'react-native';
import styles from './styles';
import { Image } from 'react-native-elements';
import { BaseColor } from '../../config/color';
import PhoneInput from 'react-native-phone-input';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AuthActions, apiActions } from '@actions';
import CountryPicker, {
   Country,
   CountryCode,
} from 'react-native-country-picker-modal';
import { store } from "@store";
import Toast from 'react-native-easy-toast';
import Modal, { ModalContent } from "react-native-modals";
import Icon from 'react-native-vector-icons/FontAwesome5';
// import ImagePicker from 'react-native-image-picker';

class accountSetting extends Component {
   constructor(props) {
      super(props);

      this.state = {
         userId: store.getState().auth.login.data.user.id,
         name: store.getState().auth.login.data.user.name,
         password: '',
         newpassword: '',
         firstname: store.getState().auth.login.data.user.firstname,
         lastname: store.getState().auth.login.data.user.lastname,
         gender: 0,
         genderstring: 'Male',
         country: store.getState().auth.login.data.user.country,
         email: store.getState().auth.login.data.user.email,
         phonenumber: store.getState().auth.login.data.user.phonenumber,
         countryCode: store.getState().auth.login.data.user.countryCode,
         withCountryNameButton: true,
         withFlag: false,
         withEmoji: false,
         withFilter: false,
         withAlphaFilter: false,
         withCallingCode: false,
         userData: store.getState().auth.login.data.user,
         dialogVisible: false,
         success: false,
         new_country: '',
         new_countryCode: '',
         change_country: 0,
         dialogHeader: '',
         dialogContent: '',
         imageData: null,
         visible: false,
         disableNativeModal: false,
         withModal: true
      };

   }

   componentDidMount() {
      this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this))
      const gender = this.state.userData.gender;
      if (gender == 0) {
         this.setState({ genderstring: 'Male' })
      } else {
         this.setState({ genderstring: 'Female' })
      }
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
   handleEmail = (text) => {
      this.setState({ email: text });
   };
   onCountrySelect = (country) => {
      this.setState({ countryCode: country.cca2 })
      // this.setState({ new_countryCode: country.cca2 })
      this.setState({ country: country.name })
   };
   hideDialog() {
      const { navigation } = this.props;
      const { success } = this.state;
      this.setState({ dialogVisible: false })
      if (success)
         navigation.goBack();
   }
   async onSubmit() {
      const { name, firstname, lastname, password, newpassword, email, phonenumber, country, new_country, imageData, userId } = this.state;

      if (name == "" || firstname == "" || password == "" || newpassword == "") {
         this.setState({ dialogContent: "Please enter information correctly." })
         this.setState({ dialogHeader: "Warning" })
         this.setState({ dialogVisible: true })
         return;
      }
      // this.setState({ phonenumber: this.phone.getValue() })
      // if (country != new_country && new_country != '') {
      //    this.setState({ change_country: 2 });
      //    if (imageData == null) {
      //       this.setState({ dialogContent: "Please select a country different from the current country to be able to upload your proof of place of residence and change the country of the account." })
      //       this.setState({ dialogHeader: "Warning" })
      //       this.setState({ dialogVisible: true })
      //       return;
      //    }
      // }
      // if (imageData != null) {
      //    if (country == new_country || new_country == '') {
      //       this.setState({ dialogContent: "Please select a country other than the current country to be able to upload your proof of residence and change the account country." })
      //       this.setState({ dialogHeader: "Warning" })
      //       this.setState({ dialogVisible: true })
      //       return;
      //    }
      // }
      // await this.setState({ countryCode: store.getState().auth.login.data.user.countryCode })
      this.edtProfile();
   }

   edtProfile() {
      this.props.AuthActions.changeProfile(this.state, (response) => {
         if (response.success) {
            this.setState({ success: true })
            if (this.state.change_country == 2) {
               this.setState({ dialogHeader: "Success" })
               this.setState({ dialogContent: "Request for change of country account pending approval." })
            } else {
               this.setState({ dialogHeader: "Success" })
               this.setState({ dialogContent: "Your account has been changed successfully." })
            }
            this.setState({ dialogVisible: true })
         } else {
            this.setState({ dialogHeader: "Warning" })
            this.setState({ dialogContent: "Please enter your old password correctly." })
            this.setState({ dialogVisible: true })
         }
      })
   }

   changeCountry() {
      var options = {
         title: 'Select Image',
         customButtons: [
            {
               name: 'customOptionKey',
               title: 'Choose file from Custom Option',
            },
         ],
         storageOptions: {
            skipBackup: true,
            path: 'images',
         },
      };

      // ImagePicker.showImagePicker(options, (res) => {
      //    if (res.didCancel) {
      //       console.log('User cancelled image picker');
      //    } else if (res.error) {
      //       console.log('ImagePicker Error: ', res.error);
      //    } else if (res.customButton) {
      //       console.log('User tapped custom button: ', res.customButton);
      //    } else {
      //       this.setState({ imageData: res });
      //    }
      // });
   }

   render() {
      let self = this;
      let {
         phonenumber,
         countryCode,
         country,
         new_countryCode,
         withCountryNameButton,
         withFilter,
         withFlag,
         withEmoji,
         withAlphaFilter,
         withCallingCode,
         visible,
         disableNativeModal,
         withModal
      } = this.state;
      return (
         <View
            style={{ backgroundColor: 'white', flexDirection: 'column', flex: 1 }}>
            <Toast
               ref="toast"
               position="top"
               fadeInDuration={750}
               fadeOutDuration={1000}
               opacity={0.8}
            />
            <View
               style={[
                  { height: 130, backgroundColor: BaseColor.imgBackgroundColor },
               ]}>
               <View style={{ alignItems: 'center', marginTop: 30 }}>
                  <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white' }}>
                     ACCOUNT SETTING
          </Text>
               </View>
               <View style={{ alignItems: 'flex-end' }}>
                  <View style={{ width: 100, alignItems: 'flex-end', justifyContent: 'center', height: 50, marginRight: 10 }}>
                     {/* <TouchableOpacity style={[styles.btnPrevious]} onPress={() => this.props.navigation.goBack()}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: 'white' }}>PREVIOUS PAGE</Text>
              </TouchableOpacity> */}
                  </View>
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
                           defaultValue={this.state.userData.email}
                           editable={false}
                           color="black"
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
                           defaultValue={this.state.userData.name}
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
                           editable={false}
                           defaultValue={this.state.userData.firstname}
                           color="black"
                        />
                     </View>
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
                           editable={false}
                           defaultValue={this.state.userData.lastname}
                           color="black"
                        />
                     </View> */}
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
                        <Text style={styles.text}>NEW PASSWORD</Text>
                     </View>
                     <View>
                        <TextInput
                           style={styles.textinput}
                           underlineColorAndroid="transparent"
                           placeholder=""
                           placeholderTextColor="#9a73ef"
                           autoCapitalize="none"
                           onChangeText={(text) => self.setState({ newpassword: text })}
                           secureTextEntry={true}
                        />
                     </View>

                     {/* <View>
                        <Text style={styles.text}>GENDER</Text>
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
                           defaultValue={this.state.genderstring}
                           editable={false}
                           color="black"
                        />
                     </View> */}

                     {/* <View>
                        <Text style={[styles.text, { textAlign: 'center', fontSize: 12 }]}>Upload proof and change country of the account</Text>
                     </View> */}

                     <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={{ flex: 1 }}>
                           <Text style={styles.text}>COUNTRY OF ORIGIN</Text>
                        </View>
                        {/* <View style={{ alignItems: 'center', flex: 1 }}>
                           {this.state.imageData == null ?
                              <TouchableOpacity
                                 onPress={() => this.changeCountry()}
                                 style={{
                                    width: 150,
                                    height: 25,
                                    backgroundColor: BaseColor.imgBackgroundColor,
                                    alignItems: 'center',
                                    borderRadius: 7,
                                    justifyContent: 'center',
                                 }}>
                                 <Text style={{ color: 'white', fontWeight: 'bold' }}>CHANGE COUNTRY</Text>
                              </TouchableOpacity>
                              :
                              <TouchableOpacity
                                 onPress={() => this.changeCountry()}
                                 style={{
                                    width: 150,
                                    height: 25,
                                    backgroundColor: BaseColor.primaryColor,
                                    alignItems: 'center',
                                    borderRadius: 7,
                                    justifyContent: 'center',
                                 }}>
                                 <Text style={{ color: 'white', fontWeight: 'bold' }}>CHANGE COUNTRY</Text>
                              </TouchableOpacity>}

                        </View> */}
                        {/* <View style={{ flex: 1 }}></View> */}
                     </View>
                     <View style={[styles.textinput]}>
                        <View style={{ width: '200%', height: '100%', zIndex: 1000, position: 'absolute' }}>
                        </View>
                        <CountryPicker
                           {...{
                              countryCode,
                              withFilter,
                              withFlag,
                              withCountryNameButton,
                              withAlphaFilter,
                              withCallingCode,
                              withEmoji,
                              visible,
                              disableNativeModal,
                              withModal
                           }}
                           visible={false}
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
                           style={styles.textinput}
                           placeholderTextColor="#9a73ef"
                           value={this.state.phonenumber}
                        />
                     </View> */}
                     <View>
                        <Text style={[styles.text, { fontSize: 15, textAlign: 'center', fontWeight: 'bold' }]}>CONTACT SUPPORT</Text>
                     </View>
                     <View>
                        <TextInput
                           style={[styles.textinput, { color: BaseColor.primaryColor, textAlign: 'center' }]}
                           underlineColorAndroid="transparent"
                           placeholder=""
                           placeholderTextColor="#9a73ef"
                           autoCapitalize="none"
                           onChangeText={(text) => self.setState({ email: text })}
                           defaultValue="uvorem.pro@gmail.com"
                           editable={false}
                        />
                     </View>


                  </View>
                  <View style={{ alignItems: 'center', marginTop: 20 }}>
                     <TouchableOpacity
                        onPress={() => this.onSubmit()}
                        style={{
                           width: 200,
                           height: 35,
                           backgroundColor: BaseColor.imgBackgroundColor,
                           alignItems: 'center',
                           borderRadius: 7,
                           justifyContent: 'center',
                           marginBottom: 5,
                        }}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>SUBMIT</Text>
                     </TouchableOpacity>
                  </View>
                  <View style={{ alignItems: 'center', marginBottom: 5 }}>
                     <Image
                        source={require('@assets/images/logo.png')}
                        style={{ width: 160, height: 40 }}
                     />
                  </View>
               </ScrollView>
            </View>
            <Modal
               visible={!!this.state.dialogVisible}
               swipeThreshold={100}
               modalStyle={{ backgroundColor: "transparent" }}
               onSwipeOut={(event) => { this.setState({ dialogVisible: true }); }}
               onTouchOutside={() => { this.setState({ dialogVisible: true }); }}
            >

               <ModalContent style={{ width: 300, height: 380, paddingVertical: 25, paddingHorizontal: 25, backgroundColor: "transparent" }}>
                  <View style={{ borderWidth: 5, paddingHorizontal: 10, paddingVertical: 20, borderRadius: 30, borderColor: "#fff", backgroundColor: "#00549a" }}>
                     <Text style={{ fontSize: 25, marginTop: 10, marginBottom: 10, textAlign: "center", color: "#fff" }}>{this.state.dialogHeader}</Text>
                     <Text style={{ color: "#fff", textAlign: "center", fontSize: 18, paddingHorizontal: 15 }}>{this.state.dialogContent}</Text>
                     <TouchableOpacity activeOpacity={0.8} style={{ paddingTop: 20, paddingHorizontal: 10, marginBottom: 10 }} onPress={() => this.hideDialog()}>
                        <View style={{ backgroundColor: BaseColor.btnModal, height: 40, borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
                           <Text style={{ textAlign: "center", color: "#fff", fontSize: 20, fontWeight: "bold" }}>Ok</Text>
                        </View>
                     </TouchableOpacity>
                  </View>
               </ModalContent>
            </Modal>
         </View>
      );
   }
}
const mapDispatchToProps = dispatch => {
   return {
      apiActions: bindActionCreators(apiActions, dispatch),
      AuthActions: bindActionCreators(AuthActions, dispatch),
   };
};
export default connect(null, mapDispatchToProps)(accountSetting);