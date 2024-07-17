//external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import moment from 'moment';
//external imports
import CustomHeader from '../../../constants/CustomHeader';
import SplitBillUsers from './SplitBillUsers';
import SplitDetailsProcess from './SplitDetailsProcess';
import SplitService from '../../../service/SplitService';
import {colors} from '../../../constants/ColorConstant';

const SplitDetailViewMore = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [monthlySplits, setMonthlySplits] = useState<any[]>([]);
  const [pageLoader, setPageLoader] = useState(false);
  const [splitDetails, setSplitDetails] = useState({});
  const [splitId, setSplitId] = useState(route?.params?.data);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPageLoader(true);
      setSplitId(route?.params?.data);
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  // function for get split details data on api call
  const getData = () => {
    SplitService.getSplitDetails(splitId)
      .then((response: any) => {
        setPageLoader(false);
        setSplitDetails(response?.data);
        setMonthlySplits(response?.data?.monthlysplits);
      })
      .catch(error => {
        setPageLoader(false);
        console.log(error);
      });
  };

  // list for added split bill user
  const renderAddedSplitBillUser = ({item}: {item: any; index: any}) => {
    return <SplitBillUsers items={item} />;
  };

  // list for monthly split bill progress bar
  const renderAddedSplitMonthlyProcess = ({item}: {item: any; index: any}) => {
    return (
      <SplitDetailsProcess
        items={item}
        totalAmount={splitDetails?.totalamount}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Split Detail'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />

      {/* body section */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {!pageLoader ? (
          <View style={styles.body}>
            <View style={styles.titleContainer}>
              <Text style={styles.splitTitle}>
                {splitDetails?.groupdetails?.groupname}
              </Text>
              <Text style={styles.amountText}>
                ${splitDetails?.totalamount}
              </Text>
              <Text style={styles.spendText}>Spent</Text>
              <Text style={styles.addedByText}>
                Added by {splitDetails?.groupdetails?.groupusername} on{' '}
                {moment(splitDetails?.groupdetails?.created_at).format(
                  'MMM DD, YYYY',
                )}
              </Text>
            </View>

            {/* user with their split amount section */}
            <View>
              {splitDetails?.details?.length > 0 ? (
                <View style={{paddingHorizontal: 8}}>
                  <FlatList
                    data={splitDetails?.details}
                    renderItem={renderAddedSplitBillUser}
                    keyExtractor={(item: any, index: any) => String(index)}
                  />
                </View>
              ) : null}

              {/* description section */}
              <View style={styles.descriptionContainer}>
                <Text style={styles.textLine}>
                  {splitDetails?.groupdetails?.groupdescription}
                </Text>
              </View>

              {/* monthly process bar section */}
              <FlatList
                data={monthlySplits}
                renderItem={renderAddedSplitMonthlyProcess}
                keyExtractor={(item: any, index: any) => String(index)}
              />

              {/* spend and total amount section  */}
              <View style={styles.textDirection}>
                <View style={styles.spendContainer}>
                  <Text style={styles.spendText}>Total Amount</Text>
                  <Text style={styles.spendAmountText}>
                    ${splitDetails?.totalamount}
                  </Text>
                  <View style={styles.backgroundImageContainer}>
                    <Image
                      resizeMode="contain"
                      style={styles.image}
                      source={require('../../../assets/pngImage/CurrencyCircleDollar.png')}
                    />
                  </View>
                </View>

                <View style={styles.spendContainer}>
                  <Text style={styles.spendText}>Spent Amount</Text>
                  <Text style={styles.spendAmountText}>
                    ${splitDetails?.spendamount}
                  </Text>
                  <View style={styles.backgroundImageContainer}>
                    <Image
                      resizeMode="contain"
                      style={styles.image}
                      source={require('../../../assets/pngImage/CurrencyCircleDollar.png')}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.THEME_ORANGE} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SplitDetailViewMore;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    padding: 10,
  },
  titleContainer: {
    paddingHorizontal: 5,
    width: '75%',
  },
  splitTitle: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '400',
  },
  addedByText: {
    color: colors.textGray,
    fontSize: 14,
    fontWeight: '500',
  },
  amountText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
  },
  spendText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '400',
  },
  imageContainer: {
    backgroundColor: colors.GRAY,
    borderRadius: 50,
    height: 30,
    width: 30,
  },
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
  textLine: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '400',
    paddingHorizontal: 10,
    textAlign: 'justify',
  },
  descriptionContainer: {
    height: 'auto',
    marginVertical: 5,
    padding: 5,
  },
  textDirection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingVertical: 3,
  },
  spendContainer: {
    backgroundColor: colors.BLACK2,
    borderRadius: 15,
    height: 70,
    padding: 5,
    width: '48%',
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
    height: 80,
    opacity: 0.3,
    position: 'absolute',
    right: -12,
    width: 80,
    zIndex: 1,
  },
  loaderContainer: {
    alignSelf: 'center',
    height: '90%',
    justifyContent: 'center',
  },
});
