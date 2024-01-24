import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

const CustomCheckbox = ({ label, isChecked, onChange }) => {
  return (
    <TouchableOpacity
      onPress={() => onChange(!isChecked)}
      style={{ flexDirection: 'row', alignItems: 'center' }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderWidth: 1,
          borderColor: isChecked ? 'blue' : 'gray',
          marginRight: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isChecked && (
          <Text
            style={{
              color: isChecked ? 'blue' : 'gray',
            }}
          >
            ✓
          </Text>
        )}
      </View>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
};


export default CustomCheckbox;