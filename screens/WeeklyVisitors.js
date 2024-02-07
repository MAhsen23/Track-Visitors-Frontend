import React, { useState, useEffect } from "react";
import {
    View, Image,
    StyleSheet, ScrollView, Text, Modal, FlatList, Pressable,
} from 'react-native';
import HeaderBar from '../components/header_bar'
import url from "../ApiUrl";
import { FontFamily, Color } from "../GlobalStyles";

const App = () => {

    const [selectedImage, setSelectedImage] = useState('');

    const [visitors, setVisitors] = useState([]);
    const [selectedVisitor, setSelectedVisitor] = useState('')

    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        fetchVisitors();
    }, [])

    useEffect(() => {
        if (selectedImage) {
            setIsModalVisible(true);
        }
    }, [selectedImage])

    const fetchVisitors = async () => {
        try {
            const response = await fetch(`${url}GetWeeklyVisitors`);
            if (response.ok) {
                const data = await response.json();
                setVisitors(data);
            } else {
                throw new Error('Failed to fetch weekly visitors.');
            }
        } catch (error) {
            console.error('Error occurred during API request:', error);
        }
    };

    const formatDate = (dateString) => {
        return dateString.format('YYYY-MM-DD');
    };

    const formatTime = (hours, minutes) => {
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}:${formattedMinutes} ${period}`;
    };

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
                <Pressable onPress={() => {
                    setSelectedImage(item.image)
                }} style={[styles.itemText, { minWidth: 50, maxWidth: 50 }]}>
                    <Image
                        style={{ width: 30, height: 30, borderRadius: 100, borderWidth: 1, borderColor: '#fff' }}
                        source={{ uri: `data:image/jpeg;base64,${item.image}` }}
                    />
                </Pressable>
                <Text style={[styles.itemText, { minWidth: 150, maxWidth: 150 }]}>{item.VisitorName}</Text>
                <Text style={[styles.itemText, { minWidth: 100, maxWidth: 100 }]}>{item.VisitDate}</Text>
                <Text style={[styles.itemText, { minWidth: 100, maxWidth: 100 }]}>{entry_time_formatted}</Text>
                <Text style={[styles.itemText, { minWidth: 100, maxWidth: 100 }]}>{exit_time_formatted ? exit_time_formatted : 'Active visit'}</Text>
                <Text style={[styles.itemText, { minWidth: 250, maxWidth: 250 }]}>{item.LocationsVisited}</Text>
            </View>
        );
    };


    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <HeaderBar title="Weekly Visitors" />
            <View style={styles.container}>
                {visitors.length > 0 &&
                    <ScrollView horizontal>
                        <View style={styles.listContainer}>
                            <View style={styles.header}>
                                <Text style={[styles.headerText, { minWidth: 45, maxWidth: 45 }]}>S.No</Text>
                                <Text style={[styles.headerText, { minWidth: 50, maxWidth: 50 }]}></Text>
                                <Text style={[styles.headerText, { minWidth: 150, maxWidth: 150 }]}>Name</Text>
                                <Text style={[styles.headerText, { minWidth: 100, maxWidth: 100 }]}>Visit Date</Text>
                                <Text style={[styles.headerText, { minWidth: 100, maxWidth: 100 }]}>Entry Time</Text>
                                <Text style={[styles.headerText, { minWidth: 100, maxWidth: 100 }]}>Exit Time</Text>
                                <Text style={[styles.headerText, { minWidth: 250, maxWidth: 250 }]}>Destination</Text>
                            </View>
                            <FlatList
                                style={styles.flatList}
                                data={visitors}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={renderItem}
                            />
                        </View>
                    </ScrollView>
                }
                <View>
                    <Modal
                        animationType="fade"
                        visible={isModalVisible}
                        onRequestClose={() => setIsModalVisible(false)}
                        transparent
                    >
                        <View style={{
                            flex: 1,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <View
                                style={{
                                    borderRadius: 8,
                                    paddingVertical: 15,
                                    paddingHorizontal: 15,
                                    maxHeight: 350,
                                    backgroundColor: '#fff',
                                    elevation: 1,
                                    width: '92%',
                                    alignItems: 'center',
                                }}
                            >
                                <Image
                                    style={{ width: 260, height: 260, borderRadius: 4, }}
                                    source={{ uri: `data:image/jpeg;base64,${selectedImage}` }}
                                />
                                <Pressable onPress={() => { setIsModalVisible(false) }} style={{ marginVertical: 15, }}>
                                    <Image
                                        style={[{
                                            tintColor: Color.redishLook
                                            , width: 25, height: 25
                                        }]}
                                        source={require("../assets/multiply.png")}
                                    />
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
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
})

export default App;