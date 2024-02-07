import * as React from "react";
import { Text, BackHandler, StatusBar, StyleSheet, View, Image, TouchableOpacity, ScrollView, Pressable } from "react-native";
import { Color, FontFamily } from "../GlobalStyles";
import url from '../ApiUrl';


const App = (props) => {
    const { name, id } = props.route?.params;

    React.useEffect(() => {
        const backAction = () => {
            return true;
        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, []);

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
                        <Text style={{ fontFamily: FontFamily.poppinsRegular, fontSize: 15, color: Color.white }}>Director</Text>
                    </View>
                    <Pressable onPress={() => props.navigation.navigate('Login')}>
                        <Image
                            source={require("../assets/Logout.png")}
                            style={{ tintColor: '#fff', width: 30, height: 30 }}
                        />
                    </Pressable>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={styles.buttonContainer}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 }}>
                            <TouchableOpacity style={styles.buttons} onPress={() => props.navigation.navigate('TodayVisitors', { id })}>
                                <View style={{ position: 'relative' }}>
                                    <Image
                                        style={styles.icons}
                                        resizeMode="cover"
                                        source={require("../assets/daily.png")}
                                    />
                                </View>
                                <Text style={styles.buttonsText}>Today's Visitors</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { props.navigation.navigate('WeeklyVisitors') }} style={styles.buttonsRight}>
                                <Image
                                    style={styles.icons}
                                    resizeMode="cover"
                                    source={require("../assets/calendar_7.png")}
                                />
                                <Text style={styles.buttonsText}>Weekly Visitors</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 }}>
                            <TouchableOpacity style={styles.buttons} onPress={() => props.navigation.navigate('SearchTodayVisitors')}>
                                <View style={{ position: 'relative' }}>
                                    <Image
                                        style={[styles.icons, { tintColor: '#fff' }]}
                                        resizeMode="cover"
                                        source={require("../assets/search2.png")}
                                    />
                                </View>
                                <Text style={styles.buttonsText}>Search Visitors</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonsRight} onPress={() => props.navigation.navigate('BlockedVisitors')}>
                                <Image
                                    style={styles.icons}
                                    resizeMode="cover"
                                    source={require("../assets/unavailable.png")}
                                />
                                <Text style={styles.buttonsText}>Blocked Visitors</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView >
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
})

export default App;