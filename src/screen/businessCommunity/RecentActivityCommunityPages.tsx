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
import BusinessCommunityService from '../../service/BusinessCommunityService';
import BusinessPageTab from './BusinessPageTab';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import {colors} from '../../constants/ColorConstant';

const RecentActivityCommunityPages = ({navigation}: {navigation: any}) => {
  const [myCommunity, setMyCommunity] = useState<any[]>([]);
  const [noData, setNoData] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [searchText, setSearchText] = useState('');
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSearchText('');
      setPageLoader(true);
      getCommunityData();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get all my community data api call
  const getCommunityData = async () => {
    BusinessCommunityService.postHomeCommunity()
      .then((response: any) => {
        setPageLoader(false);
        setMyCommunity(response.data.allrecentactivitycommunity);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for search all my community data api call
  const getSearchCommunityData = (text: string) => {
    const data = {
      search: text,
    };
    BusinessCommunityService.postSearchHomeCommunity(data)
      .then((response: any) => {
        if (response.data.allrecentactivitycommunity > 0) {
          setNoData(false);
          setMyCommunity(response.data.allrecentactivitycommunity);
          setPageLoader(false);
        } else {
          setMyCommunity(response.data.allrecentactivitycommunity);
          setPageLoader(false);
          setNoData(true);
        }
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // list for business page
  const renderPageList = ({item}: {item: any; index: any}) => {
    return <BusinessPageTab items={item} handleView={handleViewPage} />;
  };

  // navigation for community details page
  const handleViewPage = (pageId: number) => {
    navigation.navigate('StackNavigation', {
      screen: 'CommunityDetailsPage',
      params: {id: pageId},
    });
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Recent Activity Community Pages'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* search field  */}
      <View style={styles.searchBoxContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Search By Community Name"
            placeholderTextColor={colors.textGray}
            style={styles.searchInput}
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
              getSearchCommunityData(text);
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
        myCommunity?.length > 0 ? (
          <View style={styles.body}>
            {/* page section  */}
            <View style={{height: '90%'}}>
              <FlatList
                data={myCommunity}
                renderItem={renderPageList}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            {!noData ? (
              <Text style={styles.noDataText}>No Community Created. </Text>
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
  );
};

export default RecentActivityCommunityPages;

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
    color: colors.BLACK,
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
  loaderContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
