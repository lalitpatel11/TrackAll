//external imports
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
//internal imports
import AddPostRoutineButton from './AddPostRoutineButton';
import BusinessCommunityService from '../../service/BusinessCommunityService';
import BusinessPostTabs from './BusinessPostTabs';
import BusinessRoutineTab from './BusinessRoutineTab';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import DeleteAlertModal from '../groups/DeleteAlertModal';
// import PageUnFollowModal from './PageUnFollowModal';
import SubscriptionPurchaseModal from './SubscriptionPurchaseModal';
import ViewFollowersModal from './ViewFollowersModal';
import {colors} from '../../constants/ColorConstant';
import ViewAppointmentsModal from './ViewAppointmentsModal';
import BusinessService from '../../service/BusinessService';
import ViewServicesModal from './ViewServicesModal';

const BusinessDetailsPage = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [businessFollowers, setBusinessFollowers] = useState<any[]>([]);
  const [businessId, setBusinessId] = useState<number>(route?.params?.id);
  const [businessPost, setBusinessPost] = useState<any[]>([]);
  const [businessRoutines, setBusinessRoutines] = useState<any[]>([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [followerPageLoader, setFollowerPageLoader] = useState(false);
  const [myUserId, setMyUserId] = useState<any>();
  const [noFollowerData, setNoFollowerData] = useState(false);
  const [pageDetails, setPageDetails] = useState({});
  const [pageLoader, setPageLoader] = useState(false);
  const [planPurchaseVisible, setPlanPurchaseVisible] = useState(false);
  const [postDeleteModal, setPostDeleteModal] = useState(false);
  const [postId, setPostId] = useState<any>();
  const [postRoutine, setPostRoutine] = useState('P');
  const [unFollowModal, setUnFollowModal] = useState(false);
  const [viewAppointmentsModal, setViewAppointmentsModal] = useState(false);
  const [viewFollowersModal, setViewFollowersModal] = useState(false);
  const [viewServicesModal, setViewServicesModal] = useState(false);
  const [allAppointments, setAllAppointments] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [accountId, setAccountId] = useState<any>();
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setBusinessId(route?.params?.id);
      setPageLoader(true);
      getData();
      getBusinessFollowers();
      getAllAppointment();
      getAllService();
    });
    return unsubscribe;
  }, [navigation]);

  // function for api call to get all the business details data
  const getData = async () => {
    // user id for delete and edit icon
    const token = await AsyncStorage.getItem('userId');
    setMyUserId(token);
    const accountId = await AsyncStorage.getItem('accountId');
    setAccountId(accountId);

    BusinessCommunityService.getBusinessDetails(businessId)
      .then((response: any) => {
        setPageDetails(response.data.detail);
        setBusinessPost(response.data.posts);
        setBusinessRoutines(response.data.businessroutines);
        setPageLoader(false);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for api call to get all the appointment
  const getAllAppointment = () => {
    const body = {
      businessid: businessId,
      // selectdate: ,
      // search:
    };

    BusinessCommunityService.postAllAppointmentOnBusiness(body)
      .then((response: any) => {
        setAllAppointments(response?.data?.allappointmentrequest);
        setPageLoader(false);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for api call to search all the page appointment
  const handleSearchAppointmentList = (text: string) => {
    const data = {
      businessid: businessId,
      search: text,
    };
    BusinessCommunityService.postAllAppointmentOnBusiness(data)
      .then((response: any) => {
        if (response?.data?.allfollowers > 0) {
          setNoFollowerData(false);
          setAllAppointments(response?.data?.allappointmentrequest);
          setFollowerPageLoader(false);
        } else {
          setAllAppointments(response?.data?.allappointmentrequest);
          setFollowerPageLoader(false);
          setNoFollowerData(true);
        }
      })
      .catch(error => {
        setFollowerPageLoader(false);
        console.log(error);
      });
  };

  // function for api call to get all the services
  const getAllService = () => {
    const body = {
      businessid: businessId,
    };

    BusinessService.postAllBusinessOnService(body)
      .then((response: any) => {
        setAllServices(response?.data?.allservicelist);
        setPageLoader(false);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for api call to get all the page followers
  const getBusinessFollowers = () => {
    setFollowerPageLoader(true);
    const data = {
      businessid: businessId,
    };
    BusinessCommunityService.postAllBusinessFollowers(data)
      .then((response: any) => {
        setFollowerPageLoader(false);
        setBusinessFollowers(response?.data?.allfollowers);
      })
      .catch(error => {
        setFollowerPageLoader(false);
        console.log(error);
      });
  };

  // function for api call to search all the page followers
  const handleSearchFollowerList = (text: string) => {
    const data = {
      businessid: businessId,
      search: text,
    };
    BusinessCommunityService.postAllBusinessFollowers(data)
      .then((response: any) => {
        if (response?.data?.allfollowers > 0) {
          setNoFollowerData(false);
          setBusinessFollowers(response?.data?.allfollowers);
          setFollowerPageLoader(false);
        } else {
          setBusinessFollowers(response?.data?.allfollowers);
          setFollowerPageLoader(false);
          setNoFollowerData(true);
        }
      })
      .catch(error => {
        setFollowerPageLoader(false);
        console.log(error);
      });
  };

  // function for api call for follow click
  const handleFollowClick = () => {
    const data = {
      businessid: businessId,
      status: 1,
    };
    BusinessCommunityService.postFollowUnFollowBusiness(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getData();
      })
      .catch(error => {
        console.log(error);
      });
  };
  const handleUnFollowClick = () => {
    setUnFollowModal(true);
  };

  // function for api call for unFollow click
  const handleUnFollowYesCLick = () => {
    setUnFollowModal(false);
    const data = {
      businessid: businessId,
      status: 0,
    };
    BusinessCommunityService.postFollowUnFollowBusiness(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getData();
      })
      .catch(error => {
        console.log(error);
      });
  };

  //list for routine tab
  const renderRoutineItem = ({item}: {item: any; index: any}) => {
    return (
      <BusinessRoutineTab item={item} onTabClick={handleOnRoutineTabClick} />
    );
  };

  // navigation for routine details page
  const handleOnRoutineTabClick = (routineId: number) => {
    navigation.navigate('StackNavigation', {
      screen: 'RoutineDetails',
      params: {id: routineId, screen: 'ROUTINE'},
    });
  };

  // function for delete post icon click to open alert modal
  const handlePostDelete = (id: any) => {
    setPostId(id);
    setPostDeleteModal(true);
  };

  // function for api call for delete post click
  const handlePostDeleteClick = () => {
    setPostDeleteModal(false);
    BusinessCommunityService.getDeleteBusinessPost(postId)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getData();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // routine on edit business page on edit icon click
  const handlePostEdit = (item: any) => {
    navigation.navigate('StackNavigation', {
      screen: 'EditBusinessPost',
      params: {id: item.id, data: item, businessId: businessId},
    });
  };

  // function for api call for delete business click
  const handleDelete = () => {
    setDeleteModal(false);
    BusinessCommunityService.getDeleteBusiness(businessId)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        navigation.replace('StackNavigation', {
          screen: 'BusinessCommunity',
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // navigation for purchase business subscription plan
  const handlePlanPurchaseSubmitClick = () => {
    setPlanPurchaseVisible(false);
    navigation.navigate('StackNavigation', {
      screen: 'BusinessSubscriptionPayment',
      params: {
        businessId: businessId,
        price: pageDetails?.price,
      },
    });
  };

  // navigation for purchase business subscription plan
  const handleSubscribe = () => {
    navigation.navigate('StackNavigation', {
      screen: 'BusinessSubscriptionPayment',
      params: {
        businessId: businessId,
        price: pageDetails?.price,
      },
    });
  };

  // function for api call for unsubscribe the page
  const handleUnSubscribe = () => {
    const data = {
      businessid: businessId,
      status: 0,
    };
    BusinessCommunityService.postSubscribeBusiness(data)
      .then((response: any) => {
        getData();
        toastRef.current.getToast(response.data.message, 'success');
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const handleUpdate = () => {
    setViewServicesModal(false);
    setPageLoader(true);
    getData();
    getAllService();
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Business Details'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />
      {!pageLoader ? (
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          nestedScrollEnabled={true}>
          <View style={styles.body}>
            {/* page details section  */}
            <View style={styles.detailsContainer}>
              <View style={styles.direction}>
                {/* image section */}
                {pageDetails?.businessimage ? (
                  <View style={styles.imageContainer}>
                    <Image
                      style={styles.image}
                      resizeMode="cover"
                      source={{uri: `${pageDetails?.businessimage}`}}
                    />
                  </View>
                ) : (
                  <View style={styles.noGroupImageContainer}>
                    <View style={styles.noGroupImage}>
                      <Image
                        resizeMode="cover"
                        style={styles.image}
                        source={require('../../assets/pngImage/noImage.png')}
                      />
                    </View>
                  </View>
                )}

                <View style={styles.followDirection}>
                  {/* name and follower section */}
                  <View style={styles.amountContainer}>
                    <Text style={styles.pageName}>{pageDetails?.name}</Text>
                    <Text style={styles.followerText}>
                      {pageDetails?.totalfollow} Followers
                    </Text>
                  </View>

                  {/* follow un follow button section on the basis of user id */}
                  <View>
                    {pageDetails?.created_by != myUserId ? (
                      <>
                        {pageDetails?.youfollow == 'Not Following' ? (
                          <TouchableOpacity
                            style={styles.followContainer}
                            onPress={() => {
                              handleFollowClick();
                            }}>
                            <Text style={styles.followText}>Follow </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={styles.followingContainer}
                            onPress={() => {
                              handleUnFollowClick();
                            }}>
                            <Text style={styles.followingText}>UnFollow</Text>
                          </TouchableOpacity>
                        )}
                      </>
                    ) : null}
                  </View>

                  {/* edit delete icon basis of my user id */}
                  <View style={styles.iconsContainer}>
                    {pageDetails?.created_by == myUserId &&
                    pageDetails?.user_type_id != 2 ? (
                      <View style={styles.direction}>
                        {/* edit icon  */}
                        <TouchableOpacity
                          style={styles.editContainer}
                          onPress={() => {
                            navigation.navigate('StackNavigation', {
                              screen: 'EditBusiness',
                              params: {
                                data: pageDetails,
                              },
                            });
                          }}>
                          <Image
                            resizeMode="contain"
                            style={styles.icon}
                            source={require('../../assets/pngImage/editIcon.png')}
                          />
                        </TouchableOpacity>

                        {/* delete icon  */}
                        <TouchableOpacity
                          style={styles.editContainer}
                          onPress={() => {
                            setDeleteModal(true);
                          }}>
                          <Image
                            resizeMode="contain"
                            style={styles.icon}
                            source={require('../../assets/pngImage/Trash.png')}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>

              {pageDetails?.created_by != myUserId ? (
                <TouchableOpacity
                  style={styles.appointmentContainer}
                  onPress={() => {
                    navigation.navigate('StackNavigation', {
                      screen: 'AddNewAppointment',
                      params: {
                        businessId: businessId,
                        businessName: pageDetails?.name,
                      },
                    });
                  }}>
                  <Text style={styles.followText}>Schedule Appointment </Text>
                </TouchableOpacity>
              ) : null}

              {/* post, routine, follower and subscribes count */}
              <View style={styles.countDirection}>
                {/* post */}
                <TouchableOpacity
                  style={styles.countContainer}
                  onPress={() => {
                    setPostRoutine('P');
                  }}>
                  <Text style={styles.countNumber}>
                    {pageDetails?.postCount}
                  </Text>
                  <Text style={styles.countText}>Posts</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                {/* routine */}
                <TouchableOpacity
                  style={styles.countContainer}
                  onPress={() => {
                    setPostRoutine('R');
                  }}>
                  <Text style={styles.countNumber}>
                    {pageDetails?.routineCount}
                  </Text>
                  <Text style={styles.countText}>Routines</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                {/* Appointments */}
                <TouchableOpacity
                  style={styles.countContainer}
                  onPress={() => {
                    setViewAppointmentsModal(true);
                  }}>
                  <Text style={styles.countNumber}>
                    {pageDetails?.appointmentcount}
                  </Text>
                  <Text style={styles.countText}>Appointments</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                {/* followers */}
                <TouchableOpacity
                  onPress={() => setViewFollowersModal(true)}
                  style={styles.countContainer}>
                  <Text style={styles.countNumber}>
                    {pageDetails?.followersCount}
                  </Text>
                  <Text style={styles.countText}>Followers</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                {/* subscriber */}
                <TouchableOpacity
                  onPress={() => setViewServicesModal(true)}
                  style={styles.countContainer}>
                  <Text style={styles.countNumber}>
                    {pageDetails?.allServicesCount}
                  </Text>
                  <Text style={styles.countText}>Services</Text>
                </TouchableOpacity>
              </View>

              {/* location section */}
              <View style={styles.direction}>
                <View style={styles.locationIconContainer}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    source={require('../../assets/pngImage/location.png')}
                  />
                </View>
                <Text style={styles.locationText}>{pageDetails?.address}</Text>
              </View>

              {/* description section */}
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>
                  {pageDetails?.description}
                </Text>
              </View>
            </View>

            {/* subscribe section based on user id and subscription status */}
            {pageDetails?.created_by != myUserId ? (
              pageDetails?.subscribed == '1' ? (
                <View style={styles.backgroundImageContainer}>
                  <Image
                    resizeMode="stretch"
                    style={styles.image}
                    source={require('../../assets/pngImage/backgroundframe.png')}
                  />
                  <View style={styles.subscribeDirection}>
                    <Text style={styles.subscribeText}>
                      Subscribe to view all{'\n'}Post & Routine
                    </Text>
                    {pageDetails?.yousubscribe == 'Not subscribed' ? (
                      <TouchableOpacity
                        style={styles.followContainer}
                        onPress={() => {
                          handleSubscribe();
                        }}>
                        <Text style={styles.followText}>Subscribe Now</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.followContainer}
                        onPress={() => {
                          handleUnSubscribe();
                        }}>
                        <Text style={styles.followText}>UnSubscribe</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ) : null
            ) : null}

            {/* post and routine button section */}
            <View style={styles.buttonDirection}>
              <TouchableOpacity
                style={
                  postRoutine == 'P'
                    ? styles.buttonContainer
                    : styles.disableButtonContainer
                }
                onPress={() => {
                  setPostRoutine('P');
                }}>
                <Text
                  style={
                    postRoutine == 'P'
                      ? styles.buttonText
                      : styles.disableButtonText
                  }>
                  Posts
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  postRoutine == 'R'
                    ? styles.buttonContainer
                    : styles.disableButtonContainer
                }
                onPress={() => {
                  setPostRoutine('R');
                }}>
                <Text
                  style={
                    postRoutine == 'R'
                      ? styles.buttonText
                      : styles.disableButtonText
                  }>
                  Routines
                </Text>
              </TouchableOpacity>
            </View>

            {/* post and routine tabs section */}
            {postRoutine == 'P' ? (
              <>
                {businessPost?.length > 0 ? (
                  <View style={styles.postContainer}>
                    <ScrollView nestedScrollEnabled={true}>
                      {businessPost.map(item => {
                        return (
                          <BusinessPostTabs
                            items={item}
                            pageDetails={pageDetails}
                            myUserId={myUserId}
                            handlePostDelete={handlePostDelete}
                            handlePostEdit={handlePostEdit}
                          />
                        );
                      })}
                    </ScrollView>
                  </View>
                ) : (
                  <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>
                      No post added yet. {'\n'}Click on the "+" icon to create a
                      post.
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <>
                {businessRoutines?.length > 0 ? (
                  <View style={styles.postContainer}>
                    <FlatList
                      data={businessRoutines}
                      renderItem={renderRoutineItem}
                      keyExtractor={(item: any, index: any) => String(index)}
                    />
                  </View>
                ) : (
                  <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>
                      No routine added yet.{'\n'}Click on the "+" icon to create
                      a routine.
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}

      {/* create post and community icon  based on user id */}
      {pageDetails?.user_type_id == 2 ? (
        <>
          {pageDetails?.created_by == myUserId &&
          pageDetails?.id == accountId ? (
            <View style={styles.createIconContainer}>
              <AddPostRoutineButton
                navigation={navigation}
                businessId={businessId}
              />
            </View>
          ) : null}
        </>
      ) : (
        <>
          {pageDetails?.created_by == myUserId ? (
            <View style={styles.createIconContainer}>
              <AddPostRoutineButton
                navigation={navigation}
                businessId={businessId}
              />
            </View>
          ) : null}
        </>
      )}

      {/* Modal for purchase plan*/}
      <SubscriptionPurchaseModal
        visibleModal={planPurchaseVisible}
        onClose={() => {
          setPlanPurchaseVisible(false);
        }}
        onSubmitClick={handlePlanPurchaseSubmitClick}
      />

      {/* Delete alert modal for unFollow business */}
      <DeleteAlertModal
        visibleModal={unFollowModal}
        onRequestClosed={() => {
          setUnFollowModal(false);
        }}
        onPressRightButton={() => {
          handleUnFollowYesCLick();
        }}
        subHeading={'Are you sure you want to unfollow this page?'}
      />

      {/* Modal on view appointments click */}
      <ViewAppointmentsModal
        visibleModal={viewAppointmentsModal}
        onClose={() => {
          setViewAppointmentsModal(false);
        }}
        data={allAppointments}
        getAllSearchSList={handleSearchAppointmentList}
        noFollowerData={noFollowerData}
        followerPageLoader={followerPageLoader}
      />

      {/* Modal on view follower click */}
      <ViewFollowersModal
        visibleModal={viewFollowersModal}
        onClose={() => {
          setViewFollowersModal(false);
        }}
        data={businessFollowers}
        getAllSearchSList={handleSearchFollowerList}
        noFollowerData={noFollowerData}
        followerPageLoader={followerPageLoader}
      />

      {/* Modal on view services click */}
      <ViewServicesModal
        visibleModal={viewServicesModal}
        onClose={() => {
          setViewServicesModal(false);
        }}
        data={allServices}
        getAllSearchSList={() => {}}
        noFollowerData={noFollowerData}
        followerPageLoader={followerPageLoader}
        getUpdate={handleUpdate}
      />

      {/* Delete alert modal for delete business */}
      <DeleteAlertModal
        visibleModal={deleteModal}
        onRequestClosed={() => {
          setDeleteModal(false);
        }}
        onPressRightButton={() => {
          handleDelete();
        }}
        subHeading={'Are you sure you want to delete this business ?'}
      />

      {/* Delete alert modal for delete post */}
      <DeleteAlertModal
        visibleModal={postDeleteModal}
        onRequestClosed={() => {
          setPostDeleteModal(false);
        }}
        onPressRightButton={() => {
          handlePostDeleteClick();
        }}
        subHeading={'Are you sure you want to delete this post ?'}
      />
      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default BusinessDetailsPage;
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {padding: 15},
  direction: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  detailsContainer: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    height: 'auto',
    padding: 5,
  },
  imageContainer: {
    borderRadius: 50,
    height: 80,
    marginLeft: 10,
    width: 80,
  },
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
  noGroupImageContainer: {
    alignItems: 'center',
    backgroundColor: colors.GRAY,
    borderColor: colors.THEME_WHITE,
    borderRadius: 50,
    borderWidth: 3,
    height: 80,
    justifyContent: 'center',
    marginLeft: 10,
    width: 80,
  },
  noGroupImage: {
    height: 40,
    width: 35,
  },
  followDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '72%',
  },
  amountContainer: {
    paddingHorizontal: 5,
    width: '75%',
  },
  pageName: {
    color: colors.WHITE,
    fontSize: 20,
    fontWeight: '500',
    width: '100%',
  },
  followerText: {
    color: colors.THEME_WHITE,
    fontSize: 12,
    fontWeight: '400',
    paddingVertical: 8,
  },
  countDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  countContainer: {
    alignItems: 'center',
    height: 60,
    justifyContent: 'center',
    margin: 2,
    marginVertical: 10,
    width: 'auto',
  },
  countNumber: {
    color: colors.WHITE,
    fontSize: 24,
    fontWeight: '500',
  },
  countText: {
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: '400',
  },
  divider: {
    backgroundColor: colors.WHITE,
    height: 25,
    width: 1,
  },
  appointmentContainer: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    justifyContent: 'center',
    width: '45%',
    marginTop: 10,
  },
  followContainer: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    justifyContent: 'center',
    width: 'auto',
  },
  followText: {
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  followingContainer: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    elevation: 5,
    justifyContent: 'center',
    width: 'auto',
  },
  followingText: {
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: '400',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  locationText: {
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: '400',
    paddingHorizontal: 5,
  },
  descriptionContainer: {
    height: 'auto',
    marginVertical: 5,
    padding: 5,
  },
  descriptionText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '400',
    paddingHorizontal: 5,
    textAlign: 'justify',
  },
  locationIconContainer: {
    borderRadius: 50,
    height: 20,
    marginLeft: 5,
    width: 20,
  },
  buttonDirection: {
    backgroundColor: colors.BLACK3,
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    padding: 5,
  },
  buttonContainer: {
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    height: 46,
    justifyContent: 'center',
    width: '50%',
  },
  buttonText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  disableButtonContainer: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: '50%',
  },
  disableButtonText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '400',
  },
  backgroundImageContainer: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    height: 80,
    marginTop: 10,
    width: '100%',
  },
  subscribeDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    position: 'absolute',
    top: 20,
    zIndex: 1,
  },
  subscribeText: {
    color: colors.WHITE,
    fontSize: 20,
    width: '70%',
  },
  iconsContainer: {
    height: 30,
    width: '20%',
  },
  editContainer: {
    alignItems: 'center',
    borderRadius: 50,
    justifyContent: 'center',
    marginHorizontal: 2,
    padding: 3,
  },
  loaderContainer: {
    alignSelf: 'center',
    height: '83%',
    justifyContent: 'center',
  },
  postContainer: {
    elevation: 8,
    height: 'auto',
  },
  noDataContainer: {
    alignItems: 'center',
    height: 320,
    justifyContent: 'center',
  },
  noDataText: {
    color: colors.WHITE,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  createIconContainer: {
    bottom: 30,
    position: 'absolute',
    right: 10,
    zIndex: 1,
  },
  createIconContainerDisable: {
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderRadius: 100,
    bottom: 60,
    height: 60,
    justifyContent: 'center',
    padding: 20,
    position: 'absolute',
    right: 25,
    width: 60,
    zIndex: 1,
  },
  createIconImage: {
    borderRadius: 100,
    width: 25,
    height: 25,
  },
  icon: {
    height: 18,
    width: 18,
  },
});
