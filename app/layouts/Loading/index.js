import React, { Component } from "react";
import { ActivityIndicator, View, Image, Dimensions, Text, TouchableOpacity } from "react-native";
import { Images, BaseColor } from "@config";
import styles from "./styles";
import { store } from "@store";
import * as Utils from "@utils";
import { apiActions, AuthActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal, { ModalContent } from "react-native-modals";

class Loading extends Component {
  constructor(props) {
    super(props);
    var width = Dimensions.get('window').width;
    var height = Dimensions.get('window').height;
    this.state = {
      width: width,
      height: height,
      dialogVisible: false,
      dialogHeader: "",
      dialogContent: "",
    }
  }
  componentDidMount() {
    setTimeout(() => {
      try {
        if (store.getState().auth.login.success) {
          this.props.AuthActions.refreshUser((response) => {
            if (response.success) {
              return this.props.navigation.navigate("main");
            } else if (response.data == "deActive") {
              return this.props.navigation.navigate("login");
            }
          });
          // if (this.checkDate())
          //   return this.props.navigation.navigate("SubScriptionDetail", { type: Utils.SUBSCRIPTION_TYPE.SUBSCRIPTION_LOGIN });
          return this.props.navigation.navigate("main");

          //return this.props.navigation.navigate("main");
        }
      } catch (err) {
      }
      return this.props.navigation.navigate("Main");
    }, 1000);
  }
  checkDate() {
    const user = store.getState().auth.login.data.user;
    if (user.role != 6) {
      return false;
    }
    if (!user.payment)
      return true;

    if ((new Date(user.payment.toDate)).getTime() < (new Date()).getTime())
      return true;
    return false;
  }
  hideDialog() {
    this.setState({ dialogVisible: false })
  }
  render() {
    const { height, width } = this.state;
    return (
      <View style={styles.container}>
        <View>
          <Image source={require('@assets/images/logo.png')} style={{ width: 200, height: 50 }}>
          </Image>
        </View>
        <ActivityIndicator
          size="large"
          color={BaseColor.textPrimaryColor}
          style={{
            position: "absolute",
            top: 260,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center"
          }}
        />
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
                <View style={{ backgroundColor: BaseColor.btnModal, height: 40, width: 200, borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
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

const mapDispatchToProps = (dispatch) => {
  return {
    AuthActions: bindActionCreators(AuthActions, dispatch),
    apiActions: bindActionCreators(apiActions, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(Loading);