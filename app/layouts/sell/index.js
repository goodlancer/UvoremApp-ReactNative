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
    KeyboardAvoidingView,
    Picker,
    PermissionsAndroid,
    ActivityIndicator,
    BackHandler
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from './styles';
import { Image, withTheme } from 'react-native-elements';
import { BaseColor } from '../../config/color';
// import ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-easy-toast';
import { AuthActions, apiActions } from '@actions';
import Modal, { ModalContent } from "react-native-modals";
import { store } from '@store';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { AdMobRewarded } from 'react-native-admob';
import { getIntertial } from '@components/adMob/Intertial';
import { LoginManager, ShareDialog } from "react-native-fbsdk";
import ReactNativePhoneInput from 'react-native-phone-input';
import { Images } from '@config/images';
import ImagePicker from 'react-native-image-crop-picker';
class sell extends Component {
    constructor(props) {
        super(props);
        var width = Dimensions.get('window').width;
        var height = Dimensions.get('window').height;

        this.state = {
            photoUri: "",
            width: width,
            height: height - 20,
            selectedValue: 'SERVICES',
            offerType: 0,
            title: '',
            description: '',
            imageData: '',
            image_1: '',
            image_2: '',
            image_3: '',
            imageIndex: 1,
            userId: store.getState().auth.login.data.user.id,
            dialogVisible: false,
            errorMsg: "",
            dialogHeader: "Warning",
            dialogContent: "",
            Loading: false,
            sharePhotoContent: sharePhotoContent,
            role: store.getState().auth.login.data.user.role,
            totalCount: 0,
            dialogVisible_1: false,
            dialogContent_1: '',
            dialogHeader_1: '',
            dialogDel_1: '',
            dialogPremium_1: '',
            isOneButton: true,
            showFullImage: false
        };
        const sharePhotoContent = {
            contentType: 'photo',
            photos: [{ imageUrl: 'file://' + this.state.photoUri }],
        }
        this.backHandler = null;
        props.navigation.addListener('willFocus', this.refreshPage.bind(this));
    }

    refreshPage() {
        this.setState({ role: store.getState().auth.login.data.user.role });
    }

    componentDidMount() {
        this.props.AuthActions.refreshUser((response) => {
            if (response.success) {
                this.setState({ role: store.getState().auth.login.data.user.role });
            } else if (response.data == "deActive") {
                return this.props.navigation.navigate("login");
            }
        });
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this))
    }

    componentWillUnmount() {
        if (this.backHandler)
            this.backHandler.remove();
    }

    backAction() {
        if (this.state.showFullImage) {
            this.setState({ showFullImage: false });
            return true
        }
        if (this.state.Loading) {
            return true
        }
        if (this.state.dialogVisible == true || this.state.dialogVisible_1 == true) {
            if (this.props.navigation.isFocused()) {
                this.setState({ dialogVisible: false })
                this.setState({ dialogVisible_1: false })
                return true
            }
            return false
        }
        return false
    }
    facebookLogin() {
        const { photoUri } = this.state;
        if (photoUri == "") {
            return;
        }
        let self = this;
        LoginManager.logInWithPermissions(["public_profile"]).then(
            function (result) {
                if (result.isCancelled) {
                    console.log("Login cancelled");
                } else {
                    console.log(
                        "Login success with permissions: " +
                        result.grantedPermissions.toString()
                    );
                    ShareDialog.show(self.state.sharePhotoContent);
                }
            },
            function (error) {
                console.log("Login fail with error: " + error);
            }
        );
    }

    uploadPicture() {
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
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
        }).then(image => {
            console.log(image);

            this.setState({ imageData: image })
            if (this.state.imageIndex == 1) {
                this.setState({ image_1: image });
            } else if (this.state.imageIndex == 2) {
                this.setState({ image_2: image });
            } else if (this.state.imageIndex == 3) {
                this.setState({ image_3: image });
            }
        });
        // ImagePicker.launchCamera(options, (res) => {
        //   if (res.didCancel) {
        //     console.log('User cancelled image picker');
        //   } else if (res.error) {
        //     console.log('ImagePicker Error: ', res.error);
        //   } else if (res.customButton) {
        //     console.log('User tapped custom button: ', res.customButton);
        //   } else {
        //     this.setState({ photoUri: res.path })
        //     this.setState({ imageData: res });
        //     if (this.state.imageIndex == 1) {
        //       this.setState({ image_1: res });
        //     } else if (this.state.imageIndex == 2) {
        //       this.setState({ image_2: res });
        //     } else if (this.state.imageIndex == 3) {
        //       this.setState({ image_3: res });
        //     }
        //   }
        // });
    }

    handleEmail = (text) => {
        this.setState({ email: text });
    };

    backwardClicked() {
        if (this.state.imageIndex > 1) this.state.imageIndex--;
        switch (this.state.imageIndex) {
            case 1:
                this.setState({ imageData: this.state.image_1 });
                break;
            case 2:
                this.setState({ imageData: this.state.image_2 });
                break;
            case 3:
                this.setState({ imageData: this.state.image_3 });
                break;
        }
    }

    forwardClicked() {
        if (this.state.imageIndex < 3) this.state.imageIndex++;
        switch (this.state.imageIndex) {
            case 1:
                this.setState({ imageData: this.state.image_1 });
                break;
            case 2:
                this.setState({ imageData: this.state.image_2 });
                break;
            case 3:
                this.setState({ imageData: this.state.image_3 });
                break;
        }
    }

    hideDialog() {
        this.setState({ dialogVisible: false })
    }
    hideDialog_1() {
        this.setState({ dialogVisible_1: false })
    }
    async onSubmit() {
        this.setState({ Loading: true });
        const {
            image_1,
            image_2,
            image_3,
            offerType,
            title,
            description,
            totalCount,
            role
        } = this.state;
        this.setState({ dialogHeader: 'Warning' })
        this.setState({ isOneButton: true });
        const data = {
            userId: this.state.userId,
            role: this.state.role
        }
        this.props.apiActions.getOwnerArticleCount(data, (response) => {
            if (response.success) {
                this.setState({ totalCount: response.count })
                if (image_1 == '' || image_2 == '' || image_3 == '') {
                    this.setState({ dialogContent: '3 photos required of your item.' });
                    this.setState({ dialogVisible: true })
                    this.setState({ Loading: false });
                }
                else if (title == '') {
                    this.setState({ dialogContent: 'Title of your offer required.' });
                    this.setState({ dialogVisible: true })
                    this.setState({ Loading: false });
                }
                else if (description == '') {
                    this.setState({ dialogContent: 'Description and detail of your offer required.' });
                    this.setState({ dialogVisible: true })
                    this.setState({ Loading: false });
                }
                else {
                    if (this.state.totalCount == 3 && role == 2) {
                        this.setState({ dialogHeader_1: 'Warning' })
                        this.setState({ dialogDel_1: 'See previous offer published' })
                        this.setState({ dialogPremium_1: 'See the premium account' })
                        this.setState({ dialogContent_1: 'Your saved offer limit has been reached, avoid this limit with a premium account or delete one of your saved offers.' })
                        this.setState({ dialogVisible_1: true })
                        this.setState({ Loading: false });
                    } else if (this.state.totalCount > 3 && role == 2) {
                        this.setState({ dialogHeader_1: 'Warning' })
                        this.setState({ dialogContent_1: 'Your number of offers has saved the authorized over 3.' })
                        this.setState({ dialogDel_1: 'Delete the extra saved offers' })
                        this.setState({ dialogPremium_1: 'See the premium account' })
                        this.setState({ dialogVisible_1: true })
                        this.setState({ Loading: false });
                    } else {
                        this.setState({ isOneButton: false });
                        this.setState({ dialogContent: 'Are you sure want to submit your offer?' });
                        this.setState({ dialogVisible: true })
                        this.setState({ Loading: false });
                    }
                }
            }
        })
    }

    async requestOffer() {
        this.setState({ Loading: true });
        await this.setState({ dialogVisible: false })
        this.props.apiActions.insertArticle(this.state, (response) => {
            this.setState({ isOneButton: true })
            if (response.success) {
                this.props.apiActions.saveImage(this.state);
                this.setState({ dialogHeader: 'Success' })
                this.setState({ dialogContent: 'Your offer is awaiting validation, you will be notified as soon as possible.' })
                this.setState({ dialogVisible: true })
                this.setState({ Loading: false })
                this.setState({
                    selectedValue: 'SERVICES',
                    offerType: 0,
                    title: '',
                    description: '',
                    imageData: '',
                    image_1: '',
                    image_2: '',
                    image_3: '',
                    imageIndex: 1,
                });
            } else {
                this.setState({ dialogHeader: 'Network request failed.' })
                this.setState({ dialogContent: 'Please check network.' })
                this.setState({ dialogVisible: true })
                this.setState({ Loading: false })
            }
        });
    }

    async submitContinue() {
        const { totalCount, userId } = this.state;
        await this.setState({ Loading: false })
        await this.setState({ dialogVisible_1: false });
        if (totalCount > 3) {
            this.props.apiActions.deleteExtraArticles(userId, (response) => {
                this.setState({ Loading: false })
            })
        } else {
            this.props.navigation.navigate('previousOffers');
        }
    }

    async showPremium() {
        await this.setState({ dialogVisible_1: false });
        await this.setState({ Loading: false })
        this.props.navigation.navigate('increaseTime');
    }

    render() {
        const { width, height, Loading, role, totalCount, isOneButton } = this.state
        return (
            <View>
                {this.state.showFullImage ?
                    <Image
                        source={{ uri: this.state.imageData.path }}
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                    />
                    :
                    <ScrollView
                        style={{
                            backgroundColor: 'white',
                            flexDirection: 'column',
                            height: '100%',
                        }}>
                        {Loading ?
                            <View style={{ position: 'absolute', width: width, height: "100%", opacity: 0.5, backgroundColor: 'white', zIndex: 100 }}></View>
                            : null
                        }
                        <View style={{ flex: 1, backgroundColor: BaseColor.sellColor }}>
                            <View style={[styles.mainlayout, { flexDirection: 'row', marginBottom: 10 }]}>
                                <View style={{ flex: 1 }}>
                                    {role == 3 ?
                                        <View style={{ alignItems: 'center', marginTop: 10 }}><Image source={require('@assets/images/premium.png')} style={{ width: 80, height: 80 }} /></View>
                                        : null
                                    }
                                </View>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Text
                                        style={{
                                            fontSize: 40,
                                            fontWeight: 'bold',
                                            color: 'white',
                                            textAlign: 'center',
                                            marginTop: 15,
                                        }}>
                                        SELL
                                </Text>
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        alignItems: 'flex-end',
                                        marginTop: 10,
                                        marginRight: 5,
                                    }}>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}></View>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <TouchableOpacity style={[styles.btnTime]} onPress={() => this.props.navigation.navigate('increaseTime')}>
                                        <Text
                                            style={{ fontSize: 11, fontWeight: 'bold', color: 'white' }}>
                                            BECOME A PREMIUM ARTIST
                                    </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 1 }}></View>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', height: 230 }}>
                            <View
                                style={{
                                    backgroundColor: BaseColor.imgBackgroundColor,
                                    width: '20%',
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.backwardClicked();
                                            }}
                                            style={{ width: '90%', height: 230, backgroundColor: BaseColor.primaryColor, justifyContent: 'center', alignItems: 'center' }}>
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
                                <TouchableOpacity style={{
                                    height: '90%',
                                    width: '80%',
                                    borderRadius: 10,
                                    backgroundColor: 'white',
                                    justifyContent: 'center'
                                }} onPress={() => { this.setState({ showFullImage: true }) }}>
                                    {this.state.imageData == '' ? (
                                        <Text style={{ textAlign: 'center', color: BaseColor.primaryColor, fontWeight: 'bold', fontSize: 20 }}>PICTURE</Text>
                                    ) : (
                                            <Image
                                                source={{ uri: this.state.imageData.path }}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    borderRadius: 10
                                                }}
                                            />
                                        )}
                                </TouchableOpacity>
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
                                    style={{ width: '40%', height: 230, backgroundColor: BaseColor.primaryColor, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={require('@assets/images/right.png')}
                                        style={{ width: 10, height: 20 }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View
                            style={{ flexDirection: 'column', alignItems: 'center', flex: 2 }}>

                            <Text style={{ fontSize: 9, fontWeight: 'bold' }}>
                                3 PICTURES OF THE OFFER IN DETAIL
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    this.uploadPicture();
                                }}
                                style={[styles.autoOffer]}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>
                                    TAKE A PHOTO
                                 </Text>
                            </TouchableOpacity>
                            <Text
                                style={{
                                    fontSize: 10,
                                    fontWeight: 'bold',
                                    color: BaseColor.primaryColor,
                                }}>
                                MANDATORY FOR VALIDATION
                            </Text>
                            <View style={{ alignItems: 'center', marginTop: 10, width: '100%' }}>
                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                                    TITLE OF THE OFFER
                                </Text>
                                <TextInput
                                    style={styles.textinput}
                                    underlineColorAndroid="transparent"
                                    placeholder=""
                                    placeholderTextColor="#9a73ef"
                                    autoCapitalize="none"
                                    value={this.state.title}
                                    onChangeText={(text) => this.setState({ title: text })}
                                />
                            </View>
                            <View style={{ alignItems: 'center', marginTop: 10, width: '100%' }}>
                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                                    SELECT CATEGORY
                                </Text>
                                <View
                                    style={{
                                        height: 30,
                                        width: '90%',
                                        borderColor: BaseColor.primaryColor,
                                        borderWidth: 1,
                                        borderRadius: 7,
                                        justifyContent: 'center',
                                    }}>
                                    <Picker
                                        selectedValue={this.state.selectedValue}
                                        style={{ height: 30, width: '100%' }}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.setState(
                                                { selectedValue: itemValue },
                                                this.setState({ offerType: itemIndex }),
                                            )
                                        }
                                    >
                                        <Picker.Item label="DRAWINGS" value="0" />
                                        <Picker.Item label="PAINTINGS" value="1" />
                                        <Picker.Item label="ARTISTIC OBJECTS" value="2" />
                                    </Picker>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                alignItems: 'center',
                                flexDirection: 'column',
                                marginTop: 10,
                            }}>
                            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                                DETAIL DESCRIPTION OF YOUR OFFER
                            </Text>
                            <TextInput
                                style={styles.textdesc}
                                underlineColorAndroid="transparent"
                                placeholder=""
                                placeholderTextColor="#9a73ef"
                                autoCapitalize="none"
                                multiline={true}
                                value={this.state.description}
                                onChangeText={(text) => this.setState({ description: text })}
                            />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={[styles.footstyle]}>
                                <TouchableOpacity
                                    style={[styles.btnSubmit]}
                                    onPress={() => this.onSubmit()}>
                                    <Text
                                        style={{ fontSize: 12, fontWeight: 'bold', color: 'white' }}>
                                        SUBMIT
                                    </Text>
                                </TouchableOpacity>
                                <Text style={{ fontWeight: 'bold', fontSize: 10, textAlign: 'center' }}>For more purchase request talk about uvorem to your friends!</Text>
                                <Image
                                    source={require('@assets/images/logo.png')}
                                    style={{ width: 80, height: 20 }}
                                />
                            </View>
                        </View>
                    </ScrollView>
                }


                <Modal
                    visible={!!this.state.dialogVisible}
                    swipeThreshold={100}
                    modalStyle={{ backgroundColor: "transparent" }}
                    onSwipeOut={(event) => { this.setState({ dialogVisible: true }); }}
                    onTouchOutside={() => { this.setState({ dialogVisible: true }); }}
                >

                    <ModalContent style={{ width: 300, height: 380, paddingHorizontal: 25, backgroundColor: "transparent" }}>
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
                                    <TouchableOpacity activeOpacity={0.8} style={{ paddingTop: 30, paddingHorizontal: 10, marginBottom: 20 }} onPress={() => this.requestOffer()}>
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
                <Modal
                    visible={!!this.state.dialogVisible_1}
                    swipeThreshold={100}
                    modalStyle={{ backgroundColor: "transparent" }}
                    onSwipeOut={(event) => { this.setState({ dialogVisible_1: true }); }}
                    onTouchOutside={() => { this.setState({ dialogVisible_1: true }); }}
                >
                    <ModalContent style={{ width: 300, height: 380, backgroundColor: "transparent" }}>
                        <View style={{ borderWidth: 5, paddingHorizontal: 10, paddingVertical: 20, borderRadius: 30, borderColor: "#fff", backgroundColor: "#00549a" }}>
                            <Text style={{ fontSize: 25, marginBottom: 10, textAlign: "center", color: "#fff" }}>{this.state.dialogHeader_1}</Text>
                            <Text style={{ color: "#fff", textAlign: "center", fontSize: 18, }}>{this.state.dialogContent_1}</Text>
                            <TouchableOpacity activeOpacity={0.8} style={{ paddingTop: 10, paddingHorizontal: 10, marginBottom: 10 }} onPress={() => this.submitContinue()}>
                                <View style={{ backgroundColor: BaseColor.btnModal, height: 40, borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ textAlign: "center", color: "#fff", fontSize: 16, fontWeight: "bold" }}>{this.state.dialogDel_1}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} style={{ paddingHorizontal: 10 }} onPress={() => this.showPremium()}>
                                <View style={{ backgroundColor: BaseColor.btnModal, height: 40, borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ textAlign: "center", color: "#fff", fontSize: 16, fontWeight: "bold" }}>{this.state.dialogPremium_1}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ModalContent>
                </Modal>
                <Toast
                    ref="toast"
                    position="top"
                    fadeInDuration={750}
                    fadeOutDuration={2000}
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

export default connect(null, mapDispatchToProps)(sell);
