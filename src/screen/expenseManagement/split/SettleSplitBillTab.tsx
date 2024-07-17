// external imports
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import moment from 'moment';
// internal imports
import SplitBillUsers from './SplitBillUsers';
import {colors} from '../../../constants/ColorConstant';

const SettleSplitBillTab = ({
  items,
  onSelect,
  selectedList,
}: {
  items: any;
  onSelect: Function;
  selectedList: any;
}) => {
  // list for added split group members
  const renderAddedSplitBillUser = ({item}: {item: any; index: any}) => {
    return <SplitBillUsers items={item} />;
  };

  return (
    <>
      {items?.settled == 'Not settled' ? (
        <TouchableOpacity
          style={
            selectedList.includes(items?.id)
              ? styles.containerBorder
              : styles.container
          }
          onPress={() => {
            onSelect(items?.id, items);
          }}>
          {/* select image  */}
          {selectedList.includes(items?.id) ? (
            <View style={styles.selectIconContainer}>
              <Image
                resizeMode="contain"
                source={require('../../../assets/pngImage/CheckedIcon.png')}
                style={styles.image}
              />
            </View>
          ) : null}

          <View style={styles.direction}>
            <View style={styles.imageContainer}>
              <Image
                resizeMode="contain"
                source={
                  items?.images
                    ? {uri: `${items?.images}`}
                    : require('../../../assets/pngImage/dollar.png')
                }
                style={styles.image}
              />
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.splitTitle}>{items?.title}</Text>

              <Text style={styles.amountText}>
                ${items?.amount ? items?.amount : '0'}
              </Text>
              <View style={styles.direction}>
                <Text style={styles.spendText}>Spent</Text>
                <Text style={styles.personalText}>Personal</Text>
              </View>
              <Text style={styles.addedByText}>
                Added by {items?.createdbyusername} on{' '}
                {moment(items?.expense_date).format('MMM DD, YYYY')}
              </Text>
            </View>
          </View>

          {/* user with their split amount section */}
          <View>
            {items?.details?.length > 0 ? (
              <View style={styles.userContainer}>
                <FlatList
                  data={items?.details}
                  renderItem={renderAddedSplitBillUser}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.selectedContainer}>
          <View style={styles.direction}>
            <View style={styles.imageContainer}>
              <Image
                resizeMode="contain"
                source={
                  items?.images
                    ? {uri: `${items?.images}`}
                    : require('../../../assets/pngImage/dollar.png')
                }
                style={styles.image}
              />
            </View>

            <View style={styles.titleContainer}>
              <View style={styles.nameDirection}>
                <Text style={styles.splitTitle}>{items?.title}</Text>
                <Text style={styles.spendText}>Settled</Text>
              </View>
              <Text style={styles.amountText}>
                ${items?.amount ? items?.amount : '0'}
              </Text>
              <View style={styles.direction}>
                <Text style={styles.spendText}>Spent</Text>
                <Text style={styles.personalText}>Personal</Text>
              </View>
              <Text style={styles.addedByText}>
                Added by you on{' '}
                {moment(items?.expense_date).format('MMM DD, YYYY')}
              </Text>
            </View>
          </View>

          {/* user with their split amount section */}
          <View>
            {items?.details?.length > 0 ? (
              <View style={styles.userContainer}>
                <FlatList
                  data={items?.details}
                  renderItem={renderAddedSplitBillUser}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              </View>
            ) : null}
          </View>
        </View>
      )}
    </>
  );
};

export default SettleSplitBillTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK2,
    borderColor: 'transparent',
    borderRadius: 15,
    borderWidth: 2,
    elevation: 5,
    flex: 1,
    height: 'auto',
    margin: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  containerBorder: {
    backgroundColor: colors.BLACK2,
    borderColor: colors.THEME_ORANGE,
    borderRadius: 15,
    borderWidth: 2,
    elevation: 5,
    flex: 1,
    height: 'auto',
    margin: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  selectedContainer: {
    backgroundColor: colors.BLACK3,
    borderColor: 'transparent',
    borderRadius: 15,
    borderWidth: 2,
    elevation: 5,
    flex: 1,
    height: 'auto',
    margin: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  selectIconContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: 50,
    height: 40,
    position: 'absolute',
    right: 10,
    top: 10,
    width: 40,
    zIndex: 2,
  },
  direction: {
    flexDirection: 'row',
  },
  nameDirection: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleContainer: {
    paddingHorizontal: 5,
    width: '80%',
  },
  splitTitle: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '400',
    width: '80%',
  },
  addedByText: {
    color: colors.textGray,
    fontSize: 14,
    fontWeight: '500',
  },
  userContainer: {
    flex: 1,
    height: 'auto',
    paddingHorizontal: 10,
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
  personalText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '400',
    paddingHorizontal: 20,
  },
  imageContainer: {
    backgroundColor: colors.GRAY,
    borderRadius: 50,
    height: 75,
    width: 75,
  },
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
});
