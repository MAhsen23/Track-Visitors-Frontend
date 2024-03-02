import React from "react";
import { Text, BackHandler, StatusBar, StyleSheet, View, Image, Pressable, ScrollView } from "react-native";
import { FontFamily, Color } from "../GlobalStyles";


const CustomButton = ({ onPress, iconSource, text }) => {
    return (
        <Pressable onPress={onPress} style={styles.button}>
            <Image
                style={styles.icon}
                resizeMode="cover"
                source={iconSource}
            />
            <Text style={styles.buttonText}>{text}</Text>
        </Pressable>
    );
};

const App = (props) => {
    const { name, id } = props.route.params;

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
                        <Text style={{ fontFamily: FontFamily.poppinsRegular, fontSize: 22, color: Color.white }}>
                            Welcome, <Text style={{ fontFamily: FontFamily.poppinsMedium, }}>{name}</Text>
                        </Text>
                        <Text style={{ fontFamily: FontFamily.poppinsRegular, fontSize: 16, color: Color.white }}>Admin</Text>
                    </View>
                    <Pressable onPress={() => props.navigation.navigate('AdminSettings', { id })}>
                        <Image
                            source={require("../assets/settings.png")}
                            style={{ tintColor: '#fff', width: 30, height: 30 }}
                        />
                    </Pressable>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                    <View style={styles.buttonContainer}>
                        <CustomButton onPress={() => props.navigation.navigate('Users')} iconSource={require("../assets/userIcon.png")} text="Users" />
                        <CustomButton onPress={() => props.navigation.navigate('Floors')} iconSource={require("../assets/floor.png")} text="Floors" />
                        <CustomButton onPress={() => props.navigation.navigate('Locations')} iconSource={require("../assets/locationicon.png")} text="Locations" />
                        <CustomButton onPress={() => props.navigation.navigate('Cameras')} iconSource={require("../assets/cameraicon.png")} text="Cameras" />
                        <CustomButton onPress={() => props.navigation.navigate('AdjacencyMatrix')} iconSource={require("../assets/connect.png")} text="Camera Links" />
                        <CustomButton onPress={() => props.navigation.navigate('BlockVisitors', { id })} iconSource={require("../assets/unavailable.png")} text="Block Visitors" />
                        <CustomButton onPress={() => { props.navigation.navigate('Report') }} iconSource={require("../assets/reporticon.png")} text="Report" />
                        <CustomButton onPress={() => props.navigation.navigate('CurrentVisitors')} iconSource={require("../assets/listicon.png")} text="Current Visitors" />
                        <CustomButton onPress={() => props.navigation.navigate('GuardsLocation')} iconSource={require("../assets/assign.png")} text="Guards Location" />
                        <CustomButton onPress={() => props.navigation.navigate('CheckPaths')} iconSource={require("../assets/path_64px.png")} text="Paths" />
                        <CustomButton onPress={() => props.navigation.navigate('RestrictLocation')} iconSource={require("../assets/location_off.png")} text="Restrict Location" />
                        <CustomButton onPress={() => props.navigation.navigate('SearchVisitor')} iconSource={require("../assets/search2.png")} text="Search Visitor" />
                    </View>
                </ScrollView >
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    button: {
        width: '45%',
        height: 115,
        elevation: 2,
        backgroundColor: '#fcfcfc',
        marginHorizontal: 5,
        marginVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 14,
    },
    icon: {
        width: 40,
        height: 40,
        marginBottom: 10,
        tintColor: '#757575',
        opacity: 0.8,
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
});

export default App;
