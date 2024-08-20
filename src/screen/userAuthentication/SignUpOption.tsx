import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import {colors} from '../../constants/ColorConstant';

const SignUpOption = ({navigation}: {navigation: any}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView nestedScrollEnabled={true}>
        {/* logo with background color */}
        <View style={styles.backgroundContainer}>
          <Image
            style={styles.logoBackground}
            resizeMode="contain"
            source={require('../../assets/pngImage/darkbackground.png')}
          />
          <Image
            style={styles.logoBackground}
            resizeMode="contain"
            source={require('../../assets/pngImage/backgroundcolor.png')}
          />
          <Image
            style={styles.logoImage}
            resizeMode="contain"
            source={require('../../assets/pngImage/watchbackground.png')}
          />

          {/* logo */}
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              resizeMode="contain"
              source={require('../../assets/pngImage/logo.png')}
            />
          </View>

          {/* heading */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Let’s get started with </Text>
            <Text style={styles.subHeaderText}>TrackAll</Text>
          </View>
        </View>

        <Text style={styles.smallHeaderText}>You are?</Text>

        {/* SignUp option for individual, business and  Organization  */}
        <View style={styles.signUpContainer}>
          <ScrollView horizontal={true}>
            {/* Individual user sign up  */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SignUp');
              }}
              style={styles.signUpBox}>
              <View style={styles.imageDirection}>
                <Image
                  style={styles.logoImage}
                  resizeMode="contain"
                  source={require('../../assets/pngImage/indivisuallogo.png')}
                />
              </View>
              <Text style={styles.signUpHeadingText}>Individual User</Text>

              <View style={styles.iconContainer}>
                <Image
                  resizeMode="contain"
                  style={styles.logoImage}
                  source={require('../../assets/pngImage/rightorangearrow.png')}
                />
              </View>
            </TouchableOpacity>

            {/* SignUp option for business */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('StackNavigation', {
                  screen: 'BusinessSignUp',
                });
              }}
              style={styles.signUpBox}>
              <View style={styles.imageDirection}>
                <Image
                  style={styles.logoImage}
                  resizeMode="contain"
                  source={require('../../assets/pngImage/businesslogo.png')}
                />
              </View>
              <Text style={styles.signUpHeadingText}>Business</Text>

              <View style={styles.iconContainer}>
                <Image
                  resizeMode="contain"
                  style={styles.logoImage}
                  source={require('../../assets/pngImage/rightorangearrow.png')}
                />
              </View>
            </TouchableOpacity>

            {/* SignUp option for Organization */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('StackNavigation', {
                  screen: 'OrganizationSignUp',
                });
              }}
              style={styles.signUpBox}>
              <View style={styles.imageDirection}>
                <Image
                  style={styles.logoImage}
                  resizeMode="contain"
                  source={require('../../assets/pngImage/organisationlogo.jpg')}
                />
              </View>
              <Text style={styles.signUpHeadingText}>Organization</Text>

              <View style={styles.iconContainer}>
                <Image
                  resizeMode="contain"
                  style={styles.logoImage}
                  source={require('../../assets/pngImage/rightorangearrow.png')}
                />
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* already signin text  */}
        <View style={styles.otherTextContainer}>
          <Text style={styles.otherTextOne}>Already have an account</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SignIn');
            }}>
            <Text style={styles.otherTextTwo}>Sign In?</Text>
          </TouchableOpacity>
        </View>

        {/* t&c and privacy policy */}
        <View style={{marginTop: 15}}>
          <Text style={styles.otherTextOne}>
            By Proceeding you agree with the
          </Text>
          <View style={styles.direction}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('StackNavigation', {
                  screen: 'TermAndCondition',
                });
              }}>
              <Text style={styles.otherTextTwo}>Term of use</Text>
            </TouchableOpacity>
            <Text style={styles.otherTextOne}> and</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('StackNavigation', {
                  screen: 'PrivacyPolicy',
                });
              }}>
              <Text style={styles.otherTextTwo}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpOption;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLACK,
  },
  backgroundContainer: {
    alignSelf: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    height: 394,
    marginTop: 25,
    width: 379,
  },
  logoContainer: {
    backgroundColor: colors.BLACK2,
    alignSelf: 'center',
    height: 125,
    marginTop: 50,
    position: 'absolute',
    width: 125,
    zIndex: 2,
    borderRadius: 15,
  },
  logo: {
    alignSelf: 'center',
    height: 125,
    position: 'absolute',
    width: 125,
    zIndex: 4,
  },
  logoBackground: {
    height: '100%',
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  logoImage: {
    height: '100%',
    width: '100%',
  },
  headerContainer: {
    alignSelf: 'center',
    marginTop: 200,
    position: 'absolute',
    zIndex: 2,
  },
  headerText: {
    color: colors.WHITE,
    fontSize: 25,
    textAlign: 'center',
  },
  subHeaderText: {
    color: colors.WHITE,
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  smallHeaderText: {
    color: colors.WHITE,
    fontSize: 25,
    fontWeight: '500',
    marginTop: 40,
    marginHorizontal: 15,
  },
  signUpContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    width: '100%',
  },
  signUpBox: {
    backgroundColor: colors.BLACK3,
    borderRadius: 8,
    elevation: 0.5,
    height: 185,
    justifyContent: 'center',
    marginRight: 20,
    marginVertical: 6,
    width: 173,
  },
  imageDirection: {
    alignSelf: 'center',
    height: 72,
    marginVertical: 10,
    width: 84,
  },
  signUpHeadingText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    padding: 5,
    textAlign: 'center',
  },
  iconContainer: {
    alignSelf: 'center',
    height: 40,
    width: 40,
  },
  otherTextContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: 15,
  },
  otherTextOne: {
    color: colors.WHITE,
    textAlign: 'center',
  },
  otherTextTwo: {
    color: colors.THEME_ORANGE,
    paddingLeft: 5,
  },
  direction: {
    alignSelf: 'center',
    flexDirection: 'row',
  },
});
