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
import CustomPicker from '../Custom_Hayo/custom_picker_one_value';

import DatePicker from 'react-native-modern-datepicker';
import { getToday, getFormatedDate } from 'react-native-modern-datepicker';


const BlockedVisitorScreen = (props) => {

    const { id } = props.route.params;

    const today = new Date();
    const todaysDate = getFormatedDate(today.setDate(today.getDate()), 'YYYY/MM/DD')
    const tomorrowsDate = getFormatedDate(today.setDate(today.getDate() + 1), 'YYYY/MM/DD')

    const [selectedVisitor, setSelectedVisitor] = useState('')
    const [name, setName] = useState('')
    const [contact, setContact] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [error, setError] = useState('')
    const [startDatePickerOpen, setStartDatePickerOpen] = useState(false)
    const [endDatePickerOpen, setEndDatePickerOpen] = useState(false)
    const [blockedVisitors, setBlockedVisitors] = useState([]);
    const [searchBlockedVisitors, setSearchBlockedVisitors] = useState([])
    const [visitors, setVisitors] = useState([])
    const [searchVisitors, setSearchVisitors] = useState([])
    const [visitorDdModelVisible, setVisitorDdModelVisible] = useState(false)

    const [searchMode, setSearchMode] = useState(false)
    const mainSearchRef = useRef();
    const visitorSearchRef = useRef();


    useEffect(() => {
        fetchVisitors();
        fetchBlockVisitors();
    }, []);

    const showError = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 5000);
    };

    const fetchVisitors = async () => {
        try {
            const response = await fetch(`${url}GetAllVisitors`);
            if (response.ok) {
                const data = await response.json();
                setVisitors(data);
                setSearchVisitors(data);
                console.log(data)
                showError('');
            } else {
                throw new Error('Failed to fetch all visitors.');
            }
        } catch (error) {
            showError('An error occurred while fetching all visitors.');
            console.error('Error occurred during API request:', error);
        }
    };

    const fetchBlockVisitors = async () => {
        try {
            const response = await fetch(`${url}GetBlockVisitors`);
            if (response.ok) {
                const data = await response.json();
                setBlockedVisitors(data);
                setSearchBlockedVisitors(data);
                setError('');
            } else {
                throw new Error('Failed to fetch all visitors.');
            }
        } catch (error) {
            showError('An error occurred while fetching all visitors.');
            console.error('Error occurred during API request:', error);
        }
    };
    const onVisitorsSearch = (txt) => {
        if (txt !== '') {
            let tempData = visitors.filter((item) => {
                for (let key in item) {
                    if (key !== 'id')
                        if (item[key].toLowerCase().includes(txt.toLowerCase())) {
                            return true;
                        }
                }
                return false;
            });
            setSearchVisitors(tempData);
        } else {
            setSearchVisitors(visitors);
        }
    }

    const handleVisitorSelection = (item) => {
        console.log(item.block)
        if (item.block === "True") {
            Alert.alert('Error', 'Visitor already blocked.')
            return
        }
        setSelectedVisitor(item.name);
        setName(item.name)
        setContact(item.phone)
        setVisitorDdModelVisible(false);
    };


    const blockVisitor = async () => {
        try {
            if (!startDate || !endDate || !selectedVisitor) {
                Alert.alert('Error', 'Please select all the fields!');
                return;
            }

            const foundObject = visitors.find(item => item.name === selectedVisitor);
            const visitor_id = foundObject.id;

            const formData = new FormData();
            formData.append('user_id', id);
            formData.append('start_date', startDate);
            formData.append('end_date', endDate);
            formData.append('visitor_id', visitor_id)

            const response = await fetch(`${url}BlockVisitor`, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                Alert.alert('Success', 'Visitor blocked successfully.');
                setName('');
                setContact('');
                setSelectedVisitor('');
                setStartDate('');
                setEndDate('');
                fetchBlockVisitors();
            } else {
                throw new Error('Failed to block visitor.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occured while blocking visitor.');
            console.error(error);
        }
    }

    const unblockVisitor = async (visitor_id) => {
        try {
            const response = await fetch(`${url}UnblockVisitor`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    visitor_id: visitor_id,
                }),
            });
            if (response.ok) {
                setError('');
                fetchBlockVisitors();
                Alert.alert('Success', 'Visitor unblocked successfully.');
            } else {
                throw new Error('Failed to unblock visitor.');
            }
        } catch (error) {
            showError('An error occurred while unblock visitor.');
            console.error(error);
        }
    }

    const onMainSearch = (txt) => {
        if (txt !== '') {
            let tempData = blockedVisitors.filter((item) => {
                for (let key in item) {
                    if (key !== 'id' && typeof item[key] === 'string')
                        if (item[key].toLowerCase().includes(txt.toLowerCase())) {
                            return true;
                        }
                }
                return false;
            });
            setSearchBlockedVisitors(tempData);
        } else {
            setSearchBlockedVisitors(blockedVisitors);
        }
    }

    const renderItem = ({ item }) => (
        <Pressable>
            <View style={styles.row}>
                <Text style={styles.itemText}>{item.visitor_name}</Text>
                <Text style={styles.itemText}>{item.end_date}</Text>
                <Pressable onPress={() => { unblockVisitor(item.visitor_id) }} style={styles.itemText}>
                    <Text style={{ fontFamily: FontFamily.poppinsMedium, backgroundColor: 'skyblue', textAlign: 'center', color: 'white', paddingVertical: 4, justifyContent: 'center', width: 80, borderRadius: 5, fontSize: 13, }}>Unblock</Text>
                </Pressable>
            </View >
        </Pressable >
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ alignItems: 'center', backgroundColor: Color.white, elevation: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, height: 65, marginBottom: 5, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: "space-between" }}>
                <Pressable onPress={() => { props.navigation.goBack() }}>
                    <Image style={{ tintColor: Color.lightsteelblue, width: 32, height: 32, }} source={require('../assets/back.png')} />
                </Pressable>
                <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 19.5, letterSpacing: .4, color: Color.lightsteelblue }}>BLOCK VISITORS</Text>
                <Image style={{ tintColor: Color.white, width: 30, height: 30, }} source={require('../assets/menu.png')} />
            </View >

            <View style={styles.container}>
                {error !== '' && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Select Visitor</Text>
                        <View style={styles.pickerContainer}>
                            <Pressable
                                style={styles.dropdownselector}
                                onPress={() => setVisitorDdModelVisible(true)}
                            >
                                <Text style={styles.selectedValues}>
                                    {selectedVisitor === ''
                                        ? 'Select Visitor'
                                        : selectedVisitor}
                                </Text>
                                <Image
                                    source={require('../assets/search2.png')}
                                    style={styles.icon}
                                />
                            </Pressable>
                            <CustomPicker
                                visible={visitorDdModelVisible}
                                setVisible={setVisitorDdModelVisible}
                                selectedValue={selectedVisitor}
                                onValueChange={handleVisitorSelection}
                                data={searchVisitors}
                                onSearchData={onVisitorsSearch}
                                searchRef={visitorSearchRef}
                            />
                        </View>
                    </View>
                    {/* <View style={styles.inputContainer}>
                    <Text style={styles.label}>Visitor Name</Text>
                    <TextInput style={styles.input} editable={false} value={name} />
                </View>*/}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Contact</Text>
                        <TextInput style={[styles.input, { color: 'grey', }]} editable={false} value={contact} />
                    </View>
                    <View style={styles.inlineInputContainer}>
                        <Pressable style={styles.inlineInputLeft} onPress={() => { setStartDatePickerOpen(!startDatePickerOpen) }}>
                            <Text style={styles.label}>Start Date</Text>
                            <TextInput style={styles.input} editable={false} value={startDate} />
                        </Pressable>

                        <Pressable onPress={() => { setEndDatePickerOpen(!endDatePickerOpen) }} style={styles.inlineInputRight}>
                            <Text style={styles.label}>End Date</Text>
                            <TextInput style={styles.input} editable={false} value={endDate} />
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
                                <Pressable onPress={() => { setStartDatePickerOpen(!startDatePickerOpen) }}>
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
                                    minimumDate={tomorrowsDate}
                                />
                                <Pressable onPress={() => { setEndDatePickerOpen(!endDatePickerOpen) }}>
                                    <Text style={{ fontFamily: FontFamily.poppinsMedium }}>Close</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                    <Button title="Block" onPress={blockVisitor} />
                </View>
                <View style={styles.headerTopBar}>
                    <Text style={styles.headerTopBarText}>Blocked Visitors</Text>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={() => {
                            setSearchMode(!searchMode)
                        }}>
                            <Image style={styles.mainIcon} source={require('../assets/search2.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                {searchMode &&
                    <View style={styles.searchBar}>
                        <TextInput
                            ref={mainSearchRef}
                            style={styles.searchInput}
                            placeholder="Search"
                            onChangeText={txt => onMainSearch(txt)}
                        />
                    </View>
                }
                <View style={styles.listContainer}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Name</Text>
                        <Text style={styles.headerText}>Block till</Text>
                        <Text style={styles.headerText}>Action</Text>
                    </View>

                    <FlatList style={styles.flatList} data={searchBlockedVisitors} keyExtractor={(item, index) => index.toString()} renderItem={renderItem} />
                </View>
            </View >
        </View>
    )
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

export default BlockedVisitorScreen;
