// external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
//internal imports
import AddedSplitTab from './AddedSplitTab';
import CommonToast from '../../../constants/CommonToast';
import CustomHeader from '../../../constants/CustomHeader';
import SplitService from '../../../service/SplitService';
import {colors} from '../../../constants/ColorConstant';

const SettleSplitGroup = ({navigation}: {navigation: any}) => {
  const [noData, setNoData] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [splitList, setSplitList] = useState([]);
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get all split group on api call
  const getData = () => {
    setPageLoader(true);
    SplitService.postSplitGroupList()
      .then((response: any) => {
        setPageLoader(false);
        setSplitList(response.data.mygroups);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for search all split group data on api call
  const getAllSearchSplit = (text: string) => {
    setPageLoader(true);
    const data = {
      search: text,
    };
    SplitService.postSearchSplitGroupList(data)
      .then((response: any) => {
        setPageLoader(false);
        if (response.data.mygroups.length > 0) {
          setPageLoader(false);
          setNoData(false);
          setSplitList(response.data.mygroups);
        } else {
          setPageLoader(false);
          setNoData(true);
          setSplitList(response.data.mygroups);
        }
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log('error', error);
      });
  };

  // list for added split group
  const renderAddedSplit = ({item}: {item: any; index: any}) => {
    return <AddedSplitTab items={item} onViewClick={handleViewDetailsClick} />;
  };

  // navigation for settle bill on click
  const handleViewDetailsClick = (id: any) => {
    navigation.navigate('StackNavigation', {
      screen: 'SettleSplitBill',
      params: {
        data: id,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Split Groups'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* body section */}
      <View style={styles.body}>
        {/* search field  */}
        <View style={styles.searchBoxContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Search Split By Title"
              placeholderTextColor={colors.textGray}
              style={styles.searchInput}
              value={searchText}
              onChangeText={text => {
                setSearchText(text);
                getAllSearchSplit(text);
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

        {/* all added split section  */}
        {!pageLoader ? (
          splitList?.length > 0 ? (
            <View style={styles.container}>
              <FlatList
                data={splitList}
                renderItem={renderAddedSplit}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              {!noData ? (
                <Text style={styles.noDataText}>
                  No Split Created. {'\n'}Click on the "Add split" to create
                  split.
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

        {/* toaster message for error response from API  */}
        <CommonToast ref={toastRef} />
      </View>
    </View>
  );
};

export default SettleSplitGroup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    padding: 10,
    flex: 1,
  },
  searchBoxContainer: {
    flexDirection: 'row',
    height: 65,
    justifyContent: 'space-between',
    paddingVertical: 10,
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
