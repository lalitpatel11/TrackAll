// external imports
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef} from 'react';
// internal imports
import {colors} from '../../constants/ColorConstant';
import ServiceTab from './ServiceTab';
import BusinessService from '../../service/BusinessService';

const ViewServicesModal = ({
  data,
  followerPageLoader,
  getAllSearchSList,
  noFollowerData,
  onClose,
  visibleModal,
  getUpdate,
}: {
  data: any;
  followerPageLoader: boolean;
  getAllSearchSList: Function;
  noFollowerData: boolean;
  onClose: Function;
  visibleModal: boolean;
  getUpdate: Function;
}) => {
  const toastRef = useRef<any>();

  // list follower tab
  const renderPageList = ({item}: {item: any; index: any}) => {
    return <ServiceTab items={item} onDeleteClick={handleDeleteClick} />;
  };

  const handleDeleteClick = (id: any) => {
    const body = {
      serviceid: id,
    };

    BusinessService.postDeleteService(body)
      .then(response => {
        getUpdate();
        toastRef.current.getToast(response.data.message, 'success');
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={visibleModal}
        onRequestClose={() => {
          onClose();
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalViewRepeat}>
            <View style={styles.direction}>
              <Text style={styles.followerText}>All Services</Text>

              {/* cross button section  */}
              <TouchableOpacity
                style={styles.crossContainer}
                onPress={() => {
                  onClose();
                }}>
                <Image
                  style={styles.imageStyle}
                  resizeMode="contain"
                  source={require('../../assets/pngImage/cross.png')}
                />
              </TouchableOpacity>
            </View>

            {/* search field  */}
            {/* <View style={styles.searchBoxContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Search by title"
                  placeholderTextColor={colors.textGray}
                  style={styles.searchInput}
                  value={searchText}
                  onChangeText={text => {
                    setSearchText(text);
                    getAllSearchSList(text);
                  }}
                />
              </View>
              <View style={styles.searchContainer}>
                <Image
                  resizeMode="contain"
                  source={require('../../assets/pngImage/searchIcon.png')}
                />
              </View>
            </View> */}

            {!followerPageLoader ? (
              data?.length > 0 ? (
                <FlatList
                  data={data}
                  renderItem={renderPageList}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              ) : (
                <View style={styles.noDataContainer}>
                  {!noFollowerData ? (
                    <Text style={styles.noDataText}>No data available.</Text>
                  ) : (
                    <Text style={styles.noDataText}>No data found</Text>
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
      </Modal>
    </View>
  );
};

export default ViewServicesModal;

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalViewRepeat: {
    backgroundColor: colors.BLACK2,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '70%',
    padding: 10,
    paddingTop: 20,
  },
  direction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  followerText: {
    color: colors.WHITE,
    fontSize: 20,
    fontWeight: '500',
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
  crossContainer: {
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    height: 30,
    width: 30,
    zIndex: 1,
  },
  imageStyle: {
    borderRadius: 10,
    height: '100%',
    width: '100%',
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
  loaderContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
