import React, { useState, useEffect } from "react";
import { Text, StyleSheet, Alert, View, Image, Dimensions, Pressable, ScrollView, Modal, TouchableOpacity, VirtualizedList } from "react-native";
import { FontFamily, Color } from "../GlobalStyles";
import url from '../ApiUrl';
import SingleValueCusDropdown from '../components/one_value_picker'
import CalendarPicker from 'react-native-calendar-picker';
import { FlatList } from "react-native-gesture-handler";


const App = (props) => {

    const [images, setImages] = useState([]);
    const [cameras, setCameras] = useState([])
    const [camera, setCamera] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [maxDate, setMaxDate] = useState('')

    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const today = new Date();
        const formattedToday = today.toISOString().split('T')[0];
        setMaxDate(formattedToday);
        fetchDumpImagesList(formattedToday, formattedToday);
        fetchCameras();
    }, []);

    const fetchCameras = async () => {
        try {
            const response = await fetch(`${url}GetAllCameras`);
            if (response.ok) {
                const data = await response.json();
                setCameras(data);
            } else {
                throw new Error('Failed to fetch cameras.');
            }
        } catch (error) {
            console.error('Error occurred during API request:', error);
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toISOString().split('T')[0];
    };

    const fetchDumpImagesList = async (start_date, end_date) => {
        try {
            console.log(start_date, end_date)
            setIsFetching(true);
            const response = await fetch(`${url}GetDumpImages?camera=${camera}&start_date=${formatDate(start_date)}&end_date=${formatDate(end_date)}`);
            if (response.ok) {
                const data = await response.json();
                setImages(data.images);
                setIsFetching(false);
            } else {
                throw new Error('Failed to fetch images list.');
            }
        } catch (error) {
            console.error('Error occurred during API request:', error);
        }
    }

    const openModal = (index) => {
        setSelectedImageIndex(index);
        setModalVisible(true);
    }

    const closeModal = () => {
        setModalVisible(false);
    }

    const changeImage = (direction) => {
        let newIndex;
        if (direction === 'next') {
            newIndex = selectedImageIndex + 1;
            if (newIndex >= images.length) {
                newIndex = 0;
            }
        } else {
            newIndex = selectedImageIndex - 1;
            if (newIndex < 0) {
                newIndex = images.length - 1;
            }
        }
        setSelectedImageIndex(newIndex);
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ alignItems: 'center', backgroundColor: Color.white, elevation: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, height: 65, marginBottom: 5, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: "space-between" }}>
                <Pressable onPress={() => { props.navigation.goBack() }}>
                    <Image style={{ tintColor: Color.lightsteelblue, width: 32, height: 32, }} source={require('../assets/back.png')} />
                </Pressable>
                <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 19.5, letterSpacing: .4, color: Color.lightsteelblue }}>UNKNOWNS</Text>
                <Image style={{ tintColor: Color.white, width: 30, height: 30, }} source={require('../assets/menu.png')} />
            </View>
            <View style={styles.container}>
                <View>
                    <SingleValueCusDropdown
                        placeholder="Select Camera.."
                        width='92%'
                        height={350}
                        options={cameras}
                        selectedValue={camera}
                        onValueSelect={setCamera}
                        labelKey="name"
                        valueKey="id"
                    />
                </View>
                <Pressable onPress={() => setIsModalVisible(true)} style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FCFCFC', padding: 15, elevation: 1, marginBottom: 30, marginTop: 0, borderRadius: 8, }}>
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
                <Pressable disabled={isFetching} onPress={() => {
                    if (!fromDate || !toDate) {
                        Alert.alert('Error', 'Please fill in all the fields.');
                        return;
                    }
                    else {
                        fetchDumpImagesList(fromDate, toDate)
                    }
                }} style={{ marginBottom: 30, flexDirection: 'row', backgroundColor: Color.deepskyblue, width: '50%', height: 45, justifyContent: "center", alignItems: 'center', borderRadius: 40, }}>
                    <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 15, color: '#fff' }}>{isFetching ? 'Fetching...' : 'Fetch'}</Text>
                    <Image source={require('../assets/synchronize.png')} style={{ width: 20, height: 20, marginBottom: 2, marginLeft: 5, }} />
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
                                <Pressable onPress={() => { setIsModalVisible(false); }} >
                                    <Text style={{ fontFamily: FontFamily.poppinsMedium, alignSelf: 'center' }}>Close</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
                <VirtualizedList
                    contentContainerStyle={{ justifyContent: 'space-between', flexDirection: 'row', flexWrap: 'wrap' }}
                    data={images}
                    initialNumToRender={8}
                    renderItem={({ item }) => (

                        <TouchableOpacity style={{ padding: 5, borderRadius: 5, elevation: 2, marginHorizontal: 2, marginVertical: 5, width: 115, backgroundColor: '#fff', height: 245, alignItems: "center" }} key={item.filename} onPress={() => openModal(index)}>
                            <Image
                                style={{ height: 180, width: 108, borderRadius: 5, resizeMode: 'stretch' }}
                                source={{ uri: `data:image/jpeg;base64,${item.image}` }}
                            />
                            <View style={{ marginTop: 5, }}>
                                <Text style={{ fontFamily: FontFamily.poppinsMedium, textAlign: "center" }}>{item.date}</Text>
                                <Text style={{ fontFamily: FontFamily.poppinsRegular, textAlign: "center" }}>{item.time}</Text>
                            </View>
                        </TouchableOpacity>

                    )}

                    keyExtractor={(item, index) => index.toString()}
                    getItemCount={() => images.length}
                    getItem={(data, index) => data[index]}
                    numColumns={3}
                />

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: '#efefef' }}>
                        {images.length > 0 && selectedImageIndex >= 0 && selectedImageIndex < images.length && (
                            <Image
                                source={{ uri: `${url}GetDumpImage?path=${images[selectedImageIndex].full_path}` }}
                                style={{ width: '100%', height: '90%', resizeMode: 'contain' }}
                            />
                        )}
                        <View style={{ position: 'absolute', top: 20, left: 20 }}>
                            <TouchableOpacity onPress={closeModal}>
                                <Image source={require('../assets/cross.png')} style={{ width: 30, height: 30, tintColor: 'black' }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ position: 'absolute', top: '50%', right: 20 }}>
                            <TouchableOpacity onPress={() => changeImage('next')}>
                                <Image source={require('../assets/sort_right.png')} style={{ width: 20, height: 20, tintColor: 'grey' }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ position: 'absolute', top: '50%', left: 20 }}>
                            <TouchableOpacity onPress={() => changeImage('prev')}>
                                <Image source={require('../assets/sort_left.png')} style={{ width: 20, height: 20, tintColor: 'grey' }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </View >
    )
}

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    pictures: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
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
})
