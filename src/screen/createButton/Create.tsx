// external imports
import {
  Animated,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React, {useState} from 'react';
// internal imports
import {colors} from '../../constants/ColorConstant';

const Create = ({navigation}: {navigation: any}) => {
  const [click, setClick] = useState(false);
  const buttonSize = new Animated.Value(1);
  const mode = new Animated.Value(0);

  // function for create click animation
  const handleCreateClick = () => {
    // Animated.sequence([
    //   Animated.timing(buttonSize, {
    //     toValue: 0.95,
    //     duration: 100,
    //     useNativeDriver: false,
    //   }),
    //   Animated.timing(buttonSize, {
    //     toValue: 1,
    //     useNativeDriver: false,
    //   }),
    //   Animated.timing(mode, {
    //     toValue: mode._value === 0 ? 1 : 0,
    //     useNativeDriver: false,
    //   }),
    // ]).start();
  };

  const thermometerX = mode.interpolate({
    inputRange: [0, 1],
    outputRange: [-24, -100],
  });

  const thermometerY = mode.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, -100],
  });

  const timeX = mode.interpolate({
    inputRange: [0, 1],
    outputRange: [-24, -24],
  });

  const timeY = mode.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, -150],
  });

  const pulseX = mode.interpolate({
    inputRange: [0, 1],
    outputRange: [-24, 50],
  });

  const pulseY = mode.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, -100],
  });

  const rotation = mode.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const sizeStyle = {
    transform: [{scale: buttonSize}],
  };

  // function for expense tab click
  const handleExpenseClick = () => {
    handleCreateClick();
    navigation.navigate('StackNavigation', {screen: 'ExpenseManagement'});
  };

  // function for business tab click
  const handleBusinessClick = () => {
    handleCreateClick();
    navigation.navigate('StackNavigation', {screen: 'BusinessCommunity'});
  };

  // function for event tab click
  const handleEventClick = () => {
    handleCreateClick();
    navigation.navigate('StackNavigation', {screen: 'EventManagement'});
  };

  return (
    <View style={{position: 'absolute', alignItems: 'center'}}>
      {/* expense tab */}
      <Animated.View
        style={{position: 'absolute', left: thermometerX, top: thermometerY}}>
        <TouchableOpacity
          style={styles.expenseImage}
          onPress={() => {
            handleExpenseClick();
          }}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={require('../../assets/pngImage/expensesIcon.png')}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* business tab */}
      <Animated.View style={{position: 'absolute', left: timeX, top: timeY}}>
        <TouchableOpacity
          style={styles.expenseImage}
          onPress={() => {
            handleBusinessClick();
          }}>
          <Image
            style={styles.image}
            tintColor={colors.THEME_ORANGE}
            resizeMode="contain"
            source={require('../../assets/pngImage/businessIcon.png')}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* event tab */}
      <Animated.View style={{position: 'absolute', left: pulseX, top: pulseY}}>
        <TouchableOpacity
          style={styles.expenseImage}
          onPress={() => {
            handleEventClick();
          }}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={require('../../assets/pngImage/eventIcon.png')}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* plus icon section  */}
      <TouchableOpacity
        onPress={() => {
          // handleCreateClick();
          // setClick(!click);
        }}
        activeOpacity={1}
        style={styles.createBox}>
        <Animated.View style={[styles.createTabBox, sizeStyle]}>
          {/* <LinearGradient
            colors={!click ? ['#ED933C', '#E15132'] : ['#FF0101', '#FF0101']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.createTabContainer}>
            <Animated.View style={{transform: [{rotate: rotation}]}}>
              <Image
                style={styles.tabIcon}
                resizeMode="contain"
                source={require('../../assets/pngImage/logo.png')}
              />
            </Animated.View>
          </LinearGradient> */}
          <View style={styles.createTabContainer}>
            <Image
              style={styles.tabIcon}
              resizeMode="contain"
              source={require('../../assets/pngImage/logo.png')}
            />
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default Create;
const styles = StyleSheet.create({
  createTabContainer: {
    alignItems: 'center',
    backgroundColor: colors.BLACK2,
    borderColor: colors.BLACK3,
    borderRadius: 100,
    borderWidth: 2,
    elevation: 5,
    justifyContent: 'center',
    padding: 5,
    position: 'absolute',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    top: -35,
    shadowOffset: {
      width: 0,
      height: 10,
    },
  },
  createTabBox: {
    alignItems: 'center',
    borderRadius: 100,
    justifyContent: 'center',
    position: 'relative',
    top: -25,
  },
  createBox: {
    alignItems: 'center',
    borderRadius: 100,
    justifyContent: 'center',
    top: -15,
  },
  tabIcon: {
    height: 65,
    width: 65,
  },
  expenseImage: {
    alignItems: 'center',
    backgroundColor: colors.THEME_WHITE,
    borderRadius: 50,
    elevation: 5,
    height: 47,
    justifyContent: 'center',
    padding: 5,
    position: 'absolute',
    top: -25,
    width: 47,
  },
  image: {
    height: 25,
    width: 25,
  },
});
