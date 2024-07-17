// external imports
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
// import Video from 'react-native-video';

const EventVideos = ({
  eventImages,
  imageClick,
}: {
  eventImages: any;
  imageClick: Function;
}) => {
  return (
    <TouchableOpacity
      style={styles.feedbackImageContainer}
      onPress={() => {
        imageClick();
      }}>
      {/* <Video
        source={{uri: `${eventImages?.images}`}} // Can be a URL or a local file.
        ref={ref => {
          this.player = ref;
        }} // Store reference
        onBuffer={this.onBuffer} // Callback when remote video is buffering
        onError={this.videoError} // Callback when video cannot be loaded
        style={styles.backgroundVideo}
      /> */}

      {/* <Video
    onEnd={this.onEnd}
    onLoad={this.onLoad}
    onLoadStart={this.onLoadStart}
    onProgress={this.onProgress}
    paused={this.state.paused}
    ref={videoPlayer => (this.videoPlayer = videoPlayer)}
    resizeMode={this.state.screenType}
    onFullScreen={this.state.isFullScreen}
    source={{
      uri: 'https://assets.mixkit.co/videos/download/mixkit-countryside-meadow-4075.mp4'
    }}
    style={styles.mediaPlayer}
    volume={10}
/> */}
    </TouchableOpacity>
  );
};

export default EventVideos;

const styles = StyleSheet.create({
  feedbackImageContainer: {
    borderRadius: 12,
    height: 80,
    margin: 3,
    width: 120,
  },
  image: {
    borderRadius: 12,
    width: '100%',
    height: '100%',
  },
  backgroundVideo: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
