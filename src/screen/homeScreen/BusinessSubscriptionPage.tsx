//external imports
import {
  ActivityIndicator,
  Image,
  Platform,
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
//import : third parties
import {
  initConnection,
  endConnection,
  finishTransaction,
  flushFailedPurchasesCachedAsPendingAndroid,
  purchaseUpdatedListener,
  purchaseErrorListener,
  getSubscriptions,
  requestSubscription,
  SubscriptionPurchase,
} from 'react-native-iap';
import CancelSubsIos from '../../modals/CancelSubsIos/CancelSubsIos';

const BusinessSubscriptionPage = ({navigation}: {navigation: any}) => {
  //variables
  const productSkus = Platform.select({
    ios: ['Plan_b_monthly'], //will receive from apple account
    android: [],
    default: [],
  }) as string[];
  //hook : states
  const [deleteModal, setDeleteModal] = useState(false);
  const [mySubscriptionPlan, setMySubscriptionPlan] = useState([]);
  const [pageLoader, setPageLoader] = useState(false);
  const [monthlySubscriptionPlan, setMonthlySubscriptionPlan] = useState([]);
  const [yearlySubscriptionPlan, setYearlySubscriptionPlan] = useState([]);
  const [monthlyIosSubs, setMonthlyIosSubs] = useState([]);
  const toastRef = useRef<any>();
  const [myUserId, setMyUserId] = useState<any>();
  const [planId, setPlanId] = useState('');
  const [webViewModal, setWebViewModal] = useState(false);
  const [showCancelSub, setShowCancelSub] = useState(false);
  //function : imp function
  useEffect(() => {
    let purchaseUpdateSubscription = null;
    let purchaseErrorSubscription = null;
    const initializeConnection = async () => {
      try {
        await initConnection();
        if (Platform.OS === 'android') {
          await flushFailedPurchasesCachedAsPendingAndroid();
          purchaseUpdateSubscription = purchaseUpdatedListener(
            (purchase: SubscriptionPurchase) => {
              const receipt = purchase.transactionReceipt;
              console.log(receipt);
            },
          );
          purchaseErrorSubscription = purchaseErrorListener((error: any) => {
            console.warn('purchaseErrorListener', error);
          });
        }
      } catch (error) {
        console.error('An error occurred', error.message);
      }
    };
    fetchProducts();
    initializeConnection();
    return () => {
      purchaseUpdateSubscription = null;
      purchaseErrorSubscription = null;
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const products = await getSubscriptions({
        skus: Platform.select({
          ios: [
            'Plan_b_monthly',
            'Plan_c_monthly',
            'Plan_d_monthly',
            'Plan_b_yearly',
            'Plan_c_yearly',
            'Plan_d_yearly',
          ],
          android: [],
        }),
      });
      setMonthlyIosSubs(products);
    } catch (error) {
      console.error('Error occurred while fetching products', error.message);
    }
  };

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
        setMySubscriptionPlan(response.data.plandetails);
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.error(error);
      });
  };

  // function for get all subscription plan on api call
  const getAllPlans = () => {
    SubscriptionServices.getAllSubscription()
      .then((response: any) => {
        setPageLoader(false);
        setMonthlySubscriptionPlan(response.data.monthlyplans);
        setYearlySubscriptionPlan(response.data.yearlyplans);
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.error(error);
      });
  };

  // list for monthly subscription plan
  const renderMonthlyItem = ({item}: {item: any}) => {
    return (
      <SubscriptionPlanTab
        item={item}
        submitButtonClick={() => {
          if (Platform.OS == 'ios') {
            handleSubmitButtonClick(item);
            // if (mySubscriptionPlan.planname == 'Free (Plan A)') {
            //   handleSubmitButtonClick(item);
            // } else {
            //   toastRef.current.getToast(
            //     'Please cancel your previous subscription',
            //     'warning',
            //   );
            // }
          } else {
            handleSubmitButtonClick(item);
          }
        }}
        currentPlan={mySubscriptionPlan?.price}
      />
    );
  };

  // list for monthly subscription plan
  const renderYearlyItem = ({item}: {item: any}) => {
    return (
      <SubscriptionPlanTab
        item={item}
        submitButtonClick={() => {
          if (Platform.OS == 'ios') {
            handleSubmitButtonClick(item);
            // if (mySubscriptionPlan.planname == 'Free (Plan A)') {
            //   handleSubmitButtonClick(item);
            // } else {
            //   toastRef.current.getToast(
            //     'Please cancel your previous subscription',
            //     'warning',
            //   );
            // }
          } else {
            handleSubmitButtonClick(item);
          }
        }}
        currentPlan={mySubscriptionPlan?.price}
      />
    );
  };

  // navigation on payment click
  const handleSubmitButtonClick = async (item: any) => {
    if (Platform.OS === 'ios') {
      const index = monthlyIosSubs.findIndex(e => e.productId == item.title);
      var data = await requestSubscription({
        sku: monthlyIosSubs[index].productId,
      });
      const postData = {
        planId: item.planid,
        ...data,
      };
      onSubmit(postData);
    } else {
      setPlanId(item.planid);
      setWebViewModal(true);
    }
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
        console.error(error);
      });
  };
  // function on pay button click on api call
  const onSubmit = async (values: any) => {
    const data = {
      plan_id: values?.planId,
      transactionReceipt: values.transactionReceipt,
      transactionId: values.transactionId,
    };
    SubscriptionServices.purchaseAppleSubscription(data)
      .then((response: any) => {
        if (response.data.status) {
          toastRef.current.getToast(response.data.message, 'success');
          getMyPlan();
          getAllPlans();
        } else {
          toastRef.current.getToast(response.data.message, 'warning');
        }
      })
      .catch((error: any) => {
        console.error('error', JSON.stringify(error));
      });
  };
  //UI

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
                screen: 'BusinessHome',
              },
            });
          },
        }}
      />

      {/* my current plan  */}
      {!pageLoader ? (
        <View style={styles.body}>
          <Text style={styles.heading}>Business Subscription</Text>
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

              {mySubscriptionPlan?.price !== '$0/Month' ? (
                <TouchableOpacity
                  onPress={() => {
                    if (Platform.OS === 'android') {
                      setDeleteModal(true);
                    } else {
                      setShowCancelSub(true);
                    }
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
              navigation.navigate('DrawerNavigator', {
                screen: 'BottomNavigator',
                params: {
                  screen: 'BusinessHome',
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
      <CancelSubsIos visible={showCancelSub} setVisibility={setShowCancelSub} />
    </View>
  );
};

export default BusinessSubscriptionPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    flex: 1,
    padding: 10,
  },
  heading: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    padding: 5,
  },
  myCurrentPlanContainer: {
    borderRadius: 30,
    height: 'auto',
    marginBottom: 30,
    marginHorizontal: 10,
    padding: 15,
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
