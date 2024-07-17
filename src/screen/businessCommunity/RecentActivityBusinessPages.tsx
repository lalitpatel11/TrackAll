// export imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
// internal imports
import BusinessCommunityService from '../../service/BusinessCommunityService';
import BusinessPageTab from './BusinessPageTab';
import CustomHeader from '../../constants/CustomHeader';
import {colors} from '../../constants/ColorConstant';

const RecentActivityBusinessPages = ({navigation}: {navigation: any}) => {
  const [myBusiness, setMyBusiness] = useState<any[]>([]);
  const [noData, setNoData] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSearchText('');
      setPageLoader(true);
      getBusinessData();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get all my business data api call
  const getBusinessData = async () => {
    BusinessCommunityService.postRecentActivityBusiness()
      .then((response: any) => {
        setPageLoader(false);
        setMyBusiness(response.data.recentactivitybusiness);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for search all my business data api call
  const getSearchBusinessData = (text: string) => {
    const data = {
      search: text,
    };
    setPageLoader(true);
    BusinessCommunityService.postSearchRecentActivityBusiness(data)
      .then((response: any) => {
        if (response.data.recentactivitybusiness > 0) {
          setNoData(false);
          setMyBusiness(response.data.recentactivitybusiness);
          setPageLoader(false);
        } else {
          setMyBusiness(response.data.recentactivitybusiness);
          setPageLoader(false);
          setNoData(true);
        }
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // list for business tab
  const renderPageList = ({item}: {item: any; index: any}) => {
    return <BusinessPageTab items={item} handleView={handleViewPage} />;
  };

  // navigation for business details
  const handleViewPage = (pageId: number) => {
    navigation.navigate('StackNavigation', {
      screen: 'BusinessDetailsPage',
      params: {id: pageId},
    });
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Recent Activity Business Pages'}
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
            placeholder="Search By Name, City, State, Zip Code"
            placeholderTextColor={colors.textGray}
            style={styles.searchInput}
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
              getSearchBusinessData(text);
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
        myBusiness?.length > 0 ? (
          <View style={styles.body}>
            {/* page section  */}
            <View style={{height: '90%'}}>
              <FlatList
                data={myBusiness}
                renderItem={renderPageList}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            {!noData ? (
              <Text style={styles.noDataText}>No Business Created. </Text>
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
    </View>
  );
};

export default RecentActivityBusinessPages;

const styles = StyleSheet.create({
  container: {flex: 1},
  body: {padding: 10},
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
    backgroundColor: colors.WHITE,
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
