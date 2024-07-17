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
import LinearGradient from 'react-native-linear-gradient';
import React, {useEffect, useRef, useState} from 'react';
//internal imports
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import GroupServices from '../../service/GroupServices';
import MyGroupsTab from './MyGroupsTab';
import ShareGroupIdModal from './ShareGroupIdModal';
import {colors} from '../../constants/ColorConstant';

const SharedGroups = ({navigation}: {navigation: any}) => {
  const [myGroupList, setMyGroupList] = useState([]);
  const [noData, setNoData] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [shareIdGroupVisible, setShareIdGroupVisible] = useState(false);
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSearchText('');
      setPageLoader(true);
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get all shared group data on api call
  const getData = () => {
    GroupServices.getSharedGroups()
      .then((response: any) => {
        setPageLoader(false);
        setMyGroupList(response?.data?.mygroups);
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for search all shared group data on api call
  const searchGroup = (text: string) => {
    setPageLoader(true);
    GroupServices.getSearchSharedGroups(text)
      .then((response: any) => {
        if (response?.data?.mygroups.length > 0) {
          setNoData(false);
          setMyGroupList(response?.data?.mygroups);
          setPageLoader(false);
        } else {
          setMyGroupList(response?.data?.mygroups);
          setPageLoader(false);
          setNoData(true);
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // list for shared groups
  const renderGroupsItems = ({item}: {item: any; index: any}) => {
    return (
      <MyGroupsTab
        items={item}
        navigation={navigation}
        title={'SHAREDGROUPS'}
      />
    );
  };

  // function for close modal on close shared group click
  const onSharedGroupIdCloseClick = () => {
    setShareIdGroupVisible(!shareIdGroupVisible);
  };

  // function for share group successfully
  const onShareGroupIdSubmitClick = (msg: any) => {
    setShareIdGroupVisible(!shareIdGroupVisible);
    toastRef.current.getToast(msg, 'success');
    getData();
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Shared Groups'}
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
          <TouchableOpacity>
            <Image
              resizeMode="contain"
              source={require('../../assets/pngImage/searchIcon.png')}
            />
          </TouchableOpacity>
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
              <Text style={styles.noDataText}>No Shared Group</Text>
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

      {/* share id icon  */}
      <LinearGradient
        colors={['#ED933C', '#E15132']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.createIconContainer}>
        <TouchableOpacity
          onPress={() => {
            // handleCreateClick();
            setShareIdGroupVisible(!shareIdGroupVisible);
          }}>
          <Image
            style={styles.createIconImage}
            resizeMode="contain"
            source={require('../../assets/pngImage/Plus.png')}
          />
        </TouchableOpacity>
      </LinearGradient>

      {/* Modal for create group */}
      <ShareGroupIdModal
        visibleModal={shareIdGroupVisible}
        onClose={() => {
          onSharedGroupIdCloseClick();
        }}
        onSubmitClick={onShareGroupIdSubmitClick}
      />
      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </View>
  );
};

export default SharedGroups;

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
