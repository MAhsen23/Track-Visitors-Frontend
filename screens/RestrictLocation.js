import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, FlatList, Modal, Text, Image, TextInput, Alert, Pressable, StyleSheet } from "react-native";
import { FontFamily, Color } from '../GlobalStyles';
import url from '../ApiUrl';
import CustomDropdown from '../Custom_Hayo/multi_value_picker';
import DatePicker from 'react-native-modern-datepicker';
import CustomTimePicker from "../Custom_Hayo/time_picker";
import { getToday, getFormatedDate } from 'react-native-modern-datepicker';


const App = () => {

    const today = new Date();
    const todaysDate = getFormatedDate(today.setDate(today.getDate()), 'YYYY/MM/DD')
    const tomorrowsDate = getFormatedDate(today.setDate(today.getDate() + 1), 'YYYY/MM/DD')

    const [startselectedTime, setStartSelectedTime] = useState({ hours: 12, minutes: 0, dayPart: 'AM' });
    const [endselectedTime, setEndSelectedTime] = useState({ hours: 12, minutes: 0, dayPart: 'AM' });


    const [locations, setLocations] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);

    const [restrictedLocations, setRestrictedLocations] = useState([]);

    const [error, setError] = useState('');

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [startDatePickerOpen, setStartDatePickerOpen] = useState(false)
    const [endDatePickerOpen, setEndDatePickerOpen] = useState(false)

    const [mainSearchText, setMainSearchText] = useState('');

    useEffect(() => {
        fetchLocations();
        fetchRestrictedLocations();
    }, []);


    const fetchRestrictedLocations = async () => {
        try {
            const response = await fetch(`${url}GetRestrictedLocations`);
            if (response.ok) {
                const data = await response.json();
                setRestrictedLocations(data);
                setError('');
            } else {
                throw new Error('Failed to fetch restricted locations.');
            }
        } catch (error) {
            showError('An error occurred while fetching restricted locations.');
            console.error('Error occurred during API request:', error);
        }
    };


    const restrictLocations = async () => {
        try {
            if (selectedLocations.length === 0 || !startDate || !endDate || !startselectedTime || !endselectedTime) {
                Alert.alert('Error', 'Please select all the fields.');
                return;
            }
            else {
                console.log(selectedLocations, startDate, endDate, startselectedTime, endselectedTime)
                const response = await fetch(`${url}RestrictLocation`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        locations: selectedLocations,
                        start_datetime: `${startDate} ${formatTime(startselectedTime)}`,
                        end_datetime: `${endDate} ${formatTime(endselectedTime)}`,
                    }),
                });
                if (response.ok) {
                    setError('');
                    setSelectedLocations([]);
                    setStartDate('');
                    setEndDate('');
                    setStartSelectedTime({ hours: 12, minutes: 0, dayPart: 'AM' })
                    setEndSelectedTime({ hours: 12, minutes: 0, dayPart: 'AM' });
                    Alert.alert('Success', 'Location restricted successfully.');
                    fetchRestrictedLocations();
                } else {
                    throw new Error('Failed to restrict location.');
                }
            }
        }
        catch (error) {
            showError('An error occurred while restrict locations.');
            console.error('Error occurred during API request:', error);
        }
    }



    const formatTime = (time) => {
        const formattedHours = time.hours < 10 ? `0${time.hours}` : `${time.hours}`;
        const formattedMinutes = time.minutes < 10 ? `0${time.minutes}` : `${time.minutes}`;
        return `${formattedHours}:${formattedMinutes} ${time.dayPart}`;
    };

    const showError = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 5000);
    };

    const fetchLocations = async () => {
        try {
            const response = await fetch(`${url}GetAllLocations`);
            if (response.ok) {
                const data = await response.json();
                console.log(data)
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

    const renderItem = ({ item }) => (
        <Pressable>
            <View style={styles.row}>
                <Text style={styles.itemText}>{item.location_name}</Text>
                <Text style={[styles.itemText]}>{item.end_datetime}</Text>
                <Pressable style={styles.itemText}>
                    <Text style={{ fontFamily: FontFamily.poppinsMedium, backgroundColor: 'skyblue', textAlign: 'center', color: 'white', paddingVertical: 4, justifyContent: 'center', width: 80, borderRadius: 5, fontSize: 13, }}>UnRestrict</Text>
                </Pressable>
            </View >
        </Pressable >
    );

    return (
        <View style={styles.container}>
            {error !== '' && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
            <Text style={styles.label}>Location</Text>
            <CustomDropdown
                options={locations}
                selectedValues={selectedLocations}
                onValuesSelect={setSelectedLocations}
                labelKey="name"
                valueKey="id"
                placeholder="Select Location"
                height={350}
                width='92%'
            />
            <View style={styles.inputBox}>
                <Pressable onPress={() => { setStartDatePickerOpen(!startDatePickerOpen) }} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
                    <TextInput placeholder="Select start date & time" value={startDate ? String(`${startDate} ${formatTime(startselectedTime)}`) : ''} editable={false} style={styles.input} />
                    <Image style={{ tintColor: 'lightgrey', position: "absolute", right: 10, width: 20, height: 20, }} source={require('../assets/schedule.png')} />
                </Pressable>
            </View>
            <View style={styles.inputBox}>
                <Pressable onPress={() => { setEndDatePickerOpen(!endDatePickerOpen) }} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
                    <TextInput placeholder="Select end date & time" editable={false} style={styles.input} value={endDate ? String(`${endDate} ${formatTime(endselectedTime)}`) : ''} />
                    <Image style={{ tintColor: 'lightgrey', position: "absolute", right: 10, width: 20, height: 20, }} source={require('../assets/schedule.png')} />
                </Pressable>
            </View>

            <Modal
                animationType='slide'
                transparent={true}
                visible={startDatePickerOpen}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <DatePicker
                            mode='calendar'
                            onSelectedChange={date => setStartDate(date)}
                            minimumDate={todaysDate}
                        />
                        <CustomTimePicker label="" selectedTime={startselectedTime} setSelectedTime={setStartSelectedTime} />
                        <Pressable style={{ marginTop: 30, }} onPress={() => { setStartDatePickerOpen(!startDatePickerOpen) }}>
                            <Text style={{ fontFamily: FontFamily.poppinsMedium }}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>


            <Modal
                animationType='slide'
                transparent={true}
                visible={endDatePickerOpen}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <DatePicker
                            mode='calendar'
                            onSelectedChange={date => setEndDate(date)}
                            minimumDate={todaysDate}
                        />
                        <CustomTimePicker label="" selectedTime={endselectedTime} setSelectedTime={setEndSelectedTime} />
                        <Pressable style={{ marginTop: 30, }} onPress={() => { setEndDatePickerOpen(!endDatePickerOpen) }}>
                            <Text style={{ fontFamily: FontFamily.poppinsMedium }}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Pressable onPress={restrictLocations} style={{ padding: 12, backgroundColor: Color.deepskyblue, alignItems: 'center', borderRadius: 7, elevation: 1, marginVertical: 20, }}>
                <Text style={{
                    fontFamily: FontFamily.poppinsMedium,
                    fontSize: 16,
                    color: '#fff',
                }}>Restrict</Text>
            </Pressable>

            <View style={styles.searchBar}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    value={mainSearchText}
                    onChangeText={(text) => setMainSearchText(text)}
                />
            </View>
            <View style={styles.listContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Location</Text>
                    <Text style={styles.headerText}>Restricted till</Text>
                    <Text style={styles.headerText}>Action</Text>
                </View>

                <FlatList
                    style={styles.flatList}
                    data={restrictedLocations.filter((location) => {
                        for (let key in location) {
                            if (key !== 'location_id' && typeof location[key] === 'string') {
                                if (location[key].toLowerCase().includes(mainSearchText.toLowerCase())) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    })}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    errorContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    errorText: {
        color: 'red',
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 13,
        textAlign: 'center',
    },

    label: {
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 15,
        marginBottom: 5,
    },
    input: {
        flex: 1,
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
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        color: 'grey',
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 13,
    },
    inputBox: {
        marginBottom: 20,
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


    searchBar: {
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
        paddingRight: 10,
    },
    flatList: {
        marginBottom: 35,
    },
    headerTopBar: {
        paddingHorizontal: 12, height: 60,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 10,
        borderRadius: 7,
    },
    headerTopBarText: {
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 16,
        color: Color.deepskyblue
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
        tintColor: Color.deepskyblue,
    },
})
export default App;