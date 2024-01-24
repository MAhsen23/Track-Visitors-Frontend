import React, { useState } from 'react'
import { Text, View, FlatList, StyleSheet, Pressable, TextInput, ImageBackground, Image } from 'react-native'

import { FontFamily } from '../GlobalStyles';

export default function App(props) {

    const [showIcon, setShowIcon] = useState('')

    const backgrounds = [
        require('../assets/faisal_masjid.jpg'),
        require('../assets/road.jpg'),
        require('../assets/faisal_masjid.jpg'),
        require('../assets/road.jpg'),
        require('../assets/faisal_masjid.jpg'),
        require('../assets/road.jpg'),
        require('../assets/faisal_masjid.jpg'),
        require('../assets/road.jpg'),
        // Add more background images as needed
    ];

    const celebrities = [
        require('../assets/vk.jpg'),
        require('../assets/tp.jpg'),
        require('../assets/vk.jpg'),
        require('../assets/tp.jpg'),
        require('../assets/vk.jpg'),
        require('../assets/tp.jpg'),
    ];

    const [backgroundIndex, setBackgroundIndex] = useState(0);
    const [celebrityIndex, setCelebrityIndex] = useState(0);

    const renderBackgroundItem = ({ item, index }) => (
        <Pressable onLongPress={() => { setShowIcon(item) }} style={style.box}>
            <Image source={item} style={style.image} />
            {showIcon === item &&
                <Pressable onPress={() => { console.warn("delete") }} style={{ backgroundColor: '#fcfcfc', opacity: 0.8, position: 'absolute', borderRadius: 20, alignItems: 'center', justifyContent: 'center', width: 40, height: 40, }}>
                    <Image
                        source={require('../assets/delete1.png')}
                        style={{ height: 20, width: 20, tintColor: 'red', }}
                    />
                </Pressable>
            }
        </Pressable>
    );

    const renderCelebrityItem = ({ item, index }) => (
        <View style={style.box}>
            <Image source={item} style={style.image} />
        </View>
    );

    return (
        <View>
            <View style={style.container}>
                <View style={style.search}>
                    <Text style={{ color: '#7F7F7F', fontSize: 16, fontFamily: FontFamily.poppinsRegular }}>
                        Search
                    </Text>
                </View>

                <FlatList
                    data={backgrounds}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderBackgroundItem}
                    onMomentumScrollEnd={(event) => {
                        const newIndex = Math.round(event.nativeEvent.contentOffset.x / 150);
                        setBackgroundIndex(newIndex);
                    }}
                />

                <FlatList
                    data={celebrities}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderCelebrityItem}
                    onMomentumScrollEnd={(event) => {
                        const newIndex = Math.round(event.nativeEvent.contentOffset.x / 150);
                        setCelebrityIndex(newIndex);
                    }}
                />
                {/* Upload Button */}
                <View>
                    <Pressable
                        style={style.upload}>
                        <Text style={{ color: '#ac326a', fontSize: 15, fontFamily: 'Poppins Bold', fontWeight: 'bold', alignSelf: 'center' }}>
                            ADD NEW TEMPLATE
                        </Text>
                        <Image
                            source={require('../assets/upload.png')}
                            style={{ height: 25, width: 25, resizeMode: 'contain', marginLeft: 30 }}
                        />
                    </Pressable>
                </View>
            </View>

        </View >

    )
}
const style = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    background: {
        height: 900,
        width: 500,
        flex: 1
    },
    upload: {
        backgroundColor: '#FCFCFC',
        paddingHorizontal: 70,
        paddingVertical: 13,
        margin: 40,
        borderRadius: 15,
        marginTop: 50,
        elevation: 3,
        flexDirection: 'row'
    },
    search: {
        backgroundColor: '#FCFCFC',
        paddingHorizontal: 35,
        paddingVertical: 10,
        marginHorizontal: 30,
        marginVertical: 30,
        marginTop: 40,
        borderRadius: 30,
        elevation: 3,
        justifyContent: 'center',
    },
    box: {
        backgroundColor: '#FCFCFC',
        borderRadius: 15,
        marginHorizontal: 6,
        marginVertical: 8,
        elevation: 3,
        width: 150,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    swipeBox: {
        backgroundColor: '#FCFCFC',
        borderRadius: 25,
        marginLeft: 43,
        elevation: 3,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        opacity: 0.8
    },
    image: {
        width: 140,
        height: 190,
        borderRadius: 12
    },
    SelectBox: {
        backgroundColor: '#FCFCFC',
        borderRadius: 15,
        marginHorizontal: 10,
        marginVertical: 30,
        elevation: 3,
        width: 110,
        height: 110,
        alignItems: 'center',
        justifyContent: 'center'
    },
    SelectImage: {
        width: 100,
        height: 100,
        borderRadius: 10,

    },
})