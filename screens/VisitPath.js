import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Image } from 'react-native';
import { FontFamily, Color } from "../GlobalStyles";
import url from '../ApiUrl';

const App = (props) => {

    const { selectedVisitorId, visitorName } = props.route?.params;


    const [visitPathHistory, setVisitPathHistory] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchVisitPathHistory();
        const refreshInterval = setInterval(() => {
            fetchVisitPathHistory();
        }, 10000);

        return () => {
            clearInterval(refreshInterval);
        };
    }, [selectedVisitorId])


    const fetchVisitPathHistory = async () => {
        try {

            const response = await fetch(`${url}GetVisitPathHistory`, {
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
                const data = await response.json();
                setVisitPathHistory(data);
            } else {
                throw new Error('Failed to fetch visit path history.');
            }
        } catch (error) {
            setError('An error occurred while fetching visit path history.');
            console.error(error);
        }

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
                <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 19.5, letterSpacing: .4, color: Color.lightsteelblue }}>VISIT PATH HISTORY</Text>
                <Image style={{ tintColor: Color.white, width: 30, height: 30, }} source={require('../assets/menu.png')} />
            </View >
            <View style={styles.container}>
                <View >
                    <Text style={styles.name}>{visitorName}</Text>
                </View>
                <ScrollView style={{ backgroundColor: '#fff' }} horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.pathContainer}>
                        {visitPathHistory.map((item, index) => {
                            const locations = item.locations.split(',')[0]
                            const timeParts = item.time.split(':');
                            const hours = parseInt(timeParts[0], 10);
                            const minutes = parseInt(timeParts[1], 10);
                            const cam_visit_time = formatTime(hours, minutes);
                            return (
                                <View key={index} style={styles.cameraItemContainer}>
                                    <View style={styles.cameraItem}>
                                        <Text style={styles.cameraName}>{`${item.camera_name}`}</Text>
                                        <Text style={styles.locations}>{`${locations}`}</Text>
                                        <Text style={styles.floors}>{`${item.floor_name}`}</Text>
                                        <Text style={styles.visitTime}>{`${cam_visit_time}`}</Text>
                                    </View>
                                    {index < visitPathHistory.length - 1 && (
                                        <Image source={require('../assets/arrow_left.png')} style={styles.arrow} />
                                    )}
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 30,
        backgroundColor: "#fff",
    },
    pathContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        paddingVertical: 30,
        backgroundColor: "#fff",
    },
    cameraItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cameraItem: {
        backgroundColor: '#fff',
        elevation: 2,
        borderRadius: 5,
        padding: 16,
        marginRight: 10,
        marginLeft: 1,
        width: 130,
    },
    cameraName: {
        fontSize: 17,
        marginBottom: 8,
        fontFamily: FontFamily.poppinsMedium,
    },
    locations: {
        fontSize: 15,
        marginBottom: 8,
        fontFamily: FontFamily.poppinsRegular,
    },
    visitTime: {
        fontSize: 14,
        fontFamily: FontFamily.poppinsRegular,
    },
    arrow: {
        resizeMode: 'contain',
        width: 40,
        height: 40,
        marginRight: 10,
    },
    floors: {
        fontSize: 15,
        marginBottom: 8,
        fontFamily: FontFamily.poppinsRegular,
    },
    name: {
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 17,
    }
});

export default App;
