import React, {useState, useRef} from 'react';
import {View, Text, TouchableOpacity, Animated, Dimensions} from 'react-native';

const {height} = Dimensions.get('window');

const AnimatedSlideUp = () => {
  const [isListView, setIsListView] = useState(true);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleView = () => {
    Animated.timing(animation, {
      toValue: isListView ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setIsListView(!isListView);
  };

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -height], // Aktualny widok przesuwa się do góry
  });

  const translateYNew = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0], // Nowy widok wchodzi od dołu
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0], // Zanikanie starego ekranu
  });

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableOpacity
        onPress={toggleView}
        style={{marginBottom: 20, padding: 10, backgroundColor: 'blue'}}>
        <Text style={{color: 'white'}}>Przełącz widok</Text>
      </TouchableOpacity>

      <View
        style={{
          width: 300,
          height: 300,
          overflow: 'hidden',
          backgroundColor: '#ddd',
          borderRadius: 20,
        }}>
        <Animated.View
          style={{position: 'absolute', transform: [{translateY}], opacity}}>
          <View
            style={{
              width: 300,
              height: 300,
              backgroundColor: 'lightblue',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 20}}>📋 Lista</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={{
            position: 'absolute',
            transform: [{translateY: translateYNew}],
          }}>
          <View
            style={{
              width: 300,
              height: 300,
              backgroundColor: 'lightgreen',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 20}}>📅 Kalendarz</Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

export default AnimatedSlideUp;
