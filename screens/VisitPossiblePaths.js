import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { Color, FontFamily } from '../GlobalStyles';

const App = (props) => {

    const { possiblePaths, entryTime, paths, source, selectedVisitorId, sourceName, selectedDestinationsNames } = props.route?.params;

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ alignItems: 'center', backgroundColor: Color.white, elevation: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, height: 65, marginBottom: 5, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: "space-between" }}>
                <Pressable onPress={() => { props.navigation.goBack() }}>
                    <Image style={{ tintColor: Color.lightsteelblue, width: 32, height: 32, }} source={require('../assets/back.png')} />
                </Pressable>
                <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 19.5, letterSpacing: .4, color: Color.lightsteelblue }}>DESTINATION PATHS</Text>
                <Image style={{ tintColor: Color.white, width: 30, height: 30, }} source={require('../assets/menu.png')} />
            </View >
            <ScrollView style={{ backgroundColor: 'white' }} showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 20, }}>
                        <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 15, }}>{sourceName} <Text>to</Text> {selectedDestinationsNames.join(', ')}</Text>
                        <Pressable onPress={() => { props.navigation.navigate('ShowPaths', { entryTime, paths, source, selectedVisitorId }) }} style={{ width: 40, height: 40, backgroundColor: Color.deepskyblue, borderRadius: 5, }}>
                        </Pressable>
                    </View>

                    {possiblePaths.map((path, index) => (
                        <View key={index} style={styles.pathContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.pathTitle}>Path {index + 1}</Text>
                            </View>
                            <View style={styles.path}>
                                {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}> */}
                                {path.map((step, stepIndex) => (
                                    <View style={{ flexDirection: 'row' }} key={stepIndex}>
                                        <Text style={{
                                            marginRight: 6, borderRadius: 4,
                                            marginVertical: 10, color: Color.darkgrey,
                                            fontFamily: FontFamily.poppinsRegular,
                                            fontSize: 14,
                                            alignItems: 'center',
                                            textAlign: 'center',
                                        }}>{step}</Text>
                                        {stepIndex < path.length - 1 && (
                                            <Image source={require('../assets/right.png')} style={styles.arrowImage} />
                                        )}
                                    </View>
                                ))}
                                {/* </ScrollView> */}
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView >
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    pathContainer: {
        backgroundColor: '#fff',
        padding: 7,
        borderRadius: 8,
        marginBottom: 12,
        elevation: 3,
    },
    pathTitle: {
        fontSize: 16,
        fontFamily: FontFamily.poppinsRegular,
        marginBottom: 3,
    },
    path: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 5,
    },
    arrowImage: {
        width: 20,
        height: 20,
        marginRight: 6,
        tintColor: Color.deepskyblue,
        alignSelf: 'center',
        marginVertical: 10,
    },
});

export default App;