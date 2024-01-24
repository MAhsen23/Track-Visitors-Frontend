import React, { useState, useRef, useEffect } from 'react';
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
    TouchableOpacity,
    Animated,
} from 'react-native';
import { Color, FontFamily } from '../GlobalStyles';
import url from '../ApiUrl';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

const MyScreen = (props) => {
    const [floors, setFloors] = useState([]);
    const [searchFloors, setSearchFloors] = useState([]);
    const [floorName, setFloorName] = useState('');
    const [error, setError] = useState('');
    const [buttonState, setButtonState] = useState('Add');
    const [searchMode, setSearchMode] = useState(false);

    const mainSearchRef = useRef();

    const [editFloorId, setEditFloorId] = useState('');

    useEffect(() => {
        fetchFloors();
    }, []);

    const showError = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 5000);
    };

    const fetchFloors = async () => {
        try {
            const response = await fetch(`${url}GetAllFloors`);
            if (response.ok) {
                const data = await response.json();
                setFloors(data);
                setSearchFloors(data);
                setError('');
            } else {
                throw new Error('Failed to fetch floors.');
            }
        } catch (error) {
            showError('An error occurred while fetching floors.');
            console.error('Error occurred during API request:', error);
        }
    };

    const onMainSearch = (txt) => {
        if (txt !== '') {
            let tempData = floors.filter((item) => {
                return item.name.toLowerCase().indexOf(txt.toLowerCase()) > -1;
            });
            setSearchFloors(tempData);
        } else {
            setSearchFloors(floors);
        }
    };

    const insertFloor = async () => {
        if (!floorName) {
            Alert.alert('Error', 'Please enter a floor name.');
            return;
        }

        try {
            const response = await fetch(`${url}/AddFloor`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: floorName,
                }),
            });
            if (response.ok) {
                setError('');
                setFloorName('');
                Alert.alert('Success', 'Floor inserted successfully.');
                fetchFloors();
            } else {
                throw new Error('Failed to insert floor.');
            }
        } catch (error) {
            showError('An error occurred while inserting floor.');
            console.error(error);
        }
    };

    const updateFloor = async () => {
        if (!floorName || !editFloorId) {
            Alert.alert('Error', 'Please enter data first!');
            return;
        }
        try {
            const response = await fetch(`${url}/UpdateFloor/${editFloorId}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: floorName,
                }),
            });
            if (response.ok) {
                setError('');
                setEditFloorId('');
                setButtonState('Add')
                setFloorName('')
                Alert.alert('Success', 'Floor updated successfully.');
                fetchFloors();
            } else {
                throw new Error('Failed to update floor.');
            }
        } catch (error) {
            showError('An error occurred while updating the floor.');
        }
    };

    const deleteFloor = async (id) => {
        try {
            const response = await fetch(`${url}DeleteFloor/${id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                setError('');
                if (buttonState === 'Edit') {
                    setEditFloorId('');
                    setFloorName('');
                    setButtonState('Add');
                }
                Alert.alert('Success', 'Floor deleted successfully.');
                fetchFloors();
            } else {
                throw new Error('Failed to delete floor.');
            }
        } catch (error) {
            showError('An error occurred while deleting the floor.');
        }
    };

    let rowRefs = new Map();

    const rightActions = (progress, dragX, id) => {
        const rowScale = dragX.interpolate({
            inputRange: [0, 100],
            outputRange: [1, 0.7],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View style={{ flexDirection: 'row', transform: [{ scale: rowScale }] }}>
                <TouchableOpacity onPress={() => {
                    setEditFloorId(id);
                    const foundFloor = floors.find(obj => obj.id === id);
                    setFloorName(foundFloor.name);
                    setButtonState('Edit');
                }} style={{ backgroundColor: 'white', height: '100%', padding: 11, marginLeft: 5, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/editing2.png')} style={{ width: 20, height: 20, tintColor: '#33B5E6' }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    Alert.alert(
                        'Confirmation',
                        'Are you sure you want to delete this floor?',
                        [
                            {
                                text: 'Cancel',
                                style: 'cancel',
                            },
                            {
                                text: 'Delete',
                                style: 'destructive',
                                onPress: () => deleteFloor(id),
                            },
                        ]
                    );
                }} style={{ backgroundColor: 'white', height: '100%', padding: 11, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/delete7.png')} style={{ width: 20, height: 20, tintColor: 'red' }} />
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const renderItem = ({ item }) => (
        <GestureHandlerRootView>
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
                <View style={styles.row}>
                    <Text style={styles.itemText}>{item.name}</Text>
                </View>
            </Swipeable>
        </GestureHandlerRootView>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ alignItems: 'center', backgroundColor: Color.white, elevation: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, height: 65, marginBottom: 5, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: "space-between" }}>
                <Pressable onPress={() => { props.navigation.goBack() }}>
                    <Image style={{ tintColor: Color.lightsteelblue, width: 32, height: 32, }} source={require('../assets/back.png')} />
                </Pressable>
                <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 19.5, letterSpacing: .4, color: Color.lightsteelblue }}>FLOORS</Text>
                <Image style={{ tintColor: Color.white, width: 30, height: 30, }} source={require('../assets/menu.png')} />
            </View >
            <View style={styles.container}>
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
                            setFloorName("");
                            setEditFloorId("");
                        }}>
                            <Image source={require('../assets/multiply.png')} style={styles.editModeIcon} />
                        </TouchableOpacity>
                    </View>
                )}
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Floor Name</Text>
                        <TextInput
                            style={styles.input}
                            value={floorName}
                            onChangeText={setFloorName}
                        />
                    </View>
                    <Button title={buttonState === 'Edit' ? 'Update' : 'Insert'} onPress={() => {
                        if (buttonState == 'Add') {
                            insertFloor();
                        } else {
                            updateFloor();
                        }
                    }} />
                </View>

                <View style={styles.headerTopBar}>
                    <Text style={styles.headerTopBarText}>Saved Floors</Text>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={() => {
                            setSearchMode(!searchMode);
                        }}>
                            <Image style={styles.icon} source={require('../assets/search2.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                {searchMode &&
                    <View style={styles.searchBar}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search"
                            ref={mainSearchRef}
                            onChangeText={txt => onMainSearch(txt)}
                        />
                    </View>
                }
                <View style={styles.listContainer}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Floor Name</Text>
                    </View>
                    <FlatList
                        style={styles.flatList}
                        data={searchFloors}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={renderItem}
                    />
                </View>
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
        marginBottom: 10,
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
        borderColor: '#e1e1e1',
        borderRadius: 15,
        borderWidth: 1,
        paddingHorizontal: 12,
        fontFamily: FontFamily.poppinsMedium,
        paddingVertical: 7,
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
        backgroundColor: '#fff',
    },
    selectedItem: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e1e1',
        alignItems: 'center'
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
    tickIcon: {
        marginLeft: 10,
        width: 15,
        height: 15,
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
    cell: {
        fontSize: 15,
        fontFamily: FontFamily.poppinsRegular,
        textAlign: 'left',
        flex: 1,
        color: '#000'
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
});

export default MyScreen;
