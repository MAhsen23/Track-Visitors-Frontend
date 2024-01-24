import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Modal,
    Image,
    FlatList,
    Alert,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { Color, FontFamily } from '../GlobalStyles';
import url from '../ApiUrl';


const App = (props) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState('')
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [maxDate, setMaxDate] = useState('')

    useEffect(() => {
        const today = new Date();
        fetchVisitorsReport(today.toISOString().split('T')[0], today.toISOString().split('T')[0]);
        setMaxDate(today.toISOString().split('T')[0])
    }, []);

    useEffect(() => {
        fetchVisitorsReport(fromDate, toDate);
    }, [fromDate, toDate]);

    const showError = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 5000);
    };


    const fetchVisitorsReport = async (startDate, endDate) => {
        try {
            if (!endDate) {
                return
            }
            const response = await fetch(`${url}GetVisitorsReport`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate,
                }),
            });
            if (response.ok) {
                const result = await response.json();
                console.log(result);
                setData(result);
                setError('');
            } else {
                throw new Error('Failed to fetch report.');
            }
        } catch (error) {
            showError('An error occurred while fetching report.');
        }
    }


    const renderItem = ({ item, index }) => {
        const entryTimeParts = item.EntryTime.split(':');
        const entryHours = parseInt(entryTimeParts[0], 10);
        const entryMinutes = parseInt(entryTimeParts[1], 10);
        const entry_time_formatted = formatTime(entryHours, entryMinutes);

        let exit_time_formatted = '';
        if (item.ExitTime) {
            const exitTimeParts = item.ExitTime.split(':');
            const exitHours = parseInt(exitTimeParts[0], 10);
            const exitMinutes = parseInt(exitTimeParts[1], 10);
            exit_time_formatted = formatTime(exitHours, exitMinutes);
        }

        return (
            <View style={styles.row}>
                <Text style={[styles.itemText, { minWidth: 45, maxWidth: 45 }]}>{(index + 1).toString()}</Text>
                <Text style={[styles.itemText, { minWidth: 150, maxWidth: 150 }]}>{item.VisitorName}</Text>
                <Text style={[styles.itemText, { minWidth: 100, maxWidth: 100 }]}>{item.VisitDate}</Text>
                <Text style={[styles.itemText, { minWidth: 100, maxWidth: 100 }]}>{entry_time_formatted}</Text>
                <Text style={[styles.itemText, { minWidth: 100, maxWidth: 100 }]}>{exit_time_formatted ? exit_time_formatted : 'Active visit'}</Text>
                <Text style={[styles.itemText, { minWidth: 250, maxWidth: 250 }]}>{item.LocationsVisited}</Text>
            </View>
        );
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const formatDate = (dateString) => {
        // const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        // const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
        return dateString.format('YYYY-MM-DD');
    };

    const formatTime = (hours, minutes) => {
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}:${formattedMinutes} ${period}`;
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ alignItems: 'center', backgroundColor: Color.white, elevation: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, height: 65, marginBottom: 5, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: "space-between" }}>
                <Pressable onPress={() => { props.navigation.goBack() }}>
                    <Image style={{ tintColor: Color.lightsteelblue, width: 32, height: 32, }} source={require('../assets/back.png')} />
                </Pressable>
                <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 19.5, letterSpacing: .4, color: Color.lightsteelblue }}>VISITOR REPORTS</Text>
                <Image style={{ tintColor: Color.white, width: 30, height: 30, }} source={require('../assets/menu.png')} />
            </View >

            <View style={styles.container}>
                {error !== '' && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}
                <Pressable onPress={() => setIsModalVisible(true)} style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FCFCFC', padding: 15, elevation: 1, marginBottom: 30, marginTop: 10, borderRadius: 8, }}>
                    <Text style={{ fontFamily: FontFamily.poppinsRegular, fontSize: 14.5, }}>
                        {fromDate && toDate ? (
                            fromDate.toISOString() === toDate.toISOString()
                                ? `${formatDate(fromDate)}`
                                : `${formatDate(fromDate)} to ${formatDate(toDate)}`
                        ) : (
                            'Select Date Range'
                        )}
                    </Text>
                    <Image source={require('../assets/daterange1.png')} style={{ width: 25, height: 25, tintColor: 'grey', opacity: 0.8 }} />
                </Pressable>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <CalendarPicker
                                startFromMonday={true}
                                maxDate={maxDate}
                                allowRangeSelection={true}
                                selectedStartDate={fromDate}
                                selectedEndDate={toDate}
                                onDateChange={(date, type) => {
                                    if (type === 'END_DATE') {
                                        setToDate(date);
                                    } else {
                                        setFromDate(date);
                                        setToDate(null);
                                    }
                                }}
                                nextTitleStyle={styles.nextPre}
                                previousTitleStyle={styles.nextPre}
                                textStyle={styles.calenderText}

                                selectedRangeStyle={styles.selectedRangeStyle}
                                dayLabelsWrapper={styles.daysStyle}
                                todayTextStyle={{ color: Color.redishLook, }}
                                todayBackgroundColor='#fff'
                            />
                            <View style={{ marginTop: 20, marginBottom: 10, }}>
                                <Pressable onPress={closeModal} >
                                    <Text style={{ fontFamily: FontFamily.poppinsMedium, alignSelf: 'center' }}>Close</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
                <ScrollView horizontal>
                    <View style={styles.listContainer}>
                        <View style={styles.header}>
                            <Text style={[styles.headerText, { minWidth: 45, maxWidth: 45 }]}>S.No</Text>
                            <Text style={[styles.headerText, { minWidth: 150, maxWidth: 150 }]}>Name</Text>
                            <Text style={[styles.headerText, { minWidth: 100, maxWidth: 100 }]}>Visit Date</Text>
                            <Text style={[styles.headerText, { minWidth: 100, maxWidth: 100 }]}>Entry Time</Text>
                            <Text style={[styles.headerText, { minWidth: 100, maxWidth: 100 }]}>Exit Time</Text>
                            <Text style={[styles.headerText, { minWidth: 250, maxWidth: 250 }]}>Destination</Text>
                        </View>
                        <FlatList
                            style={styles.flatList}
                            data={data}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderItem}
                        />
                    </View>
                </ScrollView>
                <Pressable style={styles.generateButton} onPress={() => { fetchVisitorsReport(fromDate, toDate) }}>
                    <Text style={styles.generateButtonText}>Generate Report</Text>
                </Pressable>
            </View >
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 30,
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









    dateRangeButton: {
        backgroundColor: Color.deepskyblue,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    dateRangeText: {
        color: 'white',
        fontFamily: FontFamily.poppinsMedium,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '97%',
        elevation: 5,
    },
    generateButton: {
        backgroundColor: Color.deepskyblue,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    generateButtonText: {
        color: 'white',
        fontFamily: FontFamily.poppinsMedium,
    },
    nextPre: {
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 15,
        paddingHorizontal: 15,
        color: Color.lightsteelblue,
    },
    calenderText: {
        fontFamily: FontFamily.poppinsMedium,
        color: Color.darkgrey,
    },
    selectedRangeStyle: {
        backgroundColor: '#fcfcfc',
        elevation: 1,
    },
    daysStyle: {
        borderTopColor: '#fff',
        marginBottom: 10,
    }
});

export default App;
