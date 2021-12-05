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
    WebView
} from 'react-native';
import { Image } from 'react-native-elements';
import { BaseColor } from '../../config/color';
import Modal, { ModalContent } from "react-native-modals";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { AuthActions, apiActions } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { store } from "@store";
import { ScrollView } from 'react-native-gesture-handler';
import styles from './styles';

class helper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,
        }
        this.backHandler = null;
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        const { navigation } = this.props;
        let view;
        return (
            <View style={{ flexDirection: 'column', flex: 1 }}>
                <View>
                    <Text style={{ fontSize: 30, textAlign: 'center', fontWeight: 'bold', padding: 10 }}>How it works?</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <ScrollView style={{ padding: 10 }}>
                        <Text style={{ fontSize: 18 }}>
                            * - Uvorem is a mobile application allowing the publication of your "artistic works of drawings / paintings" to benefit from the possibility of purchases or sales simply at any time of the day.{'\n'}
                        </Text>
                        <Text style={{ fontSize: 18 }}>
                            * - All the offers published on the application are renewable and only remain displayed to all "online" users for a specified period "a period determining the start and end of the display of your offers, which will be displayed on all offers posted online ”.{'\n'}
                        </Text>
                        <Text style={{ fontSize: 18 }}>
                            * - 1 hour of online posting, renewable at any time of the day for offers offered by non-premium artist accounts and 7 hours for offers offered by premium artist accounts which also have better visibility and fewer constraints backup of global offers and daily renewal.{'\n'}
                        </Text>
                        <Text style={{ fontSize: 18 }}>
                            * - The Uvorem application currently provides 3 categories and sectors of offers:
                        </Text>
                        <Text style={{ fontSize: 18 }}>
                            - DRAWINGS
                        </Text>
                        <Text style={{ fontSize: 18 }}>
                            - PAINTINGS
                        </Text>
                        <Text style={{ fontSize: 18 }}>
                            - ARTISTIC OBJECTS{'\n'}
                        </Text>
                        <Text style={{ fontSize: 18 }}>
                            Select the appropriate category for putting all your offers online.{'\n'}
                        </Text>
                        <Text style={{ fontSize: 18 }}>
                            * - The application records all your "artistic works, drawings / paintings" offers published on the application see page "PREVIOUS OFFER PUBLISHED" to simply allow you to automatically repost them at any time of the day and thus have new sales opportunities at any time.{'\n'}
                        </Text>
                        <Text style={{ fontSize: 18 }}>
                            * - The number of backups in the database of your "artistic works, drawings / paintings" offers is limited to "3" for non-premium artist accounts and for users who have subscribed to a premium artist account an "unlimited" backup.{'\n'}
                        </Text>
                        <Text style={{ fontSize: 18 }}>
                            Reminder * All your "artistic works drawings / paintings" offers already published can be republished and put back online at any time according to you, from the "PREVIOUS OFFER PUBLISHED" page and the [AUTOMATIC OFFER] button.{'\n'}
                        </Text>
                        <Text style={{ fontSize: 18 }}>
                            * - Uvorem allows you to get in touch with the most serious possible "sellers and buyers" users, in order to quickly and safely conclude a good deal and if possible on a daily basis.{'\n'}
                        </Text>
                        <Text style={{ fontSize: 18 }}>
                            * - Each user can discover the seller's email when posting an offer for possible negotiations and agreement by email.{'\n'}
                        </Text>
                        <Text style={{ fontSize: 18 }}>
                            * - No transaction is carried out on the application for the moment we simply recommend an example of secure payment: "Paypal".{'\n'}
                        </Text>
                        <Text style={{ fontSize: 18 }}>
                            * - Please also check the links of payment services provided by all sellers to avoid fraud not eligible by uvorem.{'\n'}
                        </Text>
                        <Text style={{ fontSize: 18 }}>
                            * - Uvorem wishes you a good experience and remains at your disposal for any requests, see the account settings page to contact support.{'\n'}
                        </Text>
                    </ScrollView>
                </View>
                <View style={{ alignItems: 'center', margin: 10 }}>
                    <Image
                        source={require('@assets/images/logo.png')}
                        style={{ width: 100, height: 25 }}
                    />
                </View>
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

export default connect(null, mapDispatchToProps)(helper);