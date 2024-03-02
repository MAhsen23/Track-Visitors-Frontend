import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    StyleSheet,
    Image,
    ScrollView,
    Pressable,
    TouchableOpacity,
    Animated,
    VirtualizedList,
} from 'react-native';
import { FontFamily, Color } from '../GlobalStyles';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

const App = (props) => {

    const [camerasDetails, setCamerasDetails] = useState([]);
    const [searchCamerasDetails, setSearchCamerasDetails] = useState([]);
    const [error, setError] = useState('');
    const mainSearchRef = useRef();

    useEffect(() => {
        fetchCamerasLocationsConnections();
    }, []);

    const showError = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 5000);
    };

    const onMainSearch = (txt) => {
        if (txt !== '') {
            let tempData = camerasDetails.filter((item) => {
                for (let key in item) {
                    if (key !== 'id')
                        if (item[key].toLowerCase().includes(txt.toLowerCase())) {
                            return true;
                        }
                }
                return false;
            });
            setSearchCamerasDetails(tempData);
        } else {
            setSearchCamerasDetails(camerasDetails);
        }
    }


    const fetchCamerasLocationsConnections = async () => {
        try {
            const response = await fetch(`${global.url}GetAllCamerasLocationsConnections`);
            if (response.ok) {
                const data = await response.json();
                setCamerasDetails(data);
                setSearchCamerasDetails(data);
                setError('')
            } else {
                throw new Error('Failed to fetch cameras details.');
            }
        } catch (error) {
            showError('An error occurred while fetching cameras details.');
            console.error('Error occurred during API request:', error);
        }
    };


    const deleteCamera = async (id) => {
        try {
            const response = await fetch(`${global.url}DeleteCamera/${id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                setError('');
                Alert.alert('Success', 'Camera deleted successfully.');
                fetchCamerasLocationsConnections();
            } else {
                throw new Error('Failed to delete camera.');
            }
        } catch (error) {
            showError('An error occurred while deleting the camera.');
        }
    }



    let rowRefs = new Map();

    const renderItem = ({ item }) => {

        let modifiedLocationNames = item.LocationNames
        if (item.LocationNames && item.LocationNames.includes(',')) {
            modifiedLocationNames = item.LocationNames.split(',').map(item => item.trim()).join(', ');
        }

        let lineByLineLocNames = item.LocationNames
        if (item.LocationNames && item.LocationNames.includes(',')) {
            lineByLineLocNames = item.LocationNames.split(',');
        }


        let modifiedConnectedCameraNames = item.ConnectedCameraNames
        if (item.ConnectedCameraNames && item.ConnectedCameraNames.includes(',')) {
            modifiedConnectedCameraNames = item.ConnectedCameraNames.split(',').map(item => item.trim()).join(', ');
        }

        let lineByLineCamNames = item.ConnectedCameraNames
        if (item.ConnectedCameraNames && item.ConnectedCameraNames.includes(',')) {
            lineByLineCamNames = item.ConnectedCameraNames.split(',');
        }

        return (
            <GestureHandlerRootView >
                <Swipeable renderRightActions={(progress, dragX) => rightActions(progress, dragX, item.id)}
                    key={item.id}
                    ref={ref => {
                        if (ref && !rowRefs.get(item.id)) {
                            rowRefs.set(item.id, ref);
                        }
                    }}
                    onSwipeableWillOpen={() => {
                        [...rowRefs.entries()].forEach(([key, ref]) => {
                            if (key !== item.id && ref) ref.close();
                        });
                    }}
                >
                    <View>
                        <View style={styles.row}>
                            <Text style={{ paddingBottom: 10, paddingLeft: 1, fontSize: 15, color: '#000', fontFamily: FontFamily.poppinsMedium }}>{item.CameraName}</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, backgroundColor: '#0CBFA7', width: '100%', height: 45, borderRadius: 5, paddingHorizontal: 12, alignItems: 'center' }}>
                                <Text style={{ flex: 1, fontSize: 15, color: "#fff", fontFamily: FontFamily.poppinsSemibold, opacity: 1, }}>Locations</Text>
                                <Text style={{ flex: 1, fontSize: 15, color: "#fff", fontFamily: FontFamily.poppinsSemibold, opacity: 1, }}>Connected with</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 18, }}>
                                <View style={{ flex: 1, paddingRight: 8 }}>
                                    {item.LocationNames.includes(',') ?
                                        (
                                            lineByLineLocNames.map((loc, loc_index) => (

                                                <Text key={loc_index} style={{
                                                    fontFamily: FontFamily.poppinsRegular,
                                                    fontSize: 14.5,
                                                    paddingVertical: 1,
                                                    color: '#000',
                                                    opacity: 0.7,
                                                    marginBottom: 6,
                                                }}>•  {loc}</Text>
                                                //○

                                            ))

                                        ) :
                                        (
                                            <Text style={{
                                                fontFamily: FontFamily.poppinsRegular,
                                                fontSize: 14,
                                                paddingRight: 5,
                                                color: '#000',
                                                opacity: 0.7,
                                            }}>•  {modifiedLocationNames}</Text>
                                        )
                                    }
                                </View>
                                <View style={{ flex: 1, paddingRight: 8 }}>
                                    {item.ConnectedCameraNames.includes(',') ?
                                        (
                                            lineByLineCamNames.map((cam, cam_index) => (

                                                <Text key={cam_index} style={{
                                                    fontFamily: FontFamily.poppinsRegular,
                                                    fontSize: 14,
                                                    paddingVertical: 1,
                                                    color: '#000',
                                                    opacity: 0.7,
                                                    marginBottom: 6,
                                                }}>•  {cam}</Text>
                                                //○

                                            ))

                                        ) :
                                        (
                                            <Text style={{
                                                fontFamily: FontFamily.poppinsRegular,
                                                fontSize: 14,
                                                paddingRight: 5,
                                                color: '#000',
                                                opacity: 0.7,
                                            }}>•  {modifiedConnectedCameraNames}</Text>
                                        )
                                    }
                                </View>
                            </View>
                        </View>
                    </View >
                </Swipeable>
            </GestureHandlerRootView >
        )
    };


    const rightActions = (progress, dragX, id) => {

        const rowScale = dragX.interpolate({
            inputRange: [0, 100],
            outputRange: [1, 0.7],
            extrapolate: 'clamp'
        });

        return (
            <Animated.View style={{
                flexDirection: 'row', transform: [{ scale: rowScale }],
            }} >
                <TouchableOpacity onPress={() => {

                    const foundCamera = camerasDetails.find(obj => obj.id === id);
                    const camera_name_value = foundCamera.CameraName;

                    let location_ids_value = foundCamera.LocationIDs
                        .split(',')
                        .map(item => parseInt(item.trim(), 10));

                    let connectedCameras_value = foundCamera.ConnectedCameraNames
                        .split(',')
                        .map(item => item.trim());


                    let cameraTimes = foundCamera.TimeToReach
                        .split(',')
                        .map(item => item.trim());

                    let timeInputs_value = {};
                    connectedCameras_value.forEach((camera, index) => {
                        timeInputs_value[camera] = cameraTimes[index];
                    });

                    const state = "Edit"
                    props.navigation.navigate('Cameras', { id, camera_name_value, location_ids_value, connectedCameras_value, timeInputs_value, state })

                }} style={{ backgroundColor: 'white', height: '100%', padding: 11, marginLeft: 5, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/editing2.png')} style={{ width: 25, height: 25, tintColor: '#33B5E6' }} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    Alert.alert(
                        'Confirmation',
                        'Are you sure you want to delete this camera?',
                        [
                            {
                                text: 'Cancel',
                                style: 'cancel',
                            },
                            {
                                text: 'Delete',
                                style: 'destructive',
                                onPress: () => deleteCamera(id),
                            },
                        ]
                    );
                }}
                    style={{ backgroundColor: 'white', height: '100%', padding: 11, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/delete7.png')} style={{ width: 25, height: 25, tintColor: 'red' }} />
                </TouchableOpacity>
            </Animated.View >
        );
    };



    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ alignItems: 'center', backgroundColor: Color.white, elevation: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, height: 65, marginBottom: 5, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: "space-between" }}>
                <Pressable onPress={() => { props.navigation.goBack() }}>
                    <Image style={{ tintColor: Color.lightsteelblue, width: 32, height: 32, }} source={require('../assets/back.png')} />
                </Pressable>
                <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 19.5, letterSpacing: .4, color: Color.lightsteelblue }}>SAVED CAMERAS</Text>
                <Image style={{ tintColor: Color.white, width: 30, height: 30, }} source={require('../assets/menu.png')} />
            </View >

            <View style={styles.container} >
                {error !== '' && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}
                <View style={styles.searchBar}>
                    <TextInput
                        ref={mainSearchRef}
                        style={styles.searchInput}
                        placeholder="Search"
                        onChangeText={txt => onMainSearch(txt)}
                    />
                </View>
                <View style={[styles.listContainer, { marginHorizontal: 20, paddingBottom: 10, marginBottom: 100, borderBottomColor: 'lightgrey', borderBottomWidth: 1 }]}>
                    <VirtualizedList
                        showsVerticalScrollIndicator={false}
                        data={searchCamerasDetails}
                        initialNumToRender={8}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        getItemCount={() => searchCamerasDetails.length}
                        getItem={(data, index) => data[index]}
                    />
                </View>
                <Pressable
                    style={({ pressed }) => [
                        styles.showButton,
                        {
                            backgroundColor: pressed
                                ? Color.deepskyblue
                                : Color.deepskyblue,
                        },
                    ]}
                    onPress={() => { props.navigation.navigate('Cameras') }}
                >
                    <Text style={styles.showButtonText}>
                        Insert New Camera
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingVertical: 20,
    },
    searchBar: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    searchInput: {
        height: 40,
        borderColor: '#e1e1e1',
        borderRadius: 15,
        borderWidth: 1,
        paddingHorizontal: 12,
        flex: 1,
    },
    listContainer: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e1e1',
        paddingHorizontal: 6,
    },
    headerText: {
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 16,
    },
    row: {
        marginVertical: 15,
        marginHorizontal: 1,
        elevation: 1,
        borderRadius: 5,
        paddingVertical: 15,
        backgroundColor: "#fff",
        paddingHorizontal: 12,
    },
    cell: {
        fontSize: 15,
        fontFamily: FontFamily.poppinsRegular,
        textAlign: 'left',
        flex: 1,
        color: '#000'
    },

    icon: {
        width: 12.5,
        height: 12.5,
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
    icon: {
        marginLeft: 18,
        width: 18,
        height: 18,
        tintColor: 'white',
    },
    itemText: {
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 14.5,
        paddingRight: 5,
        color: '#000',
        opacity: 0.7,
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

})


export default App;