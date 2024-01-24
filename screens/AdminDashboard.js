import * as React from "react";
import { Text, BackHandler, StatusBar, StyleSheet, View, Image, Pressable, ScrollView } from "react-native";
import { FontFamily, Color } from "../GlobalStyles";


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
                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={styles.buttonContainer}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 }}>
                            <Pressable onPress={() => props.navigation.navigate('Users')} style={styles.buttons}>
                                <Image
                                    style={styles.icons}
                                    resizeMode="cover"
                                    source={require("../assets/userIcon.png")}
                                />
                                <Text style={styles.buttonsText}>Users</Text>
                            </Pressable>
                            <Pressable onPress={() => props.navigation.navigate('Floors')} style={styles.buttonsRight}>
                                <Image
                                    style={styles.icons}
                                    resizeMode="cover"
                                    source={require("../assets/floor.png")}
                                />
                                <Text style={styles.buttonsText}>Floors</Text>
                            </Pressable>
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 }}>
                            <Pressable onPress={() => props.navigation.navigate('Locations')} style={styles.buttons}>
                                <Image
                                    style={styles.icons}
                                    resizeMode="cover"
                                    source={require("../assets/locationicon.png")}
                                />
                                <Text style={styles.buttonsText}>Locations</Text>
                            </Pressable>

                            <Pressable onPress={() => props.navigation.navigate('Cameras')} style={styles.buttonsRight}>
                                <Image
                                    style={styles.icons}
                                    resizeMode="cover"
                                    source={require("../assets/cameraicon.png")}
                                />
                                <Text style={styles.buttonsText}>Cameras</Text>
                            </Pressable>
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 }}>
                            <Pressable onPress={() => props.navigation.navigate('AdjacencyMatrix')} style={styles.buttons}>
                                <Image
                                    style={styles.icons}
                                    resizeMode="cover"
                                    source={require("../assets/connect.png")}
                                />
                                <Text style={styles.buttonsText}>Camera links</Text>
                            </Pressable>
                            <Pressable style={styles.buttonsRight} onPress={() => props.navigation.navigate('BlockVisitors', { id })}>
                                <Image
                                    style={styles.icons}
                                    resizeMode="cover"
                                    source={require("../assets/unavailable.png")}
                                />
                                <Text style={styles.buttonsText}>Block Visitors</Text>
                            </Pressable>

                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 }}>
                            <Pressable onPress={() => { props.navigation.navigate('Report') }} style={styles.buttons}>
                                <Image
                                    style={styles.icons}
                                    resizeMode="cover"
                                    source={require("../assets/reporticon.png")}
                                />
                                <Text style={styles.buttonsText}>Report</Text>
                            </Pressable>
                            {/* <Pressable style={styles.buttonsRight} onPress={() => props.navigation.navigate('ProcessVideo')}>
                                <Image
                                    style={styles.icons}
                                    resizeMode="cover"
                                    source={require("../assets/spam.png")}
                                />
                                <Text style={styles.buttonsText}>Process Video</Text>
                            </Pressable> */}

                            <Pressable onPress={() => props.navigation.navigate('CurrentVisitors')} style={styles.buttonsRight}>
                                <Image
                                    style={styles.icons}
                                    resizeMode="cover"
                                    source={require("../assets/listicon.png")}
                                />
                                <Text style={styles.buttonsText}>Current Visitors</Text>
                            </Pressable>
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 }}>
                            <Pressable style={styles.buttons} onPress={() => props.navigation.navigate('GuardsLocation')}>
                                <Image
                                    style={styles.icons}
                                    resizeMode="cover"
                                    source={require("../assets/assign.png")}
                                />
                                <Text style={styles.buttonsText}>Guards Location</Text>
                            </Pressable>
                            <Pressable onPress={() => props.navigation.navigate('CheckPaths')} style={styles.buttonsRight}>
                                <Image
                                    style={styles.icons}
                                    resizeMode="cover"
                                    source={require("../assets/path_64px.png")}
                                />
                                <Text style={styles.buttonsText}>Paths</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView >
            </View>
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
})

export default App;