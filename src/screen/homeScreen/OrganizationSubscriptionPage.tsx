//external imports
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import LinearGradient from 'react-native-linear-gradient';
import React, {useEffect, useRef, useState} from 'react';
//internal imports
import CustomHeader from '../../constants/CustomHeader';
import DeleteAlertModal from '../groups/DeleteAlertModal';
import SubscriptionServices from '../../service/SubscriptionServices';
import {colors} from '../../constants/ColorConstant';
import SubscriptionPlanTab from '../subscriptionPlan/SubscriptionPlanTab';
import CommonToast from '../../constants/CommonToast';
import WebView from 'react-native-webview';
import {API} from '../../service/api/ApiDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrganizationSubscriptionPage = ({navigation}: {navigation: any}) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [mySubscriptionPlan, setMySubscriptionPlan] = useState([]);
  const [pageLoader, setPageLoader] = useState(false);
  const [monthlySubscriptionPlan, setMonthlySubscriptionPlan] = useState([]);
  const [yearlySubscriptionPlan, setYearlySubscriptionPlan] = useState([]);
  const toastRef = useRef<any>();
  const [myUserId, setMyUserId] = useState<any>();
  const [planId, setPlanId] = useState('');
  const [webViewModal, setWebViewModal] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPageLoader(true);
      getMyPlan();
      getAllPlans();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get my current subscription plan on api call
  const getMyPlan = async () => {
    const token = await AsyncStorage.getItem('userId');
    setMyUserId(token);

    SubscriptionServices.getMySubscription()
      .then((response: any) => {
        setPageLoader(false);
        setMySubscriptionPlan(response?.data?.plandetails);
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for get all subscription plan on api call
  const getAllPlans = () => {
    SubscriptionServices.getAllSubscription()
      .then((response: any) => {
        setPageLoader(false);
        setMonthlySubscriptionPlan(response?.data?.monthlyplans);
        setYearlySubscriptionPlan(response?.data?.yearlyplans);
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // list for monthly subscription plan
  const renderMonthlyItem = ({item}: {item: any}) => {
    return (
      <SubscriptionPlanTab
        item={item}
        submitButtonClick={handleSubmitButtonClick}
        currentPlan={mySubscriptionPlan?.price}
      />
    );
  };

  // list for monthly subscription plan
  const renderYearlyItem = ({item}: {item: any}) => {
    return (
      <SubscriptionPlanTab
        item={item}
        submitButtonClick={handleSubmitButtonClick}
        currentPlan={mySubscriptionPlan?.price}
      />
    );
  };

  // navigation on payment click
  const handleSubmitButtonClick = (planId: any) => {
    setPlanId(planId);
    setWebViewModal(true);
  };

  const handleSkip = () => {
    return <View />;
  };

  // function for cancel plan click
  const handleCancelPlan = () => {
    setDeleteModal(false);
    SubscriptionServices.getCancelSubscription()
      .then(response => {
        toastRef.current.getToast(response.data.message, 'success');
        getMyPlan();
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Subscriptions'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.replace('DrawerNavigator', {
              screen: 'BottomNavigator',
              params: {
                screen: 'OrganizationHome',
              },
            });
          },
        }}
      />

      {/* my current plan  */}
      {!pageLoader ? (
        <View style={styles.body}>
          <Text style={styles.heading}>Organization Subscription</Text>
          <LinearGradient
            colors={['#F5B532', '#F28520']}
            style={styles.myCurrentPlanContainer}>
            {/* background image  */}
            <Image
              style={{
                height: 130,
                width: 400,
                position: 'absolute',
              }}
              resizeMode="contain"
              source={require('../../assets/pngImage/background.png')}
            />

            {/* name and price section  */}
            <View style={styles.planNameContainer}>
              <View style={styles.whiteContainer} />
              <View>
                <Text style={styles.myCurrentPlanName}>
                  {mySubscriptionPlan?.planname}
                </Text>
                <Text style={styles.myPlanPrice}>
                  {mySubscriptionPlan?.price}
                </Text>
              </View>

              {mySubscriptionPlan?.price !== 'Free' ? (
                <TouchableOpacity
                  onPress={() => {
                    setDeleteModal(true);
                  }}
                  style={styles.cancelButtonContainer}>
                  <Text style={styles.cancelButtonText}>
                    Cancel subscription
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* group and member count section */}
            <View style={styles.MyPlanDescriptionSection}>
              <View>
                <Text style={styles.myPlanDescription}>Group Count</Text>
                <Text style={styles.myPlanCount}>
                  {mySubscriptionPlan?.group}
                </Text>
              </View>
              <View>
                <Text style={styles.myPlanDescription}>Member Count</Text>
                <Text style={styles.myPlanCount}>
                  {mySubscriptionPlan?.user_invites}
                </Text>
              </View>
            </View>
          </LinearGradient>

          <ScrollView style={{height: '100%'}}>
            <View style={{height: '50%'}}>
              <Text style={styles.heading}> Monthly Subscriptions</Text>
              {/* monthly slider section */}
              <AppIntroSlider
                data={monthlySubscriptionPlan}
                renderItem={renderMonthlyItem}
                dotStyle={styles.dotStyle}
                activeDotStyle={styles.activeDotStyle}
                dotClickEnabled={true}
                renderDoneButton={handleSkip}
                renderNextButton={handleSkip}
                keyExtractor={(item: any) => item.id}
              />
            </View>

            <View style={{height: '50%', marginBottom: 80}}>
              <Text style={styles.heading}> Yearly Subscriptions</Text>
              {/* yearly slider section */}
              <AppIntroSlider
                data={yearlySubscriptionPlan}
                renderItem={renderYearlyItem}
                dotStyle={styles.dotStyle}
                activeDotStyle={styles.activeDotStyle}
                dotClickEnabled={true}
                renderDoneButton={handleSkip}
                renderNextButton={handleSkip}
                keyExtractor={(item: any) => item.id}
              />
            </View>
          </ScrollView>

          {/* webview for subscription */}
          {webViewModal ? (
            <View style={styles.webViewStyle}>
              <WebView
                source={{
                  uri: `${API.GET_WEB_LINK_SUBSCRIPTION}/${planId}/${myUserId}`,
                }}
                contentMode="mobile"
                onNavigationStateChange={data => {
                  if (
                    data?.url ==
                    'https://dev.remindably.com/user/paymentsuccessfull'
                  ) {
                    setWebViewModal(false);
                    getMyPlan();
                    getAllPlans();
                    toastRef.current.getToast(
                      'Payment has been done successfully.',
                    );
                  }
                }}
              />
            </View>
          ) : null}

          {/* skip section */}
          <TouchableOpacity
            style={styles.skipContainer}
            onPress={() => {
              navigation.replace('DrawerNavigator', {
                screen: 'BottomNavigator',
                params: {
                  screen: 'OrganizationHome',
                },
              });
            }}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}

      {/* Delete alert modal  */}
      <DeleteAlertModal
        visibleModal={deleteModal}
        onRequestClosed={() => {
          setDeleteModal(false);
        }}
        onPressRightButton={() => {
          handleCancelPlan();
        }}
        subHeading={
          'Are you sure you want to cancel your current subscription ?'
        }
      />

      {/* toaster message for error response from API */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default OrganizationSubscriptionPage;

const styles = StyleSheet.create({
  container: {flex: 1},
  body: {
    flex: 1,
    padding: 10,
  },
  heading: {
    color: colors.THEME_BLACK,
    fontSize: 16,
    fontWeight: '500',
    padding: 5,
  },
  myCurrentPlanContainer: {
    borderRadius: 30,
    height: 'auto',
    marginBottom: 30,
    marginHorizontal: 10,
    padding: 10,
    paddingVertical: 15,
    width: '95%',
  },
  planNameContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  whiteContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: 5,
    height: 20,
    margin: 5,
    width: 20,
  },
  myCurrentPlanName: {
    color: colors.WHITE,
    fontSize: 17,
    fontWeight: '700',
  },
  myPlanPrice: {
    color: colors.WHITE,
    fontSize: 17,
    fontWeight: '700',
  },
  MyPlanDescriptionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  myPlanDescription: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '400',
  },
  myPlanCount: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '700',
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
  cancelButtonContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    padding: 5,
    position: 'absolute',
    right: 0,
    width: 'auto',
    zIndex: 1,
  },
  cancelButtonText: {
    color: colors.THEME_ORANGE,
    fontSize: 12,
    fontWeight: '500',
  },
  skipContainer: {
    alignSelf: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    marginTop: 10,
    width: 80,
  },
  skipText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  webViewStyle: {
    flex: 1,
    height: '100%',
    marginTop: 10,
    position: 'absolute',
    width: '100%',
    zIndex: 999,
  },
});
