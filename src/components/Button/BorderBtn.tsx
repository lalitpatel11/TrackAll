/* eslint-disable prettier/prettier */
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    ViewStyle,
    TextStyle,
    ActivityIndicator,
  } from 'react-native';
  import React from 'react';
import { colors } from '../../constants/ColorConstant';
  
  interface BorderBtnProps {
    buttonText: string;
    containerStyle?: ViewStyle;
    buttonTextStyle?: TextStyle;
    onClick: () => void;
    disable?: boolean;
    loader?: boolean;
    loaderColor?: string;
    activeOpacity?: number | undefined;
  }
  
  const BorderBtn: React.FC<BorderBtnProps> = ({
    buttonText,
    containerStyle,
    buttonTextStyle,
    onClick,
    disable = false,
    loader = false,
    loaderColor,
    activeOpacity,
  }) => {
    const clickHandler = () => {
      if (onClick) {
        onClick();
      }
    };
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity ? activeOpacity : 0.3}
        onPress={clickHandler}
        style={[
          styles.touch,
          containerStyle,
          disable && {backgroundColor: 'gray', opacity: 0.3},
        ]}
        disabled={disable || loader}>
        {loader ? (
          <ActivityIndicator color={loaderColor ? loaderColor : 'white'} />
        ) : (
          <Text style={[styles.text, buttonTextStyle]} allowFontScaling={false}>{buttonText}</Text>
        )}
      </TouchableOpacity>
    );
  };
  
  export default BorderBtn;
  
  const styles = StyleSheet.create({
    touch: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      height: 60,
      backgroundColor: colors.THEME_ORANGE,
      width: '95%',
    },
    text: {
      color: 'white',
      fontSize: 18,
      fontWeight: '500',
      textAlign: 'center',
    },
  });
  