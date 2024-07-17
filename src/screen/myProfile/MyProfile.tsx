//external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
//internal imports
import ChangePreferencesModal from './ChangePreferencesModal';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import DeleteAlertModal from '../groups/DeleteAlertModal';
import GroupTab from '../homeScreen/GroupTab';
import PreSelectedPreference from './PreSelectedPreference';
import SubmitButton from '../../constants/SubmitButton';
import UserAuthService from '../../service/UserAuthService';
import {colors} from '../../constants/ColorConstant';
import BusinessService from '../../service/BusinessService';
import MyAllBusinessListTab from '../homeScreen/MyAllBusinessListTab';

const MyProfile = ({navigation}: {navigation: any}) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [groupList, setGroupList] = useState([]);
  const [pageLoader, setPageLoader] = useState(false);
  const [preferenceModal, setPreferenceModal] = useState(false);
  const [preferences, setPreferences] = useState<any[]>([]);
  const [userInformation, setUserInformation] = useState({});
  const [userType, setUserType] = useState('1');
  const [myAllBusinessList, setMyAllBusinessList] = useState([]);
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPageLoader(true);
      getData();
      getBusiness();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get my profile data on api call
  const getData = async () => {
    const accountId = await AsyncStorage.getItem('accountId');
    const userType = await AsyncStorage.getItem('userType');
    setUserType(userType);

    if (userType == '2') {
      UserAuthService.getMyBusinessProfile(accountId)
        .then((response: any) => {
          setPageLoader(false);
          setUserInformation(response?.data?.userinformation);
          setPreferences(response?.data?.preferences);
          setGroupList(response?.data?.groupList);
        })

        .catch((error: any) => {
          setPageLoader(false);
          console.log('error', error);
        });
    } else {
      UserAuthService.getMyProfile()
        .then((response: any) => {
          setPageLoader(false);
          setUserInformation(response?.data?.userinformation);
          setPreferences(response?.data?.preferences);
          setGroupList(response?.data?.groupList);
        })
        .catch((error: any) => {
          setPageLoader(false);
          console.log('error', error);
        });
    }
  };

  const getBusiness = async () => {
    setPageLoader(true);
    BusinessService.postMyAllBusinessList()
      .then((response: any) => {
        setPageLoader(false);
        setMyAllBusinessList(response?.data?.myallbusiness);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error, 'error');
      });
  };

  // list for pre selected preferences
  const renderInterestItem = ({item}: {item: any; index: any}) => {
    return <PreSelectedPreference interests={item} />;
  };

  // navigation for My groups and my routines
  const handleTabPress = (title: string) => {
    if (title === 'My Groups') {
      navigation.navigate('StackNavigation', {
        screen: 'MyGroups',
        params: {title: 'My Groups'},
      });
    } else if (title === 'My Routines') {
      navigation.navigate('BottomNavigator', {
        screen: 'Routine',
        params: {title: 'My Routines'},
      });
    } else {
    }
  };

  // list for group tab
  const renderGroupItem = ({item}: {item: any; index: any}) => {
    return <GroupTab items={item} tabPress={handleTabPress} />;
  };

  // list for all my business list
  const renderMyAllBusinessItem = ({item}: {item: any; index: any}) => {
    return (
      <MyAllBusinessListTab
        items={item}
        navigation={navigation}
        onDelete={onBusinessDelete}
      />
    );
  };

  // on business delete icon click
  const onBusinessDelete = () => {
    getBusiness();
  };

  // change preference functionality
  const handlePreferenceSubmitClick = (arrayList: any) => {
    setPreferenceModal(false);

    const data = new FormData();
    arrayList.map((e: number, index: any) => {
      data.append(`interests[${index}]`, e);
    });

    UserAuthService.postEditPreferences(data)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        getData();
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log('error', error);
      });
  };

  // delete account functionality
  const handleDelete = () => {
    setDeleteModal(false);
    UserAuthService.getDeleteProfile()
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        AsyncStorage.removeItem('authToken');
        navigation.replace('StackNavigation', {screen: 'SignUp'});
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      {/* header section  */}
      <CustomHeader
        headerText={'My Profile'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* body section */}
      {!pageLoader ? (
        <ScrollView>
          <View style={styles.body}>
            {userType == '3' ? (
              <View style={styles.organizationProfileContainer}>
                <View style={styles.profileContainer}>
                  <View style={styles.direction}>
                    <Image
                      resizeMode="contain"
                      style={styles.profileImage}
                      source={
                        userInformation?.profileimage
                          ? {uri: `${userInformation?.profileimage}`}
                          : require('../../assets/pngImage/avatar.png')
                      }
                    />
                    <View style={styles.nameContainer}>
                      <Text style={styles.nameText}>
                        {userInformation?.name}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.editIcon}
                    onPress={() => {
                      navigation.navigate('StackNavigation', {
                        screen: 'EditProfile',
                        params: {
                          data: userInformation,
                        },
                      });
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{height: 18, width: 18}}
                      source={require('../../assets/pngImage/editIcon.png')}
                    />
                  </TouchableOpacity>
                </View>

                <View style={{padding: 10}}>
                  {/* email */}
                  <View style={styles.direction}>
                    <View style={styles.emailImageContainer}>
                      <Image
                        resizeMode="cover"
                        style={styles.image}
                        source={require('../../assets/pngImage/EnvelopeSimple.png')}
                      />
                    </View>
                    <View>
                      <Text style={styles.emailText}>
                        {userInformation?.email}
                      </Text>
                    </View>
                  </View>

                  {/* number */}
                  <View style={styles.direction}>
                    <View style={styles.emailImageContainer}>
                      <Image
                        resizeMode="cover"
                        style={styles.image}
                        source={require('../../assets/pngImage/Phone.png')}
                      />
                    </View>

                    {userInformation?.contactno != null ? (
                      <View>
                        <Text style={styles.emailText}>
                          {userInformation?.contactno.replace(
                            /(\d{3})(\d{3})(\d{4})/,
                            '$1-$2-$3',
                          )}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {/* location */}
                  <View style={styles.direction}>
                    <View style={styles.emailImageContainer}>
                      <Image
                        resizeMode="cover"
                        style={styles.image}
                        source={require('../../assets/pngImage/location.png')}
                      />
                    </View>
                    <View>
                      <Text style={styles.emailText}>
                        {userInformation?.address}
                      </Text>
                    </View>
                  </View>

                  {/* business category */}
                  <View style={{marginVertical: 5}}>
                    <Text style={styles.preferenceText}>Organization Type</Text>
                    <Text style={styles.emailText}>
                      {userInformation?.organizationtype}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.profileContainer}>
                <View style={styles.direction}>
                  <Image
                    resizeMode="contain"
                    style={styles.profileImage}
                    source={
                      userInformation?.profileimage
                        ? {uri: `${userInformation?.profileimage}`}
                        : require('../../assets/pngImage/avatar.png')
                    }
                  />
                  <View style={styles.nameContainer}>
                    <Text style={styles.nameText}>{userInformation?.name}</Text>
                    <Text style={styles.emailText}>
                      {userInformation?.email}
                    </Text>
                  </View>
                </View>

                {userType != '2' ? (
                  <TouchableOpacity
                    style={styles.editIcon}
                    onPress={() => {
                      navigation.navigate('StackNavigation', {
                        screen: 'EditProfile',
                        params: {
                          data: userInformation,
                        },
                      });
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{height: 18, width: 18}}
                      source={require('../../assets/pngImage/editIcon.png')}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            )}

            {/* details based on user type */}
            {userType == '1' ? (
              <View>
                <View style={styles.textDirection}>
                  <Text style={styles.preferenceText}>Preferences</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setPreferenceModal(true);
                    }}>
                    <Text style={styles.addEditText}>Add/Change</Text>
                  </TouchableOpacity>
                </View>
                {/* selected interest tab  */}
                <FlatList
                  data={preferences}
                  renderItem={renderInterestItem}
                  numColumns={3}
                  keyExtractor={(item: any, index: any) => String(index)}
                />

                {/* my groups tab  */}
                <View>
                  <FlatList
                    data={groupList}
                    renderItem={renderGroupItem}
                    numColumns={2}
                    keyExtractor={(item: any, index: any) => String(index)}
                  />
                </View>
              </View>
            ) : userType == '2' ? (
              <View style={{height: 420}}>
                <View style={styles.textDirection}>
                  <Text style={styles.preferenceText}>Business</Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.replace('StackNavigation', {
                        screen: 'AddBusiness',
                      });
                    }}>
                    <Text style={styles.addEditText}>Add Business</Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={myAllBusinessList}
                  renderItem={renderMyAllBusinessItem}
                  // numColumns={2}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              </View>
            ) : null}

            <View style={{marginVertical: 10}}>
              <SubmitButton
                buttonText={'Delete Account'}
                submitButton={() => {
                  setDeleteModal(true);
                }}
              />
            </View>

            {/* modal for change and add preference list */}
            <ChangePreferencesModal
              visibleModal={preferenceModal}
              onClose={() => {
                setPreferenceModal(false);
              }}
              onSubmitClick={handlePreferenceSubmitClick}
              preferences={preferences}
            />

            {/* Delete alert modal  */}
            <DeleteAlertModal
              visibleModal={deleteModal}
              onRequestClosed={() => {
                setDeleteModal(false);
              }}
              onPressRightButton={() => {
                handleDelete();
              }}
              subHeading={'Are you sure you want to delete the account?'}
              info={
                "When you delete your account, you won't be able to retrieve the information on app."
              }
            />
          </View>
        </ScrollView>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}
      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    padding: 10,
  },
  organizationProfileContainer: {
    backgroundColor: colors.BLACK3,
    borderRadius: 30,
    marginBottom: 200,
  },
  profileContainer: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
    borderRadius: 30,
    flexDirection: 'row',
    height: 100,
    paddingHorizontal: 5,
  },
  direction: {
    flexDirection: 'row'},
  profileImage: {
    backgroundColor: colors.WHITE,
    borderRadius: 50,
    height: 65,
    marginHorizontal: 5,
    width: 65,
  },
  nameContainer: {
    justifyContent: 'center',
    paddingHorizontal: 6,
    width: '70%',
  },
  nameText: {
    color: colors.THEME_ORANGE,
    fontSize: 20,
    fontWeight: 'bold',
  },
  emailText: {
    color: colors.WHITE,
    fontSize: 14,
  },
  editIcon: {
    alignItems: 'center',
    backgroundColor: colors.BLACK2,
    borderRadius: 50,
    height: 50,
    justifyContent: 'center',
    right: 25,
    width: 50,
  },
  textDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  preferenceText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
  },
  addEditText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
  },
  deleteText: {
    color: colors.THEME_ORANGE,
    fontSize: 18,
    fontWeight: '500',
  },
  loaderContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  emailImageContainer: {
    borderRadius: 50,
    height: 20,
    marginBottom: 10,
    marginRight: 10,
    width: 20,
  },
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
});
