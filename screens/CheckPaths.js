import * as React from "react";
import { Text, Alert, StyleSheet, View, Image, Pressable, ScrollView } from "react-native";
import { FontFamily, Color } from "../GlobalStyles";
import CustomDropdown from "../components/multi_value_picker";
import url from "../ApiUrl";
import SingleValueCusDropdown from "../components/one_value_picker";

const App = (props) => {

    const [locations, setLocations] = React.useState([]);
    const [source, setSource] = React.useState('');
    const [destinations, setDestinations] = React.useState([]);
    const [error, setError] = React.useState('');

    const [paths, setPaths] = React.useState([]);

    React.useEffect(() => {
        fetchLocations();
    }, [])

    React.useEffect(() => {
        if (!source || destinations.length === 0) {
            return
        }
        fetchPaths();
    }, [source, destinations])

    const showError = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 5000);
    };

    const fetchLocations = async () => {
        try {
            const response = await fetch(`${url}GetAllLocations`);
            if (response.ok) {
                const data = await response.json();
                setLocations(data);
                setError('');
            } else {
                throw new Error('Failed to fetch locations.');
            }
        } catch (error) {
            showError('An error occurred while fetching locations.');
            console.error('Error occurred during API request:', error);
        }
    };


    const fetchPaths = async () => {
        try {
            const response = await fetch(`${url}GetLocationPaths`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    source: source,
                    destinations: destinations,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                setPaths(data);
                setError('');
            } else {
                throw new Error('Failed to fetch paths.');
            }
        } catch (error) {
            showError('An error occurred while fetching paths.');
            console.error('Error occurred during API request:', error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ alignItems: 'center', backgroundColor: Color.white, elevation: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, height: 65, marginBottom: 5, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: "space-between" }}>
                <Pressable onPress={() => { props.navigation.goBack() }}>
                    <Image style={{ tintColor: Color.lightsteelblue, width: 32, height: 32, }} source={require('../assets/back.png')} />
                </Pressable>
                <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 19.5, letterSpacing: .4, color: Color.lightsteelblue }}>PATHS</Text>
                <Image style={{ tintColor: Color.white, width: 30, height: 30, }} source={require('../assets/menu.png')} />
            </View >

            <View style={styles.container}>
                {error !== '' && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}
                <View style={styles.formContainer}>
                    <Text style={[styles.label]}>Source</Text>
                    <SingleValueCusDropdown
                        options={locations}
                        selectedValue={source}
                        onValueSelect={setSource}
                        labelKey="name"
                        valueKey="id"
                        placeholder="Select Source"
                        height={350}
                        width='92%'
                    />
                    <Text style={[styles.label, { marginTop: 10, }]}>Destinations</Text>
                    <CustomDropdown
                        options={locations.filter(item => item.type !== 'Gate')}
                        selectedValues={destinations}
                        onValuesSelect={setDestinations}
                        labelKey="name"
                        valueKey="id"
                        placeholder="Select Destinations"
                        height={350}
                        width='92%'
                    />
                    {paths.length !== 0 &&
                        <Text style={{ alignSelf: "center", marginTop: 15, fontFamily: FontFamily.poppinsRegular, fontSize: 16, letterSpacing: 0.7, }}>Possible Paths</Text>
                    }
                </View>
                <View style={{ paddingHorizontal: 20, flex: 1, }}>
                    <ScrollView style={{ backgroundColor: 'white' }} showsVerticalScrollIndicator={false}>
                        {paths.map((path, index) => (
                            <View key={index} style={styles.pathContainer}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={styles.pathTitle}>Path {index + 1}</Text>
                                </View>
                                <View style={styles.path}>
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
                                </View>
                            </View>
                        ))}
                    </ScrollView >
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    formContainer: {
        paddingHorizontal: 20,
        paddingVertical: 30,
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

    label: {
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 15,
        marginBottom: 5,
    },

    button: {
        backgroundColor: Color.deepskyblue,
        height: 45,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15,
    },
    buttonText: {
        color: 'white',
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 15,
    },


    pathContainer: {
        backgroundColor: '#fff',
        padding: 7,
        borderRadius: 8,
        marginBottom: 12,
        elevation: 1,
        marginHorizontal: 3,
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
})

export default App;