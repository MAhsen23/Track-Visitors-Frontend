import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    ActivityIndicator,
    StyleSheet,
    Image,
    Pressable,
    Alert,
    ScrollView,
} from "react-native";
import { Color } from "../GlobalStyles";
import { FontFamily } from "../GlobalStyles";
import CustomPickerOneValue from "../components/custom_picker_one_value";
import url from "../ApiUrl";
import ImagePicker from 'react-native-image-crop-picker';
import CustomDropdown from "../components/multi_value_picker";



const App = (props) => {

    const { id } = props.route?.params;
    const [dutyLocation, setDutyLocation] = useState('');
    const [visitors, setVisitors] = useState([])
    const [searchVisitors, setSearchVisitors] = useState([])
    const [selectedVisitor, setSelectedVisitor] = useState('')
    const [error, setError] = useState('')
    const [visitorDdModelVisible, setVisitorDdModelVisible] = useState(false)
    const visitorSearchRef = useRef();
    const [selectedVisitorId, setSelectedVisitorId] = useState('')

    const [entryTime, setEntryTime] = useState('')

    const [selectedDestinations, setSelectedDestinations] = useState([]);

    const [destinations, setDestinations] = useState([])

    const [visitorImage, setVisitorImage] = useState(null);
    const [isLoadingImage, setIsLoadingImage] = useState(false);

    const [threshold, setThreshold] = useState(0);

    const updateEntryTime = () => {
        const currentTime = new Date();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = (hours % 12) || 12;
        const formattedTime = `${formattedHours}:${minutes} ${ampm}`;
        setEntryTime(formattedTime);
    };


    useEffect(() => {

        fetchVisitors();
        fetchDutyLocation();
        fetchDestinations();
        updateEntryTime();

        const intervalId = setInterval(updateEntryTime, 60000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const fetchDestinations = async () => {
        try {
            const response = await fetch(`${url}GetAllLocations`);
            if (response.ok) {
                const data = await response.json();
                setDestinations(data);
                setError('');
            } else {
                throw new Error('Failed to fetch destination locations.');
            }
        } catch (error) {
            setError('An error occurred while fetching destination locations.');
            console.error('Error occurred during API request:', error);
        }
    };


    const fetchDutyLocation = async () => {
        try {
            const response = await fetch(`${url}GetGuardDutyLocation/${id}`);
            if (response.ok) {
                const data = await response.json();
                setDutyLocation(data.duty_location)
                setError('');
            } else {
                throw new Error('Failed to fetch duty location.');
            }
        } catch (error) {
            setError('An error occurred while fetching duty location.');
            console.error('Error occurred during API request:', error);
        }
    }





    const insertVisit = async () => {

        if (!selectedVisitor || selectedDestinations.length === 0 || !dutyLocation) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        try {

            const response = await fetch(`${url}StartVisitWithThreads`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: selectedVisitorId,
                    starttime: entryTime,
                    destinations: selectedDestinations,
                    user_id: id,
                    source: dutyLocation,
                }),
            });
            if (response.ok) {
                const responseBody = await response.json();
                const paths = responseBody.paths;
                const source = responseBody.source;
                const possiblePaths = responseBody.locationPaths;

                const sourceObj = destinations.find(item => item.id === dutyLocation);
                const sourceName = sourceObj.name;

                const selectedDestinationsNames = [];

                selectedDestinations.map((id) => {
                    const foundDestination = destinations.find(item => item.id === id);
                    selectedDestinationsNames.push(foundDestination.name);
                })

                setError('');
                setSelectedDestinations([])
                setSelectedVisitor('');

                props.navigation.navigate('VisitPossiblePaths', { possiblePaths, entryTime, paths, source, selectedVisitorId, sourceName, selectedDestinationsNames });

                Alert.alert('Success', 'Visit inserted successfully.');
            } else {
                throw new Error('Failed to insert visit.');
            }
        } catch (error) {
            setError('An error occurred while inserting visit.');
            console.error(error);
        }
    }





    const fetchVisitors = async () => {
        try {
            const response = await fetch(`${url}GetAllVisitors`);
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


    const handleVisitorSelection = async (item) => {


        if (item.block === "True") {
            Alert.alert("Error", "This visitor is blocked..")
            setVisitorDdModelVisible(false);
            setSelectedVisitor('');
            setSelectedDestinations([]);
            return;
        }

        setSelectedVisitor(item);
        setSelectedVisitorId(item.id);
        setVisitorDdModelVisible(false);
        setIsLoadingImage(true);

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


    const recognizeVisitorWithImage = async (capturedImage) => {
        try {

            const formData = new FormData();
            formData.append(`image`, {
                uri: capturedImage.path,
                type: capturedImage.mime, // Make sure 'mime' is available in the image object
                name: `img${1 + 1}.${capturedImage.path.split('.').pop()}`,
            });

            const response = await fetch(`${url}GetVisitorWithImage`, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                if (!data) {
                    Alert.alert('Warning', 'No visitor detected.');
                }
                else {
                    visitorData = data[0]
                    handleVisitorSelection(data[0]);
                }
            } else {
                throw new Error('Failed to fetch visitor with image.');
            }

        } catch (error) {
            Alert.alert('Error', 'An error occured while fetching visitor with image.');
            console.error(error);
        }
    };

    const [scanImage, setScanImage] = useState('')

    const captureVisitorPicture = async () => {
        try {
            const image = await ImagePicker.openCamera({
                mediaType: 'photo',
            });
            setScanImage(image);
            recognizeVisitorWithImage(image);
        } catch (error) {
            console.log('Error during capturing visitor image:', error);
        }
    };

    const handleValuesSelect = (selectedValues) => {
        const hasRestrictedLocation = selectedValues.some(item => {
            const locObj = destinations.find(des => des.id === item);
            return locObj && locObj.restrict === "True";
        });

        if (hasRestrictedLocation) {
            Alert.alert("Error", 'One or more selected locations are restricted');
        } else {
            console.log("Selected values:", selectedValues);
            setSelectedDestinations(selectedValues);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ alignItems: 'center', backgroundColor: Color.white, elevation: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, height: 65, marginBottom: 5, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: "space-between" }}>
                <Pressable onPress={() => { props.navigation.goBack() }}>
                    <Image style={{ tintColor: Color.lightsteelblue, width: 32, height: 32, }} source={require('../assets/back.png')} />
                </Pressable>
                <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 19.5, letterSpacing: .4, color: Color.lightsteelblue }}>ADD NEW VISIT</Text>
                <Image style={{ tintColor: Color.white, width: 30, height: 30, }} source={require('../assets/menu.png')} />
            </View >

            <ScrollView style={{ backgroundColor: '#fff' }}>
                <View style={styles.container}>
                    {error !== '' && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}
                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={{ fontFamily: FontFamily.poppinsMedium, alignSelf: "center" }}>Scan Visitor</Text>
                            <Pressable style={{ marginBottom: 30, marginTop: 10, alignSelf: "center" }} onPress={captureVisitorPicture} >
                                <Image
                                    source={require("../assets/cam.png")}
                                    style={{ tintColor: Color.deepskyblue, width: 70, height: 70 }}
                                />
                            </Pressable>
                            <View style={styles.pickerContainer}>
                                <Pressable
                                    style={styles.dropdownselector}
                                    onPress={() => setVisitorDdModelVisible(true)}
                                >
                                    <Text style={styles.selectedValues}>
                                        {selectedVisitor === ''
                                            ? 'Select Visitor'
                                            : selectedVisitor.name}
                                    </Text>
                                    <Image
                                        source={require('../assets/search2.png')}
                                        style={styles.icon}
                                    />
                                </Pressable>
                                <CustomPickerOneValue
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


                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Entry time</Text>
                            <TextInput style={styles.input} editable={false} value={entryTime} />
                        </View>

                        <Text style={styles.label}>Destination</Text>
                        <CustomDropdown
                            options={destinations.filter(item => item.type !== 'Gate')}
                            selectedValues={selectedDestinations}
                            onValuesSelect={handleValuesSelect}
                            labelKey="name"
                            valueKey="id"
                            placeholder="Select Destination"
                            height={350}
                            width='92%'
                        />
                        <Pressable style={styles.button} onPress={insertVisit}>
                            <Text style={styles.buttonText}>Start Visit</Text>
                        </Pressable>
                    </View>
                </View >
            </ScrollView >
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        padding: 10,
        borderColor: '#e1e1e1',
        borderWidth: 1,
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 14.5,
        justifyContent: "center",
        marginBottom: 10,
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

export default App;