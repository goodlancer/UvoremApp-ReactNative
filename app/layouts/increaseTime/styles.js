import { StyleSheet } from "react-native";
import { BaseColor } from '../../config/color';
export default StyleSheet.create({
    mainlayout: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnPrevious: {
        backgroundColor: BaseColor.backColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        height: 30,
        width: 100
    },
});
