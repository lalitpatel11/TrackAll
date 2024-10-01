//import : react components
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
//import : custom components
import CustomHeader from '../../constants/CustomHeader';
import SubscriptionPlanTab from './SubscriptionPlanTab';
//import : third parties
import AppIntroSlider from 'react-native-app-intro-slider';
import LinearGradient from 'react-native-linear-gradient';
import WebView from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import : utils
import {colors} from '../../constants/ColorConstant';
import {API} from '../../service/api/ApiDetails';
import SubscriptionServices from '../../service/SubscriptionServices';
//import : modals
import DeleteAlertModal from '../groups/DeleteAlertModal';
//import : redux
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
import CommonToast from '../../constants/CommonToast';
import {Button} from 'native-base';
import BorderBtn from '../../components/Button/BorderBtn';

const SubscriptionPlan = ({navigation}: {navigation: any}) => {
  //variables
  const productSkus = Platform.select({
    ios: ['Plan_b_monthly'], //will receive from apple account
    android: [],
    default: [],
  }) as string[];
  const toastRef = useRef<any>();
  //hook : states
  const [deleteModal, setDeleteModal] = useState(false);
  const [mySubscriptionPlan, setMySubscriptionPlan] = useState([]);
  const [pageLoader, setPageLoader] = useState(false);
  const [monthlySubscriptionPlan, setMonthlySubscriptionPlan] = useState([]);
  const [yearlySubscriptionPlan, setYearlySubscriptionPlan] = useState([]);
  const [myUserId, setMyUserId] = useState<any>();
  const [planId, setPlanId] = useState('');
  const [webViewModal, setWebViewModal] = useState(false);
  const [monthlyIosSubs, setMonthlyIosSubs] = useState<any>([]);
  const [showCancelSub, setShowCancelSub] = useState(false);
  const [currentPlan, setCurrentPlan] = React.useState<any>(undefined);
  const [nextButtonLoader, setNextButtonLoader] =
    React.useState<boolean>(false);
  const [subscriptionModal, setSybscriptionModal] =
    React.useState<boolean>(false);
  //function : imp functio
  useEffect(() => {
    let purchaseUpdateSubscription = null;
    let purchaseErrorSubscription = null;
    const initializeConnection = async () => {
      try {
        await initConnection();
        fetchProducts();
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
      } catch (error: any) {
        console.error('An error occurred', error.message);
      }
    };
    initializeConnection();
    return () => {
      purchaseUpdateSubscription = null;
      purchaseErrorSubscription = null;
      endConnection();
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
    } catch (error: any) {
      console.error('Error occurred while fetching products', error.message);
    }
  };

  // navigation on payment click
  const handleSubmitButtonClick = async (item: any) => {
    try {
      setNextButtonLoader(true);
      if (Platform.OS === 'ios') {
        const index = monthlyIosSubs.findIndex(
          (e: any) => e.productId == item.title,
        );
        var data = await requestSubscription({
          sku: monthlyIosSubs[index]?.productId,
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
    } catch (err: any) {
      console.log('err in requestSubscription', err?.message);
    } finally {
      setNextButtonLoader(false);
    }
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
  const handleSkip = () => {
    return <View />;
  };
  //function : serv func
  const getMyPlan = async () => {
    const token = await AsyncStorage.getItem('userId');
    setMyUserId(token);
    SubscriptionServices.getMySubscription()
      .then((response: any) => {
        console.log('RESPONSE:::::', response.data);

        setPageLoader(false);
        setMySubscriptionPlan(response.data.plandetails);
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log(error);
      });
  };
  const getAllPlans = () => {
    SubscriptionServices.getAllSubscription()
      .then((response: any) => {
        setPageLoader(false);
        setMonthlySubscriptionPlan(response.data.monthlyplans);
        setYearlySubscriptionPlan(response.data.yearlyplans);
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log(error);
      });
  };

  //function : render func
  const renderMonthlyItem = ({item}: {item: any}) => {
    return (
      <SubscriptionPlanTab
        item={item}
        submitButtonClick={() => {
          if (Platform.OS == 'ios') {
            subscriptionModalHandler(item);
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
  const renderYearlyItem = ({item}: {item: any}) => {
    return (
      <SubscriptionPlanTab
        item={item}
        submitButtonClick={() => {
          if (Platform.OS == 'ios') {
            subscriptionModalHandler(item);
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

  // function for cancel plan click
  const handleCancelPlan = () => {
    setDeleteModal(false);
    SubscriptionServices.getCancelSubscription()
      .then(response => {
        getMyPlan();
      })
      .catch(error => {
        console.log(error);
      });
  };
  //hook : useEffect
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPageLoader(true);
      getMyPlan();
      getAllPlans();
    });
    return unsubscribe;
  }, [navigation]);

  const goToAppAgreement = (termAndCondition = false) => {
    navigation.navigate('StackNavigation', {
      screen: termAndCondition ? 'TermAndCondition' : 'PrivacyPolicy',
    });
  };

  const subscriptionModalHandler = (item?: any) => {
    setCurrentPlan(item);
    setSybscriptionModal(value => !value);
  };

  //UI
  return (
    <>
      <View style={styles.container}>
        {/* header section */}
        <CustomHeader
          headerText={'Subscriptions'}
          backButton={{
            visible: true,
            onClick: () => {
              navigation.goBack();
            },
          }}
        />

        <View style={styles.agreementLinksContainer}>
          <TouchableOpacity
            onPress={() => {
              goToAppAgreement(true);
            }}>
            <Text style={{color: colors.THEME_ORANGE, fontSize: 15}}>
              Term of use
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              goToAppAgreement(false);
            }}>
            <Text style={{color: colors.THEME_ORANGE, fontSize: 15}}>
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>

        {/* my current plan  */}
        {!pageLoader ? (
          <View style={styles.body}>
            <Text style={styles.heading}>My Subscription</Text>
            <LinearGradient
              colors={['#F5B532', '#F28520']}
              style={styles.myCurrentPlanContainer}>
              {/* background image  */}
              <Image
                style={styles.backgroundImage}
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
        <CommonToast ref={toastRef} />
        <CancelSubsIos
          visible={showCancelSub}
          setVisibility={setShowCancelSub}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={subscriptionModal}
        style={{backgroundColor: 'rgba(0,0,0,0.3)'}}>
        <View style={{...styles.modalContainer, justifyContent: 'flex-end'}}>
          <View style={styles.wrapper}>
            <Text style={styles.subscriptionText}>Subscription Details</Text>
            <Text
              style={{
                marginTop: 5,
                paddingHorizontal: 10,
                fontSize: 15,
                color: 'black',
              }}>
              Your subscription will automatically renew unless auto-renew is
              turned off at least 24 hours before the current period ends. Your
              account will be charged for renewal within 24 hours prior to the
              end of the current period at the cost of the selected
              subscription.
              {'\n'}
              {'\n'}Payment will be charged to your iTunes Account at
              confirmation of purchase.
              {'\n'}
              {'\n'}You can manage your subscription and turn off auto-renewal
              by going to your Account Settings after purchase.
            </Text>
            <View style={styles.buttonContainer}>
              <BorderBtn
                loader={nextButtonLoader}
                disable={nextButtonLoader}
                buttonText="Continue"
                containerStyle={{
                  width: '85%',
                }}
                onClick={() => {
                  handleSubmitButtonClick(currentPlan);
                }}
              />
              <BorderBtn
                buttonText="Cancel"
                disable={nextButtonLoader}
                containerStyle={{
                  marginTop: 7,
                  width: '85%',
                  backgroundColor: 'red',
                }}
                buttonTextStyle={{color: 'white'}}
                onClick={subscriptionModalHandler}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default SubscriptionPlan;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK2,
    flex: 1,
  },
  agreementLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 7,
    paddingHorizontal: 10,
  },
  body: {
    flex: 1,
    padding: 10,
  },
  backgroundImage: {
    height: 130,
    position: 'absolute',
    width: 400,
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
    fontSize: 18,
    fontWeight: '700',
  },
  myPlanPrice: {
    color: colors.WHITE,
    fontSize: 18,
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
    borderRadius: 10,
    height: 30,
    padding: 5,
    position: 'absolute',
    right: 0,
    width: 'auto',
    zIndex: 1,
  },
  cancelButtonText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '500',
  },
  webViewStyle: {
    flex: 1,
    height: '100%',
    marginTop: 10,
    position: 'absolute',
    width: '100%',
    zIndex: 999,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  policyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  policy: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
  },
  line: {
    height: 5,
    width: 1,
    backgroundColor: 'gray',
  },
  wrapper: {
    paddingTop: 15,
    alignItems: 'center',
    // elevation: 2,
    height: '70%',
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 5,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  subscriptionText: {
    marginBottom: 10,
    fontSize: 16,
    color: colors.THEME_ORANGE,
    fontWeight: '500',
  },
});
