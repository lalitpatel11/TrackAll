//external imports
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
//internal imports
import {colors} from '../../constants/ColorConstant';

const AllCategoryEditBudgetary = ({
  checked,
  checkedList,
  handleChecked,
  handleDelete,
  item,
  myUserId,
}: {
  checked: boolean;
  checkedList: number[];
  handleChecked: Function;
  handleDelete?: Function;
  item: any;
  myUserId?: any;
}) => {
  return (
    <View style={styles.interestsContainer}>
      <TouchableOpacity
        disabled={true}
        style={
          checkedList.includes(item.id)
            ? checked
              ? styles.interestsTabBorder
              : styles.interestsTab
            : styles.interestsTab
        }
        onPress={() => {
          handleChecked(item.id);
        }}>
        {checkedList.includes(item.id) ? (
          checked ? (
            <Image
              style={styles.checkedIcon}
              resizeMode="contain"
              source={require('../../assets/pngImage/checked.png')}
            />
          ) : null
        ) : null}

        {/* category image section  */}
        <View style={styles.categoryContainer}>
          <Image
            resizeMode="contain"
            source={
              item?.categoryimage
                ? {uri: `${item?.categoryimage}`}
                : require('../../assets/pngImage/avatar.png')
            }
            style={styles.categoryImage}
          />
        </View>
        {/* user name section */}
        <Text style={styles.categoryLabel}>{item?.categoryname}</Text>
      </TouchableOpacity>

      {/* delete icon based on user id  */}
      {myUserId == item?.created_by ? (
        <TouchableOpacity
          style={styles.editContainer}
          onPress={() => {
            handleDelete(item.id);
          }}>
          <Image
            resizeMode="contain"
            style={{height: 18, width: 18}}
            source={require('../../assets/pngImage/Trash.png')}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default AllCategoryEditBudgetary;

const styles = StyleSheet.create({
  interestsContainer: {
    backgroundColor: colors.BLACK3,
    borderRadius: 20,
    flexDirection: 'row',
    height: 105,
    margin: 5,
  },
  interestsTab: {
    alignItems: 'center',
    borderColor: colors.brightGray,
    borderRadius: 20,
    borderWidth: 2,
    height: 105,
    justifyContent: 'flex-start',
    paddingVertical: 10,
    width: 105,
  },
  interestsTabBorder: {
    alignItems: 'center',
    borderColor: colors.THEME_ORANGE,
    borderRadius: 20,
    borderWidth: 2,
    height: 105,
    justifyContent: 'flex-start',
    paddingVertical: 10,
    width: 105,
  },
  checkedIcon: {
    left: 5,
    position: 'absolute',
    top: 5,
    zIndex: 1,
  },
  categoryContainer: {
    backgroundColor: colors.GRAY,
    borderRadius: 50,
    height: 45,
    width: 45,
  },
  categoryImage: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
  categoryLabel: {
    color: colors.WHITE,
    fontSize: 16,
    textAlign: 'center',
  },
  editContainer: {
    alignItems: 'center',
    borderRadius: 50,
    justifyContent: 'center',
    marginHorizontal: 3,
    padding: 3,
    position: 'absolute',
    right: 0,
    zIndex: 1,
  },
});