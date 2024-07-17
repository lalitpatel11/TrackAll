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
// internal imports
import AddSplitButton from './AddSplitButton';
import AddedSplitTab from './AddedSplitTab';
import CommonToast from '../../../constants/CommonToast';
import CustomHeader from '../../../constants/CustomHeader';
import SplitService from '../../../service/SplitService';
import {colors} from '../../../constants/ColorConstant';

const AddedSplit = ({navigation}: {navigation: any}) => {
  const [noData, setNoData] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [spendAmount, setSpendAmount] = useState('0');
  const [splitList, setSplitList] = useState([]);
  const [totalAmount, setTotalAmount] = useState('0');
  const toastRef = useRef<any>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get all split group data on api call
  const getData = () => {
    setPageLoader(true);
    SplitService.postSplitGroupList()
      .then((response: any) => {
        setPageLoader(false);
        setTotalAmount(response?.data?.totalamount);
        setSpendAmount(response?.data?.spendamount);
        setSplitList(response?.data?.mygroups);
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
        if (response?.data?.mygroups.length > 0) {
          setPageLoader(false);
          setNoData(false);
          setSplitList(response?.data?.mygroups);
        } else {
          setPageLoader(false);
          setNoData(true);
          setSplitList(response?.data?.mygroups);
        }
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log('error', error);
      });
  };

  // list for added split
  const renderAddedBudgetary = ({item}: {item: any; index: any}) => {
    return <AddedSplitTab items={item} onViewClick={handleViewDetailsClick} />;
  };

  // navigation for split details page on view click
  const handleViewDetailsClick = (id: any) => {
    navigation.navigate('StackNavigation', {
      screen: 'SplitDetail',
      params: {
        data: id,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Added Split'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* body section */}
      <View style={styles.body}>
        {/* spend and total amount section  */}
        <View style={styles.textDirection}>
          <View style={styles.spendContainer}>
            <Text style={styles.spendText}>Spent Amount</Text>
            <Text style={styles.spendAmountText}>${totalAmount}</Text>
            <View style={styles.backgroundImageContainer}>
              {/* <Image
                resizeMode="contain"
                style={styles.image}
                source={require('../../../assets/pngImage/CurrencyCircleDollar.png')}
              /> */}
            </View>
          </View>

          <View style={styles.spendContainer}>
            <Text style={styles.spendText}>Amount to be collected</Text>
            <Text style={styles.spendAmountText}>${spendAmount}</Text>
            <View style={styles.backgroundImageContainer}>
              {/* <Image
                resizeMode="contain"
                style={styles.image}
                source={require('../../../assets/pngImage/CurrencyCircleDollar.png')}
              /> */}
            </View>
          </View>
        </View>

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
                renderItem={renderAddedBudgetary}
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

        {/* create notes icon  */}
        <View style={styles.createIconContainer}>
          <AddSplitButton navigation={navigation} />
        </View>

        {/* toaster message for error response from API  */}
        <CommonToast ref={toastRef} />
      </View>
    </View>
  );
};

export default AddedSplit;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    flex: 1,
    padding: 10,
  },
  textDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
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
  spendContainer: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    height: 'auto',
    padding: 5,
    width: '48%',
  },
  spendText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '400',
    padding: 5,
    zIndex: 2,
  },
  spendAmountText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    paddingHorizontal: 5,
  },
  backgroundImageContainer: {
    borderRadius: 50,
    bottom: -12,
    height: 70,
    opacity: 0.3,
    position: 'absolute',
    right: -12,
    width: 70,
    zIndex: 1,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  createIconContainer: {
    bottom: 30,
    position: 'absolute',
    right: 40,
    zIndex: 1,
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
