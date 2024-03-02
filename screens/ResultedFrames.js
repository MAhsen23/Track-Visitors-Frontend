import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Modal, FlatList, Text, StyleSheet, Pressable, Button } from 'react-native';
import { FontFamily } from '../GlobalStyles';

const ResultedFrames = (props) => {
    const [imageList, setImageList] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const fetchImages = async () => {
        try {
            const timestamp = new Date().getTime();
            const response = await fetch(`${global.url}image_list?timestamp=${timestamp}`);
            const data = await response.json();
            setImageList(data.images);
        } catch (error) {
            console.error('Error fetching image list:', error);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const renderImageItem = ({ item }) => (
        <TouchableOpacity onPress={() => setSelectedImage(item)}>
            <View style={{ paddingVertical: 8, paddingHorizontal: 20, }}>
                <Image
                    style={{ width: "100%", height: 235, borderRadius: 5, }}
                    source={{ uri: `${global.url}images/${item}?timestamp=${new Date().getTime()}` }}
                />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Pressable style={styles.button} onPress={() => props.navigation.navigate('ResultedVideo')}>
                <Text style={styles.buttonText}>Show video result</Text>
            </Pressable>

            <FlatList
                data={imageList}
                renderItem={renderImageItem}
                keyExtractor={(item) => item}
                numColumns={1}
            />

            <Modal visible={!!selectedImage} transparent={true} onRequestClose={() => setSelectedImage(null)}>
                <View style={styles.modalContainer}>
                    <Button title='Close' onPress={() => { setSelectedImage(null) }} />
                    {selectedImage && (
                        <Image
                            source={{ uri: `${global.url}images/${selectedImage}?timestamp=${new Date().getTime()}` }}
                            style={styles.fullImage}
                            resizeMode="contain"
                        />
                    )}
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 20,
    },
    modalContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
    },
    fullImage: {
        alignSelf: 'center',
        width: '100%',
        height: '100%',
    },
    button: {
        backgroundColor: '#8CD6FA',
        height: 40,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 15,
    },
});

export default ResultedFrames;
