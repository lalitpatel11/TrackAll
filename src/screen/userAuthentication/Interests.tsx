//external imports
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
//internal imports
import {colors} from '../../constants/ColorConstant';

const Interests = ({
  checked,
  checkedList,
  handleChecked,
  interests,
}: {
  checked: boolean;
  checkedList: number[];
  handleChecked: Function;
  interests: any;
}) => {
  return (
    <View style={styles.interestsContainer}>
      <TouchableOpacity
        style={
          checkedList?.includes(interests?.id)
            ? checked
              ? styles.interestsTabBorder
              : styles.interestsTab
            : styles.interestsTab
        }
        onPress={() => {
          handleChecked(interests?.id, interests);
        }}>
        {checkedList?.includes(interests?.id) ? (
          checked ? (
            <Image
              style={styles.checkedIcon}
              resizeMode="contain"
              source={require('../../assets/pngImage/checked.png')}
            />
          ) : null
        ) : null}
        <Image
          style={styles.image}
          resizeMode="contain"
          source={{uri: `${interests?.icon}`}}
        />
        <Text style={styles.interestsLabel}>{interests?.name}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Interests;

const styles = StyleSheet.create({
  interestsContainer: {
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.WHITE,
    borderRadius: 20,
    flexDirection: 'row',
    height: 105,
    justifyContent: 'space-between',
    margin: 5,
    width: '30%',
  },
  interestsTab: {
    alignItems: 'center',
    borderColor: colors.WHITE,
    borderRadius: 20,
    borderWidth: 2,
    height: 105,
    justifyContent: 'center',
    width: '100%',
  },
  interestsTabBorder: {
    alignItems: 'center',
    borderColor: colors.THEME_ORANGE,
    borderRadius: 20,
    borderWidth: 2,
    height: 105,
    justifyContent: 'center',
    width: '100%',
  },
  interestsLabel: {
    color: colors.BLACK,
  },
  checkedIcon: {
    position: 'absolute',
    right: 5,
    top: 5,
    zIndex: 1,
  },
  image: {
    height: 40,
    width: 40,
  },
});
