import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    VirtualizedList,
    StyleSheet,
    Pressable,
    Image,
} from 'react-native';
import { FontFamily, Color } from '../GlobalStyles';


const App = (props) => {
    const [locations, setLocations] = useState([]);
    const [searchLocations, setSearchLocations] = useState([]);
    const [error, setError] = useState('');
    const mainSearchRef = useRef();

    useEffect(() => {
        fetchLocations();
    }, []);

    const showError = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 5000);
    };

    const fetchLocations = async () => {
        try {
            const response = await fetch(`${global.url}GetAllLocations`);
            if (response.ok) {
                const data = await response.json();
                setLocations(data);
                setSearchLocations(data);
                setError('');
            } else {
                throw new Error('Failed to fetch locations.');
            }
        } catch (error) {
            showError('An error occurred while fetching locations.');
            console.error('Error occurred during API request:', error);
        }
    };

    const deleteLocation = async (id) => {
        try {
            const response = await fetch(`${global.url}/DeleteLocation/${id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                setError('');
                Alert.alert('Success', 'Location deleted successfully.');
                fetchLocations();
            } else {
                throw new Error('Failed to delete location.');
            }
        } catch (error) {
            showError('An error occurred while deleting the location.');
        }
    }

    const [openItem, setOpenItem] = useState('');

    const renderItem = ({ item }) => {
        return (
            <View>
                <Pressable onPress={() => {
                    setOpenItem((prevOpenItem) => (prevOpenItem === item ? '' : item));
                }} style={styles.row}>
                    <Text style={styles.itemText}>{item.name}</Text>
                    <Text style={styles.itemText}>{item.floor_name}</Text>
                    <Text style={styles.itemText}>{item.type}</Text>
                </Pressable>
                {openItem === item ?
                    <View style={{ height: 50, borderRadius: 5, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fcfcfc', elevation: 1, marginBottom: 22, marginHorizontal: 1, marginTop: -3, }}>
                        <Pressable onPress={() => {

                            const id = item.id
                            const foundLocation = locations.find(obj => obj.id === id);
                            const floor_id = foundLocation.floor_id;
                            const location_name = foundLocation.name;
                            const type_value = foundLocation.type;
                            let isDestination_value = false;
                            if (foundLocation.isDestination === "1") {
                                isDestination_value = true
                            } else {
                                isDestination_value = false
                            }
                            const state = "Edit"
                            props.navigation.navigate('Locations', { id, floor_id, location_name, type_value, isDestination_value, state })

                        }} style={{ backgroundColor: Color.deepskyblue, width: 90, paddingVertical: 7, marginRight: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', borderRadius: 4, }}>
                            <Text style={{ color: '#fff', fontFamily: FontFamily.poppinsMedium, fontSize: 13, }}>Edit</Text>
                            <Image source={require('../assets/editing2.png')} style={{ marginLeft: 10, marginBottom: 3, width: 17, height: 17, tintColor: '#fff' }} />
                        </Pressable>
                        <Pressable onPress={() => {
                            Alert.alert(
                                'Confirmation',
                                'Are you sure you want to delete this location?',
                                [
                                    {
                                        text: 'Cancel',
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Delete',
                                        style: 'destructive',
                                        onPress: () => deleteLocation(item.id),
                                    },
                                ]
                            );
                        }} style={{ backgroundColor: Color.redishLook, width: 90, paddingVertical: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', borderRadius: 4, }}>
                            <Text style={{ color: '#fff', fontFamily: FontFamily.poppinsMedium, fontSize: 13, }}>Delete</Text>
                            <Image source={require('../assets/delete6.png')} style={{ marginLeft: 10, marginBottom: 3, width: 17, height: 17, tintColor: '#fff' }} />
                        </Pressable>
                    </View> : null
                }
            </View >
        )
    };

    const onMainSearch = (txt) => {
        if (txt !== '') {
            let tempData = locations.filter((item) => {
                for (let key in item) {
                    if (key !== 'id' && typeof item[key] === 'string')
                        if (item[key].toLowerCase().includes(txt.toLowerCase())) {
                            return true;
                        }
                }
                return false;
            });
            setSearchLocations(tempData);
        } else {
            setSearchLocations(locations);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ alignItems: 'center', backgroundColor: Color.white, elevation: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, height: 65, marginBottom: 5, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: "space-between" }}>
                <Pressable onPress={() => { props.navigation.goBack() }}>
                    <Image style={{ tintColor: Color.lightsteelblue, width: 32, height: 32, }} source={require('../assets/back.png')} />
                </Pressable>
                <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 19.5, letterSpacing: .4, color: Color.lightsteelblue }}>SAVED LOCATIONS</Text>
                <Image style={{ tintColor: Color.white, width: 30, height: 30, }} source={require('../assets/menu.png')} />
            </View >

            <View style={styles.container}>
                {error !== '' && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}
                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        ref={mainSearchRef}
                        onChangeText={(txt) => onMainSearch(txt)}
                    />
                </View>

                <View style={[styles.listContainer, { marginHorizontal: 20, paddingBottom: 10, marginBottom: 100, borderBottomColor: 'lightgrey', borderBottomWidth: 1 }]}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Loc Name</Text>
                        <Text style={styles.headerText}>Floor</Text>
                        <Text style={styles.headerText}>Type</Text>
                    </View>

                    <VirtualizedList

                        data={searchLocations}
                        initialNumToRender={8}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        getItemCount={() => searchLocations.length}
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
                    onPress={() => { props.navigation.navigate('Locations') }}
                >
                    <Text style={styles.showButtonText}>
                        Insert New Location
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};


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
        fontSize: 14,
        flex: 1,
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