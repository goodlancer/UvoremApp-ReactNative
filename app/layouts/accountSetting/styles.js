import {StyleSheet} from 'react-native';
import { BaseColor } from '../../config/color';

export default StyleSheet.create({
  mainlayout: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginRight: 20,
    marginLeft: 20,
    marginTop: 25,
    fontSize: 15,
    fontWeight: 'bold'
  },
  textinput: {
    marginRight: 20,
    marginLeft: 20,
    padding: 0,
    paddingRight: 5,
    paddingLeft: 5,
    height: 33,
    borderColor: BaseColor.primaryColor,
    borderWidth: 1,
    borderRadius: 10,
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
