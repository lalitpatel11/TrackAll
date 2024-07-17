//external imports
import React from 'react';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {RectButton} from 'react-native-gesture-handler';
import {View, Text, StyleSheet, Image} from 'react-native';
//internal imports
import {colors} from '../../constants/ColorConstant';

const GroupTask = ({item, taskDelete}: {item: any; taskDelete: Function}) => {
  const renderRightActions = (progress: any, dragX: any) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });

    return (
      <RectButton
        style={styles.rightAction}
        onPress={() => {
          taskDelete(item.id);
        }}>
        <Image
          resizeMode="contain"
          style={{height: 18, width: 18}}
          source={require('../../assets/pngImage/WhiteTrash.png')}
        />
      </RectButton>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.taskContainer}>
        <Text style={styles.taskText}>@ {item.time}</Text>
        <Text style={styles.taskText}>{item.taskname} </Text>
      </View>
    </Swipeable>
  );
};

export default GroupTask;

const styles = StyleSheet.create({
  taskContainer: {
    alignSelf: 'center',
    backgroundColor: colors.WHITE,
    borderRadius: 6,
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 10,
    width: '100%',
  },
  taskText: {
    color: colors.THEME_BLACK,
    fontSize: 16,
    paddingHorizontal: 5,
    paddingVertical: 15,
  },
  rightAction: {
    alignItems: 'center',
    backgroundColor: colors.RED,
    borderRadius: 8,
    justifyContent: 'center',
    left: 8,
    marginBottom: 8,
    width: '20%',
  },
  actionText: {color: colors.RED},
});
