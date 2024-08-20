//external imports
import React from 'react';
import {View, StyleSheet} from 'react-native';
//internal imports
import WebView from 'react-native-webview';
import {API} from '../../service/api/ApiDetails';
import CustomHeader from '../../constants/CustomHeader';
import {colors} from '../../constants/ColorConstant';

const TermAndCondition = (props: any) => {
  return (
    <View style={styles.container}>
      {/* header section */}
      <CustomHeader
        headerText={'Term and Condition'}
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
            uri: `${API.GET_TERM_AND_CONDITION}`,
          }}
          contentMode="mobile"
        />
      </View>
    </View>
  );
};

export default TermAndCondition;

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
