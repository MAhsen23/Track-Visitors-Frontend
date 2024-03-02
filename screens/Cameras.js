import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    FlatList,
    StyleSheet,
    Image,
    Pressable,
    Modal,
    TouchableOpacity,
} from 'react-native';
import { FontFamily, Color } from '../GlobalStyles';
import CustomDropdown from '../components/multi_value_picker';


const MyScreen = (props) => {

    const { id, camera_name_value, location_ids_value, connectedCameras_value, timeInputs_value, state } = props.route?.params || {}

    const [cameras, setCameras] = useState([]);
    const [locations, setLocations] = useState([]);
    const [name, setName] = useState('');
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [connectedCameras, setConnectedCameras] = useState([]);
    const [error, setError] = useState('');
    const [cameraDdModelvisible, setCameraDdModelVisible] = useState(false);
    const [searchCameras, setSearchCameras] = useState(cameras);
    const [timeInputs, setTimeInputs] = useState({});
    const searchCameraRef = useRef();

    const [buttonState, setButtonState] = useState('Add');
    const [editCameraId, setEditCameraId] = useState('');

    useEffect(() => {
        fetchLocations();
        fetchCameras();
        if (state === "Edit") {

            setName(camera_name_value);
            setSelectedLocations(location_ids_value);
            setConnectedCameras(connectedCameras_value)
            setTimeInputs(timeInputs_value);
            setButtonState('Edit')
            setEditCameraId(id);
        }
    }, [state, id]);


    const showError = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 5000);
    };

    const fetchCameras = async () => {
        try {
            const response = await fetch(`${global.url}GetAllCameras`);
            if (response.ok) {
                const data = await response.json();
                setCameras(data);
                setSearchCameras(data);
                setError('');
            } else {
                throw new Error('Failed to fetch cameras.');
            }
        } catch (error) {
            showError('An error occurred while fetching cameras.');
            console.error('Error occurred during API request:', error);
        }
    };

    const updateCamera = async () => {
        if (!name || selectedLocations.length === 0) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }


        let connectedCamerasIds = [];
        let timeToReach = [];
        connectedCameras.map(camera => {
            const foundObject = cameras.find(item => item.name === camera)
            let camera_id = null;
            if (foundObject) {
                camera_id = foundObject.id;
                connectedCamerasIds.push(camera_id);
                if (!(timeInputs[camera])) {
                    Alert.alert('Error', 'Please fill time for connected cameras.');
                    return;
                } else {
                    timeToReach.push(timeInputs[camera])
                }
            }
        })
        try {
            const response = await fetch(`${global.url}UpdateCamera/${editCameraId}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    cameraLocations: selectedLocations,
                    connectedCameras: connectedCamerasIds,
                    time: timeToReach
                }),
            });
            if (response.ok) {
                setError('');
                setEditCameraId('');
                setButtonState('Add')
                setName('');
                setSelectedLocations([]);
                setConnectedCameras([]);
                setTimeInputs({});
                props.navigation.navigate('SavedCameras');
                Alert.alert('Success', 'Camera updated successfully.');
            } else {
                throw new Error('Failed to update Camera.');
            }
        } catch (error) {
            showError('An error occurred while updating camera.');
            console.error(error);
        }
    }


    const onCamSearch = (txt) => {
        if (txt !== '') {
            let tempData = cameras.filter((item) => {
                return item.name.toLowerCase().indexOf(txt.toLowerCase()) > -1;
            });
            setSearchCameras(tempData);
        } else {
            setSearchCameras(cameras);
        }
    };


    const handleCameraSelection = (item) => {
        if (connectedCameras.includes(item)) {
            setConnectedCameras(connectedCameras.filter((value) => value !== item));
        } else {
            setConnectedCameras([...connectedCameras, item]);
        }
    };

    const handleTimeInputChange = (camera, value) => {
        setTimeInputs({ ...timeInputs, [camera]: value });
    };

    const fetchLocations = async () => {
        try {
            const response = await fetch(`${global.url}GetAllLocations`);
            if (response.ok) {
                const data = await response.json();
                setLocations(data);
                setError('');
            } else {
                throw new Error('Failed to fetch locations.');
            }
        } catch (error) {
            showError('An error occurred while fetching locations.');
            console.error('Error occurred during API request:', error);
        }
    };

    const insertCamera = async () => {
        if (!name || selectedLocations.length === 0) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        let connectedCamerasIds = [];
        let timeToReach = [];
        connectedCameras.map(camera => {
            const foundObject = cameras.find(item => item.name === camera)
            let camera_id = null;
            if (foundObject) {
                camera_id = foundObject.id;
                connectedCamerasIds.push(camera_id);
                if (!(timeInputs[camera])) {
                    Alert.alert('Error', 'Please fill time for connected cameras.');
                    return;
                } else {
                    timeToReach.push(timeInputs[camera])
                }
            }
        })
        try {
            const response = await fetch(`${global.url}AddCamera`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    cameraLocations: selectedLocations,
                    connectedCameras: connectedCamerasIds,
                    time: timeToReach
                }),
            });
            if (response.ok) {
                setError('');
                setName('');
                setSelectedLocations([]);
                setConnectedCameras([]);
                setTimeInputs({});
                Alert.alert('Success', 'Camera inserted successfully.');
                fetchCameras();
            } else {
                throw new Error('Failed to insert Camera.');
            }
        } catch (error) {
            showError('An error occurred while inserting camera.');
            console.error(error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ alignItems: 'center', backgroundColor: Color.white, elevation: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, height: 65, marginBottom: 5, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: "space-between" }}>
                <Pressable onPress={() => { props.navigation.goBack() }}>
                    <Image style={{ tintColor: Color.lightsteelblue, width: 32, height: 32, }} source={require('../assets/back.png')} />
                </Pressable>
                <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 19.5, letterSpacing: .4, color: Color.lightsteelblue }}>CAMERAS</Text>
                <Image style={{ tintColor: Color.white, width: 30, height: 30, }} source={require('../assets/menu.png')} />
            </View >

            <View style={styles.container} >
                {error !== '' && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}
                {buttonState === "Edit" && (
                    <View style={styles.editModeBar}>
                        <Text style={styles.editModeText}>Edit Mode Enabled</Text>
                        <TouchableOpacity onPress={() => {

                            setButtonState("Add");
                            setEditCameraId("");
                            setName('');
                            setSelectedLocations([]);
                            setConnectedCameras([]);
                            setTimeInputs({});

                        }}>
                            <Image source={require('../assets/multiply.png')} style={styles.editModeIcon} />
                        </TouchableOpacity>
                    </View>
                )}
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Camera Name</Text>
                        <TextInput style={styles.input} value={name} onChangeText={setName} />
                    </View>
                    <Text style={styles.label}>Camera Locations</Text>
                    <CustomDropdown
                        options={locations}
                        selectedValues={selectedLocations}
                        onValuesSelect={setSelectedLocations}
                        labelKey="name"
                        valueKey="id"
                        placeholder="Select Camera Locations"
                        height={350}
                        width='92%'
                    />
                    <Text style={styles.label}>Connected Cameras</Text>
                    <View style={styles.pickerContainer}>
                        <Pressable
                            style={styles.dropdownselector}
                            onPress={() => setCameraDdModelVisible(!cameraDdModelvisible)}
                        >
                            <Text style={styles.selectedValues}>
                                {connectedCameras.length === 0
                                    ? 'Select Connected Cameras'
                                    : connectedCameras.join(', ')}
                            </Text>
                            <Image
                                source={require('../assets/expand.png')}
                                style={styles.icon}
                            />
                        </Pressable>
                        <Modal visible={cameraDdModelvisible} animationType="fade" transparent={true} onRequestClose={() => setCameraDdModelVisible(false)}>
                            <View style={styles.modalContainer}>
                                <View style={styles.dropdownarea}>
                                    <TextInput
                                        ref={searchCameraRef}
                                        placeholder="Search"
                                        style={styles.searchInputDd}
                                        onChangeText={(txt) => onCamSearch(txt)}
                                    />
                                    <FlatList
                                        data={searchCameras.map(item => item.name)}
                                        renderItem={({ item }) => {
                                            const isSelected = connectedCameras.includes(item);
                                            return (
                                                <Pressable
                                                    style={[
                                                        styles.dropdownitem,
                                                        isSelected && styles.selectedItem,
                                                    ]}
                                                    onPress={() => handleCameraSelection(item)}
                                                >
                                                    <Text style={{ fontFamily: FontFamily.poppinsRegular, fontSize: 13, color: isSelected ? 'black' : 'grey' }}>
                                                        {item}
                                                    </Text>
                                                    {isSelected && (
                                                        <TextInput
                                                            style={{
                                                                width: 100,
                                                                padding: 5,
                                                                marginLeft: 5,
                                                                fontFamily: FontFamily.poppinsRegular, fontSize: 13,
                                                            }}
                                                            onChangeText={(value) =>
                                                                handleTimeInputChange(item, value)
                                                            }
                                                            value={timeInputs[item]}
                                                            placeholder="Enter Time"
                                                        />
                                                    )}
                                                </Pressable>
                                            );
                                        }}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                    <View>
                                        <Pressable onPress={() => {

                                            let check = false;
                                            connectedCameras.map((camera) => {
                                                if (!(timeInputs[camera])) {
                                                    check = true;
                                                }
                                            })
                                            if (check) {
                                                Alert.alert('Error', 'Please fill time for connected cameras.');
                                            }
                                            else {
                                                setCameraDdModelVisible(false)
                                            }
                                        }} >
                                            <Text style={{ fontFamily: FontFamily.poppinsMedium, alignSelf: 'center' }}>Close</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                    {connectedCameras.length > 0 && (
                        <View style={styles.selectedCamerasContainer}>
                            <Text style={styles.selectedCameraItemText}>
                                {connectedCameras.map((camera) => `${camera}:${timeInputs[camera]}`).join(', ')}
                            </Text>
                        </View>
                    )}
                    <Button title={buttonState === 'Edit' ? 'Update' : 'Insert'} onPress={() => {
                        if (buttonState == 'Add') {
                            insertCamera();
                        }
                        else {
                            updateCamera();
                        }
                    }} />
                </View>
                {buttonState !== "Edit" &&
                    <Pressable
                        style={({ pressed }) => [
                            styles.showButton,
                            {
                                backgroundColor: pressed
                                    ? Color.deepskyblue
                                    : Color.deepskyblue,
                            },
                        ]}
                        onPress={() => { props.navigation.navigate('SavedCameras') }}
                    >
                        <Text style={styles.showButtonText}>
                            Show Saved Cameras
                        </Text>
                    </Pressable>
                }
            </View>
        </View>
    );
};

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
        marginBottom: 22,
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
        height: 47,
        borderColor: '#e1e1e1',
        borderWidth: 1,
        paddingHorizontal: 10,
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 13,
        borderRadius: 5,
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
        marginHorizontal: 1,
        elevation: 1,
        borderRadius: 3,
        paddingVertical: 10,
        backgroundColor: "#fff",
        paddingHorizontal: 6,
    },
    itemText: {
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 14,
        flex: 1,
    },
    errorContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    errorText: {
        color: 'red',
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 13,
        textAlign: 'center',
    },
    flatList: {
        marginBottom: 35,
    },
    selectedValues: {
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 14,
    },
    icon: {
        width: 12.5,
        height: 12.5,
    },
    dropdownselector: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 14,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 1,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    dropdownarea: {
        paddingBottom: 12,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        width: '85%',
        height: 300,
        borderRadius: 7,
        marginTop: 10,
        backgroundColor: '#fff',
        elevation: 3,
        alignSelf: 'center',
    },
    dropdownitem: {
        width: '100%',
        alignSelf: 'center',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 0.2,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    searchInputDd: {
        width: '85%',
        height: 50,
        borderBottomColor: '#00bfff',
        borderBottomWidth: 0.6,
        alignSelf: 'center',
        padding: 0,
        marginBottom: 7,
    },
    tickIcon: {
        width: 15,
        height: 15,
        marginRight: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    selectedCamerasContainer: {
        backgroundColor: '#8CD6FA',
        height: 60,
        marginBottom: 20,
        borderRadius: 5,
        padding: 10,
    },
    selectedCameraItemText: {
        color: 'white',
        fontFamily: FontFamily.poppinsSemibold,
        fontSize: 15,
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
    editModeBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F35469',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginVertical: 8,
        marginHorizontal: 5,
        borderRadius: 5,
    },
    editModeText: {
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 15,
        color: 'white',
    },
    editModeIcon: {
        width: 22,
        height: 22,
        tintColor: 'white',
    },

    showButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        marginHorizontal: 15,
        backgroundColor: Color.deepskyblue,
        paddingVertical: 13,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 1,
    },
    showButtonText: {
        color: 'white',
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 13,
    },

});

export default MyScreen;
