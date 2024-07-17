// external import
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
// internal import
import {colors} from '../../constants/ColorConstant';

const AllSubCategoryTab = ({
  checked,
  checkedList,
  handleChecked,
  handleDelete,
  items,
  myUserId,
}: {
  checked: boolean;
  checkedList: any;
  handleChecked: Function;
  handleDelete?: Function;
  items: any;
  myUserId?: any;
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <TouchableOpacity
          onPress={() => {
            handleChecked(items?.id);
          }}>
          <Text
            style={
              checkedList.includes(items?.id)
                ? checked
                  ? styles.interestsTabBorder
                  : styles.interestsTab
                : styles.interestsTab
            }>
            {items.name}
          </Text>
        </TouchableOpacity>
      </View>

      {/* delete icon based on user id */}
      {myUserId == items?.createdby ? (
        <TouchableOpacity
          style={styles.deleteContainer}
          onPress={() => {
            handleDelete(items?.id);
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

export default AllSubCategoryTab;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  body: {
    backgroundColor: colors.BLACK3,
    borderRadius: 38,
    marginRight: 3,
  },
  interestsTab: {
    borderRadius: 38,
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
    height: 40,
    paddingVertical: 10,
    textAlign: 'center',
    width: 125,
  },
  interestsTabBorder: {
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 38,
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
    height: 40,
    paddingVertical: 10,
    textAlign: 'center',
    width: 125,
  },
  deleteContainer: {
    alignItems: 'center',
    borderRadius: 50,
    justifyContent: 'center',
    marginHorizontal: 3,
    padding: 3,
  },
});
