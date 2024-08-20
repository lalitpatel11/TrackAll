import {View, Text, Modal} from 'react-native';
import React from 'react';
import {styles} from './CancelSubsIosStyle';
import {TouchableOpacity} from 'react-native';
import {colors} from '../../constants/ColorConstant';
import {Icon} from 'native-base';
import {Image} from 'react-native';
const CancelSubsIos = ({visible, setVisibility = () => {}}) => {
  //function : modal func
  const closeModal = () => {
    setVisibility(false);
  };

  //UI
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <TouchableOpacity onPress={closeModal} style={styles.blurView} />
        <View style={styles.mainView}>
          <Text style={styles.TitleText}>Cancel subscription</Text>
          <View
            style={{
              borderBottomWidth: 0.5,
              marginVertical: 10,
              borderColor: colors.GRAY,
            }}
          />
          <View style={styles.bulletView}>
            <Image
              resizeMode="contain"
              source={require('../../assets/pngImage/CheckCircle.png')}
            />
            <Text style={styles.bulletTextStyle}>Open the Settings app.</Text>
          </View>
          <View style={styles.bulletView}>
            <Image
              resizeMode="contain"
              source={require('../../assets/pngImage/CheckCircle.png')}
            />
            <Text style={styles.bulletTextStyle}>Tap your name.</Text>
          </View>
          <View style={styles.bulletView}>
            <Image
              resizeMode="contain"
              source={require('../../assets/pngImage/CheckCircle.png')}
            />
            <Text style={styles.bulletTextStyle}>Tap the subscription.</Text>
          </View>
          <View style={{...styles.bulletView, alignItems: 'flex-start'}}>
            <Image
              resizeMode="contain"
              source={require('../../assets/pngImage/CheckCircle.png')}
            />
            <Text style={styles.bulletTextStyle}>
              Tap Cancel Subscription. You might need to scroll down to find the
              Cancel Subscription button. If there is no Cancel button or you
              see an expiration message in red text, the subscription is already
              canceled.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CancelSubsIos;
