// external imports
import React, {useRef, useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
// internal imports
import BusinessService from '../../service/BusinessService';
import CommonToast from '../../constants/CommonToast';
import DeleteAlertModal from '../groups/DeleteAlertModal';
import {colors} from '../../constants/ColorConstant';

const MyAllBusinessListTab = ({
  items,
  navigation,
  onDelete,
}: {
  items: any;
  navigation: any;
  onDelete: Function;
}) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const toastRef = useRef<any>();

  // function for delete button click on api call to delete task
  const handleDelete = () => {
    setDeleteModal(false);
    BusinessService.getDeleteMyBusiness(items?.businessid)
      .then((response: any) => {
        toastRef.current.getToast(response.data.message, 'success');
        onDelete();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.navigate('StackNavigation', {
          screen: 'BusinessDetailsPage',
          params: {id: items.businessid},
        });
      }}>
      <View style={styles.imageContainer}>
        <Image
          resizeMode="contain"
          style={styles.profileImage}
          source={
            items?.businessProfile
              ? {uri: `${items?.businessProfile}`}
              : require('../../assets/pngImage/avatar.png')
          }
        />
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => {
            navigation.navigate('StackNavigation', {
              screen: 'EditMyBusiness',
              params: {
                data: items,
              },
            });
          }}>
          <Image
            resizeMode="contain"
            style={styles.icon}
            source={require('../../assets/pngImage/editIcon.png')}
          />
        </TouchableOpacity>

        {/* delete icon based on account type */}
        {items?.accounttype == 'S' ? (
          <>
            <TouchableOpacity
              style={styles.deleteIcon}
              onPress={() => {
                setDeleteModal(true);
              }}>
              <Image
                resizeMode="contain"
                style={styles.icon}
                source={require('../../assets/pngImage/Trash.png')}
              />
            </TouchableOpacity>
          </>
        ) : null}
      </View>

      {/* details section */}
      <View style={{marginTop: 10}}>
        <View style={styles.direction}>
          <Text style={styles.labelText}>Name: </Text>
          <Text style={styles.nameText}>{items?.name}</Text>
        </View>

        {items?.email != null ? (
          <View style={styles.direction}>
            <Text style={styles.labelText}>Email: </Text>
            <Text style={styles.nameText}>{items?.email}</Text>
          </View>
        ) : null}

        {items?.contactnumber != null ? (
          <View style={styles.direction}>
            <Text style={styles.labelText}>Mobile: </Text>
            <Text style={styles.nameText}>
              {items?.contactnumber.replace(
                /(\d{3})(\d{3})(\d{4})/,
                '$1-$2-$3',
              )}
            </Text>
          </View>
        ) : null}

        {items?.website != null ? (
          <View style={styles.direction}>
            <Text style={styles.labelText}>Website: </Text>
            <Text style={styles.nameText}>
              {items?.website ? items?.website : 'N/A'}
            </Text>
          </View>
        ) : null}

        <View style={styles.direction}>
          <Text style={styles.labelText}>Address: </Text>
          <Text style={styles.nameText}>{items?.address}</Text>
        </View>

        <View style={styles.direction}>
          <Text style={styles.labelText}>Business type: </Text>
          <Text style={styles.nameText}>{items?.businesstype}</Text>
        </View>

        <View style={styles.direction}>
          <Text style={styles.labelText}>Description: </Text>
          <Text style={styles.nameText}>{items?.description}</Text>
        </View>
      </View>

      {/* Delete alert modal for delete appointment */}
      <DeleteAlertModal
        visibleModal={deleteModal}
        onRequestClosed={() => {
          setDeleteModal(false);
        }}
        onPressRightButton={() => {
          handleDelete();
        }}
        subHeading={'Are you sure you want to delete this business ?'}
      />

      {/* toaster message for error response from API  */}
      <CommonToast ref={toastRef} />
    </TouchableOpacity>
  );
};

export default MyAllBusinessListTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK2,
    borderRadius: 8,
    flex: 1,
    margin: 2,
    marginVertical: 10,
    padding: 10,
  },
  imageContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 40,
  },
  profileImage: {
    borderRadius: 50,
    height: 35,
    marginHorizontal: 5,
    width: 35,
  },
  editIcon: {
    alignItems: 'center',
    borderRadius: 50,
    height: 20,
    justifyContent: 'center',
    position: 'absolute',
    right: 30,
    width: 20,
    zIndex: 1,
  },
  deleteIcon: {
    alignItems: 'center',
    borderRadius: 50,
    height: 20,
    justifyContent: 'center',
    position: 'absolute',
    right: 5,
    width: 20,
    zIndex: 1,
  },
  icon: {
    height: 15,
    width: 15,
  },
  direction: {flexDirection: 'row'},
  labelText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
  nameText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '400',
    width: '75%',
  },
});
