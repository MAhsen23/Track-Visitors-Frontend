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
} from "react-native";
import { Color, FontFamily, FontSize } from "../GlobalStyles";
import url from '../ApiUrl';

import { Dropdown } from 'react-native-element-dropdown';

const App = (props) => {

    const [error, setError] = useState('');
    const [guards, setGuards] = useState([]);
    const [searchGuards, setSearchGuards] = useState([]);
    const mainSearchRef = useRef();

    const [locations, setLocations] = useState([]);
    const [location, setLocation] = useState(null);

    const [assignMode, setAssignMode] = useState(false);
    const [selectedGuard, setSelectedGuard] = useState('');

    useEffect(() => {
        fetchGuards();
        fetchLocations();
    }, []);

    const showError = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 5000);
    };



    const fetchGuards = async () => {
        try {
            const response = await fetch(`${url}GetAllGuardsLocation`);
            if (response.ok) {
                const data = await response.json();
                setGuards(data);
                setSearchGuards(data);
                setError('');
            } else {
                throw new Error('Failed to fetch guards.');
            }

        } catch (error) {
            showError('An error occurred while fetching guards.');
            console.error('Error occurred during API request:', error);
        }
    };



    const updateDutyLocation = async () => {

        if (!location || !selectedGuard) {
            Alert.alert('Error', 'Please select duty location first!');
            return;
        }
        try {
            const response = await fetch(`${url}AllocateDutyLocation/${selectedGuard.id}`, {
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
                setSelectedGuard('');
                setLocation(null);
                setAssignMode(false);
                Alert.alert('Success', 'Duty location updated successfully.');
                fetchGuards();
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
            const response = await fetch(`${url}GetAllLocations`);
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


    const onMainSearch = (txt) => {
        if (txt !== '') {
            let tempData = guards.filter((item) => {
                for (let key in item) {
                    if (key !== 'id' && typeof item[key] === 'string') {
                        if (item[key].toLowerCase().includes(txt.toLowerCase())) {
                            return true;
                        }
                    }
                }
                return false;
            });
            setSearchGuards(tempData);
        } else {
            setSearchGuards(guards);
        }
    }

    const renderItem = ({ item }) => (

        <View style={styles.row}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemText}>{item.username}</Text>
            {item.duty_location ?
                (
                    < View style={{ flexDirection: 'row', flex: 1, justifyContent: "space-between" }}>
                        <Text style={styles.itemText}>{item.location_name}</Text>
                        <Pressable onPress={() => {

                            setSelectedGuard(item)
                            setLocation(item.location_id);
                            setAssignMode(true);

                        }} style={{ elevation: 2, backgroundColor: Color.redishLook, borderRadius: 5, alignItems: "center", marginRight: 3, marginLeft: 5, justifyContent: "center", width: 55, height: 40, }}>
                            <Text style={{
                                fontFamily: FontFamily.poppinsSemibold,
                                fontSize: 14,
                                color: "#fff",
                            }}>EDIT</Text>
                        </Pressable>
                    </View>
                ) : (
                    < View style={{ flexDirection: 'row', flex: 1, justifyContent: "space-between" }}>
                        <Text style={styles.itemText}>----</Text>
                        <Pressable onPress={() => {
                            setSelectedGuard(item);
                            setLocation(null);
                            setAssignMode(true)
                        }} style={{ elevation: 2, backgroundColor: 'skyblue', borderRadius: 5, alignItems: "center", marginRight: 3, marginLeft: 5, justifyContent: "center", width: 55, height: 40, }}>
                            <Text style={{
                                fontFamily: FontFamily.poppinsSemibold,
                                fontSize: 14,
                                color: "#fff",
                            }}>ALLOT</Text>
                        </Pressable>
                    </View>
                )
            }
        </View >
    );


    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ alignItems: 'center', backgroundColor: Color.white, elevation: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, height: 65, marginBottom: 5, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: "space-between" }}>
                <Pressable onPress={() => { props.navigation.goBack() }}>
                    <Image style={{ tintColor: Color.lightsteelblue, width: 32, height: 32, }} source={require('../assets/back.png')} />
                </Pressable>
                <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 19.5, letterSpacing: .4, color: Color.lightsteelblue }}>GUARDS LOCATION</Text>
                <Image style={{ tintColor: Color.white, width: 30, height: 30, }} source={require('../assets/menu.png')} />
            </View >

            <View style={styles.constainer}>
                {error !== '' && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}
                <View style={{ flex: 2, borderBottomColor: 'lightgrey', borderBottomWidth: 1 }}>

                    <View style={styles.searchBar}>
                        <TextInput
                            ref={mainSearchRef}
                            style={styles.searchInput}
                            placeholder="Search"
                            onChangeText={txt => onMainSearch(txt)}
                        />
                    </View>

                    <View style={styles.listContainer}>
                        <View style={styles.header}>
                            <Text style={styles.headerText}>Name</Text>
                            <Text style={styles.headerText}>Username</Text>
                            <Text style={styles.headerText}>Duty Location</Text>
                        </View>

                        <FlatList showsVerticalScrollIndicator={false} style={styles.flatList} data={searchGuards} keyExtractor={(item, index) => index.toString()} renderItem={renderItem} />
                    </View>

                </View>
                <View style={{ flex: assignMode ? 2 : 1, paddingTop: 20, }}>
                    {assignMode &&
                        <View>
                            <View style={{ marginBottom: 20, backgroundColor: '#FCFCFC', paddingHorizontal: 12, paddingTop: 15, paddingBottom: 30, borderRadius: 8, elevation: 1, }}>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                    <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 16 }}>{selectedGuard.name}</Text>
                                    <Pressable onPress={() => {
                                        setLocation(null);
                                        setAssignMode(false);
                                        setSelectedGuard('');
                                    }}>
                                        <Image source={require('../assets/multiply1.png')} style={{ width: 23, height: 23, tintColor: 'grey' }} />
                                    </Pressable>
                                </View>
                                <Text style={{ fontFamily: FontFamily.poppinsRegular, fontSize: 14 }}>{selectedGuard.username}</Text>
                                <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 16, marginTop: 15 }}>
                                    Duty Location  <Text style={{ fontFamily: FontFamily.poppinsRegular }}>
                                        {selectedGuard.duty_location ? selectedGuard.location_name : 'Not Assigned'}
                                    </Text>
                                </Text>
                            </View>
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
                                searchPlaceholder="Search..."
                                value={location}
                                onChange={item => {
                                    setLocation(item.id);
                                }}
                            />
                            <Pressable style={styles.button} onPress={updateDutyLocation}>
                                <Text style={styles.buttonText}>{selectedGuard.duty_location ? 'Update' : 'Save'}</Text>
                            </Pressable>
                        </View>
                    }
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    constainer: {
        flex: 1,
        backgroundColor: "#fff",
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    searchBar: {
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
    },
    header: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 6,
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


    errorContainer: {
        backgroundColor: '#fff',
    },
    errorText: {
        color: 'red',
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 13,
        textAlign: 'center',
    },
})

export default App;