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
    BackHandler,
} from 'react-native';
import styles from "./styles";
import { Image } from 'react-native-elements';
import { BaseColor } from '../../config/color';
import RNPaypal from 'react-native-paypal-lib';
import { AdMobRewarded } from 'react-native-admob';
import { getIntertial } from '@components/adMob/Intertial';
import Banner from '@components/adMob/Banner';
import Modal, { ModalContent } from "react-native-modals";
import { AuthActions, apiActions } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { store } from "@store";

class increaseTime extends Component {
    constructor(props) {
        super(props);
        var width = Dimensions.get('window').width
        var height = Dimensions.get('window').height
        this.state = {
            width: width,
            height: height - 20,
            email: '',
            selectedValue: 'Jave',
            userId: store.getState().auth.login.data.user.id,
            dialogVisible: false,
            dialogHeader: "",
            dialogContent: "",
        }
    }

    componentDidMount() {
        getIntertial();
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this))
        AdMobRewarded.showAd().catch(error => console.warn(error));
    }
    backAction() {
        if(this.state.dialogVisible){
          this.setState({dialogVisible: false});
          return true
        }
        if (this.props.navigation.isFocused()) {
          this.setState({ dialogVisible: false })
          return false
        }
      }
    componentWillUnmount() {
        AdMobRewarded.removeAllListeners();
    }

    handleEmail = (text) => {
        this.setState({ email: text })
    }
    async subscribe() {
        const self = this;
        RNPaypal.paymentRequest({
            clientId: 'AYQBff-wdGe4va25dHkDfxOFGBjlv_gCu5nfZV52xLk8TFC9GkpbnSGjsyn8XGB-mH7fh7e8Q65WsbuF',
            environment: RNPaypal.ENVIRONMENT.PRODUCTION,
            intent: RNPaypal.INTENT.SALE,
            price: 4.7,
            currency: 'USD',
            description: `INCREASE OFFER DISPLAY TIME`,
            acceptCreditCards: true
        }).then(response => {
            console.log(response)
            self.props.apiActions.increaseTime(this.state.userId, (response) => {
                if(response.success){
                    self.setState({ dialogHeader: 'Congratulations!' })
                    self.setState({ dialogContent: 'You have become a premium artist.' })
                    self.setState({ dialogVisible: true })
                }
            });
        }).catch(err => {
            console.log(err.message)
        })
    }

    hideDialog() {
        this.setState({ dialogVisible: false })
    }

    render() {
        return (
            <ScrollView style={{ backgroundColor: 'white', flexDirection: 'column', flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: BaseColor.purchaseColor }}>
                    <View style={[styles.mainlayout]}>
                        <View style={{flexDirection: 'row'}}><Text style={{ fontSize: 27, fontWeight: 'bold', color: 'white', textAlign: 'center', marginTop: 30 }}>PREMIUM ARTIST</Text><Text style={{ fontSize: 27, fontWeight: 'bold', color: BaseColor.primaryColor, textAlign: 'center', marginTop: 30 }}> BONUS</Text></View>
                        <Text style={{ fontSize: 13, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 }}>GET MORE SALES OPPORTUNITY EVERYDAY</Text>
                    </View>
                </View>
                <View style={{ flex: 4 }}>
                    <View style={[styles.mainlayout]}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginTop: 10 }}>INCREASE THE POSTING TIME OF YOUR OFFERS</Text>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                        <TouchableOpacity onPress={() => this.subscribe()} style={{ height: 50, width: 200, backgroundColor: BaseColor.primaryColor, borderRadius: 9, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>SUBSCRIBE</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center', flexDirection:'row', marginTop: 20}}>
                        <View style={{flex: 1}}></View>
                        <View style={{ borderWidth: 5, borderTopWidth: 0, borderColor: BaseColor.primaryColor, width: 200, height: 300, borderRadius: 20, alignItems: 'center' }}>
                            <View style={{ position: 'absolute', width: 200, height: 50, backgroundColor: BaseColor.textOffer, borderRadius: 10, alignItems: 'center', justifyContent:'center' }}>
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 9, padding: 0, zIndex: 1000, position:'absolute', height: 47 }}>EXTRA TIME</Text>
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24, color: BaseColor.primaryColor }}>7 Hours</Text>
                            </View>
                            <View style={{ marginTop: 100 }}>
                                <Text style={{ color: BaseColor.primaryColor, fontSize: 28, fontWeight: 'bold' }}>
                                    4.70$
                                </Text>
                            </View>
                            <View style={{ marginTop: 45, width: 280, paddingVertical: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: BaseColor.backColor }}>
                                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
                                    Display time of all your offers for 1 week
                                </Text>
                            </View>
                            <View style={{ width: 280, paddingVertical: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: '#e0c505' }}>
                                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold', textAlign: 'center', color: BaseColor.backColor }}>
                                    Premium artist badge on your online offers
                                </Text>
                            </View>
                            <View style={{ marginTop: 10, height: 25, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 45, fontWeight: 'bold', color: BaseColor.purchaseColor, textAlign: 'center' }}>
                                    +
                                </Text>
                            </View>
                        </View>
                        <View style={{flex:1, marginBottom: 50}}>
                            <Image
                                source={require('@assets/images/sell_marker.png')}
                                style={{ width: 70, height: 70 }}
                            />
                        </View>
                    </View>

                    <View style={{alignItems: 'center',marginTop: 10,flexDirection:'row', justifyContent: 'center'}}><Text style={{fontWeight: 'bold', fontSize: 10, color: BaseColor.purchaseColor}}>UNLIMITED BACKUP</Text><Text style={{fontWeight: 'bold', fontSize: 10, color: BaseColor.backColor}}> OF YOUR PREVIOUSLY PUBLISHED OFFERS</Text></View>
                </View>
                <View style={{ flex: 1, alignItems: 'center', paddingTop: 10 }}>
                    <Image
                        source={require('@assets/images/logo.png')}
                        style={{ width: 250, height: 70 }}
                    />
                </View>
                <Modal
                    visible={!!this.state.dialogVisible}
                    swipeThreshold={100}
                    modalStyle={{ backgroundColor: "transparent" }}
                    onSwipeOut={(event) => { this.setState({ dialogVisible: true }); }}
                    onTouchOutside={() => { this.setState({ dialogVisible: true }); }}
                >

                    <ModalContent style={{ width: 320, height: 300, paddingVertical: 25, paddingHorizontal: 25, backgroundColor: "transparent" }}>
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
            </ScrollView>
        );
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
        apiActions: bindActionCreators(apiActions, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(increaseTime);