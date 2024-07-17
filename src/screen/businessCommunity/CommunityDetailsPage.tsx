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
import React, {useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
// internal imports
import CustomHeader from '../../constants/CustomHeader';
import {colors} from '../../constants/ColorConstant';
import PageUnFollowModal from './PageUnFollowModal';
import BusinessCommunityService from '../../service/BusinessCommunityService';
import CommonToast from '../../constants/CommonToast';
import ViewFollowersModal from './ViewFollowersModal';
import DeleteAlertModal from '../groups/DeleteAlertModal';
import BusinessPostTabs from './BusinessPostTabs';

const CommunityDetailsPage = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [communityFollowers, setCommunityFollowers] = useState<any[]>([]);
  const [communityId, setCommunityId] = useState(route?.params?.id);
  const [communityPost, setCommunityPost] = useState<any[]>([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [followerPageLoader, setFollowerPageLoader] = useState(false);
  const [myUserId, setMyUserId] = useState<any>();
  const [noFollowerData, setNoFollowerData] = useState(false);
  const [pageDetails, setPageDetails] = useState({});
  const [pageLoader, setPageLoader] = useState(false);
  const [postDeleteModal, setPostDeleteModal] = useState(false);
  const [postId, setPostId] = useState<any>();
  const [unFollowModal, setUnFollowModal] = useState(false);
  const [viewFollowersModal, setViewFollowersModal] = useState(false);
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setCommunityId(route?.params?.id);
      setPageLoader(true);
      getData();
      getCommunityFollowers();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get all community data api call
  const getData = async () => {
    // user id for delete and edit icon
    const token = await AsyncStorage.getItem('userId');
    setMyUserId(token);

    BusinessCommunityService.getCommunityDetails(communityId)
      .then((response: any) => {
        setPageDetails(response.data.communitydetail);
        setCommunityPost(response.data.posts);
        setPageLoader(false);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for get all the page followers data api call
  const getCommunityFollowers = () => {
    const data = {
      communityid: communityId,
    };
    BusinessCommunityService.postAllCommunityFollowers(data)
      .then((response: any) => {
        setFollowerPageLoader(false);
        setCommunityFollowers(response.data.allfollowers);
      })
      .catch(error => {
        setFollowerPageLoader(false);
        console.log(error);
      });
  };

  // function for search all the page followers data api call
  const handleSearchFollowerList = (text: string) => {
    const data = {
      communityid: communityId,
      search: text,
    };
    BusinessCommunityService.postAllCommunityFollowers(data)
      .then((response: any) => {
        if (response.data.allfollowers > 0) {
          setNoFollowerData(false);
          setCommunityFollowers(response.data.allfollowers);
          setFollowerPageLoader(false);
        } else {
          setCommunityFollowers(response.data.allfollowers);
          setFollowerPageLoader(false);
          setNoFollowerData(true);
        }
      })
      .catch(error => {
        setFollowerPageLoader(false);
        console.log(error);
      });
  };

  // function for follow click api call
  const handleFollowClick = () => {
    const data = {
      communityid: communityId,
      status: 1,
    };
    BusinessCommunityService.postFollowUnFollowCommunity(data)
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

  // function for unFollow click api call
  const handleUnFollowYesCLick = () => {
    setUnFollowModal(false);
    const data = {
      communityid: communityId,
      status: 0,
    };
    BusinessCommunityService.postFollowUnFollowCommunity(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getData();
      })
      .catch(error => {
        console.log(error);
      });
  };

  // function on delete post icon click
  const handlePostDelete = (id: any) => {
    setPostId(id);
    setPostDeleteModal(true);
  };

  // function on delete post icon click api call
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

  // navigation on edit  community post icon click
  const handlePostEdit = (item: any) => {
    navigation.navigate('StackNavigation', {
      screen: 'EditCommunityPost',
      params: {id: item.id, data: item, communityId: communityId},
    });
  };

  // function on edit post click api call
  const handleDelete = () => {
    setDeleteModal(false);
    BusinessCommunityService.getDeleteCommunity(communityId)
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

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Community Details'}
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
                {pageDetails?.communityimage ? (
                  <View style={styles.imageContainer}>
                    <Image
                      style={styles.image}
                      resizeMode="contain"
                      source={{uri: `${pageDetails?.communityimage}`}}
                    />
                  </View>
                ) : (
                  <View style={styles.noGroupImageContainer}>
                    <View style={styles.noGroupImage}>
                      <Image
                        resizeMode="contain"
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

                  {/* edit delete icon basis of my user id */}
                  <View style={styles.iconsContainer}>
                    {pageDetails?.created_by == myUserId ? (
                      <View style={styles.direction}>
                        {/* edit icon  */}
                        <TouchableOpacity
                          style={styles.editContainer}
                          onPress={() => {
                            navigation.navigate('StackNavigation', {
                              screen: 'EditCommunity',
                              params: {
                                data: pageDetails,
                              },
                            });
                          }}>
                          <Image
                            resizeMode="contain"
                            style={{height: 18, width: 18}}
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
                            style={{height: 18, width: 18}}
                            source={require('../../assets/pngImage/Trash.png')}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>

              {/* post and follower count */}
              <View style={styles.direction}>
                <View style={styles.countContainer}>
                  <Text style={styles.countNumber}>
                    {pageDetails?.postCount}
                  </Text>
                  <Text style={styles.countText}>Posts</Text>
                </View>

                <View style={styles.divider} />

                <TouchableOpacity
                  onPress={() => setViewFollowersModal(true)}
                  style={styles.countContainer}>
                  <Text style={styles.countNumber}>
                    {pageDetails?.followersCount}
                  </Text>
                  <Text style={styles.countText}>Followers</Text>
                </TouchableOpacity>
              </View>

              {/* description section */}
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>
                  {pageDetails?.description}
                </Text>
              </View>
            </View>

            {/* post title section */}
            {communityPost?.length > 0 ? (
              <View style={styles.textDirection}>
                <Text style={styles.labelText}>Post</Text>
              </View>
            ) : null}

            {/* post tabs section */}
            {communityPost?.length > 0 ? (
              <View style={styles.postContainer}>
                <ScrollView nestedScrollEnabled={true}>
                  {communityPost.map(item => {
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
                  No Post Added. {'\n'}Click on the "+" icon to create a post.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}

      {/* create notes icon  */}
      <LinearGradient
        colors={['#F28520', '#F5BD35']}
        style={styles.createIconContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('StackNavigation', {
              screen: 'CreateCommunityPost',
              params: {id: communityId},
            });
          }}>
          <Image
            style={styles.createIconImage}
            resizeMode="contain"
            source={require('../../assets/pngImage/Plus.png')}
          />
        </TouchableOpacity>
      </LinearGradient>

      {/* Modal on unFollow click */}
      <PageUnFollowModal
        visibleModal={unFollowModal}
        onClose={() => {
          setUnFollowModal(false);
        }}
        handleUnFollowYesCLick={handleUnFollowYesCLick}
      />

      {/* Modal on view follower click */}
      <ViewFollowersModal
        visibleModal={viewFollowersModal}
        onClose={() => {
          setViewFollowersModal(false);
        }}
        data={communityFollowers}
        getAllSearchSList={handleSearchFollowerList}
        noFollowerData={noFollowerData}
        followerPageLoader={followerPageLoader}
      />

      {/* Delete alert modal for delete community */}
      <DeleteAlertModal
        visibleModal={deleteModal}
        onRequestClosed={() => {
          setDeleteModal(false);
        }}
        onPressRightButton={() => {
          handleDelete();
        }}
        subHeading={'Are you sure you want to delete this community ?'}
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

export default CommunityDetailsPage;
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    padding: 15,
  },
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
    height: 60,
    marginLeft: 10,
    width: 60,
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
    height: 60,
    justifyContent: 'center',
    marginLeft: 10,
    width: 60,
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
    width: '76%',
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
  countContainer: {
    alignItems: 'center',
    height: 60,
    justifyContent: 'center',
    margin: 3,
    marginVertical: 10,
    width: 80,
  },
  countNumber: {
    color: colors.WHITE,
    fontSize: 24,
    fontWeight: '500',
  },
  countText: {
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    backgroundColor: colors.WHITE,
    height: 25,
    width: 1,
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
  textDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  labelText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    marginTop: 5,
    paddingVertical: 15,
  },
  viewAllText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '500',
  },
  postContainer: {
    height: 'auto',
  },
  iconsContainer: {
    width: '20%',
    height: 30,
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
    height: 25,
    width: 25,
  },
});
