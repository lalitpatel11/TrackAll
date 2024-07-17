// external imports
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
// internal imports
import {colors} from './ColorConstant';

const CustomHeader = ({
  backButton,
  bellButton,
  drawerButton,
  headerText,
}: {
  drawerButton?: {onClick: Function; visible?: boolean};
  headerText: string;
  bellButton?: {onClick: Function; visible?: boolean};
  backButton?: {onClick: Function; visible?: boolean};
}) => {
  return (
    <LinearGradient
      colors={['#ED933C', '#E15132']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={styles.container}>
      <View style={styles.body}>
        {/* drawer menu icon for side menu */}
        {drawerButton?.visible ? (
          <TouchableOpacity
            style={styles.iconStyle}
            onPress={() => {
              drawerButton?.onClick();
            }}>
            <Image
              resizeMode="contain"
              style={styles.icon}
              source={require('../assets/pngImage/nav.png')}
            />
          </TouchableOpacity>
        ) : null}

        {/* back arrow icon for back navigation */}
        {backButton?.visible ? (
          <TouchableOpacity
            style={styles.iconStyle}
            onPress={() => {
              backButton?.onClick();
            }}>
            <Image
              resizeMode="contain"
              style={styles.icon}
              source={require('../assets/pngImage/ArrowLeft.png')}
            />
          </TouchableOpacity>
        ) : null}

        {/* header text  */}
        <View>
          <Text style={styles.headerText}>{headerText}</Text>
        </View>

        {/* bell button icon for notification */}
        {bellButton?.visible ? (
          <TouchableOpacity
            style={styles.iconStyle}
            onPress={() => {
              bellButton?.onClick();
            }}>
            <Image
              resizeMode="contain"
              style={styles.icon}
              source={require('../assets/pngImage/bell.png')}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconStyle} />
        )}
      </View>
    </LinearGradient>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingTop: Platform.OS === 'android' ? 20 : 40,
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  iconStyle: {alignSelf: 'center'},
  icon: {
    height: 30,
    width: 30,
  },
  headerText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
