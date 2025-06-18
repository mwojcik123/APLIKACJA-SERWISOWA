import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import AnimatedAbsoluteButton from 'react-native-animated-absolute-buttons/AnimatedAbsoluteButton';
import {connect} from 'react-redux';
const buttons = [
  {
    color: 'blue',
    content: <Text>👊</Text>,
    action: () => {
      alert('You clicked!');
    },
  },
  {
    color: 'red',
    content: <Text>🤙</Text>,
    action: () => {
      alert('You clicked!');
    },
  },
  {
    color: 'green',
    content: <Text>👋</Text>,
    action: () => {
      alert('You clicked!');
    },
  },
];

export class exa extends Component {
  render() {
    return (
      <View style={{width: '100%', height: '100%'}}>
        {/* <AnimatedAbsoluteButton
          buttonSize={50}
          buttonColor="indigo"
          buttonShape="circular"
          buttonContent={<Text>👍</Text>}
          direction="top"
          position="bottom-right"
          positionVerticalMargin={10}
          positionHorizontalMargin={10}
          time={500}
          easing="bounce"
          buttons={buttons}
        /> */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => console.log('Button clicked')}>
            <Text style={styles.buttonText}>Mój przycisk</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
const mapStateToProps = state => ({
  format_day: state.calendar.format_day,
  event_detail: state.calendar.event_detail,
  isAuthenticated: state.auth.isAuthenticated,
  members: state.member.members,
  member_user: state.member.member_user,
});
export default connect(mapStateToProps, null)(exa);
