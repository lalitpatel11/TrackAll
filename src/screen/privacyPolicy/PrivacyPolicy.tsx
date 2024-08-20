//external imports
import React from 'react';
import {View, StyleSheet} from 'react-native';
//internal imports
import WebView from 'react-native-webview';
import {API} from '../../service/api/ApiDetails';
import CustomHeader from '../../constants/CustomHeader';
import {colors} from '../../constants/ColorConstant';

const PrivacyPolicy = (props: any) => {
  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Privacy Policy'}
        backButton={{
          visible: true,
          onClick: () => {
            props.navigation.goBack();
          },
        }}
      />
      <View style={styles.webViewStyle}>
        <WebView
          source={{
            uri: `${API.GET_PRIVACY_POLICY}`,
          }}
          contentMode="mobile"
        />
      </View>
    </View>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  webViewStyle: {
    marginTop: '25%',
    height: '90%',
    position: 'absolute',
    width: '100%',
    zIndex: 999,
  },
});
