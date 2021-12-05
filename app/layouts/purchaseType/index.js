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
} from 'react-native';
import { Image, withTheme } from 'react-native-elements';
import { BaseColor } from '../../config/color';
import styles from './styles';
export default class purchaseType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userType: props.navigation.state.params.userType,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    };
  }

  render() {
    const { width, height } = this.state
    return (
      <View
        style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
        <View style={{ flex: 1.3, backgroundColor: 'white' }}>
          <View
            style={{
              alignContent: 'center',
              alignItems: 'center',
              marginTop: 5,
            }}>
            {this.state.userType == 0 && (
              <Text
                style={{
                  fontSize: 40,
                  fontWeight: 'bold',
                  color: BaseColor.primaryColor,
                }}>
                PREMIUM ARTIST
              </Text>
            )}
            {this.state.userType == 1 && (
              <Text
                style={{
                  fontSize: 40,
                  fontWeight: 'bold',
                  color: BaseColor.purchaseColor,
                }}>
                GENERAL ARTIST
              </Text>
            )}
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 18,
                color: BaseColor.textOffer,
              }}>
              SELECT YOUR CATEGORY OF OFFERS
            </Text>
            {this.state.userType == 0 && (
              <Text
                style={{
                  fontSize: 40,
                  fontWeight: 'bold',
                  color: BaseColor.primaryColor,
                }}>
                OFFERS
              </Text>
            )}
            {this.state.userType == 1 && (
              <Text
                style={{
                  fontSize: 40,
                  fontWeight: 'bold',
                  color: BaseColor.purchaseColor,
                }}>
                OFFERS
              </Text>
            )}
            <View style={{flexDirection:'row'}}>
              <View style={{ flex: 2 }}></View>
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    width: 100,
                    height: 50,
                    marginLeft: 10,
                    marginTop: -10
                  }}>
                  {/* <TouchableOpacity style={[styles.btnPrevious]} onPress={() => this.props.navigation.goBack()}>
                    <Text
                      style={{ fontSize: 11, fontWeight: 'bold', color: 'white' }}>
                      PREVIOUS PAGE
                </Text>
                  </TouchableOpacity> */}
                </View>
              </View>
            </View>
          </View>

        </View>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('purchasePremium', { userType: this.state.userType, offerType: 0 })}>
          <View
            style={[
              styles.mainlayout,
              { backgroundColor: BaseColor.electronicColor },
            ]}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                marginBottom: 25
              }}>
              DRAWINGS
            </Text>
            <View style={{ position: 'absolute' }}>
              {this.state.userType == 0 && (
                <Image
                  source={require('@assets/images/sell_marker.png')}
                  style={{
                    width: 55,
                    height: 55,
                    marginLeft: width - 100,
                    marginTop: height / 3 / 3 - 20,
                  }}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, marginTop: 5 }}
          onPress={() => this.props.navigation.navigate('purchasePremium', { userType: this.state.userType, offerType: 1 })}>
          <View
            style={[
              styles.mainlayout,
              { backgroundColor: BaseColor.clothColor },
            ]}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                marginBottom: 25
              }}>
              PAINTINGS
            </Text>
            <View style={{ position: 'absolute' }}>
              {this.state.userType == 0 && (
                <Image
                  source={require('@assets/images/sell_marker.png')}
                  style={{
                    width: 55,
                    height: 55,
                    marginLeft: width - 100,
                    marginTop: height / 3 / 3 - 20,
                  }}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, marginTop: 5 }}
          onPress={() => this.props.navigation.navigate('purchasePremium', { userType: this.state.userType, offerType: 2 })}>
          <View
            style={[
              styles.mainlayout,
              { backgroundColor: BaseColor.otherColor },
            ]}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                marginBottom: 25
              }}>
              ARTISTIC OBJECTS
            </Text>
            <View style={{ position: 'absolute' }}>
              {this.state.userType == 0 && (
                <Image
                  source={require('@assets/images/sell_marker.png')}
                  style={{
                    width: 55,
                    height: 55,
                    marginTop: height / 3 / 3 - 20,
                    marginLeft: width - 100
                  }}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
        <View style={[{ flex: 1 }]}>
          <View style={[styles.mainlayout, { backgroundColor: 'white' }]}>
            <Image
              source={require('@assets/images/logo.png')}
              style={{ width: 200, height: 50 }}
            />
          </View>
        </View>
      </View>
    );
  }
}
