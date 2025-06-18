// PartsItem.js
import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';

const PartsItem = ({item, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.events}>
        <View style={styles.eventInside}>
          <Text style={styles.TextID}>{item.catalog_id}</Text>
          <Text style={styles.TextDesc}>
            {item.description.substring(0, 19)}
          </Text>
        </View>
        <Text
          style={
            item.quantity > 0 ? styles.TextQuantity2 : styles.TextQuantity
          }>
          {item.quantity}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  events: {
    width: '100%',
    height: 50,
    margin: 1,
    justifyContent: 'space-between',
    backgroundColor: 'lightgrey',
    marginTop: 1,
    borderRadius: 10,
    flexDirection: 'row',
  },
  eventInside: {
    height: 50,
    margin: 1,
    marginTop: 1,
    borderRadius: 10,
    flexDirection: 'row',
  },
  TextID: {
    textAlignVertical: 'center',
    fontWeight: 'bold',
    color: 'black',
    fontSize: 22,
    margin: 1,
  },
  TextDesc: {
    color: 'grey',
    fontSize: 16,
    textAlignVertical: 'center',
    margin: 4,
    width: 'auto',
  },
  TextQuantity: {
    color: 'red',
    fontSize: 30,
    textAlignVertical: 'center',
    fontWeight: 'bold',
    margin: 5,
  },
  TextQuantity2: {
    color: 'black',
    fontSize: 30,
    textAlignVertical: 'center',
    fontWeight: 'bold',
    margin: 5,
  },
});

export default PartsItem;
