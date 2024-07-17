// external imports
// import React, {useEffect, useRef, useState} from 'react';
// import {
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// //internal imports
// import CommonToast from '../constants/CommonToast';
// import UserAuthService from '../service/UserAuthService';
// import {colors} from '../constants/ColorConstant';

// export default function DrawerContent({navigation}: {navigation: any}) {
//   const [userInformation, setUserInformation] = useState({});
//   const toastRef = useRef<any>();

//   // function for logout from app
//   const handleLogout = () => {
//     AsyncStorage.removeItem('authToken');
//     toastRef.current.getToast('User logged out successfully', 'success');
//     navigation.goBack();
//     navigation.replace('StackNavigation', {screen: 'SignIn'});
//   };

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       UserAuthService.getMyProfile()
//         .then((response: any) => {
//           // set user user email and name for future use
//           AsyncStorage.setItem('userName', response.data.userinformation.name);
//           AsyncStorage.setItem(
//             'userEmail',
//             response.data.userinformation.email,
//           );
//           setUserInformation(response.data.userinformation);
//         })
//         .catch((error: any) => {
//         });
//     });
//     return unsubscribe;
//   }, [navigation]);

//   return (
//     <SafeAreaView>
//       <ScrollView>
//         <View style={styles.container}>
//           {/* back arrow section for close the side menu */}
//           <TouchableOpacity
//             onPress={() => {
//               navigation.goBack();
//             }}>
//             <Image
//               resizeMode="contain"
//               style={styles.backArrowIcon}
//               source={require('../assets/pngImage/ArrowLeft.png')}
//             />
//           </TouchableOpacity>

//           {/* user profile image and name */}
//           <View style={styles.profileContainer}>
//             <TouchableOpacity
//               style={styles.profileImageContainer}
//               onPress={() => {
//                 navigation.navigate('StackNavigation', {
//                   screen: 'MyProfile',
//                 });
//               }}>
//               <Image
//                 resizeMode="contain"
//                 style={styles.image}
//                 source={
//                   userInformation?.profileimage
//                     ? {uri: `${userInformation?.profileimage}`}
//                     : require('../assets/pngImage/avatar.png')
//                 }
//               />
//             </TouchableOpacity>
//             <Text
//               style={styles.profileName}
//               onPress={() => {
//                 navigation.navigate('StackNavigation', {
//                   screen: 'MyProfile',
//                 });
//               }}>
//               {userInformation?.name}
//             </Text>
//           </View>

//           {/* home section */}
//           <TouchableOpacity
//             style={styles.menuContainer}
//             onPress={() => {
//               navigation.navigate('Home');
//             }}>
//             <View style={styles.menuImage}>
//               <Image
//                 resizeMode="contain"
//                 style={styles.image}
//                 source={require('../assets/pngImage/House.png')}
//               />
//             </View>
//             <Text style={styles.menuLabel}>Home</Text>
//           </TouchableOpacity>

//           {/* my groups */}
//           <TouchableOpacity
//             style={styles.menuContainer}
//             onPress={() => {
//               navigation.navigate('StackNavigation', {
//                 screen: 'MyGroups',
//               });
//             }}>
//             <View style={styles.menuImage}>
//               <Image
//                 resizeMode="contain"
//                 style={styles.image}
//                 source={require('../assets/pngImage/Users.png')}
//               />
//             </View>
//             <Text style={styles.menuLabel}>My Groups</Text>
//           </TouchableOpacity>

//           {/* community section */}
//           <TouchableOpacity
//             style={styles.menuContainer}
//             onPress={() => {
//               navigation.navigate('BottomNavigator', {
//                 screen: 'Community',
//               });
//             }}>
//             <View style={styles.menuImage}>
//               <Image
//                 resizeMode="contain"
//                 style={styles.image}
//                 source={require('../assets/pngImage/community01.png')}
//               />
//             </View>
//             <Text style={styles.menuLabel}>Community</Text>
//           </TouchableOpacity>

//           {/* routines section */}
//           <TouchableOpacity
//             style={styles.menuContainer}
//             onPress={() => {
//               navigation.navigate('StackNavigation', {
//                 screen: 'Routine',
//               });
//             }}>
//             <View style={styles.menuImage}>
//               <Image
//                 resizeMode="contain"
//                 style={styles.image}
//                 source={require('../assets/pngImage/routine.png')}
//               />
//             </View>
//             <Text style={styles.menuLabel}>Routines</Text>
//           </TouchableOpacity>

//           {/* goal tracker section */}
//           <TouchableOpacity
//             style={styles.menuContainer}
//             onPress={() => {
//               navigation.navigate('BottomNavigator', {
//                 screen: 'GoalTracker',
//               });
//             }}>
//             <View style={styles.menuImage}>
//               <Image
//                 resizeMode="contain"
//                 style={styles.image}
//                 source={require('../assets/pngImage/routine.png')}
//               />
//             </View>
//             <Text style={styles.menuLabel}>Goal Tracker</Text>
//           </TouchableOpacity>

//           {/* notes section */}
//           <TouchableOpacity
//             style={styles.menuContainer}
//             onPress={() => {
//               navigation.navigate('BottomNavigator', {
//                 screen: 'Notes',
//               });
//             }}>
//             <View style={styles.menuImage}>
//               <Image
//                 resizeMode="contain"
//                 style={styles.image}
//                 source={require('../assets/pngImage/Notepad.png')}
//               />
//             </View>
//             <Text style={styles.menuLabel}>Notes</Text>
//           </TouchableOpacity>

//           {/* my subscription plan section */}
//           <TouchableOpacity
//             style={styles.menuContainer}
//             onPress={() => {
//               navigation.navigate('StackNavigation', {
//                 screen: 'SubscriptionPlan',
//               });
//             }}>
//             <View style={styles.menuImage}>
//               <Image
//                 resizeMode="contain"
//                 style={styles.image}
//                 source={require('../assets/pngImage/Crown.png')}
//               />
//             </View>
//             <Text style={styles.menuLabel}>My Subscription Plan</Text>
//           </TouchableOpacity>

//           {/* Term and condition section */}
//           <TouchableOpacity
//             style={styles.menuContainer}
//             onPress={() => {
//               navigation.navigate('StackNavigation', {
//                 screen: 'TermAndCondition',
//               });
//             }}>
//             <View style={styles.menuImage}>
//               <Image
//                 resizeMode="contain"
//                 style={styles.image}
//                 source={require('../assets/pngImage/FileText.png')}
//               />
//             </View>
//             <Text style={styles.menuLabel}>Terms and Conditions</Text>
//           </TouchableOpacity>

//           {/* privacy policy section */}
//           <TouchableOpacity
//             style={styles.menuContainer}
//             onPress={() => {
//               navigation.navigate('StackNavigation', {
//                 screen: 'PrivacyPolicy',
//               });
//             }}>
//             <View style={styles.menuImage}>
//               <Image
//                 resizeMode="contain"
//                 style={styles.image}
//                 source={require('../assets/pngImage/Note01.png')}
//               />
//             </View>
//             <Text style={styles.menuLabel}>Privacy Policy</Text>
//           </TouchableOpacity>

//           {/* logout section */}
//           <View style={styles.logOutContainer}>
//             <TouchableOpacity
//               style={styles.flex}
//               onPress={() => {
//                 handleLogout();
//               }}>
//               <Image
//                 resizeMode="contain"
//                 style={styles.menuImage}
//                 source={require('../assets/pngImage/Power.png')}
//               />
//               <Text style={styles.menuLabel}>Logout</Text>
//             </TouchableOpacity>

//             {/* version section */}
//             <View>
//               <Text style={styles.menuLabel}>App Ver:- 1.0.0</Text>
//             </View>
//           </View>
//         </View>

//         {/* toaster message for error response from API  */}
//         <CommonToast ref={toastRef} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 30,
//   },
//   profileContainer: {
//     flexDirection: 'row',
//     marginTop: 30,
//   },
//   profileImageContainer: {
//     borderRadius: 50,
//     height: 70,
//     width: 70,
//   },
//   profileName: {
//     alignSelf: 'center',
//     color: colors.WHITE,
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginHorizontal: 10,
//     maxWidth: '70%',
//     width: 'auto',
//   },
//   menuContainer: {
//     flexDirection: 'row',
//     marginTop: 25,
//     width: '65%',
//   },
//   image: {
//     borderRadius: 50,
//     height: '100%',
//     width: '100%',
//   },
//   menuLabel: {
//     color: colors.WHITE,
//     fontSize: 16,
//     fontWeight: '500',
//     marginLeft: 15,
//     textAlign: 'center',
//   },
//   toggleButtonContainer: {
//     marginLeft: 150,
//   },
//   flex: {flexDirection: 'row'},
//   backArrowIcon: {
//     height: 30,
//     width: 30,
//   },
//   menuImage: {
//     height: 20,
//     width: 20,
//   },
//   logOutContainer: {
//     alignItems: 'flex-end',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 100,
//     width: '100%',
//   },
// });

// external imports
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
//internal imports
import CommonToast from '../constants/CommonToast';
import UserAuthService from '../service/UserAuthService';
import {colors} from '../constants/ColorConstant';

export default function DrawerContent({navigation}: {navigation: any}) {
  const [userInformation, setUserInformation] = useState({});
  const [userType, setUserType] = useState('1');
  const toastRef = useRef<any>();

  // function for logout from app
  const handleLogout = () => {
    AsyncStorage.removeItem('authToken');
    AsyncStorage.removeItem('userId');
    AsyncStorage.removeItem('userType');
    AsyncStorage.removeItem('accountId');
    toastRef.current.getToast('User logged out successfully', 'success');
    navigation.goBack();
    navigation.replace('StackNavigation', {screen: 'SignIn'});
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getMyProfile();
    });
    return unsubscribe;
  }, [navigation]);

  const getMyProfile = async () => {
    const accountId = await AsyncStorage.getItem('accountId');
    const userType = await AsyncStorage.getItem('userType');
    setUserType(userType);

    if (userType == '2') {
      UserAuthService.getMyBusinessProfile(accountId)
        .then((response: any) => {
          // set user user email and name for future use
          AsyncStorage.setItem(
            'userName',
            response?.data?.userinformation?.name,
          );
          AsyncStorage.setItem(
            'userEmail',
            response?.data?.userinformation?.email,
          );
          setUserInformation(response?.data?.userinformation);
        })
        .catch((error: any) => {
          console.error('error', error);
        });
    } else {
      UserAuthService.getMyProfile()
        .then((response: any) => {
          // set user user email and name for future use
          AsyncStorage.setItem(
            'userName',
            response?.data?.userinformation?.name,
          );
          AsyncStorage.setItem(
            'userEmail',
            response?.data?.userinformation?.email,
          );
          setUserInformation(response?.data?.userinformation);
        })
        .catch((error: any) => {
          console.log('error', error);
        });
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          {/* back arrow section for close the side menu */}
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              resizeMode="contain"
              style={styles.backArrowIcon}
              source={require('../assets/pngImage/ArrowLeft.png')}
            />
          </TouchableOpacity>

          {/* user profile image and name */}
          <View style={styles.profileContainer}>
            <TouchableOpacity
              style={styles.profileImageContainer}
              onPress={() => {
                navigation.navigate('StackNavigation', {
                  screen: 'MyProfile',
                });
              }}>
              <Image
                resizeMode="contain"
                style={{width: '100%', height: '100%', borderRadius: 50}}
                source={
                  userInformation?.profileimage
                    ? {uri: `${userInformation?.profileimage}`}
                    : require('../assets/pngImage/avatar.png')
                }
              />
            </TouchableOpacity>
            <Text
              style={styles.profileName}
              onPress={() => {
                navigation.navigate('StackNavigation', {
                  screen: 'MyProfile',
                });
              }}>
              {userInformation?.name}
            </Text>
          </View>

          {userType == '1' ? (
            <>
              {/* home section */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('Home');
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    source={require('../assets/pngImage/home.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>Home</Text>
              </TouchableOpacity>

              {/* my groups */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('StackNavigation', {
                    screen: 'MyGroups',
                  });
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    source={require('../assets/pngImage/Users.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>My Groups</Text>
              </TouchableOpacity>

              {/* community section */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('BottomNavigator', {
                    screen: 'Community',
                  });
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    tintColor={colors.WHITE}
                    source={require('../assets/pngImage/community.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>Community</Text>
              </TouchableOpacity>

              {/* my routines section */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('StackNavigation', {
                    screen: 'Routine',
                  });
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    tintColor={colors.WHITE}
                    source={require('../assets/pngImage/routines.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>My Routines</Text>
              </TouchableOpacity>

              {/* goal tracker section */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('BottomNavigator', {
                    screen: 'GoalTracker',
                  });
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    source={require('../assets/pngImage/routine.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>Goal Tracker</Text>
              </TouchableOpacity>

              {/* notes section */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('BottomNavigator', {
                    screen: 'Notes',
                  });
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    tintColor={colors.WHITE}
                    source={require('../assets/pngImage/note.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>Notes</Text>
              </TouchableOpacity>

              {/* my subscription plan section */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('StackNavigation', {
                    screen: 'SubscriptionPlan',
                  });
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    source={require('../assets/pngImage/Crown.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>My Subscription Plan</Text>
              </TouchableOpacity>
            </>
          ) : userType == '2' ? (
            <>
              {/* Business home section */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('BottomNavigator', {
                    screen: 'BusinessHome',
                  });
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    source={require('../assets/pngImage/home.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>Home</Text>
              </TouchableOpacity>

              {/* Business my groups */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('BottomNavigator', {
                    screen: 'BusinessGroup',
                  });
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    tintColor={colors.WHITE}
                    source={require('../assets/pngImage/community.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>Groups</Text>
              </TouchableOpacity>

              {/* goal tracker section */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('BottomNavigator', {
                    screen: 'GoalTracker',
                  });
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    source={require('../assets/pngImage/routine.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>Goal Tracker</Text>
              </TouchableOpacity>

              {/* Business schedule management section */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('BottomNavigator', {
                    screen: 'BusinessScheduleManagement',
                  });
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    tintColor={colors.WHITE}
                    source={require('../assets/pngImage/shedulemanagment.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>Schedule Management</Text>
              </TouchableOpacity>

              {/* Business expense management section */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('StackNavigation', {
                    screen: 'BusinessExpenseManagement',
                  });
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    tintColor={colors.WHITE}
                    source={require('../assets/pngImage/expensemanagment.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>Expense Management</Text>
              </TouchableOpacity>

              {/* Business event management section */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('BottomNavigator', {
                    screen: 'BusinessEventManagement',
                  });
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    tintColor={colors.WHITE}
                    source={require('../assets/pngImage/eventmanagment.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>Event Management</Text>
              </TouchableOpacity>

              {/* Business my subscription plan section */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('StackNavigation', {
                    screen: 'BusinessSubscriptionPage',
                  });
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    source={require('../assets/pngImage/Crown.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>My Subscription Plan</Text>
              </TouchableOpacity>
            </>
          ) : userType == '3' ? (
            <>
              {/* Business home section */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('BottomNavigator', {
                    screen: 'OrganizationHome',
                  });
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    source={require('../assets/pngImage/home.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>Home</Text>
              </TouchableOpacity>

              {/* organization my groups */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('BottomNavigator', {
                    screen: 'OrganizationGroup',
                  });
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    tintColor={colors.WHITE}
                    source={require('../assets/pngImage/community.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>Groups</Text>
              </TouchableOpacity>

              {/* goal tracker section */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('BottomNavigator', {
                    screen: 'GoalTracker',
                  });
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    source={require('../assets/pngImage/routine.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>Goal Tracker</Text>
              </TouchableOpacity>

              {/* organization schedule management section */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('BottomNavigator', {
                    screen: 'OrganizationScheduleManagement',
                  });
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    tintColor={colors.WHITE}
                    source={require('../assets/pngImage/shedulemanagment.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>Schedule Management</Text>
              </TouchableOpacity>

              {/* organization expense management section */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('StackNavigation', {
                    screen: 'OrganizationExpenseManagement',
                  });
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    tintColor={colors.WHITE}
                    source={require('../assets/pngImage/expensemanagment.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>Expense Management</Text>
              </TouchableOpacity>

              {/* organization event management section */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('BottomNavigator', {
                    screen: 'OrganizationEventManagement',
                  });
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    tintColor={colors.WHITE}
                    source={require('../assets/pngImage/eventmanagment.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>Event Management</Text>
              </TouchableOpacity>

              {/* organization my subscription plan section */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('StackNavigation', {
                    screen: 'OrganizationSubscriptionPage',
                  });
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    source={require('../assets/pngImage/Crown.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>My Subscription Plan</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* home section */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  if (userType == '1') {
                    navigation.navigate('Home');
                  } else if (userType == '2') {
                    navigation.navigate('BusinessHome');
                  } else if (userType == '3') {
                    navigation.navigate('OrganizationHome');
                  } else {
                    navigation.navigate('Home');
                  }
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    source={require('../assets/pngImage/home.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>Home</Text>
              </TouchableOpacity>

              {/* my groups */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('StackNavigation', {
                    screen: 'MyGroups',
                  });
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    source={require('../assets/pngImage/Users.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>My Groups</Text>
              </TouchableOpacity>

              {/* community section */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('BottomNavigator', {
                    screen: 'Community',
                  });
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    source={require('../assets/pngImage/community01.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>Community</Text>
              </TouchableOpacity>

              {/* my routines section */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('BottomNavigator', {
                    screen: 'Routine',
                  });
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    tintColor={colors.WHITE}
                    source={require('../assets/pngImage/routines.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>My Routines</Text>
              </TouchableOpacity>

              {/* notes section */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('BottomNavigator', {
                    screen: 'Notes',
                  });
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    source={require('../assets/pngImage/Notepad.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>Notes</Text>
              </TouchableOpacity>

              {/* my subscription plan section */}
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => {
                  navigation.navigate('StackNavigation', {
                    screen: 'SubscriptionPlan',
                  });
                }}>
                <View style={styles.menuImage}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    source={require('../assets/pngImage/Crown.png')}
                  />
                </View>
                <Text style={styles.menuLabel}>My Subscription Plan</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Term and condition section */}
          <TouchableOpacity
            style={styles.menuContainer}
            onPress={() => {
              navigation.navigate('StackNavigation', {
                screen: 'TermAndCondition',
              });
            }}>
            <View style={styles.menuImage}>
              <Image
                resizeMode="contain"
                style={styles.image}
                source={require('../assets/pngImage/termandcondition.png')}
              />
            </View>
            <Text style={styles.menuLabel}>Terms and Conditions</Text>
          </TouchableOpacity>

          {/* privacy policy section */}
          <TouchableOpacity
            style={styles.menuContainer}
            onPress={() => {
              navigation.navigate('StackNavigation', {
                screen: 'PrivacyPolicy',
              });
            }}>
            <View style={styles.menuImage}>
              <Image
                resizeMode="contain"
                style={styles.image}
                source={require('../assets/pngImage/privacypolicy.png')}
              />
            </View>
            <Text style={styles.menuLabel}>Privacy Policy</Text>
          </TouchableOpacity>
          {/* logout section */}
          <View style={styles.logOutContainer}>
            <TouchableOpacity
              style={styles.flex}
              onPress={() => {
                handleLogout();
              }}>
              <Image
                resizeMode="contain"
                style={styles.menuImage}
                source={require('../assets/pngImage/Power.png')}
              />
              <Text style={styles.menuLabel}>Logout</Text>
            </TouchableOpacity>

            {/* version section */}
            <View>
              <Text style={styles.menuLabel}>App Ver:- 1.0.0</Text>
            </View>
          </View>
        </View>

        {/* toaster message for error response from API  */}
        <CommonToast ref={toastRef} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  profileContainer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  profileImageContainer: {
    borderRadius: 50,
    height: 70,
    width: 70,
  },
  profileName: {
    alignSelf: 'center',
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
    maxWidth: '70%',
    width: 'auto',
  },
  menuContainer: {
    flexDirection: 'row',
    marginTop: 25,
    width: '65%',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    tintColor: colors.WHITE,
  },
  menuLabel: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 15,
    textAlign: 'center',
  },
  toggleButtonContainer: {
    marginLeft: 150,
  },
  flex: {flexDirection: 'row'},
  menuImage: {width: 20, height: 20},
  logOutContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 100,
    width: '100%',
  },
  backArrowIcon: {
    height: 30,
    width: 30,
  },
});
