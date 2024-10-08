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
import CommonToast from '../../../constants/CommonToast';
import CustomHeader from '../../../constants/CustomHeader';
import {colors} from '../../../constants/ColorConstant';
import CreateGroupModal from '../../groups/CreateGroupModal';
import MyGroupsTab from '../../groups/MyGroupsTab';
import BusinessService from '../../../service/BusinessService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GroupServices from '../../../service/GroupServices';
import PlanPurchaseModal from '../../groups/PlanPurchaseModal';

const BusinessGroup = ({navigation}: {navigation: any}) => {
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
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  // function for open side menu
  const handleOpenDrawer = () => {
    navigation.openDrawer();
  };

  // function for get all my group data on api call
  const getData = async () => {
    const accountId = await AsyncStorage.getItem('accountId');

    BusinessService.getMyBusinessGroups(accountId)
      .then((response: any) => {
        setPageLoader(false);
        setMyGroupList(response?.data?.mygroups);
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for search all my group data on api call
  const searchGroup = async (text: string) => {
    setPageLoader(true);
    const accountId = await AsyncStorage.getItem('accountId');

    BusinessService.getSearchMyBusinessGroups(text, accountId)
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
        headerText={'Business Groups'}
        drawerButton={{
          visible: true,
          onClick: () => {
            handleOpenDrawer();
          },
        }}
        bellButton={{
          visible: true,
          onClick: () => {
            navigation.navigate('StackNavigation', {
              screen: 'Notifications',
            });
          },
        }}
      />

      {/* search box */}
      <View style={styles.searchBoxContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Search group by name"
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
            source={require('../../../assets/pngImage/searchIcon.png')}
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
                No Group created yet. {'\n'}Click on the "+" icon to create a
                Group.
              </Text>
            ) : (
              <Text style={styles.noDataText}>No result found</Text>
            )}
          </View>
        )
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
        </View>
      )}

      {/* create group icon  */}
      <View style={styles.createIconContainer}>
        <TouchableOpacity
          onPress={() => {
            setCreateGroupVisible(!createGroupVisible);
          }}>
          <Image
            style={styles.createIconImage}
            resizeMode="contain"
            source={require('../../../assets/pngImage/Plus.png')}
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

export default BusinessGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLACK,
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
