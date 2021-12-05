import { StyleSheet } from "react-native";
import { BaseColor } from '../../config/color';
export default StyleSheet.create({
    btnPrevious: {
        backgroundColor: BaseColor.backColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        height: 25,
        width: 100,
    },
    mainlayout: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})