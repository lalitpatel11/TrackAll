//external imports
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
//internal imports
import {colors} from '../../constants/ColorConstant';

const SharedNotesTab = ({
  items,
  onDeleteClick,
}: {
  items: any;
  onDeleteClick: Function;
}) => {
  return (
    <View style={styles.container}>
      {/* group image section */}
      {items?.groupimage ? (
        <View style={styles.groupImageContainer}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={{uri: `${items?.groupimage}`}}
          />
        </View>
      ) : (
        <View style={styles.noGroupImageContainer}>
          <View style={styles.noGroupImage}>
            <Image
              style={{width: '100%', height: '100%'}}
              resizeMode="contain"
              source={require('../../assets/pngImage/noImage.png')}
            />
          </View>
        </View>
      )}

      {/* name section  */}
      <View style={styles.nameContainer}>
        <Text style={styles.groupLabel}>Group Name: </Text>
        <Text style={styles.groupName}>{items?.name}</Text>
      </View>

      {/* delete image section  */}
      <TouchableOpacity
        style={styles.deleteContainer}
        onPress={() => {
          onDeleteClick(items?.groupid);
        }}>
        <Image
          resizeMode="contain"
          style={{height: 18, width: 18}}
          source={require('../../assets/pngImage/Trash.png')}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SharedNotesTab;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
    borderLeftColor: colors.THEME_ORANGE,
    borderLeftWidth: 3,
    borderRadius: 15,
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 5,
    padding: 10,
    width: 320,
  },
  direction: {
    flexDirection: 'row',
  },
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
  groupImageContainer: {
    borderColor: colors.GRAY,
    borderRadius: 50,
    borderWidth: 3,
    height: 70,
    width: 70,
  },
  noGroupImageContainer: {
    alignItems: 'center',
    backgroundColor: colors.THEME_WHITE,
    borderColor: colors.GRAY,
    borderRadius: 50,
    borderWidth: 3,
    height: 70,
    justifyContent: 'center',
    width: 70,
  },
  noGroupImage: {
    height: 40,
    width: 35,
  },
  nameContainer: {
    paddingLeft: 5,
    width: '60%',
  },
  groupLabel: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
  },
  groupName: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    fontWeight: '500',
    width: '100%',
  },
  deleteContainer: {
    alignItems: 'center',
    backgroundColor: colors.lightRed,
    borderRadius: 50,
    height: 50,
    justifyContent: 'center',
    marginHorizontal: 3,
    padding: 3,
    width: 50,
  },
});
