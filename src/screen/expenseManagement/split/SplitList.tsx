//external imports
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
//internal imports
import CustomHeader from '../../../constants/CustomHeader';
import SplitListTab from './SplitListTab';
import SplitService from '../../../service/SplitService';
import {colors} from '../../../constants/ColorConstant';

const SplitList = ({navigation, route}: {navigation: any; route: any}) => {
  const [noData, setNoData] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [splitBillList, setSplitBillList] = useState([]);
  const [splitGroupId, setSplitGroupId] = useState(route?.params?.data);
  const [totalAmount, setTotalAmount] = useState('0');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSplitGroupId(route?.params?.data);
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get all split bill data on api call
  const getData = () => {
    const data = {
      groupid: splitGroupId,
    };
    setPageLoader(true);
    SplitService.postSplitBillList(data)
      .then((response: any) => {
        setPageLoader(false);
        setTotalAmount(response.data.totalamount);
        setSplitBillList(response.data.splitexpenses);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // function for search all split bill data on api call
  const getAllSearchSplit = (text: string) => {
    setPageLoader(true);
    const data = {
      groupid: splitGroupId,
      search: text,
    };
    SplitService.postSearchSplitBillList(data)
      .then((response: any) => {
        setPageLoader(false);
        if (response?.data?.splitexpenses?.length > 0) {
          setPageLoader(false);
          setNoData(false);
          setSplitBillList(response.data.splitexpenses);
        } else {
          setPageLoader(false);
          setNoData(true);
          setSplitBillList(response.data.splitexpenses);
        }
      })
      .catch((error: any) => {
        setPageLoader(false);
        console.log('error', error);
      });
  };

  // list for split bill
  const renderAddedSplitList = ({item}: {item: any; index: any}) => {
    return <SplitListTab items={item} />;
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Split List'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.navigate('StackNavigation', {
              screen: 'SplitDetail',
              params: {
                data: splitGroupId,
              },
            });
          },
        }}
      />

      {/* body section */}
      <View style={styles.body}>
        <View style={styles.spendContainer}>
          <Text style={styles.spendText}>Total Amount</Text>
          <Text style={styles.spendAmountText}>${totalAmount}</Text>
          <View style={styles.backgroundImageContainer}>
            <Image
              resizeMode="contain"
              style={styles.image}
              source={require('../../../assets/pngImage/CurrencyCircleDollar.png')}
            />
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
          splitBillList?.length > 0 ? (
            <View style={styles.container}>
              <FlatList
                data={splitBillList}
                renderItem={renderAddedSplitList}
                keyExtractor={(item: any, index: any) => String(index)}
              />
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              {!noData ? (
                <Text style={styles.noDataText}>
                  No Split List Added. {'\n'}
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
      </View>
    </View>
  );
};

export default SplitList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    flex: 1,
    padding: 10,
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
    height: 90,
    justifyContent: 'center',
    paddingHorizontal: 10,
    width: '100%',
  },
  spendText: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
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
    bottom: -18,
    height: 110,
    position: 'absolute',
    right: -18,
    width: 110,
    zIndex: 1,
  },
  image: {
    height: '100%',
    opacity: 0.3,
    width: '100%',
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
