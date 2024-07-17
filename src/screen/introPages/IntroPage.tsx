//external imports
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
//internal imports
import IntroScreenTab from './IntroScreenTab';
import {colors} from '../../constants/ColorConstant';

const IntroPage = (props: any) => {
  const [pageLoader, setPageLoader] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  // function for get bottom navigator
  const getData = async () => {
    let token = await AsyncStorage.getItem('authToken');
    if (token) {
      setPageLoader(false);
      props.navigation.replace('DrawerNavigator', {
        screen: 'BottomNavigator',
        params: {
          screen: 'Home',
        },
      });
    } else {
      setPageLoader(false);
    }
  };

  const slides = [
    {
      id: 1,
      textLineOne: 'Stay focused with',
      textLineTwo: 'TrackAll',
      backgroundImage: require('../../assets/pngImage/Rectangle.png'),
      image: require('../../assets/pngImage/IntroFirst.png'),
    },
    {
      id: 2,
      textLineOne: 'Develop habits with',
      textLineTwo: 'TrackAll Community',
      backgroundImage: require('../../assets/pngImage/Rectangle.png'),
      image: require('../../assets/pngImage/IntroSecond.png'),
    },
    {
      id: 3,
      textLineOne: '',
      textLineTwo: '',
      backgroundImage: require('../../assets/pngImage/Rectangle.png'),
      image: require('../../assets/pngImage/IntroThird.png'),
    },
  ];

  // list for intro pages
  const renderItem = ({item}: {item: any}) => {
    return <IntroScreenTab item={item} />;
  };

  // function for skip click
  const handleSkip = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.replace('WelcomePage');
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
          props.navigation.replace('WelcomePage');
        }}>
        <Text style={styles.skipText}>Get started</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {!pageLoader ? (
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
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}
    </>
  );
};

export default IntroPage;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  dotStyle: {
    backgroundColor: colors.lightGray,
  },
  activeDotStyle: {
    backgroundColor: colors.THEME_ORANGE,
  },
  skipText: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    fontWeight: '500',
    paddingRight: 20,
    top: 10,
  },
});
