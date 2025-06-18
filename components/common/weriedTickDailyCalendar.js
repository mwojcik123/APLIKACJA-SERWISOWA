import React, {Component} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import {getCalendarDaily} from '../actions/calendar';

class WeriedTickDailyCalendar extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.props.getCalendarDaily();
  }
  render() {
    return <View></View>;
  }
}

export default connect(null, {getCalendarDaily})(WeriedTickDailyCalendar);
