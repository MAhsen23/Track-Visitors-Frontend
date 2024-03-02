import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Pressable,

    Alert,
    StatusBar,
} from "react-native";
import { Color, FontFamily, FontSize } from "../GlobalStyles";
import ImagePicker from 'react-native-image-crop-picker';




const AddVisitor = (props) => {
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [images, setImages] = useState([]);
    const [innerView, setInnerView] = useState(false);

    const handleSubmit = async () => {
        try {
            if (!name || !contact) {
                Alert.alert('Error', 'Please fill in all fields.');
                return;
            }
            else {
                if (images.length <= 0) {
                    Alert.alert('Error', 'Please select images of the visitor.');
                    return;
                }
                else {
                    const formData = new FormData();
                    formData.append('name', name);
                    formData.append('contact', contact);
                    formData.append('count', images.length);


                    images.forEach((image, index) => {
                        formData.append(`image${index + 1}`, {
                            uri: image.path,
                            type: image.mime, // Make sure 'mime' is available in the image object
                            name: `img${index + 1}.${image.path.split('.').pop()}`,
                        });
                    });

                    const response = await fetch(`${global.url}AddVisitor`, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        method: 'POST',
                        body: formData,
                    });

                    if (response.ok) {
                        Alert.alert('Success', 'Visitor details added successfully.');
                        setName('');
                        setContact('');
                        setImages([]);
                    } else {
                        throw new Error('Failed to add visitor details.');
                    }
                }
            }
        } catch (error) {
            //setError('An error occured while adding visitor details.');
            Alert.alert('Error', 'An error occured while adding visitor details.');
            console.error(error);
        }
    };

    const onSearch = (txt) => {
        if (txt !== '') {
            let tempData = locations.filter((item) => {
                return item.toLowerCase().indexOf(txt.toLowerCase()) > -1;
            });
            setData(tempData);
        } else {
            setData(locations);
        }
    };

    const handleTakePicture = () => {
        setInnerView(true);
    };

    const handleCancel = () => {
        setInnerView(false);
    };



    const handleTakePhotos = async () => {
        try {
            const images = [];
            for (let i = 0; i < 5; i++) {
                const image = await ImagePicker.openCamera({
                    mediaType: 'photo',
                });
                images.push(image);
            }
            setImages(images);
            console.log('Captured images:', images);
            setInnerView(false);
        } catch (error) {
            console.log('Error capturing images:', error);
        }
    };

    // const handleChooseFromLibrary = () => {
    //     ImagePicker.openPicker({
    //         multiple: true,
    //         mediaType: 'photo',

    //     }).then(images => {
    //         setImages(images);
    //     });
    // };


    const handleChooseFromLibrary = () => {
        ImagePicker.openPicker({
            multiple: true,
            mediaType: 'photo',
        }).then(async selectedImages => {
            const totalImages = selectedImages.length + images.length;
            if (totalImages <= 5) {

                const result = [];

                for await (const image of selectedImages) {
                    const img = await ImagePicker.openCropper({
                        mediaType: "photo",
                        path: image.path,
                        width: 1000,
                        height: 1000,
                    });
                    result.push(img);
                }
                setImages(prevImages => [...prevImages, ...result]);
                setInnerView(false);
            } else {
                alert('You can select up to 5 images.');
            }
        });
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ alignItems: 'center', backgroundColor: Color.white, elevation: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, height: 65, marginBottom: 5, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: "space-between" }}>
                <Pressable onPress={() => { props.navigation.goBack() }}>
                    <Image style={{ tintColor: Color.lightsteelblue, width: 32, height: 32, }} source={require('../assets/back.png')} />
                </Pressable>
                <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 19.5, letterSpacing: .4, color: Color.lightsteelblue }}>REGISTER NEW VISITOR</Text>
                <Image style={{ tintColor: Color.white, width: 30, height: 30, }} source={require('../assets/menu.png')} />
            </View >
            <ScrollView style={{ backgroundColor: '#fff' }}>
                <View style={innerView ? styles.blurContainer : styles.container}>
                    <Pressable style={styles.circleButton} onPress={handleTakePicture}>
                        <Image style={{ marginBottom: 10, width: 40, height: 40, tintColor: Color.steelblue }} source={require('../assets/upload4.png')} />
                        <Text style={styles.buttonText}>Upload Pictures</Text>
                    </Pressable>

                    <View style={styles.pictureContainer}>
                        {images.map((picture, index) => (
                            <View key={index} style={{ width: 60, height: 60, backgroundColor: '#fcfcfc', margin: 5, borderRadius: 100, justifyContent: "center", alignItems: "center", elevation: 2, }}>
                                <Image
                                    key={index}
                                    source={{ uri: picture.path }}
                                    style={styles.takenPicture}
                                />
                            </View>
                        ))}
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputField}>
                            <Text style={styles.labelText}>Visitor Name</Text>
                            <TextInput style={styles.textInput} value={name} onChangeText={name => setName(name)} />
                        </View>
                        <View style={styles.inputField}>
                            <Text style={styles.labelText}>Contact Information</Text>
                            <TextInput
                                style={styles.textInput}
                                value={contact}
                                onChangeText={contact => setContact(contact)}
                            />
                        </View>
                    </View>

                    <Pressable style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.submitbuttonText}>Add Visitor</Text>
                    </Pressable>
                </View>
            </ScrollView>
            {
                innerView && (
                    <View style={styles.innerView}>
                        <View style={styles.innerViewContent}>
                            <View style={{ backgroundColor: '#F87B8F', width: 40, height: 7, borderRadius: 20, alignSelf: "center", marginVertical: 5, justifyContent: "center" }}>
                                <View style={{ backgroundColor: 'white', width: 4, height: 4, borderRadius: 100, marginLeft: 2 }}></View>
                            </View>
                            <Text style={styles.innerViewTitle}>Visitor Pictures</Text>
                            <TouchableOpacity
                                style={styles.innerViewButton}
                                onPress={handleTakePhotos}
                            >
                                <Text style={styles.innerViewButtonText}>Take Photos</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.innerViewButton}
                                onPress={handleChooseFromLibrary}
                            >
                                <Text style={styles.innerViewButtonText}>Choose From Library</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.innerViewButton}
                                onPress={handleCancel}
                            >
                                <Text style={styles.innerViewButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 30,
    },
    circleButton: {
        alignSelf: "center",
        marginTop: 70,
        backgroundColor: '#fff',
        width: 170,
        height: 170,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        elevation: 2,
    },
    buttonText: {
        color: Color.steelblue,
        fontSize: 14,
        letterSpacing: 0.6,
        textAlign: "center",
        fontFamily: FontFamily.poppinsRegular
    },
    inputContainer: {
        marginTop: 30,
    },
    labelText: {
        fontSize: 15,
        fontFamily: FontFamily.poppinsRegular,
        color: Color.steelblue,
        letterSpacing: 0.3,
    },
    textInput: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 14,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 1,
        flexDirection: 'row',
        color: 'grey',
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 14,
    },
    inputField: {
        marginBottom: 35,
    },
    button: {
        width: '100%',
        backgroundColor: Color.deepskyblue,
        height: 52,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    submitbuttonText: {
        fontSize: FontSize.size_base,
        fontWeight: "600",
        fontFamily: FontFamily.poppinsSemibold,
        color: Color.white
    },
    icon: {
        width: 16,
        height: 16,
    },
    pictureContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 25,
        marginBottom: 10,
    },
    takenPicture: {
        width: 50,
        height: 50,
        borderRadius: 100,
    },




    innerView: {
        position: 'absolute',
        bottom: 0,
        left: 2,
        right: 2,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 10,
        paddingVertical: 10,
    },
    innerViewContent: {
        paddingHorizontal: 30,
    },
    innerViewTitle: {
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 16,
        textAlign: 'center',
        paddingBottom: 25,
        paddingTop: 15,
        letterSpacing: 0.4,

    },
    innerViewButton: {
        borderRadius: 30,
        backgroundColor: Color.redishLook,
        elevation: 1,
        marginBottom: 14,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    innerViewButtonText: {
        fontFamily: FontFamily.poppinsSemibold,
        fontSize: 14,
        color: '#fff',
    },
    blurContainer: {
        flex: 1,
        backgroundColor: "#fff",
        opacity: 0.1,
        padding: 30,
        pointerEvents: "none",
    },
});

export default AddVisitor;
