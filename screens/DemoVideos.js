import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Image,
    Pressable,
    Modal,
    Alert,
    Dimensions
} from "react-native";
import { Color } from "../GlobalStyles";
import { FontFamily } from "../GlobalStyles";
import { FontSize } from "../GlobalStyles";
import CustomPicker from "../components/custom_picker_one_value";
import Video from 'react-native-video';
import { launchImageLibrary } from 'react-native-image-picker';

const cameras = [
    {
        "id": 1,
        "name": 'C1'
    },
    {
        "id": 2,
        "name": 'C2'
    },
    {
        "id": 3,
        "name": 'C3'
    },
    {
        "id": 4,
        "name": 'C4'
    },
]

const App = () => {

    const [time, setTime] = useState('')
    const [video, setVideo] = useState(null);
    const windowHeight = Dimensions.get('window').height;

    const [searchCameras, setSearchCameras] = useState(cameras)
    const [selectedCamera, setSelectedCamera] = useState('')
    const [cameraDdModelVisible, setCameraDdModelVisible] = useState(false)
    const cameraSearchRef = useRef();

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



    const sendCameraData = async () => {
        if (!video || !time || !selectedCamera) {
            Alert.alert('Error', 'No video selected');
            return;
        }

        const formData = new FormData();
        formData.append('time', time);
        formData.append('camera_name', selectedCamera);
        formData.append('video', {
            uri: video.uri,
            type: video.type,
            name: video.fileName,
        }
        );

        try {
            const response = await fetch(`${global.url}CheckVisitorIsPresent`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.ok) {
                Alert.alert('Success', 'Camera data send successfully.');
            } else {
                Alert.alert('Error', 'Failed to send camera data.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'An error occurred while send the camera data.');
        }
    };

    const onCamerasSearch = (txt) => {
        if (txt !== '') {
            let tempData = cameras.filter((item) => {
                for (let key in item) {
                    if (key !== 'id')
                        if (item[key].toLowerCase().includes(txt.toLowerCase())) {
                            return true;
                        }
                }
                return false;
            });
            setSearchCameras(tempData);
        } else {
            setSearchCameras(cameras);
        }
    }

    const handleCameraSelection = (item) => {
        setSelectedCamera(item.name);
        setCameraDdModelVisible(false);
    };


    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Time</Text>
                    <TextInput style={styles.input} value={time} onChangeText={time => setTime(time)} />
                </View>
                {video && (
                    <View>
                        <Video
                            source={{ uri: video.uri }}
                            style={{ width: 200, height: 350, alignSelf: 'center', marginVertical: '5%' }}
                            controls={true}
                            resizeMode="contain"
                        />
                    </View>
                )}
                <Pressable onPress={selectVideo} style={styles.button}>
                    <Text style={styles.buttonText}>Choose video</Text>
                </Pressable>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Camera</Text>
                    <View style={styles.pickerContainer}>
                        <Pressable
                            style={styles.dropdownselector}
                            onPress={() => setCameraDdModelVisible(true)}
                        >
                            <Text style={styles.selectedValues}>
                                {selectedCamera === ''
                                    ? 'Select Camera'
                                    : selectedCamera}
                            </Text>
                            <Image
                                source={require('../assets/expand.png')}
                                style={styles.icon}
                            />
                        </Pressable>
                        <CustomPicker
                            visible={cameraDdModelVisible}
                            setVisible={setCameraDdModelVisible}
                            selectedValue={selectedCamera}
                            onValueChange={handleCameraSelection}
                            data={searchCameras}
                            onSearchData={onCamerasSearch}
                            searchRef={cameraSearchRef}
                        />
                    </View>
                </View>
                <Pressable onPress={sendCameraData} style={[styles.button, { backgroundColor: '#F35469' }]}>
                    <Text style={styles.buttonText}>Save</Text>
                </Pressable>
            </View>
        </View >

    )
}
export default App;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    formContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    inputContainer: {
        marginBottom: 10,
    },
    inlineInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    inlineInputLeft: {
        flex: 1,
        marginRight: 6,
    },
    inlineInputRight: {
        flex: 1,
        marginLeft: 6,
    },
    label: {
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 15,
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: '#e1e1e1',
        borderWidth: 1,
        paddingHorizontal: 10,
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 13,
        alignItems: 'center',
        textAlignVertical: "center",
    },
    searchBar: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    searchInput: {
        height: 40,
        borderColor: '#e1e1e1',
        borderRadius: 15,
        borderWidth: 1,
        paddingHorizontal: 12,
    },

    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e1e1',
    },
    headerText: {
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 15,
        flex: 1,
    },
    item: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e1e1',
    },
    itemText: {
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 14,
        flex: 1,
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        marginBottom: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        width: '85%',
        paddingHorizontal: 5,
        paddingTop: 10,
        paddingBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            height: 2,
            width: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    errorContainer: {
        backgroundColor: '#ffcccc',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    errorText: {
        color: 'white',
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 13,
        textAlign: 'center',
    },
    flatList: {
        marginBottom: 35,
    },
    headerTopBar: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: Color.deepskyblue,
        marginHorizontal: 20,
        marginVertical: 10,
        elevation: 2,
        borderRadius: 7,
    },
    headerTopBarText: {
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 16,
        color: 'white'
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginRight: 10,
    },
    mainIcon: {
        marginLeft: 18,
        width: 18,
        height: 18,
        tintColor: 'white',
    },

    dropdownselector: {
        height: 40,
        width: '100%',
        borderWidth: 1,
        borderColor: '#e1e1e1',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 10,
    },
    selectedValues: {
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 12.5,
    },
    icon: {
        width: 12.5,
        height: 12.5,
    },
    button: {
        backgroundColor: '#8CD6FA',
        height: 40,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15,
    },
    buttonText: {
        color: 'white',
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 15,
    },
})