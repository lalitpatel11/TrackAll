import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors} from '../../constants/ColorConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ServiceTab = ({
  items,
  onDeleteClick,
}: {
  items: any;
  onDeleteClick: any;
}) => {
  const [useType, setUseType] = useState('');
  const [accountId, setAccountId] = useState<any>();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const userType: any = await AsyncStorage.getItem('userType');
    setUseType(userType);

    const accountId = await AsyncStorage.getItem('accountId');
    setAccountId(accountId);
  };

  return (
    <View style={styles.container}>
      {/* title section */}
      <View style={styles.direction}>
        <Text style={styles.title}>Service Name :</Text>
        <Text style={styles.userName}>{items?.servicename}</Text>
      </View>

      {/* description section */}
      <View style={styles.direction}>
        <Text style={styles.title}>Time :</Text>
        <Text style={styles.userName}>{items?.time}</Text>
      </View>

      {/* delete icon  */}
      {useType == '2' && items?.businessid == accountId ? (
        <TouchableOpacity
          style={styles.editContainer}
          onPress={() => {
            onDeleteClick(items?.serviceid);
          }}>
          <Image
            resizeMode="contain"
            style={{width: 18, height: 18}}
            source={require('../../assets/pngImage/Trash.png')}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default ServiceTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    flex: 1,
    marginVertical: 5,
    padding: 10,
  },
  direction: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  title: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '500',
  },
  userName: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
    width: '75%',
  },
  editContainer: {
    alignItems: 'center',
    borderRadius: 50,
    justifyContent: 'center',
    marginHorizontal: 3,
    padding: 3,
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
  },
});
