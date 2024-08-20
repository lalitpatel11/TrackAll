//external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
//internal imports
import CommonToast from '../../constants/CommonToast';
import CreateGroupModal from './CreateGroupModal';
import CustomHeader from '../../constants/CustomHeader';
import GroupServices from '../../service/GroupServices';
import MyGroupsTab from './MyGroupsTab';
import {colors} from '../../constants/ColorConstant';
import PlanPurchaseModal from './PlanPurchaseModal';

const MyGroups = ({navigation}: {navigation: any}) => {
  const [createGroupVisible, setCreateGroupVisible] = useState(false);
  const [myGroupList, setMyGroupList] = useState([]);
  const [noData, setNoData] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [searchText, setSearchText] = useState('');
  const toastRef = useRef<any>();
  const [planPurchaseVisible, setPlanPurchaseVisible] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSearchText('');
      setPageLoader(true);
      // function for get all my group data on api call
      GroupServices.getMyGroups()
        .then((response: any) => {
          setPageLoader(false);
          setMyGroupList(response.data.mygroups);
        })
        .catch((error: any) => {
          setPageLoader(false);
          console.log(error);
        });
    });
    return unsubscribe;
  }, [navigation]);

  // function for search all my group data on api call
  const searchGroup = (text: string) => {
    setPageLoader(true);

    GroupServices.getSearchMyGroups(text)
      .then((response: any) => {
        if (response.data.mygroups.length > 0) {
          setNoData(false);
          setMyGroupList(response.data.mygroups);
          setPageLoader(false);
        } else {
          setMyGroupList(response.data.mygroups);
          setPageLoader(false);
          setNoData(true);
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // function for close modal on create group close click
  const onGroupCloseClick = () => {
    setCreateGroupVisible(!createGroupVisible);
  };

  // navigation on group details page after create group
  const onGroupCreateClick = (groupDetails: any) => {
    setLoader(true);

    GroupServices.postCreateGroup(groupDetails)
      .then((response: any) => {
        setLoader(false);
        if (response.data.status === 1) {
          setResponseMsg(response.data.message);
          setPlanPurchaseVisible(false);
          setCreateGroupVisible(!createGroupVisible);
          navigation.navigate('StackNavigation', {
            screen: 'GroupDetails',
            params: {
              data: response?.data?.group?.groupid,
            },
          });
        } else if (response.data.status === 0) {
          setCreateGroupVisible(false);
          setPlanPurchaseVisible(true);
          setResponseMsg(response.data.message);
        }
      })
      .catch((error: any) => {
        setLoader(false);
        console.log(error, 'error');
      });
  };

  // list for my group
  const renderGroupsItems = ({item}: {item: any; index: any}) => {
    return (
      <MyGroupsTab items={item} navigation={navigation} title={'MYGROUPS'} />
    );
  };

  const handlePlanPurchaseSubmitClick = () => {
    setPlanPurchaseVisible(false);
    navigation.navigate('StackNavigation', {
      screen: 'SubscriptionPlan',
    });
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'My Groups'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.navigate('Home');
          },
        }}
      />
      {/* search box */}
      <View style={styles.searchBoxContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Search Group By Name"
            placeholderTextColor={colors.textGray}
            style={styles.searchInput}
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
              searchGroup(text);
            }}
          />
        </View>
        <View style={styles.searchContainer}>
          <Image
            resizeMode="contain"
            source={require('../../assets/pngImage/searchIcon.png')}
          />
        </View>
      </View>

      {/* body section */}
      {!pageLoader ? (
        myGroupList?.length > 0 ? (
          <View style={styles.body}>
            {/* my groups list  */}
            <View style={{height: '90%'}}>
              <FlatList
                data={myGroupList}
                scrollEnabled={true}
                renderItem={renderGroupsItems}
                listKey={'myGroupList'}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            {!noData ? (
              <Text style={styles.noDataText}>
                No Group Created. {'\n'}Click on the "+" icon to create a Group.
              </Text>
            ) : (
              <Text style={styles.noDataText}>No Result Found</Text>
            )}
          </View>
        )
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}

      {/* create notes icon  */}
      <View style={styles.createIconContainer}>
        <TouchableOpacity
          onPress={() => {
            setCreateGroupVisible(!createGroupVisible);
          }}>
          <Image
            style={styles.createIconImage}
            resizeMode="contain"
            source={require('../../assets/pngImage/Plus.png')}
          />
        </TouchableOpacity>
      </View>

      {/* Modal for create group */}
      <CreateGroupModal
        visibleModal={createGroupVisible}
        onClose={() => {
          onGroupCloseClick();
        }}
        onCreateClick={(groupDetails: any) => {
          onGroupCreateClick(groupDetails);
        }}
        navigation={navigation}
        loader={loader}
      />

      {/* Modal for purchase plan*/}
      <PlanPurchaseModal
        visibleModal={planPurchaseVisible}
        onClose={() => {
          setPlanPurchaseVisible(false);
        }}
        responseMsg={responseMsg}
        onSubmitClick={handlePlanPurchaseSubmitClick}
      />

      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default MyGroups;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    padding: 10,
  },
  searchBoxContainer: {
    flexDirection: 'row',
    height: 65,
    justifyContent: 'space-between',
    padding: 10,
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
    justifyContent: 'center',
    width: '14%',
  },
  createIconContainer: {
    alignItems: 'center',
    backgroundColor: colors.THEME_ORANGE,
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
  loaderContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  noDataContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  noDataText: {
    color: colors.WHITE,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
});
