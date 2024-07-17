// external import
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import React, {useRef, useState} from 'react';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// internal imports
import CameraGalleryModal from '../../groups/CameraGalleryModal';
import CommonToast from '../../../constants/CommonToast';
import CustomHeader from '../../../constants/CustomHeader';
import InviteMemberOnSplitModal from './InviteMemberOnSplitModal';
import RecentlyAddedMembersTab from '../../groups/RecentlyAddedMembersTab';
import SplitService from '../../../service/SplitService';
import SubmitButton from '../../../constants/SubmitButton';
import {colors} from '../../../constants/ColorConstant';
import {splitValidation} from '../../../constants/SchemaValidation';

const AddSplit = ({navigation}: {navigation: any}) => {
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [cameraGalleryModal, setCameraGalleryModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedMembersId, setSelectedMembersId] = useState<number[]>([]);
  const [selectedMembersList, setSelectedMembersList] = useState<any[]>([]);
  const [splitBillImage, setSplitBillImage] = useState({});
  const toastRef = useRef<any>();

  // function for open camera
  const openCamera = async () => {
    try {
      let value = await ImagePicker.openCamera({
        width: 1080,
        height: 1080,
        cropping: true,
        mediaType: 'photo',
        compressImageQuality: 1,
        compressImageMaxHeight: 1080 / 2,
        compressImageMaxWidth: 1080 / 2,
      }).then(image => {
        setSplitBillImage(image);
        setCameraGalleryModal(false);
      });
    } catch (error) {
      setCameraGalleryModal(false);

      console.log('error in openLibrary', error);
    }
  };

  // function for open gallery
  const openLibrary = async () => {
    try {
      let value = await ImagePicker.openPicker({
        width: 1080,
        height: 1080,
        cropping: true,
        mediaType: 'photo',
        compressImageQuality: 1,
        compressImageMaxHeight: 1080 / 2,
        compressImageMaxWidth: 1080 / 2,
      }).then(image => {
        setSplitBillImage(image);
        setCameraGalleryModal(false);
      });
    } catch (error) {
      setCameraGalleryModal(false);
      console.log('error in openLibrary', error);
    }
  };

  // function for member add click to set state
  const handleMemberIdAddClick = (memberList: any[], userList: any[]) => {
    setAddMemberModal(false);
    setSelectedMembersId(memberList);
    setSelectedMembersList(userList);
  };

  // list for recently added members
  const renderAddedMembers = ({item}: {item: any; index: any}) => {
    return <RecentlyAddedMembersTab item={item} />;
  };

  // function for submit button click for api call to add split group
  const onSubmit = (values: any) => {
    Keyboard.dismiss();
    setLoader(true);

    const data = new FormData();
    if (splitBillImage?.path != null) {
      const imageName = splitBillImage?.path?.slice(
        splitBillImage?.path.lastIndexOf('/'),
        splitBillImage?.length,
      );
      data.append('groupimage', {
        name: imageName,
        type: splitBillImage?.mime,
        uri: splitBillImage?.path,
      });
    }
    data.append('groupname', values.title);
    data.append('group_description', values.description);
    if (selectedMembersId?.length >= 0) {
      selectedMembersId.map((e: any, index: any) => {
        data.append(`splitMembers[${index}]`, e);
      });
    }

    SplitService.postAddSplitGroup(data)
      .then((response: any) => {
        setLoader(false);
        if (response.data.status === 1) {
          toastRef.current.getToast(response.data.message, 'success');
          navigation.navigate('StackNavigation', {
            screen: 'SplitDetail',
            params: {
              data: response?.data?.splitgroups?.groupid,
            },
          });
        } else if (response.data.status === 0) {
          toastRef.current.getToast(response.data.message, 'success');
        }
      })
      .catch((error: any) => {
        setLoader(false);
        console.log(error, 'error in catch');
      });
  };

  const initialValues = {
    description: '',
    title: '',
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Add Split'}
        backButton={{
          visible: true,
          onClick: () => {
            navigation.goBack();
          },
        }}
      />
      {/* body section */}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}>
        <Formik
          validationSchema={splitValidation}
          initialValues={initialValues}
          onSubmit={values => {
            onSubmit(values);
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldTouched,
          }) => (
            <View style={styles.body}>
              {/* title section  */}
              <View>
                <Text style={styles.labelText}>Title</Text>
                <TextInput
                  placeholder="Enter Title"
                  placeholderTextColor={colors.textGray}
                  style={styles.textInput}
                  value={values.title}
                  onChangeText={handleChange('title')}
                  onBlur={() => {
                    handleBlur('title');
                    setFieldTouched('title');
                  }}
                />

                <Text style={styles.errorMessage}>
                  {touched.title && errors.title}
                </Text>
              </View>

              {/*Description section  */}
              <View>
                <Text style={styles.labelText}>Description</Text>
                <TextInput
                  placeholder="Enter Description Here…"
                  placeholderTextColor={colors.textGray}
                  style={styles.descriptionInput}
                  value={values.description}
                  numberOfLines={3}
                  multiline={true}
                  textAlignVertical="top"
                  onChangeText={handleChange('description')}
                  onBlur={() => {
                    handleBlur('description');
                    setFieldTouched('description');
                  }}
                />
                <Text style={styles.errorMessage}>
                  {touched.description && errors.description}
                </Text>
              </View>

              {/* recently added member  */}
              <View style={styles.direction}>
                <Text style={styles.labelText}>Added Members</Text>
                <TouchableOpacity onPress={() => setAddMemberModal(true)}>
                  <Text style={styles.addMemberText}>Add New Member</Text>
                </TouchableOpacity>
              </View>

              {selectedMembersList?.length > 0 ? (
                <FlatList
                  data={selectedMembersList}
                  renderItem={renderAddedMembers}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item: any, index: any) => String(index)}
                />
              ) : (
                <View style={styles.noMembersContainer}>
                  <Text style={styles.noMembersText}>No Members Added</Text>
                </View>
              )}

              {/* uploaded media section  */}
              {splitBillImage?.path != null ? (
                <View style={styles.uploadMediaBox}>
                  <TouchableOpacity
                    style={styles.crossContainer}
                    onPress={() => {
                      setSplitBillImage({});
                    }}>
                    <Image
                      style={styles.image}
                      resizeMode="contain"
                      source={require('../../../assets/pngImage/cross.png')}
                    />
                  </TouchableOpacity>
                  <Image
                    style={styles.imageStyle}
                    resizeMode="contain"
                    source={{uri: `${splitBillImage?.path}`}}
                  />
                </View>
              ) : null}

              {/* upload image section */}
              <TouchableOpacity
                onPress={() => setCameraGalleryModal(true)}
                style={styles.uploadMediaContainer}>
                <Image
                  style={styles.uploadImageStyle}
                  resizeMode="contain"
                  source={require('../../../assets/pngImage/UploadMedia.png')}
                />
                <Text style={styles.uploadMediaText}>Upload Image</Text>
              </TouchableOpacity>

              {/* button with loader  */}
              <View style={styles.buttonContainer}>
                <SubmitButton
                  loader={loader}
                  submitButton={handleSubmit}
                  buttonText={'Save'}
                />
              </View>

              {/* Camera Gallery Modal  */}
              <CameraGalleryModal
                visibleModal={cameraGalleryModal}
                onClose={() => {
                  setCameraGalleryModal(false);
                }}
                cameraClick={openCamera}
                galleryClick={openLibrary}
              />

              {/* Member Email Id modal  */}
              <InviteMemberOnSplitModal
                visibleModal={addMemberModal}
                onClose={() => {
                  setAddMemberModal(false);
                }}
                onSubmitClick={handleMemberIdAddClick}
                navigation={navigation}
                selectedMembersId={selectedMembersId}
                selectedMembersList={selectedMembersList}
              />

              {/* toaster message for error response from API  */}
              <CommonToast ref={toastRef} />
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddSplit;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  body: {
    flex: 1,
    padding: 10,
    paddingBottom: 40,
  },
  labelText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '500',
    paddingVertical: 5,
  },
  addMemberText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: colors.BLACK3,
    borderRadius: 10,
    color: colors.WHITE,
    fontSize: 16,
    padding: 15,
  },
  descriptionInput: {
    backgroundColor: colors.BLACK3,
    borderRadius: 10,
    color: colors.WHITE,
    fontSize: 16,
    height: 100,
    padding: 12,
  },
  errorMessage: {
    color: colors.RED,
    fontSize: 14,
    paddingHorizontal: 10,
  },
  direction: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  uploadMediaContainer: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
    borderColor: colors.THEME_ORANGE,
    borderRadius: 50,
    borderStyle: 'dotted',
    borderWidth: 2,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
  },
  uploadImageStyle: {
    height: 30,
    paddingHorizontal: 25,
    width: 30,
  },
  imageStyle: {
    height: '100%',
    borderRadius: 10,
    width: '100%',
  },
  uploadMediaText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '400',
  },
  uploadMediaBox: {
    borderRadius: 10,
    height: 90,
    marginBottom: 10,
    width: 130,
  },
  buttonContainer: {paddingTop: 30},
  noMembersContainer: {
    alignContent: 'center',
    alignItems: 'center',
    height: '16%',
    justifyContent: 'center',
  },
  noMembersText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    padding: 20,
  },
  image: {
    borderRadius: 10,
    height: '100%',
    width: '100%',
  },
  crossContainer: {
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    height: 20,
    position: 'absolute',
    right: 0,
    top: 0,
    width: 20,
    zIndex: 1,
  },
});
