import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, TextInput, Alert, ActivityIndicator, Pressable, Image, Text, View } from 'react-native';
import CustomPicker from '../components/custom_picker_one_value';
import { FontFamily } from '../GlobalStyles';
import { Color } from '../GlobalStyles';
import url from '../ApiUrl';


const ExitVisitor = (props) => {

    const [visitors, setVisitors] = useState([])
    const [searchVisitors, setSearchVisitors] = useState([])
    const [selectedVisitor, setSelectedVisitor] = useState('')
    const [error, setError] = useState('')
    const [visitorDdModelVisible, setVisitorDdModelVisible] = useState(false)
    const visitorSearchRef = useRef();
    const [selectedVisitorId, setSelectedVisitorId] = useState('')

    const [currentDate, setCurrentDate] = useState('');

    const [visitorImage, setVisitorImage] = useState(null);
    const [isLoadingImage, setIsLoadingImage] = useState(false);

    const [visitorEntryTime, setVisitorEntryTime] = useState('');

    //const [exitTime, setExitTime] = useState('');


    useEffect(() => {
        const getCurrentDate = () => {
            const now = new Date();
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const day = days[now.getDay()];
            const date = now.getDate();
            const months = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            const month = months[now.getMonth()];
            const year = now.getFullYear();
            return `${day} - ${date} ${month} ${year}`;
        };
        setCurrentDate(getCurrentDate());
        fetchVisitors();

        // updateExitTime();

        // const intervalId = setInterval(updateExitTime, 60000);
        // return () => {
        //     clearInterval(intervalId);
        // };

    }, []);

    // const updateExitTime = () => {
    //     const currentTime = new Date();
    //     const hours = currentTime.getHours();
    //     const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    //     const ampm = hours >= 12 ? 'PM' : 'AM';
    //     const formattedHours = (hours % 12) || 12;
    //     const formattedTime = `${formattedHours}:${minutes} ${ampm}`;
    //     setExitTime(formattedTime);
    // };

    const fetchVisitors = async () => {
        try {
            const response = await fetch(`${url}GetCurrentVisitors`);
            if (response.ok) {
                const data = await response.json();
                setVisitors(data);
                setSearchVisitors(data);
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

    const endVisit = async () => {
        if (!selectedVisitorId) {
            Alert.alert('Error', 'Please select visitor first.');
            return;
        }

        try {
            const response = await fetch(`${url}EndVisit`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    visitor_id: selectedVisitorId,
                }),
            });
            if (response.ok) {
                setError('');
                setSelectedVisitor('');
                setVisitorEntryTime('');
                Alert.alert('Success', 'Visit ended successfully.');
                fetchVisitors();
            } else {
                throw new Error('Failed to end visit.');
            }
        } catch (error) {
            showError('An error occurred while ending visit.');
        }
    };


    const formatTime = (hours, minutes) => {
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}:${formattedMinutes} ${period}`;
    };

    const handleVisitorSelection = async (item) => {
        setSelectedVisitor(item.name);
        setSelectedVisitorId(item.id);
        setVisitorDdModelVisible(false);
        setIsLoadingImage(true);

        const foundObject = visitors.find(obj => obj.id === item.id);
        let entry_time = null;

        if (foundObject) {
            const timeParts = foundObject.entry_time.split(':');
            const hours = parseInt(timeParts[0], 10);
            const minutes = parseInt(timeParts[1], 10);
            entry_time = formatTime(hours, minutes);
        }
        setVisitorEntryTime(entry_time);

        try {
            const response = await fetch(`${url}VisitorImages/${item.id}`);
            if (response.ok) {
                const data = await response.json();
                setVisitorImage(data.image);
            } else {
                throw new Error('Failed to fetch visitor image.');
            }
        } catch (error) {
            console.error('Error occurred during API request:', error);
        } finally {
            setIsLoadingImage(false);
        }
    };





    const showError = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 5000);
    };


    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ alignItems: 'center', backgroundColor: Color.white, elevation: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, height: 65, marginBottom: 5, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: "space-between" }}>
                <Pressable onPress={() => { props.navigation.goBack() }}>
                    <Image style={{ tintColor: Color.lightsteelblue, width: 32, height: 32, }} source={require('../assets/back.png')} />
                </Pressable>
                <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 19.5, letterSpacing: .4, color: Color.lightsteelblue }}>END VISIT</Text>
                <Image style={{ tintColor: Color.white, width: 30, height: 30, }} source={require('../assets/menu.png')} />
            </View >
            <View style={styles.container}>
                {error !== '' && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}
                <View style={styles.timeContainer}>
                    <Text style={styles.time}>{currentDate}</Text>
                </View>
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
                    {selectedVisitor && (
                        <View style={{ alignSelf: "center", marginVertical: 15, width: 215, height: 215, alignItems: "center", justifyContent: "center", elevation: 1, backgroundColor: '#fff', borderRadius: 7, }} key={visitorImage}>
                            {isLoadingImage ? (
                                <ActivityIndicator size="large" color="#000000" />
                            ) : (
                                <Image
                                    style={{ width: 200, height: 200, borderRadius: 5 }}
                                    source={{ uri: `data:image/jpeg;base64,${visitorImage}` }}
                                />
                            )}
                        </View>
                    )}
                    {visitorEntryTime && (
                        <View style={styles.inputContainer}>
                            <Text style={styles.entryTime}>
                                Visitor enters at: {visitorEntryTime}
                            </Text>
                        </View>
                    )}
                    {/* <View style={styles.inputContainer}>
                    <Text style={styles.label}>Exit time</Text>
                    <TextInput style={styles.input} editable={false} value={exitTime} />
                </View> */}
                    <Pressable style={styles.button} onPress={endVisit}>
                        <Text style={styles.buttonText}>End Visit</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    timeContainer: {
        marginBottom: 20,
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    time: {
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 16,
        textAlign: "right",
    },
    entryTime: {
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 16,
        marginTop: 15,
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
        height: 40,
        borderColor: '#e1e1e1',
        borderWidth: 1,
        paddingHorizontal: 10,
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 13,
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
    itemText: {
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 14,
        flex: 1,
    },

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
        width: 12.5,
        height: 12.5,
    },
    button: {
        backgroundColor: '#8CD6FA',
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
    thresholdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    thresholdContainer: {
        flexDirection: "row",
        borderColor: '#e1e1e1',
        borderWidth: 1,
        alignItems: "center",
        justifyContent: 'space-between'
    },
    counterInput: {
        height: 40,
        paddingHorizontal: 10,
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 13,
        color: 'black',
        marginRight: 20,
    },
    counterIconContainer: {
        flexDirection: "row",
    },
    counterIcon: {
        width: 27,
        height: 27,
    }
})

export default ExitVisitor;