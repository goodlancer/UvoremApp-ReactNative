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
  ActivityIndicator,
  BackHandler
} from 'react-native';
import styles from './styles';
import { Image } from 'react-native-elements';
import { BaseColor } from '../../config/color';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthActions, apiActions } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { store } from '@store';
import * as Utils from '@utils';
import { Images } from '@config/images';
import Dialog, { DialogContent, DialogButton, DialogTitle, DialogFooter } from 'react-native-popup-dialog';
import Modal, { ModalContent } from "react-native-modals";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { AdMobRewarded } from 'react-native-admob';
import { getIntertial } from '@components/adMob/Intertial';

class previousOffers extends Component {
  constructor(props) {
    super(props);
    var width = Dimensions.get('window').width;
    var height = Dimensions.get('window').height;
    this.state = {
      offer_id: 0,
      width: width,
      height: height - 20,
      width: width,
      height: height - 20,
      selectedValue: 'Jave',
      userId: store.getState().auth.login.data.user.id,
      role: store.getState().auth.login.data.user.role,
      allData: [],
      totalCount: 0,
      title: '',
      description: '',
      imageData: null,
      image_1: '',
      image_2: '',
      image_3: '',
      imageIndex: 1,
      imagePath: null,
      userName: store.getState().auth.login.data.user.name,
      country: '',
      pageNum: 1,
      delDialog: false,
      article_id: 0,
      Loading: false,
      dialogVisible: false,
      dialogHeader: "Warning",
      dialogContent: "",
      errorMsg: "there is no previously published offer saved for the \"PREVIOUS OFFER PUBLISHED\" page.",
      isRepublic: false,
    };
    this.backHandler = null;
  }
  componentDidMount() {
    getIntertial();
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this))
    this.getAllOwnerArticle();
  }
  UNSAFE_componentWillReceiveProps() {

  }
  componentWillUnmount() {
    AdMobRewarded.removeAllListeners();
    if (this.backHandler)
      this.backHandler.remove();
  }
  getAllOwnerArticle() {
    this.setState({ Loading: true })
    const data = {
      userId: this.state.userId,
      role: this.state.role
    }
    this.props.apiActions.getAllOwnerArticle(data, (response) => {
      if (response.success) {
        if (response.data.length == 0) {
          this.setState({ dialogHeader: "Warning" })
          this.setState({ dialogContent: "No previously saved offer available for the moment." })
          this.setState({ dialogVisible: true })
          return
        }
        this.setState({ Loading: false })
        this.setState({ allData: response.data })
        this.setState({ totalCount: this.state.allData.length / 3 })
        this.pageRefresh();
      }
    })
  }
  backAction() {
    if (this.state.Loading) {
      return true
    }

    if (this.state.delDialog) {
      this.setState({ delDialog: false });
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
  pageRefresh() {
    let { pageNum } = this.state;
    this.setState({ imageIndex: 1 })
    let url = `${Utils.SERVER_HOST}${this.state.allData[(pageNum - 1) * 3]['imagePath']}`
    this.setState({ imagePath: url })
    this.setState({ title: this.state.allData[(pageNum - 1) * 3]['title'] })
    this.setState({ description: this.state.allData[(pageNum - 1) * 3]['description'] })
    this.setState({ country: this.state.allData[(pageNum - 1) * 3]['country'] })
    this.setState({ article_id: this.state.allData[(pageNum - 1) * 3]['article_id'] })
    this.setState({ offer_id: this.state.allData[(pageNum - 1) * 3]['article_id'] })
  }

  forwardClicked() {
    let { pageNum } = this.state;
    if (this.state.imageIndex < 3) this.state.imageIndex++;
    let url = `${Utils.SERVER_HOST}${this.state.allData[(pageNum - 1) * 3 + this.state.imageIndex - 1]['imagePath']}`;
    this.setState({ imagePath: url });
  }

  backwardClicked() {
    let { pageNum } = this.state;
    if (this.state.imageIndex > 1) this.state.imageIndex--;
    let url = `${Utils.SERVER_HOST}${this.state.allData[(pageNum - 1) * 3 + this.state.imageIndex - 1]['imagePath']}`;
    this.setState({ imagePath: url });
  }

  pageDown() {
    let { pageNum, totalCount } = this.state;
    if (pageNum < totalCount) this.state.pageNum++;
    else return;
    this.pageRefresh();
  }

  pageUp() {
    let { pageNum } = this.state;
    if (pageNum > 1) this.state.pageNum--;
    else return;
    this.pageRefresh();
  }

  delArticle() {
    this.props.apiActions.deleteArticle(this.state.article_id, (response) => {
      if (response.success) {
        this.setState({ delDialog: false })
        this.getAllOwnerArticle()
      }
    })
  }

  async hideDialog() {
    const { isRepublic } = this.state;
    if (isRepublic) {
      await this.setState({ dialogVisible: false })
      await this.setState({ isRepublic: false })
      this.getAllOwnerArticle();
      return;
    }
    this.setState({ dialogVisible: false })
    this.props.navigation.goBack()
  }

  async republicOffer() {
    await AdMobRewarded.showAd().catch(error => console.warn(error));
    this.props.apiActions.republicOffer(this.state.offer_id, (response) => {
      if (response.success) {
        this.setState({ isRepublic: true })
        this.setState({ dialogHeader: "Congratulations!" })
        this.setState({ dialogContent: "Your offer has just been published again." })
        this.setState({ dialogVisible: true });
      }
    })
  }

  render() {
    const { width, height, Loading } = this.state
    return (
      <ScrollView
        style={{ backgroundColor: 'white', flexDirection: 'column', flex: 1 }}>
        {Loading ?
          <View style={{ position: 'absolute', width: width, height: height, opacity: 0.5, backgroundColor: 'white', zIndex: 100 }}></View>
          : null
        }
        <View style={{ height: this.state.height - 5 }}>
          <View style={{ flex: 1.3, backgroundColor: BaseColor.primaryColor }}>
            <View style={[styles.mainlayout]}>
              <Text
                style={{
                  fontSize: 27,
                  fontWeight: 'bold',
                  color: 'white',
                  textAlign: 'center',
                }}>
                PREVIOUS OFFER PUBLISHED
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: 'bold',
                  color: 'white',
                  textAlign: 'center',
                  color: BaseColor.imgBackgroundColor,
                }}>
                AUTOMATICALLY RENEW THE PUBLICATION OF YOUR PREVIOUS OFFERS PUBLISH
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 0.7 }}></View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <TouchableOpacity style={[styles.btnTime]} onPress={() => this.props.navigation.navigate('increaseTime')}>
                  <Text
                    style={{ fontSize: 11, fontWeight: 'bold', color: 'white' }}>
                    BECOME A PREMIUM ARTIST
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{ alignItems: 'flex-end', marginTop: 10, marginRight: 5, flex: 0.7 }}>
                {/* <TouchableOpacity style={[styles.btnPrevious]} onPress={() => this.props.navigation.goBack()}>
                  <Text
                    style={{ fontSize: 10, fontWeight: 'bold', color: 'white' }}>
                    PREVIOUS PAGE
                </Text>
                </TouchableOpacity> */}
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row', flex: 2 }}>
            <View
              style={{
                backgroundColor: BaseColor.imgBackgroundColor,
                width: '20%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.backwardClicked();
                    }}
                    style={{ width: '90%', height: '100%', backgroundColor: BaseColor.primaryColor, justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                      source={Images.left}
                      style={{ width: 10, height: 20 }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: 'white',
                    }}>
                    {this.state.imageIndex}/3
                  </Text>
                </View>

              </View>
            </View>
            <View
              style={{
                backgroundColor: BaseColor.imgBackgroundColor,
                width: '60%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: '90%',
                  width: '70%',
                  borderRadius: 10,
                  backgroundColor: 'white',
                }}>
                <Image source={{ uri: this.state.imagePath }} style={{ width: '100%', height: '100%', borderRadius: 10 }}></Image>
              </View>
            </View>
            <View
              style={{
                backgroundColor: BaseColor.imgBackgroundColor,
                width: '20%',
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.forwardClicked();
                }}
                style={{ width: '40%', height: '100%', backgroundColor: BaseColor.primaryColor, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={Images.right} style={{ width: 10, height: 20 }} />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              marginTop: 5,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.republicOffer()
              }}
              style={[styles.autoOffer]}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: 'white' }}>
                AUTOMATIC OFFER
              </Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 8, fontWeight: 'bold' }}>
              REPOST AUTOMATICALLY THIS OFFER
            </Text>
            <View style={{ alignItems: 'center', marginTop: 10, width: '100%' }}>
              <Text style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 5 }}>
                TITLE OF THE OFFER
              </Text>
              <TextInput
                style={styles.textinput}
                underlineColorAndroid="transparent"
                placeholder=""
                placeholderTextColor="#9a73ef"
                autoCapitalize="none"
                value={this.state.title}
                editable={false}
                color="black"
              />
            </View>
          </View>

          <View
            style={{ alignItems: 'center', flex: 2, flexDirection: 'column' }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: 'bold',
                marginTop: 20,
              }}>
              DETAIL DESCRIPTION OF YOUR OFFER
            </Text>
            <ScrollView style={{ width: '100%', height: '100%' }}>
              <TextInput
                style={styles.textdesc}
                underlineColorAndroid="transparent"
                placeholder=""
                placeholderTextColor="#9a73ef"
                autoCapitalize="none"
                multiline={true}
                value={this.state.description}
                editable={false}
                color="black"
              />
            </ScrollView>
            <Image
              source={require('@assets/images/logo.png')}
              style={{ width: 80, height: 20 }}
            />
          </View>
          <View style={{ flexDirection: 'row', flex: 0.7 }}>
            <View style={[styles.footstyle]}>
              <Text style={{ fontSize: 10, fontWeight: 'bold' }}>
                DELETED THIS OFFER
              </Text>
              <TouchableOpacity style={[styles.btnDelete]} onPress={() => { this.setState({ delDialog: true }) }}>
                <Text
                  style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>
                  DELETED
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.footstyle]}>
              <Text style={{ fontSize: 8, fontWeight: 'bold' }}>
                OTHER OFFERS PUBLISHED
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => {
                    this.pageUp();
                  }}
                  style={{ width: 50, height: 25, borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginRight: 10, backgroundColor: BaseColor.electronicColor }}>
                  <View style={{ rotation: -90 }}>
                    <Image source={Images.up} style={{ width: 10, height: 5 }} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.pageDown();
                  }}
                  style={{ width: 50, height: 25, borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: BaseColor.electronicColor }}>
                  <View style={{ rotation: -90 }}>
                    <Image source={Images.down} style={{ width: 10, height: 5 }} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.footstyle]}>
              <Text style={{ fontSize: 8, fontWeight: 'bold' }}>
                YOUR TOTAL OFFERS PUBLISHED
              </Text>
              <View style={[styles.offerNumber]}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    color: BaseColor.primaryColor,
                  }}>{this.state.totalCount}/{this.state.pageNum}
                </Text>
              </View>
            </View>
          </View>
          <Dialog
            visible={this.state.delDialog}
            width={250}
            height={150}
            onTouchOutside={() => {
              this.setState({ delDialog: false });
            }}
            footer={
              <DialogFooter>
                <DialogButton
                  text="CANCEL"
                  onPress={() => { this.setState({ delDialog: false }) }}
                />
                <DialogButton
                  text="OK"
                  onPress={() => { this.delArticle() }}
                />
              </DialogFooter>
            }>
            <DialogContent style={{ alignItems: 'center', }}>
              <Text style={{ fontSize: 18, textAlign: 'center', paddingTop: 28 }}>Do you want to delete this offer?</Text>
            </DialogContent>
          </Dialog>
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
        {Loading ?
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
            color={"white"}
          /> : null
        }
      </ScrollView>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    AuthActions: bindActionCreators(AuthActions, dispatch),
    apiActions: bindActionCreators(apiActions, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(previousOffers);
