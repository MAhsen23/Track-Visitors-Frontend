import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Color, FontFamily } from '../GlobalStyles';

const HeaderBar = ({ title }) => {
    const navigation = useNavigation();

    return (
        <View style={{ alignItems: 'center', backgroundColor: Color.white, elevation: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, height: 65, marginBottom: 5, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: "space-between" }}>
            <Pressable onPress={() => { navigation.goBack() }}>
                <Image style={{ tintColor: Color.lightsteelblue, width: 32, height: 32, }} source={require('../assets/back.png')} />
            </Pressable>
            <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 19.5, letterSpacing: .4, color: Color.lightsteelblue }}>{title}</Text>
            <Image style={{ tintColor: Color.white, width: 30, height: 30, }} source={require('../assets/menu.png')} />
        </View >
    );
};

export default HeaderBar;
