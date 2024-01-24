import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    StyleSheet,
    Pressable,
    Image,
    TouchableOpacity,
} from 'react-native';
import CustomPicker from '../Custom_Hayo/custom_picker_without_search';
import { FontFamily, Color } from '../GlobalStyles';
import url from '../ApiUrl';
import CheckBox from '@react-native-community/checkbox';
import { Dropdown } from 'react-native-element-dropdown';

const types = ['Office', 'Lab', 'LT', 'Gate', 'Stairs', 'Other', 'Faculty']

const MyScreen = (props) => {

    const { id, floor_id, location_name, type_value, isDestination_value, state } = props.route?.params || {}

    const [floors, setFloors] = useState([]);
    const [floor, setFloor] = useState(null);

    const [locationName, setLocationName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [type, setType] = useState('');
    const [error, setError] = useState('');

    const [editLocationId, setEditLocationId] = useState('');
    const [buttonState, setButtonState] = useState('Add');

    const [isDestination, setIsDestination] = useState(false)

    useEffect(() => {
        fetchFloors();
    }, [])

    useEffect(() => {
        if (state === "Edit") {

            setLocationName(location_name);
            setFloor(floor_id);
            setType(type_value);
            setIsDestination(isDestination_value);
            setButtonState('Edit')
            setEditLocationId(id);

        }
    }, [state, id]);

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
                setError('');
            } else {
                throw new Error('Failed to fetch floors.');
            }
        } catch (error) {
            showError('An error occurred while fetching floors.');
            console.error('Error occurred during API request:', error);
        }
    };

    const insertLocation = async () => {
        if (!locationName || !floor || !type) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        try {
            const response = await fetch(`${url}AddLocation`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: locationName,
                    floor_id: floor,
                    type: type,
                    isDestination: isDestination,
                }),
            });
            if (response.ok) {
                setError('');
                setLocationName('');
                setFloor(null);
                setType('');
                setIsDestination(false);
                props.navigation.navigate('SavedLocations');
                Alert.alert('Success', 'Location inserted successfully.');
            } else {
                throw new Error('Failed to insert location.');
            }
        } catch (error) {
            showError('An error occurred while inserting location.');
            console.error(error);
        }
    };


    const updateLocation = async () => {
        if (!locationName || !floor || !type || !editLocationId) {
            Alert.alert('Error', 'Please enter data first!');
            return;
        }
        try {

            const response = await fetch(`${url}/UpdateLocation/${editLocationId}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: locationName,
                    floor_id: floor,
                    type: type,
                    isDestination: isDestination,
                }),
            });
            if (response.ok) {
                setError('');
                setEditLocationId('');
                setButtonState('Add')
                setLocationName('');
                setType('');
                setIsDestination(false);
                setFloor(null);
                props.navigation.navigate('SavedLocations');
                Alert.alert('Success', 'Location updated successfully.');
            } else {
                throw new Error('Failed to update location.');
            }
        } catch (error) {
            showError('An error occurred while updating the location.');
        }
    }


    const handleSelection = (item) => {
        setType(item);
    };


    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ alignItems: 'center', backgroundColor: Color.white, elevation: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, height: 65, marginBottom: 5, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: "space-between" }}>
                <Pressable onPress={() => { props.navigation.goBack() }}>
                    <Image style={{ tintColor: Color.lightsteelblue, width: 32, height: 32, }} source={require('../assets/back.png')} />
                </Pressable>
                <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 19.5, letterSpacing: .4, color: Color.lightsteelblue }}>LOCATIONS</Text>
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
                            setLocationName("");
                            setFloor(null);
                            setType("");
                            setIsDestination(false);
                            setEditLocationId("");

                        }}>
                            <Image source={require('../assets/multiply.png')} style={styles.editModeIcon} />
                        </TouchableOpacity>
                    </View>
                )}
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Location Name</Text>
                        <TextInput style={styles.input} value={locationName} onChangeText={(name) => setLocationName(name)} />
                    </View>
                    <Text style={styles.label}>Location Floor</Text>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        itemTextStyle={styles.textItem}
                        data={floors}
                        maxHeight={300}
                        labelField="name"
                        valueField="id"
                        placeholder="Select Floor"
                        value={floor}
                        onChange={item => {
                            setFloor(item.id);
                        }}
                    />
                    <View style={styles.inlineInputContainer}>
                        <View style={styles.inlineInputLeft}>
                            <Text style={styles.label}>Location Type</Text>
                            <Pressable style={styles.dropdownselector} onPress={() => setModalVisible(true)}>
                                <Text style={styles.selectedValue}>{type !== '' ? type : 'Select Type'}</Text>
                                <Image source={require('../assets/expand.png')} style={styles.icon} />
                            </Pressable>
                            <CustomPicker
                                visible={modalVisible}
                                setVisible={setModalVisible}
                                selectedValue={type}
                                onValueChange={handleSelection}
                                data={types}
                            />
                        </View>
                        <View style={styles.inlineInputRight}>
                            <Text style={styles.label}>Is Destination</Text>
                            <CheckBox
                                value={isDestination}
                                onValueChange={(newValue) => {
                                    setIsDestination(newValue)
                                }}
                            />
                        </View>
                    </View>
                    <Button title={buttonState === 'Edit' ? 'Update' : 'Insert'} onPress={() => {
                        if (buttonState == 'Add') {
                            insertLocation();
                        }
                        else {
                            updateLocation();
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
                        onPress={() => { props.navigation.navigate('SavedLocations') }}
                    >
                        <Text style={styles.showButtonText}>
                            Show Saved Locations
                        </Text>
                    </Pressable>
                }
            </View>
        </View>
    );
}
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
    cell: {
        fontSize: 15,
        fontFamily: FontFamily.poppinsRegular,
        textAlign: 'left',
        flex: 1,
        color: '#000'
    },
    dropdownselector: {
        height: 47,
        width: '100%',
        borderWidth: 1,
        borderColor: '#e1e1e1',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    selectedValue: {
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 12.5,
    },
    icon: {
        width: 12.5,
        height: 12.5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dropdownarea: {
        width: '85%',
        maxHeight: 200,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 15,
    },
    dropdownitem: {
        paddingVertical: 10,
        paddingHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdownText: {
        flex: 1,
        color: 'grey',
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 14,
    },
    selectedItem: {
        backgroundColor: '#fff',
    },
    selectedItemText: {
        color: 'black',
    },
    tickIcon: {
        width: 16,
        height: 16,
        marginLeft: 10,
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
        fontSize: 14,
        flex: 1,
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




    dropdown: {
        height: 47,
        backgroundColor: 'white',
        paddingHorizontal: 12,
        marginBottom: 10,
        borderColor: '#e1e1e1',
        borderWidth: 1,
        borderRadius: 5,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 14,
        fontFamily: FontFamily.poppinsRegular,
    },
    placeholderStyle: {
        fontSize: 14,
        fontFamily: FontFamily.poppinsRegular,
    },
    selectedTextStyle: {
        fontSize: 14,
        fontFamily: FontFamily.poppinsMedium,
    },
    inputSearchStyle: {
        fontSize: 13,
        fontFamily: FontFamily.poppinsRegular,
        textAlignVertical: "center"
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