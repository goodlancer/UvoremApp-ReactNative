import { StyleSheet } from "react-native";
import { BaseColor } from "../../config/color";

export default StyleSheet.create({
    mainlayout: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    text: {
        marginRight: 20,
        marginLeft: 20,
        height: 30,
    },
    textinput: {
        padding: 0,
        paddingLeft: 5,
        paddingRight: 5,
        marginRight: 20,
        marginLeft: 20,
        height: 30,
        width: '90%',
        borderColor: BaseColor.primaryColor,
        borderWidth: 1,
        borderRadius: 10,
    },
    textdesc: {
        marginRight: 20,
        marginLeft: 20,
        height: 120,
        width: '90%',
        borderColor: BaseColor.primaryColor,
        borderWidth: 1,
        borderRadius: 10,
        textAlignVertical: 'top'
    },
    footstyle: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnPrevious: {
        backgroundColor: BaseColor.backColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        height: 30,
        width: 100
    },
    autoOffer: {
        width: 150,
        height: 30,
        backgroundColor: BaseColor.backColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    btnDelete: {
        backgroundColor: BaseColor.primaryColor,
        alignItems: 'center',
        borderRadius: 5,
        height: 25,
        justifyContent: 'center',
        width: 120
    },
    offerNumber: {
        backgroundColor: 'white',
        borderColor: BaseColor.primaryColor,
        borderWidth: 2,
        alignItems: 'center',
        borderRadius: 5,
        height: 25,
        justifyContent: 'center',
        width: 120
    },
    btnTime: {
        backgroundColor: BaseColor.purchaseColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        height: 30,
        width: 180,
        marginTop:10
    },
});
