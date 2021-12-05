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
    BackHandler
} from 'react-native';
import { Image } from 'react-native-elements';
import { BaseColor } from '../../config/color';
import { store } from "@store";
import Modal, { ModalContent } from "react-native-modals";
import styles from './styles';
import { AuthActions, apiActions } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import { AdMobRewarded } from 'react-native-admob';

class purchaseMain extends Component {
    constructor(props) {
        super(props);
        var width = Dimensions.get('window').width
        var height = Dimensions.get('window').height
        this.state = {
            width: width,
            height: height - 20,
            userId: store.getState().auth.login.data.user.id,
            dialogVisible: false,
            dialogHeader: "",
            dialogContent: "",
            role: store.getState().auth.login.data.user.role
        }
    }

    componentDidMount() {
        this.props.AuthActions.refreshUser((response) => {
            if (response.success) {
                this.setState({ role: store.getState().auth.login.data.user.role });
            } else if (response.data == "deActive") {
                return this.props.navigation.navigate("login");
            }
        });
    }

    hideDialog() {
        this.setState({ dialogVisible: false })
    }

    goPremiumPage() {
        // const {role} = this.state;
        // if(role == 3){
        //     this.props.navigation.navigate('purchaseType', { userType: 0 })
        // }else{
        //     this.setState({dialogHeader: "Warning"})
        //     this.setState({dialogContent: "You are not preminu seller."})
        //     this.setState({dialogVisible: true});
        // }
    }

    render() {
        const { width, height, role } = this.state;
        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={{ alignContent: 'center', alignItems: 'center', marginTop: 5 }}>
                        <Text style={{ fontSize: 44, fontWeight: 'bold', color: BaseColor.purchaseColor }}>PURCHASE</Text>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: 5 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: BaseColor.textOffer }}>SELECT YOUR CATEGORY OF OFFERS</Text>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: 5 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 14, textAlign: 'center' }}>
                            For more good deals every day tell your friends about uvorem!
                        </Text>
                        {/* <TouchableOpacity style={[styles.btnPrevious]} onPress={() => this.props.navigation.goBack()}>
                                <Text style={{ fontSize: 11, fontWeight: 'bold', color: 'white' }}>PREVIOUS PAGE</Text>
                            </TouchableOpacity> */}
                    </View>
                </View>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.props.navigation.navigate('purchaseType', { userType: 0 }) }}>
                    <View style={[styles.mainlayout, { backgroundColor: BaseColor.previousColor }]} >
                        <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>PREMIUM ARTIST OFFERS</Text>
                        <View style={{ position: 'absolute' }}>
                            <Image
                                source={require('@assets/images/sell_marker.png')}
                                style={{ width: 70, height: 70, marginTop: height / 3 / 3, marginLeft: width - 100 }}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, marginTop: 30 }} onPress={() => this.props.navigation.navigate('purchaseType', { userType: 1 })}>
                    <View style={[styles.mainlayout, { backgroundColor: BaseColor.purchaseColor }]}  >
                        <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>GENERAL ARTIST OFFERS</Text>
                    </View>
                </TouchableOpacity>
                <View style={[styles.mainlayout, { flex: 1, backgroundColor: 'white' }]} >
                    <Image
                        source={require('@assets/images/logo.png')}
                        style={{ width: 200, height: 50 }}
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

export default connect(null, mapDispatchToProps)(purchaseMain);