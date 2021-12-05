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
	ActivityIndicator,
	BackHandler,
	Clipboard
} from 'react-native';
import styles from './styles';
import { Image } from 'react-native-elements';
import { BaseColor } from '@config/color';
import { Images } from '@config/images';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthActions, apiActions } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { store } from '@store';
import * as Utils from '@utils';
import { useTheme } from 'react-navigation';
import { AdMobRewarded } from 'react-native-admob';
import { getIntertial } from '@components/adMob/Intertial';
import Banner from '@components/adMob/Banner';
import Modal, { ModalContent } from "react-native-modals";
import Icon from 'react-native-vector-icons/FontAwesome5';
var SharedPreferences = require('react-native-shared-preferences');
import Toast from 'react-native-easy-toast';

const timer = require('react-native-timer');
class purchasePremium extends Component {
	constructor(props) {
		super(props);
		var width = Dimensions.get('window').width;
		var height = Dimensions.get('window').height;
		this.state = {
			width: width,
			height: height - 20,
			selectedValue: '',
			userType: props.navigation.state.params.userType,
			offerType: props.navigation.state.params.offerType,
			userId: store.getState().auth.login.data.user.id,
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
			userName: "",
			userEmail: store.getState().auth.login.data.user.email,
			country: '',
			pageNum: 1,
			startTimer: false,
			isActive: false,
			setIsActive: false,
			Loading: false,
			dialogVisible: false,
			remainSecond: 0,
			remainMin: 1,
			second: "",
			minute: "",
			dialogHeader: "",
			dialogContent: "",
			isNoData: false,
			endSecond: 0,
			endMinute: 0,
			endHour: 0,
			startSecond: 0,
			startMinute: 0,
			startHour: 0,
			remainedTime: 0,
			dialogButton: '',
			email: '',
			showFullImage: false
		};
		this.backHandler = null;
	}
	componentDidMount() {
		this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this))

		SharedPreferences.setItem("isTimer", "true");
		this.setState({ Loading: true })
		this.getAllArticle();
		getIntertial();
	}

	getAllArticle() {
		const data = {
			userId: this.state.userId,
			offerType: this.state.offerType,
			userId: this.state.userId,
			userType: this.state.userType
		}
		this.props.apiActions.getAllArticle(data, (response) => {
			if (response.success) {
				if (response.data.length == 0) {
					this.setState({ isNoData: true })
					this.setState({ dialogHeader: "Warning" })
					this.setState({ dialogContent: "There is no offer at the moment." })
					this.setState({ dialogButton: 'OK' })
					this.setState({ dialogVisible: true })
					return
				}
				const start = new Date(response.start_time.replace(' ', 'T'))
				this.setState({ startMinute: start.getMinutes() })
				this.setState({ startSecond: start.getSeconds() })
				this.setState({ startHour: start.getHours() })
				this.setState({ Loading: false })
				this.setState({ allData: response.data })
				this.setState({ totalCount: this.state.allData.length / 3 })
				this.pageRefresh();
			}
		})
	}

	async pageRefresh() {
		this.setState({ second: "" })
		this.setState({ minute: "" })
		if (this.timerHandle) {
			clearTimeout(this.timerHandle);      // ***
		}
		let { pageNum } = this.state;
		const end = new Date(this.state.allData[(pageNum - 1) * 3]['updated_at'].replace(' ', 'T'))
		await this.setState({ endMinute: end.getMinutes() });
		await this.setState({ endSecond: end.getSeconds() });
		await this.setState({ endHour: end.getHours() })
		const { startMinute, endMinute, startSecond, endSecond, userType, remainedTime, startHour, endHour } = this.state;

		var realTime = (endHour - startHour) * 3600 + (endMinute - startMinute) * 60 + (endSecond - startSecond);
		var realMinute = 0, realSecond = 0;
		realMinute = parseInt(realTime / 60);
		realSecond = parseInt(realTime % 60);
		console.log(realMinute, realSecond)
		var diffMin = 0, diffSec = 0;
		diffMin = parseInt(remainedTime / 60)
		diffSec = parseInt(remainedTime % 60)
		console.log(diffMin, diffSec);
		if (realSecond < diffSec) {
			realMinute -= diffMin + 1;
			realSecond = 60 - diffSec + realSecond;
		} else {
			realMinute -= diffMin;
			realSecond = realSecond - diffSec;
		}
		this.setState({ remainMin: realMinute })
		this.setState({ remainSecond: realSecond })
		this.startTimer()
		this.setState({ imageIndex: 1 })
		let url = `${Utils.SERVER_HOST}${this.state.allData[(pageNum - 1) * 3]['imagePath']}`
		this.setState({ imagePath: url })
		this.setState({ title: this.state.allData[(pageNum - 1) * 3]['title'] })
		this.setState({ description: this.state.allData[(pageNum - 1) * 3]['description'] })
		this.setState({ country: this.state.allData[(pageNum - 1) * 3]['country'] })
		this.setState({ email: this.state.allData[(pageNum - 1) * 3]['email'] })
		this.setState({ userName: this.state.allData[(pageNum - 1) * 3]['name'] })
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
	backAction() {
		if (this.state.showFullImage) {
			this.setState({ showFullImage: false });
			return true
		}
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
	componentWillUnmount() {
		SharedPreferences.setItem("isTimer", "false");
		AdMobRewarded.removeAllListeners();
		if (this.backHandler)
			this.backHandler.remove();
	}

	startTimer() {
		var isTimer = "true";
		const self = this;
		SharedPreferences.getItem("isTimer", function (value) {
			isTimer = value;
			if (isTimer == "false") {
				return;
			}
			if (self.state.remainSecond < 1 && self.state.remainMin < 1) {
				AdMobRewarded.showAd().catch(error => console.warn(error));
				self.props.apiActions.refreshServe((response) => {
				});
				return;
			}
			if (self.state.remainSecond < 1) {
				self.state.remainMin--;
				if (self.state.remainMin < 10)
					self.setState({ minute: "0" + self.state.remainMin })
				else
					self.setState({ minute: self.state.remainMin })
				self.state.remainSecond = 60;
			} else {
				if (self.state.remainMin < 10)
					self.setState({ minute: "0" + self.state.remainMin })
				else
					self.setState({ minute: self.state.remainMin })
			}
			self.state.remainSecond--;
			if (self.state.remainSecond < 10)
				self.setState({ second: "0" + self.state.remainSecond })
			else
				self.setState({ second: self.state.remainSecond })
			self.timerHandle = setTimeout(() => {
				try {
					self.state.remainedTime++;
					self.startTimer();
				} catch (err) {

				}
			}, 1000);
		});
	}

	hideDialog() {
		this.setState({ dialogVisible: false });
		if (this.state.isNoData) {
			this.props.navigation.goBack()
		} else {
			Clipboard.setString(this.state.email);
			this.refs.toast.show('copy email.');
		}
	}

	async contactSeller() {
		await AdMobRewarded.showAd().catch(error => console.warn(error));
		this.setState({ dialogHeader: "SELLER EMAIL" })
		this.setState({ dialogContent: this.state.email })
		this.setState({ dialogButton: "Copy Email" })
		this.setState({ dialogVisible: true })
	}
	render() {
		const { width, height, Loading, remainMin, remainSecond, second, minute } = this.state
		return (
			<>
				{this.state.showFullImage ?
					<View>
						<Image
							source={{ uri: this.state.imagePath }}
							style={{
								width: '100%',
								height: '100%',
							}}
						/>
					</View>
					:
					<ScrollView style={{ backgroundColor: 'white', flexDirection: 'column', flex: 1, height: "100%" }}>
						{Loading ?
							<View style={{ position: 'absolute', width: width, height: height, opacity: 0.5, backgroundColor: 'white', zIndex: 100 }}></View>
							: null
						}
						<Toast
							ref="toast"
							position="bottom"
							fadeInDuration={750}
							fadeOutDuration={1000}
							opacity={0.8}
						/>
						<View>
							<View style={{ flexDirection: 'column', backgroundColor: BaseColor.purchaseColor, zIndex: 1000 }}>
								<View style={{ flexDirection: 'row', backgroundColor: BaseColor.purchaseColor }}>
									<View style={{ flex: 1 }}>
										{this.state.userType == 0 ?
											<Image
												source={require('@assets/images/sell_marker.png')}
												style={{ width: 85, height: 85, marginTop: 10 }}
											/> : null
										}
									</View>
									<View style={[styles.mainlayout, { flex: 1.5 }]}>
										<Text
											style={{
												fontSize: 15,
												fontWeight: 'bold',
												color: BaseColor.imgBackgroundColor,
											}}>
											REMAINING TIME</Text>
										<View style={{
											flexDirection: 'column',
											borderWidth: 2,
											borderColor: 'red',
											backgroundColor: 'white',
											height: 30,
											width: 100,
											textAlign: 'center',
											alignItems: 'center',
											justifyContent: 'center'
										}}>
											<View style={{ padding: 0, height: 9 }}>
												<Text style={{ fontSize: 9, fontWeight: 'bold', padding: 0 }}>MIN</Text>
											</View>
											<View>
												<Text style={{
													fontSize: 14,
													textAlign: 'center',
													fontWeight: 'bold',
													color: BaseColor.imgBackgroundColor,
												}}>
													{minute + ":" + second}
												</Text>
											</View>
										</View>

										<Text style={{
											fontSize: 28,
											fontWeight: 'bold',
											color: 'white',
											textAlign: 'center',
											height: 40
										}}>
											PURCHASE</Text>
									</View>
									<View style={{ flex: 1 }}></View>
								</View>
								<View style={{ alignItems: 'center' }}>
									<Text
										style={{
											fontSize: 15,
											fontWeight: 'bold',
											color: BaseColor.imgBackgroundColor,
											backgroundColor: BaseColor.primaryColor,
											width: '100%',
											textAlign: 'center',
											marginBottom: 15
										}}>
										COUNTRY OF ORIGIN
              						</Text>
									<Text
										style={{
											paddingTop: 5,
											fontSize: 14,
											fontWeight: 'bold',
											color: BaseColor.imgBackgroundColor,
											backgroundColor: 'white',
											textAlign: 'center',
											width: 150,
											height: 30,
											color: 'green',
											marginBottom: 5,
											borderRadius: 5,
											position: 'absolute',
											zIndex: 100,
											marginTop: 25,
											borderColor: BaseColor.purchaseColor,
											borderWidth: 3
										}}>
										{this.state.country}
									</Text>
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
										<View style={{ flex: 1, justifyContent: 'center', height: '100%' }}>
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
												{this.state.imageIndex}/3</Text>
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
									<TouchableOpacity
										onPress={() => { this.setState({ showFullImage: true }) }}
										style={{
											height: '80%',
											width: '70%',
											borderRadius: 10,
											backgroundColor: 'white',
										}}>
										<Image source={{ uri: this.state.imagePath }} style={{ width: '100%', height: '100%', borderRadius: 10 }}></Image>
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
										<Image source={Images.right} style={{ width: 10, height: 20 }} />
									</TouchableOpacity>
								</View>
							</View>
							<View
								style={{ flexDirection: 'column', alignItems: 'center', flex: 2 }}>
								<Text
									style={{
										fontSize: 12,
										fontWeight: 'bold',
										color: BaseColor.imgBackgroundColor,
									}}>
									Discussed with the seller for the purchase</Text>
								<TouchableOpacity
									onPress={() => {
										this.contactSeller()
									}}
									style={[styles.autoOffer]}>
									<Text
										style={{
											textAlign: 'center',
											fontSize: 8,
											fontWeight: 'bold',
											color: BaseColor.primaryColor,
											marginRight: 3,
											marginLeft: 3
										}}>
										SELECT A SECURE PAYMENT WITH THE SELLER</Text>
									<Text style={{ fontSize: 12, fontWeight: 'bold', color: 'white' }}>
										DISCOVER EMAIL SELLER</Text>
								</TouchableOpacity>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<Text style={{ fontWeight: 'bold', fontSize: 14 }}>
										PROPOSED BY:{' '}
									</Text>
									<Text style={{ fontWeight: 'bold', fontSize: 14 }}>{this.state.userName}</Text>
								</View>
								<View style={{ alignItems: 'center', marginTop: 10, width: '100%' }}>
									<Text style={{ fontSize: 12, fontWeight: 'bold' }}>
										TITLE OF THE OFFER</Text>
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
								style={{ alignItems: 'center', flex: 2.1, flexDirection: 'column', marginTop: 10 }}>
								<Text
									style={{
										fontSize: 14,
										fontWeight: 'bold',
									}}>
									DESCRIPTION AND DETAIL OF THE OFFER ON SALE</Text>
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

							</View>

							<View style={{ flexDirection: 'row', flex: 0.7, marginBottom: 10 }}>
								<View style={[styles.footstyle]}>
									<Image
										source={require('@assets/images/logo.png')}
										style={{ width: 100, height: 25 }}
									/>
								</View>
								<View style={[styles.footstyle]}>
									<Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 5 }}>
										OTHER OFFERS</Text>
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
									<Text style={{ fontSize: 9, fontWeight: 'bold' }}>
										TOTAL OFFERS AVAILABLE</Text>
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
												<Text style={{ textAlign: "center", color: "#fff", fontSize: 20, fontWeight: "bold" }}>{this.state.dialogButton}</Text>
											</View>
										</TouchableOpacity>
									</View>
								</ModalContent>
							</Modal>
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
									color={"white"}
								/> : null
							}

						</View>
					</ScrollView>
				}
			</>
		);
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		AuthActions: bindActionCreators(AuthActions, dispatch),
		apiActions: bindActionCreators(apiActions, dispatch),
	};
};

export default connect(null, mapDispatchToProps)(purchasePremium);
