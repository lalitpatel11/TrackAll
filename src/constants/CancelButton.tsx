// external imports
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
// internal imports
import {colors} from './ColorConstant';

const CancelButton = ({
  buttonText,
  loader,
  cancelButton,
}: {
  buttonText: string;
  loader?: boolean;
  cancelButton: Function;
}) => {
  return (
    <>
      {!loader ? (
        <TouchableOpacity
          onPress={() => {
            cancelButton();
          }}
          style={styles.buttonBox}>
          <Image
            resizeMode="contain"
            style={styles.icon}
            source={require('../assets/pngImage/Trash.png')}
          />
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}
    </>
  );
};

export default CancelButton;

const styles = StyleSheet.create({
  buttonBox: {
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: colors.GRAY,
    flexDirection: 'row',
    height: 63,
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: colors.RED,
    fontSize: 15,
    fontWeight: '500',
    padding: 5,
    textAlign: 'center',
  },
  icon: {
    height: 18,
    width: 18,
  },
  loaderContainer: {
    height: 60,
  },
});
