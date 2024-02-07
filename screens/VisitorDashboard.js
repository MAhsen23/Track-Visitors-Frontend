import React, { useState, useEffect } from "react";
import { Text, BackHandler, StatusBar, FlatList, StyleSheet, View, Image, TouchableOpacity, ScrollView, Pressable } from "react-native";
import { Color, FontFamily } from "../GlobalStyles";
import url from '../ApiUrl';


const App = (props) => {
    const { id, name } = props.route?.params;

    useEffect(() => {
        fetchAlerts();

        const refreshInterval = setInterval(() => {
            fetchAlerts();
        }, 60000);

        return () => {
            clearInterval(refreshInterval);
        };
    }, []);

    const [alert, setAlert] = useState('');

    const fetchAlerts = async () => {
        try {
            const response = await fetch(`${url}GetVisitorAlerts?id=${id}`);
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setAlert(data);
            } else {
                throw new Error('Failed to fetch visitor alerts.');
            }
        } catch (error) {
            showError('An error occurred while fetching visitor alerts.');
            console.error('Error occurred during API request:', error);
        }
    };


    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor={Color.lightsteelblue}
                barStyle="light-content"
            />
            <View style={{ flex: 1 }}>
                <View style={{ backgroundColor: Color.lightsteelblue, elevation: 2, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, paddingTop: 30, paddingBottom: 22, marginBottom: 20, paddingLeft: 30, paddingRight: 30, flexDirection: 'row', justifyContent: "space-between" }}>
                    <View style={[styles.welcomeContainer]}>
                        <Text style={{ fontFamily: FontFamily.poppinsRegular, fontSize: 20, color: Color.white }}>
                            Welcome, <Text style={{ fontFamily: FontFamily.poppinsMedium, }}>{name}</Text>
                        </Text>
                        <Text style={{ fontFamily: FontFamily.poppinsRegular, fontSize: 16, color: Color.white }}>Visitor</Text>
                    </View>
                    <Pressable onPress={() => props.navigation.navigate('Login')}>
                        <Image
                            source={require("../assets/Logout.png")}
                            style={{ tintColor: '#fff', width: 30, height: 30 }}
                        />
                    </Pressable>
                </View>
                <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, }}>
                    {alert.id ? (
                        <Text style={styles.heading}>Destination: <Text>{alert.destinations}</Text></Text>
                    ) : (<Text></Text>)}
                    <Pressable onPress={fetchAlerts}>
                        <Text>Refresh</Text>
                    </Pressable>
                    <View style={{ marginTop: 20, }}>
                        {alert.id ? (

                            <View style={[
                                styles.alertItem,
                                alert.type === 'warning' ? { backgroundColor: '#FFA172' } : { backgroundColor: '#ffcccc' }
                            ]}>
                                <View style={styles.row}>
                                    <Text style={styles.heading}>{alert.time}</Text>
                                </View>
                                {alert.type !== "warning" ? (
                                    <Text style={[styles.detail, { marginTop: 12, fontSize: 16.5, }]}>YOU ARE ON WRONG PATH.</Text>
                                ) : (
                                    <Text style={[styles.detail, { marginTop: 12, fontSize: 16.5, }]}>PLEASE MOVE TOWARDS YOUR PATH.</Text>
                                )
                                }<View style={[styles.info, { marginTop: 10, }]}>
                                    {/* <Text style={styles.heading}>Current Location  <Text style={styles.detail}>{alert.current_location}</Text></Text> */}
                                    {/* <Text style={[styles.heading, { marginTop: 3, }]}>Move towards  <Text style={styles.detail}>{alert.next_moves ? ((alert.next_moves).join(', ')) : null}</Text></Text> */}
                                </View>
                            </View>
                        ) : (<Text style={styles.heading}>No alerts</Text>
                        )}
                    </View>
                </View>
            </View >
        </View >
    );
}


styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        paddingBottom: 20,
    },
    buttons: {
        width: '40%',
        height: 150,
        backgroundColor: "#8CD6FA",
        borderRadius: 8,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 30,
        elevation: 2,
    },
    buttonsRight: {
        width: '40%',
        height: 150,
        backgroundColor: "#8CD6FA",
        borderRadius: 8,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 30,
        elevation: 2,
    },
    buttonsText: {
        color: '#ffffff',
        fontSize: 19,
        fontWeight: "500",
        fontFamily: FontFamily.poppinsMedium,
        textAlign: "center"
    },
    logout: {
        color: '#0081A7',
        textAlign: 'right',
        marginTop: 20,
        marginBottom: 10,
        marginRight: 30,
        fontSize: 16,
        fontFamily: FontFamily.poppinsMedium,
        fontWeight: "500",
    },
    icons: {
        width: 50,
        height: 50,
        marginBottom: 10,
    },
    welcomeContainer: {
        marginBottom: 15,
    },
    notificationBadge: {
        position: 'absolute',
        top: -5,
        right: 2,
        backgroundColor: Color.redishLook,
        borderRadius: 50,
        width: 21,
        height: 21,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 1,
    },
    notificationBadgeText: {
        color: '#fff',
        fontSize: 13,
        fontFamily: FontFamily.poppinsSemibold,
    },

    alertItem: {
        paddingVertical: 15,
        paddingHorizontal: 12,
        borderRadius: 8,
        elevation: 2,
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: "space-between",
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
    },
    heading: {
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 16,
    },
    detail: {
        fontSize: 15,
        fontFamily: FontFamily.poppinsMedium,
    }
})

export default App;