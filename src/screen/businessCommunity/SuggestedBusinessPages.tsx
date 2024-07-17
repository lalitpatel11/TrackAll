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
import BusinessCommunityService from '../../service/BusinessCommunityService';
import BusinessPageTab from './BusinessPageTab';
import CommonToast from '../../constants/CommonToast';
import CustomHeader from '../../constants/CustomHeader';
import React, {useEffect, useRef, useState} from 'react';
import {colors} from '../../constants/ColorConstant';

const SuggestedBusinessPages = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [myBusiness, setMyBusiness] = useState<any[]>([]);
  const [noData, setNoData] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [searchText, setSearchText] = useState('');
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSearchText('');
      setPageLoader(true);
      getBusinessData();
    });
    return unsubscribe;
  }, [navigation]);

  //function for get all my business data api call
  const getBusinessData = async () => {
    BusinessCommunityService.postAllSuggestedBusiness()
      .then((response: any) => {
        setPageLoader(false);
        setMyBusiness(response.data.suggestedbusiness);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  //function for search all my business data api call
  const getSearchBusinessData = (text: string) => {
    const data = {
      search: text,
    };
    setPageLoader(true);
    BusinessCommunityService.postSearchAllSuggestedBusiness(data)
      .then((response: any) => {
        if (response.data.suggestedbusiness > 0) {
          setNoData(false);
          setMyBusiness(response.data.suggestedbusiness);
          setPageLoader(false);
        } else {
          setMyBusiness(response.data.suggestedbusiness);
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

  // navigation for business details page
  const handleViewPage = (pageId: number) => {
    navigation.navigate('StackNavigation', {
      screen: 'BusinessDetailsPage',
      params: {id: pageId},
    });
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      {route?.params?.screen == 'business' ? (
        <CustomHeader
          headerText={'All Business Pages'}
          backButton={{
            visible: true,
            onClick: () => {
              navigation.goBack();
            },
          }}
        />
      ) : (
        <CustomHeader
          headerText={'Suggested Business Pages'}
          backButton={{
            visible: true,
            onClick: () => {
              navigation.goBack();
            },
          }}
        />
      )}

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
              <Text style={styles.noDataText}>No Business Suggested. </Text>
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

export default SuggestedBusinessPages;

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
