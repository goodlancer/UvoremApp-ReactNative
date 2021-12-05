// import { AdMobBanner } from 'react-native-admob'
import { View, Text, Platform } from 'react-native';
import React, { Component } from 'react';

class Banner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isError: false,
            errorText: '',
        }
    }

    render() {
        return (
            <></>
            // <View
            //     style={
            //         {
            //             backgroundColor: 'white',
            //             alignItems: 'center',
            //             width: '100%',
            //         }}
            // >

            //     {
            //         this.state.isError ?
            //             <View />
            //             :
            //             <AdMobBanner
            //                 adSize="banner"
            //                 adUnitID={Platform.OS === 'android'
            //                     ?
            //                     "ca-app-pub-5889275287697304/7398044103"
            //                     :
            //                     "ca-app-pub-5889275287697304/7398044103"}
            //                 testDevices={[AdMobBanner.simulatorId]}
            //                 onAdFailedToLoad={error => {
            //                     // console.warn(error);                    
            //                     this.setState({ isError: true, errorText: error + "" });

            //                     setTimeout(() => {
            //                         this.setState({ isError: false });
            //                     }, 10000);
            //                 }} />}

            // </View>
        );
    }
}

export default Banner;  