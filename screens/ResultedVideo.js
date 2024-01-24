import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, } from 'react-native';
import Video from 'react-native-video';
import url from '../ApiUrl';

const windowHeight = Dimensions.get('window').height;

const VideoScreen = () => {

    return (
        <View style={styles.container}>
            <Video
                source={{ uri: `${url}video?timestamp=${new Date().getTime()}` }}
                style={styles.video}
                controls={true}
                resizeMode='contain'
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: 300,
        height: windowHeight * 0.7,
    },
});

export default VideoScreen;
