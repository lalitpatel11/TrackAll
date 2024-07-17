//external imports
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import React from 'react';
//internal imports
import {colors} from '../../constants/ColorConstant';
import SignUpIntroScreenTab from './SignUpIntroScreenTab';

const SignUpIntroPage = (props: any) => {
  const slides = [
    {
      id: 1,
      textLineOne: 'Sign up as an',
      textLineTwo: 'Individual User',
      textLineThird:
        'Seamlessly manage schedules, create groups, control expenses. Join or create events and discover thriving business communities',
      darkBackgroundImage: require('../../assets/pngImage/darktheme.png'),
      orangeBackgroundImage: require('../../assets/pngImage/orangetheme.png'),
      halfBackgroundImage: require('../../assets/pngImage/halfcolortheme.png'),
      backGroundImage: require('../../assets/pngImage/introbg1.png'),
    },
    {
      id: 2,
      textLineOne: 'Sign Up as a',
      textLineTwo: 'Local Business',
      textLineThird:
        'Take charge of your appointments with custom scheduling, Booking Slots, Event Management, and expense control while connecting with your community',
      darkBackgroundImage: require('../../assets/pngImage/darktheme.png'),
      orangeBackgroundImage: require('../../assets/pngImage/orangetheme.png'),
      halfBackgroundImage: require('../../assets/pngImage/halfcolortheme.png'),
      backGroundImage: require('../../assets/pngImage/introbg2.png'),
    },
    {
      id: 3,
      textLineOne: 'Sign Up as an',
      textLineTwo: 'Organization',
      textLineThird:
        'Empower your enterprise with employee management, sales projects, Client groups, Routine management and efficient budgeting for HR sales and events',
      darkBackgroundImage: require('../../assets/pngImage/darktheme.png'),
      orangeBackgroundImage: require('../../assets/pngImage/orangetheme.png'),
      halfBackgroundImage: require('../../assets/pngImage/halfcolortheme.png'),
      backGroundImage: require('../../assets/pngImage/introbg3.png'),
    },
  ];

  // list for intro pages
  const renderItem = ({item}: {item: any}) => {
    return <SignUpIntroScreenTab item={item} />;
  };

  // function for skip click
  const handleSkip = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.replace('SignUpOption');
        }}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    );
  };

  // function for done click
  const handleDone = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.replace('SignUpOption');
        }}>
        <Text style={styles.skipText}>Get started</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <AppIntroSlider
        data={slides}
        renderItem={renderItem}
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
        dotClickEnabled={true}
        renderDoneButton={handleDone}
        renderNextButton={handleSkip}
        keyExtractor={(item: any) => item.id}
      />
    </>
  );
};

export default SignUpIntroPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dotStyle: {
    backgroundColor: colors.THEME_ORANGE,
  },
  activeDotStyle: {
    backgroundColor: colors.WHITE,
  },
  skipText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    paddingRight: 20,
    top: 10,
  },
});
