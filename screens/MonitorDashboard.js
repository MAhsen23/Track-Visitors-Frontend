import * as React from "react";
import { Text, StyleSheet, Pressable, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { FontFamily } from "../GlobalStyles";

const App = () => {
    return (
        <View>
            <View style={{
                borderBottomColor: '#F1F1F1',
                borderBottomWidth: 1,
                // backgroundColor:'#F1F1F1'
            }}>
                <Text onPress={() => { console.warn("Logout") }} style={styles.logout}>Logout</Text>
            </View>
            <View>
                <View style={styles.welcomeContainer}>
                    <Text style={{ fontFamily: FontFamily.poppinsRegular, fontSize: 21, color: '#0081A7' }}>
                        Welcome, <Text style={{ fontWeight: "500", fontFamily: FontFamily.poppinsMedium, }}>User</Text>
                    </Text>
                    <Text style={{ fontFamily: FontFamily.poppinsRegular, fontSize: 14, color: '#0081A7' }}>Monitor</Text>
                </View>
                <View style={styles.alertContainer}>
                    <Text style={{ fontWeight: "500", fontSize: 17, fontFamily: FontFamily.poppinsMedium, color: 'white', textAlign: 'center' }}>Destination: Datacell</Text>
                    <Text style={styles.alertTextColor}>Visitor deviated form path</Text>
                    <Text style={styles.alertTextColor}>Visitor Name : Ali Khan</Text>
                    <Text style={styles.alertTextColor}>Contact: +92 330 123547</Text>
                    <Text style={styles.alertTextColor}>Current Location: Admin</Text>
                </View>
                <View style={styles.alertContainer}>
                    <Text style={{ fontWeight: "500", fontSize: 17, fontFamily: FontFamily.poppinsMedium, color: 'white', textAlign: 'center' }}>Destination: LT-11</Text>
                    <Text style={styles.alertTextColor}>Visitor deviated form path</Text>
                    <Text style={styles.alertTextColor}>Visitor Name : Ali Khan</Text>
                    <Text style={styles.alertTextColor}>Contact: +92 330 123547</Text>
                    <Text style={styles.alertTextColor}>Current Location: Admin</Text>
                </View>
            </View>
        </View>
    );
}


styles = StyleSheet.create({
    buttons: {
        width: '40%',
        height: 150,
        backgroundColor: "#8CD6FA",
        borderRadius: 8,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 30,
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
        marginTop: 10,
        marginLeft: 30,
        marginBottom: 22,
    },
    alertContainer: {
        marginTop: 20,
        backgroundColor: '#FF736E',
        marginLeft: 30,
        marginRight: 30,
        borderRadius: 10,
        padding: 12,
    },
    alertTextColor: {
        color: 'white',
    }
})

export default App;