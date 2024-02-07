import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    Modal,
    Button,
    Image,
    Alert
} from 'react-native';
import { FontFamily } from '../GlobalStyles';
import { Color } from '../GlobalStyles';
import url from '../ApiUrl';
import CustomPicker from '../components/custom_picker_one_value';

import DatePicker from 'react-native-modern-datepicker';
import { getToday, getFormatedDate } from 'react-native-modern-datepicker';


const App = (props) => {

    const today = new Date();
    const todaysDate = getFormatedDate(today.setDate(today.getDate()), 'YYYY/MM/DD')
    const tomorrowsDate = getFormatedDate(today.setDate(today.getDate() + 1), 'YYYY/MM/DD')

    const [error, setError] = useState('');

    const [blockedVisitors, setBlockedVisitors] = useState([]);

    useEffect(() => {
        fetchBlockVisitors();
    }, []);

    const showError = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 5000);
    };

    const fetchBlockVisitors = async () => {
        try {
            const response = await fetch(`${url}GetBlockVisitors`);
            if (response.ok) {
                const data = await response.json();
                setBlockedVisitors(data);
                setError('');
            } else {
                throw new Error('Failed to fetch blocked visitors.');
            }
        } catch (error) {
            showError('An error occurred while fetching blocked visitors.');
            console.error('Error occurred during API request:', error);
        }
    };

    const renderItem = ({ item }) => (
        <Pressable>
            <View style={styles.row}>
                <Text style={styles.itemText}>{item.visitor_name}</Text>
                <Text style={styles.itemText}>{item.end_date}</Text>
            </View >
        </Pressable >
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ alignItems: 'center', backgroundColor: Color.white, elevation: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, height: 65, marginBottom: 5, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: "space-between" }}>
                <Pressable onPress={() => { props.navigation.goBack() }}>
                    <Image style={{ tintColor: Color.lightsteelblue, width: 32, height: 32, }} source={require('../assets/back.png')} />
                </Pressable>
                <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 19.5, letterSpacing: .4, color: Color.lightsteelblue }}>BLOCKED VISITORS</Text>
                <Image style={{ tintColor: Color.white, width: 30, height: 30, }} source={require('../assets/menu.png')} />
            </View >

            <View style={styles.container}>
                {error !== '' && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}
                <View style={styles.listContainer}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Name</Text>
                        <Text style={styles.headerText}>Block till</Text>
                    </View>

                    <FlatList style={styles.flatList} data={blockedVisitors} keyExtractor={(item, index) => index.toString()} renderItem={renderItem} />
                </View>
            </View >
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,
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
        alignItems: 'center',
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

    //modal
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
        marginBottom: 10,
    },
    selectedValues: {
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 14,
    },
    icon: {
        width: 15,
        height: 15,
    },
});

export default App;
