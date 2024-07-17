//external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
//internal imports
import AddBusinessCommunityButton from './AddBusinessCommunityButton';
import BusinessCommunityService from '../../service/BusinessCommunityService';
import CommonToast from '../../constants/CommonToast';
import CommunityPageTab from './CommunityPageTab';
import CustomHeader from '../../constants/CustomHeader';
import SuggestedBusinessPageTab from './SuggestedBusinessPageTab';
import {colors} from '../../constants/ColorConstant';

const BusinessCommunity = ({navigation}: {navigation: any}) => {
  const [allCommunity, setAllCommunity] = useState<any[]>([]);
  const [checkedTab, setCheckedTab] = useState('');
  const [mainCategory, setMainCategory] = useState('B');
  const [myBusiness, setMyBusiness] = useState<any[]>([]);
  const [myCommunity, setMyCommunity] = useState<any[]>([]);
  const [pageLoader, setPageLoader] = useState(true);
  const [recentBusinessCount, setRecentBusinessCount] = useState(0);
  const [recentBusinessData, setRecentBusinessData] = useState<any[]>([]);
  const [recentCommunityCount, setRecentCommunityCount] = useState(0);
  const [recentCommunityData, setRecentCommunityData] = useState<any[]>([]);
  const [recentlyVisitedBusiness, setRecentlyVisitedBusiness] = useState<any[]>(
    [],
  );
  const [suggestedBusiness, setSuggestedBusiness] = useState<any[]>([]);
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPageLoader(true);
      getBusinessData();
      getCommunityData();
    });
    return unsubscribe;
  }, [navigation]);

  // get all business data
  const getBusinessData = async () => {
    setPageLoader(true);
    BusinessCommunityService.postHomeBusiness()
      .then((response: any) => {
        setMyBusiness(response?.data?.mybusiness);
        setRecentlyVisitedBusiness(response?.data?.allrecentlyvisitedbusiness);
        setSuggestedBusiness(response?.data?.allsuggestedbusiness);
        setRecentBusinessCount(response?.data?.allbusinesscountnotification);
        setRecentBusinessData(response?.data?.allrecentactivitybusiness);
        setPageLoader(false);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // get all community data
  const getCommunityData = () => {
    setPageLoader(true);
    BusinessCommunityService.postHomeCommunity()
      .then((response: any) => {
        setMyCommunity(response.data.mycommunity);
        setAllCommunity(response.data.allcommunity);
        setRecentCommunityCount(response.data.allcommunitynotification);
        setRecentCommunityData(response.data.allrecentactivitycommunity);
        setPageLoader(false);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // list for all business page tab
  const renderSuggestedPageList = ({item}: {item: any; index: any}) => {
    return (
      <SuggestedBusinessPageTab
        items={item}
        handleView={handleViewBusinessPage}
      />
    );
  };

  // navigation for business details page
  const handleViewBusinessPage = (pageId: number) => {
    navigation.navigate('StackNavigation', {
      screen: 'BusinessDetailsPage',
      params: {id: pageId},
    });
  };

  // navigation for community details page
  const handleViewCommunityPage = (pageId: number) => {
    navigation.navigate('StackNavigation', {
      screen: 'CommunityDetailsPage',
      params: {id: pageId},
    });
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Business/Community'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* business and community category section  */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          onPress={() => {
            setMainCategory('B');
            getCommunityData();
            setCheckedTab('');
          }}
          style={
            mainCategory === 'B' ? styles.categoryTabBorder : styles.categoryTab
          }>
          <Text
            style={
              mainCategory === 'B'
                ? styles.categoryTextColor
                : styles.categoryText
            }>
            Business
          </Text>
          {recentBusinessCount > 0 ? (
            <Text style={styles.notificationText}>{recentBusinessCount}</Text>
          ) : null}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setMainCategory('C');
            getBusinessData();
            setCheckedTab('');
          }}
          style={
            mainCategory === 'C' ? styles.categoryTabBorder : styles.categoryTab
          }>
          <Text
            style={
              mainCategory === 'C'
                ? styles.categoryTextColor
                : styles.categoryText
            }>
            Community
          </Text>
          {recentCommunityCount > 0 ? (
            <Text style={styles.notificationText}>{recentCommunityCount}</Text>
          ) : null}
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        {/* search field  */}
        <View style={styles.searchBoxContainer}>
          <View style={styles.inputContainer}>
            {mainCategory === 'B' ? (
              <TextInput
                placeholder="Search By Name, City, State, Zip Code"
                placeholderTextColor={colors.textGray}
                style={styles.searchInput}
                onPressIn={() => {
                  navigation.navigate('StackNavigation', {
                    screen: 'SuggestedBusinessPages',
                    params: {screen: 'business'},
                  });
                }}
              />
            ) : (
              <TextInput
                placeholder="Search By Community Name"
                placeholderTextColor={colors.textGray}
                style={styles.searchInput}
                onPressIn={() => {
                  navigation.navigate('StackNavigation', {
                    screen: 'SuggestedCommunityPages',
                    params: {screen: 'community'},
                  });
                }}
              />
            )}
          </View>

          <View style={styles.searchContainer}>
            <Image
              resizeMode="contain"
              source={require('../../assets/pngImage/searchIcon.png')}
            />
          </View>
        </View>
      </View>

      {!pageLoader ? (
        <View style={{height: '80%'}}>
          {mainCategory === 'B' ? (
            <ScrollView
              contentContainerStyle={{
                paddingBottom: '20%',
              }}
              style={{
                marginBottom: 5,
              }}>
              {/* recent notification section for business*/}
              {recentBusinessData?.length > 0 ? (
                <>
                  <View style={styles.textDirection}>
                    <Text style={styles.labelText}>Recent Activity</Text>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('StackNavigation', {
                          screen: 'RecentActivityBusinessPages',
                        });
                      }}>
                      <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{marginBottom: 5}}>
                    <FlatList
                      data={recentBusinessData}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      renderItem={renderSuggestedPageList}
                      keyExtractor={(item: any, index: any) => String(index)}
                    />
                  </View>
                </>
              ) : null}

              {/* My business Pages section */}
              {myBusiness?.length > 0 ? (
                <>
                  <View style={styles.textDirection}>
                    <Text style={styles.labelText}>My Business Pages</Text>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('StackNavigation', {
                          screen: 'MyBusinessPages',
                        });
                      }}>
                      <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                  </View>

                  {myBusiness?.length > 0 ? (
                    <View style={{marginBottom: 5}}>
                      <FlatList
                        data={myBusiness}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={renderSuggestedPageList}
                        keyExtractor={(item: any, index: any) => String(index)}
                      />
                    </View>
                  ) : (
                    <View style={styles.noBusinessContainer}>
                      <Text style={styles.noDataText}>
                        No Business Created.{'\n'}Click on the "+" icon to
                        create a business.
                      </Text>
                    </View>
                  )}
                </>
              ) : null}

              {/* Recently Visited Pages section */}
              {recentlyVisitedBusiness?.length > 0 ? (
                <View style={styles.textDirection}>
                  <Text style={styles.labelText}>Recently Visited Pages</Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('StackNavigation', {
                        screen: 'RecentlyVisitedBusinessPages',
                      });
                    }}>
                    <Text style={styles.viewAllText}>View All</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              <View style={{marginBottom: 5}}>
                <FlatList
                  data={recentlyVisitedBusiness}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderSuggestedPageList}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              </View>

              {/* Suggested Pages section */}
              {suggestedBusiness?.length > 0 ? (
                <View style={styles.textDirection}>
                  <Text style={styles.labelText}>Suggested Pages</Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('StackNavigation', {
                        screen: 'SuggestedBusinessPages',
                      });
                    }}>
                    <Text style={styles.viewAllText}>View All</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              <View style={{marginBottom: 5}}>
                <FlatList
                  data={suggestedBusiness}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderSuggestedPageList}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              </View>
            </ScrollView>
          ) : (
            <ScrollView
              contentContainerStyle={{
                paddingBottom: '20%',
              }}
              style={{
                marginBottom: 5,
                flex: 1,
              }}>
              {/* recent notification section for community*/}
              {recentCommunityData?.length > 0 ? (
                <>
                  <View style={styles.textDirection}>
                    <Text style={styles.labelText}>Recent Activity</Text>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('StackNavigation', {
                          screen: 'RecentActivityCommunityPages',
                        });
                      }}>
                      <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.myCommunityPageContainer}>
                    <ScrollView nestedScrollEnabled={true}>
                      {recentCommunityData.map(item => {
                        return (
                          <CommunityPageTab
                            items={item}
                            handleView={handleViewCommunityPage}
                          />
                        );
                      })}
                    </ScrollView>
                  </View>
                </>
              ) : null}

              {/* My Community Pages section */}
              {myCommunity?.length > 0 ? (
                <>
                  <View style={styles.textDirection}>
                    <Text style={styles.labelText}>My Community Pages</Text>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('StackNavigation', {
                          screen: 'MyCommunityPages',
                        });
                      }}>
                      <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                  </View>
                  {myCommunity?.length > 0 ? (
                    <View style={styles.myCommunityPageContainer}>
                      <ScrollView nestedScrollEnabled={true}>
                        {myCommunity.map(item => {
                          return (
                            <CommunityPageTab
                              items={item}
                              handleView={handleViewCommunityPage}
                            />
                          );
                        })}
                      </ScrollView>
                    </View>
                  ) : (
                    <View style={styles.noCommunityContainer}>
                      <Text style={styles.noDataText}>
                        No Community Created.{'\n'}Click on the "+" icon to
                        create a community.
                      </Text>
                    </View>
                  )}
                </>
              ) : null}

              {/* suggested community Pages section */}
              {allCommunity?.length > 0 ? (
                <View style={styles.textDirection}>
                  <Text style={styles.labelText}>Suggested Pages</Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('StackNavigation', {
                        screen: 'SuggestedCommunityPages',
                      });
                    }}>
                    <Text style={styles.viewAllText}>View All</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              <View style={styles.communityPageContainer}>
                <ScrollView nestedScrollEnabled={true}>
                  {allCommunity.map(item => {
                    return (
                      <CommunityPageTab
                        items={item}
                        handleView={handleViewCommunityPage}
                      />
                    );
                  })}
                </ScrollView>
              </View>
            </ScrollView>
          )}
        </View>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}

      {/* create business and community icon  */}
      <View style={styles.createIconContainer}>
        <AddBusinessCommunityButton navigation={navigation} />
      </View>

      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default BusinessCommunity;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {padding: 10},
  searchBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    borderRadius: 8,
    width: '84%',
  },
  searchInput: {
    backgroundColor: colors.BLACK3,
    borderRadius: 8,
    color: colors.WHITE,
    fontSize: 16,
    padding: 10,
    paddingLeft: 10,
  },
  searchContainer: {
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 10,
    height: 45,
    justifyContent: 'center',
    width: '14%',
  },
  interestsTab: {
    backgroundColor: colors.BLACK3,
    borderRadius: 38,
    color: colors.WHITE,
    elevation: 5,
    fontSize: 14,
    fontWeight: '500',
    height: 40,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlign: 'center',
    width: 'auto',
  },
  interestsTabBorder: {
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 38,
    color: colors.WHITE,
    elevation: 5,
    fontSize: 14,
    fontWeight: '500',
    height: 40,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlign: 'center',
    width: 'auto',
  },
  categoryContainer: {
    backgroundColor: colors.BLACK3,
    flexDirection: 'row',
  },
  categoryTab: {width: '50%'},
  categoryTabBorder: {
    borderBottomColor: colors.THEME_ORANGE,
    borderBottomWidth: 3,
    width: '50%',
  },
  categoryText: {
    backgroundColor: colors.BLACK3,
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    padding: 10,
    textAlign: 'center',
  },
  categoryTextColor: {
    backgroundColor: colors.BLACK3,
    color: colors.THEME_ORANGE,
    fontSize: 16,
    fontWeight: '500',
    padding: 10,
    textAlign: 'center',
  },
  textDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  labelText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
  },
  viewAllText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
  },
  myBusinessPageContainer: {
    height: 'auto',
    marginHorizontal: 5,
    maxHeight: '27%',
  },
  noBusinessContainer: {
    alignItems: 'center',
    height: '26%',
    justifyContent: 'center',
  },
  myCommunityPageContainer: {
    height: 'auto',
    marginHorizontal: 10,
    // maxHeight: '32%',
  },
  communityPageContainer: {
    flexGrow: 1,
    marginHorizontal: 10,
  },
  noCommunityContainer: {
    alignItems: 'center',
    height: '20%',
    justifyContent: 'center',
  },
  loaderContainer: {
    alignSelf: 'center',
    height: '83%',
    justifyContent: 'center',
  },
  createIconContainer: {
    bottom: 30,
    position: 'absolute',
    right: 40,
    zIndex: 1,
  },
  noDataText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  notificationText: {
    backgroundColor: colors.RED,
    borderRadius: 50,
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: '500',
    height: 25,
    justifyContent: 'center',
    padding: 3,
    position: 'absolute',
    right: 15,
    textAlign: 'center',
    top: 3,
    width: 25,
    zIndex: 1,
  },
});
