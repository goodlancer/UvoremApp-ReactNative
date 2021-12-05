import { StyleSheet } from "react-native";
import { BaseColor } from '../../config/color';
export default StyleSheet.create({
    textinput: {
        padding: 0,
        paddingLeft: 5,
        paddingRight: 5,
        width: "100%",
        marginRight: 20,
        marginLeft: 20,
        marginTop:7,
        height: 30,
        borderColor: BaseColor.primaryColor,
        borderWidth: 1,
        borderRadius: 10,
    },
    footer: {
        flex:1,
        alignItems:'center',
    }
});
