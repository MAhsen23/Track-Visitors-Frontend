import React, { useState } from 'react';
import { View, Pressable, Alert, Dimensions, StyleSheet, Text } from 'react-native';
import Video from 'react-native-video';
import { launchImageLibrary } from 'react-native-image-picker';
import url from '../ApiUrl';
import { FontFamily } from '../GlobalStyles';

const App = (props) => {
    const [video, setVideo] = useState(null);
    const windowHeight = Dimensions.get('window').height;

    const selectVideo = () => {
        let options = {
            mediaType: 'video',
            maxWidth: 300,
            maxHeight: 550,
            quality: 1,
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                alert('User cancelled video picker');
                return;
            } else if (response.errorCode == 'camera_unavailable') {
                alert('Camera not available on device');
                return;
            } else if (response.errorCode == 'permission') {
                alert('Permission not satisfied');
                return;
            } else if (response.errorCode == 'others') {
                alert(response.errorMessage);
                return;
            }
            setVideo(response.assets[0]);
        });
    };
    const uploadVideo = async () => {
        if (!video) {
            Alert.alert('Error', 'No video selected');
            return;
        }

        const formData = new FormData();
        formData.append('video', {
            uri: video.uri,
            type: video.type,
            name: video.fileName,
        });

        try {
            const response = await fetch(`${url}ShowVisitors`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.ok) {
                Alert.alert('Success', 'Video processed successfully.');
                props.navigation.navigate('ResultedFrames')
            } else {
                Alert.alert('Error', 'Failed to process video.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'An error occurred while uploading the video.');
        }
    };


    return (
        <View style={{ flex: 1, backgroundColor: 'white', padding: 20, }}>
            <Pressable onPress={selectVideo} style={styles.button}>
                <Text style={styles.buttonText}>Choose video</Text>
            </Pressable>

            {video && (
                <View>
                    <Video
                        source={{ uri: video.uri }}
                        style={{ width: 285, height: windowHeight * 0.7, alignSelf: 'center', marginVertical: '5%' }}
                        controls={true}
                        resizeMode="contain"
                    />
                </View>
            )}
            {video &&
                <Pressable onPress={uploadVideo} style={styles.button}>
                    <Text style={styles.buttonText}>Process video</Text>
                </Pressable>
            }
        </View>
    );
};

export default App;

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#8CD6FA',
        height: 40,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 15,
    },
})

