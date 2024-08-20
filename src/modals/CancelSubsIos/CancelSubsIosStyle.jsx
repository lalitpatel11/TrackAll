import {StyleSheet} from 'react-native';
import {colors} from '../../constants/ColorConstant';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000' + '66',
  },
  blurView: {
    flex: 1,
  },
  mainView: {
    padding: 20,
    backgroundColor: colors.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  TitleText: {
    fontSize: 18,
    textAlign: 'center',
  },
  bulletView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bulletTextStyle: {
    color: colors.GRAY,
    marginLeft: 10,
    width: '80%',
  },
});
