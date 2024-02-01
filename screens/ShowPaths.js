import React, { useState, useEffect } from 'react'
import { View, Modal, Text, TextInput, Image, Pressable, Alert, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { Color, FontFamily, FontSize } from "../GlobalStyles";
import url from '../ApiUrl';
import { launchImageLibrary } from 'react-native-image-picker';
import CustomPickerWithoutSearch from "../Custom_Hayo/custom_picker_without_search";

const PathScreen = (props) => {

    const { entryTime, paths, source, selectedVisitorId } = props.route.params;

    const [error, setError] = useState('');

    const [time, setTime] = useState('');
    const [visitorId, setVisitorId] = useState('')
    const [video, setVideo] = useState(null);
    const [pathsState, setPathsState] = useState([]);
    const [camerasDetail, setCamerasDetail] = useState([])

    const [isSending, setIsSending] = useState(false);

    const [frameImage, setFrameImage] = useState('')

    const [isModalVisible, setIsModalVisible] = useState(false);


    const [cameras, setCameras] = useState([])
    const [camera, setCamera] = useState('');
    const [cameraModalVisible, setCameraModalVisible] = useState(false);

    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const showError = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 5000);
    };

    const updateEntryTime = () => {
        const currentTime = new Date();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = (hours % 12) || 12;
        const formattedTime = `${formattedHours}:${minutes} ${ampm}`;
        setTime(formattedTime);
    };


    useEffect(() => {
        updateEntryTime();

        const intervalId = setInterval(updateEntryTime, 60000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {

        setPathsState(paths);
        setVisitorId(selectedVisitorId)
        fetchCameras();

        if (source) {
            const cameraExists = camerasDetail.some(item => item.camera === source);

            if (!cameraExists) {
                const newCameraDetail = {
                    camera: source,
                    time: entryTime,
                    detect: true,
                    is_not_deviated: true,
                };
                setCamerasDetail(prevDetail => [...prevDetail, newCameraDetail]);
            }
        }
    }, [paths, source, selectedVisitorId]);


    const fetchCameras = async () => {
        try {
            const response = await fetch(`${url}GetAllCameras`);
            if (response.ok) {
                const data = await response.json();
                setCameras(data);
                showError('');
            } else {
                throw new Error('Failed to fetch cameras.');
            }
        } catch (error) {
            showError('An error occurred while fetching cameras.');
            console.error('Error occurred during API request:', error);
        }
    };

    const sendCameraVideo = async () => {
        if (!video || !time || !camera) {
            Alert.alert('Error', 'Please fill in all the fields.');
            return;
        }

        setIsSending(true);

        const formData = new FormData();
        formData.append('time', time);
        formData.append('camera_id', cameras.find(item => item.name === camera).id);
        formData.append('camera_name', camera);
        formData.append('visitor_id', visitorId);
        formData.append('video', {
            uri: video.uri,
            type: video.type,
            name: video.fileName,
        });

        try {
            const response = await fetch(`${url}CheckVisitorIsPresent`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.ok) {
                const responseBody = await response.json();
                const details = responseBody.details;
                console.log(details)

                const existingCameraIndex = camerasDetail.findIndex(item => item.camera === details.camera);

                if (existingCameraIndex !== -1 && camerasDetail[existingCameraIndex].detect !== true) {
                    const updatedCamerasDetail = [...camerasDetail];
                    updatedCamerasDetail[existingCameraIndex] = {
                        camera: details.camera,
                        time: details.time,
                        detect: details.detect,
                        is_not_deviated: details.is_not_deviated,
                    };
                    setCamerasDetail(updatedCamerasDetail);

                } else if (existingCameraIndex === -1) {

                    const newCameraDetail = {
                        camera: details.camera,
                        time: details.time,
                        detect: details.detect,
                        is_not_deviated: details.is_not_deviated,
                    };
                    setCamerasDetail(prevDetail => [...prevDetail, newCameraDetail]);
                    console.log(camerasDetail);
                }


                if (!details.is_not_deviated && details.detect && paths[0][paths[0].length - 1] === details.camera) {

                    Alert.alert('Success', 'Visitor has reached their destination but not with right path.');
                    //props.navigation.navigate('GuardDashboard')
                }
                else if (details.is_not_deviated && details.detect && paths[0][paths[0].length - 1] === details.camera) {

                    Alert.alert('Success', 'Visitor has reached their destination.');
                    //props.navigation.navigate('GuardDashboard')
                }
                else if (details.is_not_deviated && details.detect) {

                    Alert.alert('Success', 'Visitor is on the correct path.');
                }
                else if (!details.is_not_deviated && details.detect) {

                    Alert.alert('Warning', 'Visitor has deviated from their path.');
                }
                else {

                    Alert.alert('Warning', 'Visitor not detected.');
                }
            } else {

                Alert.alert('Error', 'Failed to send camera data.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'An error occurred while sending the camera data.');
        } finally {
            setIsSending(false);
        }
    };




    const handleStepPress = (step, camera, associatedCamera) => async () => {
        if (!camera || camera == source) {
            Alert.alert('Alert', 'This camera does not have a frame or may be it is the source camera.');
            return;
        }

        if (!(associatedCamera.detect)) {
            Alert.alert('Alert', 'Visitor is not detected in this frame.');
            return;
        }
        try {
            const response = await fetch(`${url}GetDetectedFrame/${visitorId}/${camera}?timestamp=${new Date().getTime()}`);
            if (response.ok) {
                const data = await response.json();
                setFrameImage(data.image);
            } else {
                throw new Error('Failed to fetch detected image.');
            }
            setIsModalVisible(true);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'An error occurred while getting the detected frame...');
        }
    };

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

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ alignItems: 'center', backgroundColor: Color.white, elevation: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, height: 65, marginBottom: 5, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: "space-between" }}>
                <Pressable onPress={() => { props.navigation.goBack() }}>
                    <Image style={{ tintColor: Color.lightsteelblue, width: 32, height: 32, }} source={require('../assets/back.png')} />
                </Pressable>
                <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 19.5, letterSpacing: .4, color: Color.lightsteelblue }}>CAMERA PATHS</Text>
                <Pressable onPress={() => {
                    setIsMenuVisible(!isMenuVisible);
                }}>
                    <Image style={{ tintColor: Color.lightsteelblue, width: 30, height: 30, }} source={require('../assets/menu.png')} />
                </Pressable>
            </View >
            <ScrollView style={{ flex: 1, backgroundColor: 'white' }} showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    {pathsState.map((path, index) => (
                        <View key={index} style={styles.pathContainer}>
                            <Text style={styles.pathTitle}>Path {index + 1}</Text>
                            <View style={styles.path}>
                                {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}> */}
                                {path.map((step, stepIndex) => {
                                    const associatedCamera = camerasDetail.find(cameraItem => cameraItem.camera === step);
                                    const cameraTime = associatedCamera ? associatedCamera.time : null;
                                    const isHighlighted = !!associatedCamera;
                                    const camera = associatedCamera ? associatedCamera.camera : null;
                                    const isDetected = associatedCamera ? associatedCamera.detect : false;

                                    return (
                                        <View key={stepIndex} style={{ position: 'relative' }}>
                                            {cameraTime && (
                                                <Text
                                                    style={{
                                                        alignSelf: 'center',
                                                        fontFamily: FontFamily.poppinsMedium,
                                                        fontSize: 13,
                                                        marginRight: 17,
                                                    }}
                                                >
                                                    {cameraTime}
                                                </Text>
                                            )}
                                            {
                                                !cameraTime && (
                                                    <Text
                                                        style={{
                                                            alignSelf: 'center',
                                                            fontFamily: FontFamily.poppinsMedium,
                                                            fontSize: 13,
                                                            marginRight: 17,
                                                        }}
                                                    >
                                                        {' '}
                                                    </Text>
                                                )
                                            }

                                            <Pressable onPress={handleStepPress(step, camera, associatedCamera)}>
                                                <Text style={[isHighlighted ? styles.stephighlight : styles.step, { backgroundColor: isHighlighted ? (isDetected ? '#0CBFA7' : '#F35469') : '#6AB7E2' }]}>
                                                    {step}
                                                </Text>
                                            </Pressable>

                                        </View>
                                    );
                                })}
                                {/* </ScrollView> */}
                            </View>
                        </View>
                    ))
                    }

                    <Pressable style={styles.button} onPress={selectVideo}>
                        <Text style={styles.buttonText}>Choose Video</Text>
                    </Pressable>
                    {
                        video &&
                        <Pressable style={styles.videoFile}>
                            <Text style={{ fontFamily: FontFamily.poppinsRegular }}>
                                {`${video.fileName.substring(0, 5)}...${video.fileName.slice(-5)}`}
                            </Text>
                        </Pressable>
                    }
                    <View style={styles.formContainer}>
                        <View style={styles.inlineInputContainer}>
                            <View style={styles.inlineInputLeft}>
                                <Text style={styles.label}>Time</Text>
                                <TextInput style={styles.input} value={time} onChangeText={setTime} />
                            </View>
                            <View style={styles.inlineInputRight}>
                                <View style={styles.pickerContainer}>
                                    <Text style={styles.label}>Camera</Text>
                                    <Pressable style={styles.dropdownselector} onPress={() => setCameraModalVisible(true)}>
                                        <Text style={{ fontFamily: FontFamily.poppinsRegular, fontSize: 13, color: '#000', opacity: 0.9 }}>{camera !== '' ? camera : 'Select Camera'}</Text>
                                        <Image source={require('../assets/expand.png')} style={styles.icon} />
                                    </Pressable>
                                    <CustomPickerWithoutSearch
                                        visible={cameraModalVisible}
                                        setVisible={setCameraModalVisible}
                                        selectedValue={camera}
                                        onValueChange={(item) => {
                                            setCamera(item)
                                        }}
                                        data={cameras.map(item => item.name)}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <Pressable style={styles.button} onPress={sendCameraVideo} disabled={isSending}>
                        <Text style={styles.buttonText}>{isSending ? 'Sending...' : 'Send'}</Text>
                    </Pressable>
                    <Modal
                        visible={isModalVisible}
                        animationType="slide"
                        transparent={true}
                    >
                        <View style={styles.modalContainer}>
                            <Image
                                style={styles.modalImage}
                                source={{ uri: `data:image/jpeg;base64,${frameImage}` }}
                            />
                            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View >
            </ScrollView >
            {isMenuVisible && (
                <View style={styles.menuContainer}>
                    <TouchableOpacity onPressIn={() => { props.navigation.navigate('CurrentVisitors') }} style={styles.menuItem}>
                        <Text style={styles.menuItemText}>Current Visitors</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('Alerts')}>
                        <Text style={styles.menuItemText}>Alerts</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    pathContainer: {
        backgroundColor: '#fff',
        padding: 7,
        borderRadius: 8,
        marginBottom: 12,
        elevation: 3,
    },
    pathTitle: {
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 16,
        marginBottom: 5,
    },
    path: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 5
    },
    step: {
        backgroundColor: '#8CD6FA',
        color: '#fff',
        padding: 14,
        borderRadius: 5,
        marginVertical: 4,
        marginRight: 17,
        fontFamily: FontFamily.poppinsSemibold,
        alignItems: 'center',
        textAlign: 'center'
    },
    stephighlight: {
        backgroundColor: '#6AB7E2',
        color: '#fff',
        padding: 14,
        borderRadius: 5,
        marginVertical: 4,
        marginRight: 17,
        fontFamily: FontFamily.poppinsSemibold,
        alignItems: 'center',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#F35469',
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
    formContainer: {
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
        borderColor: '#e1e1e1',
        borderBottomWidth: 1,
        fontFamily: FontFamily.poppinsRegular,
        padding: 0,
        fontSize: 13,
        alignItems: 'center',
        textAlignVertical: "center",
    },
    videoFile: {
        backgroundColor: '#C6EAFC',
        justifyContent: 'center',
        padding: 8,
        paddingLeft: 20,
        maxWidth: '70%',
        width: '60%',
        borderRadius: 12,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalImage: {
        width: '90%',
        height: '80%',
        borderRadius: 10,
        resizeMode: 'contain',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#F35469',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 15,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        position: 'absolute',
        top: 31,
        right: 22,
    },
    dropdownselector: {
        width: '100%',
        borderBottomWidth: 1,
        borderColor: '#e1e1e1',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 10,
    },
    selectedValues: {
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 12.5,
    },
    icon: {
        width: 12.5,
        height: 12.5,
    },
    menuContainer: {
        position: 'absolute',
        top: 66,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 3,
        padding: 20,
    },
    menuItem: {
        paddingVertical: 8,
    },
    menuItemText: {
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 15,
        color: Color.lightsteelblue,
    },

});

export default PathScreen;



