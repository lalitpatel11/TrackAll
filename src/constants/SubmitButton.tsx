// external imports
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
// internal imports
import {colors} from './ColorConstant';
import LinearGradient from 'react-native-linear-gradient';

const SubmitButton = ({
  buttonText,
  loader,
  submitButton,
}: {
  buttonText: string;
  loader?: boolean;
  submitButton: Function;
}) => {
  return (
    <>
      {!loader ? (
        <LinearGradient
          colors={['#ED933C', '#E15132']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              submitButton();
            }}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={['#ED933C', '#E15132']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.buttonContainer}>
          <ActivityIndicator size="large" color={colors.WHITE} />
        </LinearGradient>
      )}
    </>
  );
};

export default SubmitButton;

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 30,
    height: 63,
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.WHITE,
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 10,
    textAlign: 'center',
  },
});
