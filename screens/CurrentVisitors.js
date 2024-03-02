import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import { FontFamily, Color } from "../GlobalStyles";
import axios from 'axios';

const App = (props) => {
    const [visitors, setVisitors] = useState([]);
    const [error, setError] = useState('');
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchCurrentVisitors();
        }, 20000);

        const timeInterval = setInterval(() => {
            setCurrentTime(getCurrentTime());
        }, 60000);

        getCurrentTime();
        fetchCurrentVisitors();

        return () => {
            clearInterval(intervalId);
            clearInterval(timeInterval);
        };
    }, []);

    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const currentTimeString = `${formattedHours}:${formattedMinutes} ${period}`;
        setCurrentTime(currentTimeString);
        return currentTimeString;
    };

    const fetchCurrentVisitors = async () => {
        try {
            const response = await axios.get(`${global.url}GetCurrentVisitors`, {
                timeout: 10000,
            });
            const data = await response.data;
            console.log(data)
            setVisitors(data);
            setError('');
        } catch (error) {
            console.error('Error occurred during API request:', error);
        }
    };

    const formatTime = (hours, minutes) => {
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}:${formattedMinutes} ${period}`;
    };

    const renderItem = ({ item, index }) => {

        const current_location = item.current_location.split(',')[0]

        const timeParts = item.entry_time.split(':');
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);
        const entry_time_formatted = formatTime(hours, minutes);

        return (
            <Pressable onPress={() => {
                props.navigation.navigate('VisitPath', { selectedVisitorId: item.id, visitorName: item.name });
            }}>
                <View style={styles.visitorBox}>
                    <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                        <View style={{ marginTop: 5 }}>
                            <Text style={styles.cell}>{item.name}</Text>
                            <Text style={styles.cell}>{entry_time_formatted}</Text>
                            <Text style={styles.cell}>{item.location_names}</Text>
                        </View>
                        <View style={{ width: 70, height: 70, backgroundColor: '#fff', elevation: 2, margin: 5, borderRadius: 100, justifyContent: "center" }}>
                            <Image
                                style={{ width: 65, height: 65, alignSelf: 'center', borderRadius: 100 }}
                                source={{ uri: `data:image/jpeg;base64,${item.image}` }}
                            />
                        </View>
                    </View>
                    <View style={{ marginTop: 20, paddingHorizontal: 5, flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={styles.headerText}>Current Location</Text>
                        <Text style={{ fontFamily: FontFamily.poppinsRegular, fontSize: 15.5, }}>{current_location}</Text>
                    </View>
                </View>
            </Pressable >
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ alignItems: 'center', backgroundColor: Color.white, elevation: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, height: 65, marginBottom: 5, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: "space-between" }}>
                <Pressable onPress={() => { props.navigation.goBack() }}>
                    <Image style={{ tintColor: Color.lightsteelblue, width: 32, height: 32, }} source={require('../assets/back.png')} />
                </Pressable>
                <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 19.5, letterSpacing: .4, color: Color.lightsteelblue }}>CURRENT VISITORS</Text>
                <Image style={{ tintColor: Color.white, width: 30, height: 30, }} source={require('../assets/menu.png')} />
            </View >
            <View style={styles.container}>
                <View style={styles.timeContainer}>
                    <Text style={styles.time}>{currentTime}</Text>
                </View>

                <View style={styles.visitorsContainer}>
                    {/* <View style={styles.header}>
                    <Text style={styles.headerText}>   Name</Text>
                    <Text style={styles.headerText}>Entry time</Text>
                    <Text style={styles.headerText}>Destination</Text>
                </View> */}

                    <FlatList style={styles.flatList} data={visitors} keyExtractor={(item, index) => index.toString()} renderItem={renderItem} />
                </View>
            </View>
        </View>
    );
};

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    timeContainer: {
        marginBottom: 20,
    },
    time: {
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 16,
        textAlign: "right",
        letterSpacing: 0.8,
    },
    visitorBox: {
        marginVertical: 8,
        marginHorizontal: 1,
        elevation: 1,
        borderRadius: 3,
        paddingVertical: 14,
        backgroundColor: "#fff",
        paddingHorizontal: 6,
    },
    visitorItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cell: {
        textAlign: 'left',
        flex: 1,
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 15,
        paddingHorizontal: 5,
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
        fontSize: 15.5,
        flex: 1,
    },
    flatList: {
        marginBottom: 35,
    },
})