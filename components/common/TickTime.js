import React, {Component} from 'react';
import {Text, StyleSheet} from 'react-native';
import moment from 'moment';
// import 'moment/locale/pl';

export class TimeLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment(
        `${props.data_wizyty} ${props.godzina_wizyty}`,
        'YYYY-MM-DD HH:mm:ss',
      ),
      timeLeft: '', // Początkowo ustawiamy czas pozostały na pusty ciąg znaków
    };
  }

  componentDidMount() {
    this.tick();
    this.timerID = setInterval(() => this.tick(), 1000); // Uruchomienie co 10 sekund
  }

  componentWillUnmount() {
    clearInterval(this.timerID); // Wyczyść interwał po odmontowaniu komponentu
  }

  tick() {
    // Obliczanie czasu pozostałego do wydarzenia
    const now = moment();
    const diff = this.state.date.diff(now, 'minutes');

    // Generowanie odpowiedniego komunikatu w zależności od czasu pozostałego
    let timeLeft;
    if (diff >= 24 * 60 * 4) {
      timeLeft = this.state.date.fromNow();
    } else if (diff >= 24 * 60) {
      const days = Math.floor(diff / (24 * 60));
      const hours = Math.floor((diff % (24 * 60)) / 60);
      timeLeft = `${days} d${days === 1 ? 'zień' : 'ni'} i ${hours} godz${
        hours === 1 ? '' : ''
      }`;
    } else if (diff >= 60) {
      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;
      timeLeft = `${hours} godz${hours === 1 ? '' : ''} i ${minutes} min${
        minutes === 1 ? '' : ''
      }`;
    } else if (diff > 0) {
      timeLeft = `${diff} min${diff === 1 ? '' : ''}`;
    } else {
      timeLeft = ''; // Czas minął, nie wyświetlamy niczego
    }

    // Aktualizacja stanu komponentu
    this.setState({timeLeft});
  }

  render() {
    // Wyświetlenie czasu pozostałego do wydarzenia
    return (
      <>
        {this.state.timeLeft ? (
          <Text style={styles.title1}>{this.state.timeLeft}</Text>
        ) : null}
      </>
    );
  }
}

export default TimeLeft;

const styles = StyleSheet.create({
  title1: {
    fontSize: 13,
    fontWeight: '400',
    color: 'black',
    marginBottom: 0,
    textAlign: 'right',
  },
});
