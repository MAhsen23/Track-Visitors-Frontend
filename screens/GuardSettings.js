import React, { useState, useRef, useEffect } from "react";
import { Text, StatusBar, StyleSheet, View, Image, Pressable, ScrollView, Alert } from "react-native";
import { FontFamily, Color } from "../GlobalStyles";
import { Dropdown } from 'react-native-element-dropdown';

const App = (props) => {

    const { id } = props.route.params;

    const [error, setError] = useState('');
    const [locations, setLocations] = useState([])
    const [editMode, setEditMode] = React.useState('')
    const [guard, setGuard] = useState('');

    const [location, setLocation] = useState(null)


    useEffect(() => {
        fetchLocations();
        fetchGuardsData();
    }, [])

    const showError = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 5000);
    };

    const fetchGuardsData = async () => {
        try {
            const response = await fetch(`${global.url}GetUser/${id}`);
            if (response.ok) {
                const data = await response.json();
                setGuard(data[0]);
                setError('');
            } else {
                throw new Error('Failed to fetch guard details.');
            }
        } catch (error) {
            showError('An error occurred while fetching the guard details.');
        }
    }


    const updateDutyLocation = async () => {
        try {
            const response = await fetch(`${global.url}AllocateDutyLocation/${guard.id}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    location_id: location,
                }),
            });
            if (response.ok) {
                setLocation(null);
                setEditMode(false);
                Alert.alert('Success', 'Duty location updated successfully.');
                fetchGuardsData();
            } else {
                throw new Error('Failed to update duty location.');
            }
        } catch (error) {
            showError('An error occurred while updating guard duty location.');
            console.error('Error occurred during API request:', error);
        }
    }


    const fetchLocations = async () => {
        try {
            const response = await fetch(`${global.url}GetAllLocations`);
            if (response.ok) {
                const data = await response.json();
                const newdata = data.filter((item) => item.type === "Gate")
                setLocations(newdata);
                setError('');
            } else {
                throw new Error('Failed to fetch locations.');
            }
        } catch (error) {
            showError('An error occurred while fetching locations.');
            console.error('Error occurred during API request:', error);
        }
    };


    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ alignItems: 'center', backgroundColor: Color.white, elevation: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, height: 65, marginBottom: 5, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: "space-between" }}>
                <Pressable onPress={() => { props.navigation.goBack() }}>
                    <Image style={{ tintColor: Color.lightsteelblue, width: 32, height: 32, }} source={require('../assets/back.png')} />
                </Pressable>
                <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 19.5, letterSpacing: .4, color: Color.lightsteelblue }}>SETTINGS</Text>
                <Image style={{ tintColor: Color.white, width: 30, height: 30, }} source={require('../assets/menu.png')} />
            </View >
            <View style={styles.container}>
                {error !== '' && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}
                <View style={styles.settingItemsContainer}>
                    <View style={[styles.allocatedLocationSetting,]}>
                        <Text style={[styles.settingItemText, { fontFamily: FontFamily.poppinsMedium }]}>Allocated Location</Text>
                        <Pressable onPress={() => {
                            if (editMode === false) {
                                setEditMode(!editMode)
                            } else {
                                setLocation(null);
                                setEditMode(!editMode)
                            }
                        }} style={{ flexDirection: 'row', justifyContent: "space-between", }}>
                            <Text style={styles.settingItemText}>
                                {locations.find(location => location.id === guard.duty_location)?.name || 'Not Assigned'}
                            </Text>
                            <Image style={{ tintColor: 'grey', width: 22, height: 22, }} source={require("../assets/downArrow.png")} />
                        </Pressable>
                    </View>
                    {editMode &&
                        <View style={[styles.dropdownContainer, { marginBottom: (editMode) ? 150 : 10 }]}>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                itemTextStyle={styles.textItem}
                                iconStyle={styles.iconStyle}
                                data={locations}
                                maxHeight={300}
                                labelField="name"
                                valueField="id"
                                placeholder="Select location"
                                value={locations}
                                onChange={item => {
                                    setLocation(item.id);
                                }}
                            />
                        </View>
                    }
                    {editMode && location !== guard.duty_location && location &&
                        <Pressable style={[styles.button, { marginTop: -135, marginBottom: 150, }]} onPress={updateDutyLocation}>
                            <Text style={styles.buttonText}>{guard.duty_location ? 'Update' : 'Save'}</Text>
                        </Pressable>
                    }
                    <Pressable onPress={() => { props.navigation.navigate('Login') }} style={{
                        backgroundColor: '#fff',
                        marginBottom: 10,
                        elevation: 2,
                        padding: 15,
                        borderRadius: 5,
                    }}>
                        <Text style={[styles.settingItemText, { fontFamily: FontFamily.poppinsMedium }]}>Logout</Text>
                    </Pressable>
                </View>
            </View >
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
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
    settingItemsContainer: {
        marginTop: 30,
    },
    allocatedLocationSetting: {
        backgroundColor: '#fff',
        marginBottom: 10,
        elevation: 2,
        padding: 15,
        flexDirection: 'row',
        justifyContent: "space-between",
        borderRadius: 5,
    },
    settingItemText: {
        fontFamily: FontFamily.poppinsRegular,
    },




    dropdown: {
        height: 50,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    icon: {
        marginRight: 5,
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
    button: {
        backgroundColor: Color.deepskyblue,
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
export default App;