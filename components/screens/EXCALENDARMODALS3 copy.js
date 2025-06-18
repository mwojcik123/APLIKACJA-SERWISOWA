import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {addWork} from '../actions/works';
import {CLEAR_CLIENTS_DETAIL, CLEAR_EVENT, EVENT_DATE} from '../actions/types';
import moment from 'moment';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from 'react-native-table-component';
import {Picker} from '@react-native-picker/picker';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Button,
  TouchableOpacity,
  Dimensions,
  FlatList,
  TextInput,
  Modal,
  Pressable,
  RefreshControl,
  TouchableWithoutFeedback,
} from 'react-native';
import {WeriedTickDailyCalendar} from '../common/weriedTickDailyCalendar';
import {getMembers, changeMemberCalendar} from '../actions/member';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import store from '../store';
import {
  getCalendarv4,
  getCalendarv5,
  getCalendarv6,
  refreshCalendar,
  getNextCalendar,
  getPrevCalendar,
  addEvent,
  getCalendarToday,
  deleateEvent,
  updateEvent,
  getEvent,
} from '../actions/calendar';
import PropTypes from 'prop-types';
import FeatherIcon from 'react-native-vector-icons/Feather';

const {width} = Dimensions.get('window');
const clientCount = events => {
  if (events == undefined) {
    return 0;
  }
  var count = 0;
  events.forEach(event => {
    if (event.client) {
      count++;
    }
  });
  return count;
};
// const clientCountPerWeek = (week, days) => {
//   var week = 0;
//   week.forEach(element => {
//     week += clientCount(element);
//   });
//   return week;
// };
const colors = [
  '#2F4F4F',
  '#32CD32',
  '#40E0D0',
  '#4169E1',
  '#483D8B',
  '#48D1CC',
  '#4B0082',
  '#556B2F',
  '#5F9EA0',
  '#6B8E23',
  '#708090',
  '#7CFC00',
  '#7FFFD4',
  '#800000',
  '#800080',
  '#808000',
  '#808080',
  '#87CEEB',
  '#8A2BE2',
  '#8B0000',
  '#8B008B',
  '#8B4513',
  '#8FBC8F',
  '#9370DB',
  '#9400D3',
  '#98FB98',
  '#9932CC',
  '#9ACD32',
  '#A0522D',

  '#ADFF2F',

  '#B22222',
  '#B8860B',
  '#BA55D3',
  '#BDB76B',
  '#C71585',
  '#CD853F',
  '#D3D3D3',
  '#DA70D6',
  '#DAA520',
  '#DB7093',
  '#DC143C',
  '#DCDCDC',
  '#E9967A',

  '#F08080',

  '#F4A460',

  '#FA8072',

  '#FF0000',
  '#FF00FF',
  '#FF4500',
  '#FF69B4',
  '#FF8C00',
  '#FFA07A',
  '#FFA500',
  '#FFB6C1',
  '#FFD700',

  '#FFFF00',
];

class Calendary extends Component {
  generateWeek = startDate => {
    const daysInWeek = [];
    for (let i = 0; i < 7; i++) {
      daysInWeek.push(startDate.clone().add(i, 'days'));
    }
    return daysInWeek;
  };
  state = {
    isLoadingPage: true,
    name: '',
    today: '2024-05-16',
    member: this.props.member_user,
    phones: null,
    next_week: 0,
    prev_week: 0,
    show: false,
    date: null,
    selectedValue: null,
    tableHead: ['Pon'],
    tableData: ['1', '2', '3', '4', '4'],
    modalVisible: false,
    modalStove: false,
    workModal: false,
    modalVisibleClientAdd: false,
    modalVisibleClient: false,
    day: '',
    description_work: '',
    eventDay: 0,
    page: 1,
    desc: '',
    edit: false,
    showModalEvent: false,
    search: '',
    bussy: true,
    overview: true,
    rep: true,
    activation: true,
    showEvent: false,
    hours: [
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
    ],
    minutes: ['00', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'],
    hourValue: '06',
    hourValue2: '20',
    minuteValue: '00',
    modalVisible: false,
    selectedOption: '',
  };

  reff = React.createRef();

  static propTypes = {
    member_user: PropTypes.object.isRequired,
    member_calendar: PropTypes.string.isRequired,
    members: PropTypes.array.isRequired,
    getMembers: PropTypes.func.isRequired,
    getCalendarv4: PropTypes.func.isRequired,
    getCalendarv5: PropTypes.func.isRequired,
    getCalendarv6: PropTypes.func.isRequired,
    changeMemberCalendar: PropTypes.func.isRequired,
    getNextCalendar: PropTypes.func.isRequired,
    getPrevCalendar: PropTypes.func.isRequired,
    addWork: PropTypes.func.isRequired,
  };
  componentDidMount() {
    // console.log(this.reff);
    // this.reff.current.scrollTo({
    //   x: width - 1,
    //   animated: false,
    // });
    // this.props.getCalendarToday();
    // console.log(this.state.today);
    setTimeout(
      () => this.reff.current.scrollTo({x: width, animated: false}),
      0,
    );
    this.props.getCalendarv6();
    // this.setState({isLoadingPage: false});
    // store.dispatch(
    //   getCalendarv6(5, this.state.weeks[0][0].format('YYYY-MM-DD')),
    // );
    // this.props.getMembers();
    // this.fetchDataCalendar(5, this.state.weeks[0][0].format('YYYY-MM-DD'));
  }
  renderPreviousWeeks = () => {
    const {weeks} = this.state;
    const firstWeek = weeks[0];
    console.log(firstWeek[0].format('YYYY-MM-DD'));
    if (!firstWeek) return;
    const previousWeek = this.generateWeek(
      firstWeek[0].clone().subtract(1, 'week'),
    );
    if (weeks.length < 5) {
      this.setState({weeks: [previousWeek, ...weeks]});
      this.fetchData(
        this.state.member.id,
        previousWeek[1].format('YYYY-MM-DD'),
      );
    } else {
      this.setState({
        weeks: [
          this.generateWeek(previousWeek[0].clone()),
          this.generateWeek(previousWeek[0].clone().add(1, 'week')),
          this.generateWeek(previousWeek[0].clone().add(2, 'week')),
        ],
      });
      this.fetchDataCalendar(
        this.state.member,
        previousWeek[0].clone().add(2, 'week').format('YYYY-MM-DD'),
      );
    }

    // setTimeout(
    //   () => this.reff.current.scrollTo({x: width - 1, animated: false}),
    //   0,
    // );
  };

  // renderNextWeek = () => {
  //   const {weeks} = this.state;
  //   const firstWeek = weeks[weeks.length - 1];

  //   if (!firstWeek) return;
  //   const nextWeek = this.generateWeek(firstWeek[0].clone().add(1, 'week'));
  //   if (weeks.length < 5) {
  //     this.setState({weeks: [...weeks, nextWeek]});
  //     this.fetchData(this.state.member, nextWeek[1].format('YYYY-MM-DD'));
  //   } else {
  //     this.setState({
  //       weeks: [
  //         this.generateWeek(nextWeek[0].clone().subtract(2, 'week')),
  //         this.generateWeek(nextWeek[0].clone().subtract(1, 'week')),
  //         this.generateWeek(nextWeek[0].clone()),
  //       ],
  //     });
  //     this.fetchDataCalendar(
  //       this.state.member,
  //       nextWeek[0].clone().subtract(0, 'week').format('YYYY-MM-DD'),
  //     );
  //     // setTimeout(
  //     //   () => this.reff.current.scrollTo({x: width - 1, animated: false}),
  //     //   0,
  //     // );
  //   }
  // };
  loadToday = e => {
    e.preventDefault();
    this.props.getCalendarToday();
    this.reff.current.scrollTo({x: width, animated: false});
  };
  onRefresh = e => {
    // e.preventDefault();
    this.props.refreshCalendar();
  };
  handleScroll = e => {
    // e.preventDefault();
    const offset = e.nativeEvent.contentOffset.x;
    const contentHeight = e.nativeEvent.contentSize.width;
    const scrollViewHeight = width;
    // console.log(offset);
    // console.log(contentHeight - width - 1);

    if (offset <= 0) {
      // console.log('ugibugi');

      this.props.getPrevCalendar();

      this.reff.current.scrollTo({x: width, animated: false});
    }
    if (offset >= contentHeight - scrollViewHeight - 1) {
      e.preventDefault();
      const wielkosc = this.props.weeks.length;
      this.props.getNextCalendar();
      if (wielkosc >= 5) {
        this.reff.current.scrollTo({x: width, animated: false});
      }
    }
  };

  // handleScrollEnd = e => {
  //   e.preventDefault();
  //   const wielkosc = this.props.weeks.length;
  //   this.props.getNextCalendar(this.state.member, '2024-01-09');
  //   if (wielkosc < 5) {
  //     this.reff.current.scrollTo({x: width, animated: false});
  //   }
  // };

  fetchData = async (mem, date) => {
    await this.props.getCalendarv4(mem, date);
  };
  fetchDataCalendar = async (mem, date) => {
    await this.props.getCalendarv5(mem, date);
  };
  fetchDataCalendarChangeUser = async e => {
    const {weeks} = this.state;
    const firstWeek = weeks[0];
    const lastWeek = weeks[weeks.length - 1];
    // this.setState({member: sec});
    await this.props.getCalendarv6();
  };

  NextWeek = e => {
    this.setState({next_week: this.state.next_week + 1});
    this.props.getCalendar(
      this.state.member,
      this.state.next_week + 1,
      this.state.prev_week,
    );
  };
  PrevWeek = e => {
    this.setState({prev_week: this.state.prev_week + 1});
    this.props.getCalendar(
      this.state.member,
      this.state.next_week,
      this.state.prev_week + 1,
    );
  };
  Reload = e => {
    // this.setState({ prev_week: this.state.prev_week + 1 });
    this.props.getCalendar(
      this.state.member,
      this.state.next_week,
      this.state.prev_week,
    );
  };
  Today = e => {
    this.setState({prev_week: 0, next_week: 0});
    this.props.getCalendar(this.state.member, 0, 0);
  };
  cellPhones = e => {};
  choiceClient = data => {
    this.props.get_clients_detail(data);
    this.setState({modalVisibleClient: false});
  };

  onChange = e => {
    this.setState({member: e.target.value});
    this.props.getCalendar(
      e.target.value,
      this.state.next_week,
      this.state.prev_week,
    );
  };
  // Get = () =>{
  //   this.props.getCalendar(this.state.member.id,this.state.next_week,this.state.prev_week)
  // }
  EventOnMon = e => {
    this.setState({date: this.props.mon.day, eventDay: 0});
    this.showModal();
    this.setState({phones: cellphones(this.props.mon.events)});
  };
  EventOnTue = e => {
    this.setState({date: this.props.tue.day, eventDay: 1});
    this.showModal();
    this.setState({phones: cellphones(this.props.tue.events)});
  };
  EventOnWed = e => {
    this.setState({date: this.props.wed.day, eventDay: 2});
    this.showModal();
    this.setState({phones: cellphones(this.props.wed.events)});
  };
  EventOnThu = e => {
    this.setState({date: this.props.thu.day, eventDay: 3});
    this.showModal();
    this.setState({phones: cellphones(this.props.thu.events)});
  };
  EventOnFri = e => {
    this.setState({date: this.props.fri.day, eventDay: 4});
    this.showModal();
    this.setState({phones: cellphones(this.props.fri.events)});

    // this.props.makeSms(["662051956"])
  };
  showModalStove = e => {
    this.setState({modalStove: true});
  };

  Overview = e => {
    this.setState({overview: !this.state.overview});
  };

  Rep = e => {
    this.setState({rep: !this.state.rep});
  };
  Activation = e => {
    this.setState({activation: !this.state.activation});
  };

  addStove = e => {
    const {name} = this.state;
    const body = JSON.stringify({name});
    console.log(body);
    this.setState({modalStove: false});
    this.setState({name: ''});
    this.props.add_stove(body);
  };
  Search = e => {
    e.preventDefault();
    const {search, page} = this.state;
    this.props.get_clients_list(search, page);
  };
  makeCall = tel => {
    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${tel}`;
    } else {
      phoneNumber = `telprompt:${tel}`;
    }

    Linking.openURL(phoneNumber);
  };

  makeNAV = item => {
    let phoneNumber = '';
    console.log(
      `https://www.google.com/maps/search/?api=1&query=${item.street}+${item.nr_house}+${item.town}`,
    );

    if (Platform.OS === 'android') {
      googlemap = `https://www.google.com/maps/search/?api=1&query=${item.street}+${item.nr_house}+${item.town}`;
    } else {
      googlemap = `https://www.google.com/maps/search/?api=1&query=${item.street},${item.nr_house},${item.town}`;
    }

    Linking.openURL(googlemap);
  };

  addWork = e => {
    const {description_work} = this.state;
    const event = this.props.event_detail.id;
    const servisant = this.props.event_detail.servisant;
    const body = {servisant, event, description_work};
    // console.log(body)
    this.setState({workModal: false, description_work: ''});
    this.props.addWork(body);
  };

  Done = val => {
    const {servisant, data_wizyty, description} = this.props.event_detail;
    const body = {
      servisant,
      data_wizyty,
      description,
      done: true,
    };
    console.log(body);
    this.props.updateEvent(body, this.props.event_detail.id);
    this.setState({eventModal: false});
  };

  hideModalWork = e => {
    this.setState({workModal: false});
  };

  noDone = val => {
    const {servisant, data_wizyty, description} = this.props.event_detail;
    const body = {
      servisant,
      data_wizyty,
      description,
      done: false,
    };
    console.log(body);
    this.props.updateEvent(body, this.props.event_detail.id);
    this.setState({eventModal: false});
  };

  addVisit = e => {
    // e.preventDefault();

    if (this.props.clients_detail) {
      const servisant = this.state.member_calendar.id;
      const client = this.props.clients_detail.id;
      const {
        hourValue,
        eventDay,
        day,
        bussy,
        hourValue2,
        overview,
        rep,
        activation,
      } = this.state;
      const description = this.state.desc;
      const data_wizyty = day;
      const godzina_wizyty = hourValue + ':' + '00' + ':' + '00';
      const godzina_wizyty2 = hourValue2 + ':' + '00' + ':' + '00';
      const body = {
        servisant,
        client,
        data_wizyty,
        godzina_wizyty,
        godzina_wizyty2,
        description,
        bussy,
        overview,
        rep,
        activation,
      };
      // console.log(body)
      // console.log(eventDay)
      this.props.addEvent(body, eventDay);
      this.setState({
        modalVisible: false,
        desc: '',
        hourValue: '06',
        bussy: true,
        overview: true,
        rep: true,
        activation: true,
        hourValue2: '20',
      });
      store.dispatch({type: CLEAR_CLIENTS_DETAIL});
    } else {
      const client = null;
      const servisant = this.state.member_calendar.id;
      // { this.props.get_clients_detail ? client = this.props.get_clients_detail.id : client = null}
      const {
        hourValue,
        eventDay,
        day,
        bussy,
        hourValue2,
        overview,
        rep,
        activation,
      } = this.state;
      const description = this.state.desc;
      const data_wizyty = day;
      const godzina_wizyty = hourValue + ':' + '00' + ':' + '00';
      const godzina_wizyty2 = hourValue2 + ':' + '00' + ':' + '00';
      const body = {
        servisant,
        client,
        data_wizyty,
        godzina_wizyty,
        godzina_wizyty2,
        description,
        bussy,
        overview,
        rep,
        activation,
      };
      // console.log(body)
      // console.log(eventDay)
      this.props.addEvent(body, eventDay);
      this.setState({
        modalVisible: false,
        hourValue: '06',
        desc: '',
        bussy: true,
        overview: true,
        rep: true,
        activation: true,
        hourValue2: '20',
      });
      store.dispatch({type: CLEAR_CLIENTS_DETAIL});
    }
  };
  closeStove = e => {
    this.setState({modalStove: false, name: ''});
  };
  Edit = e => {
    const desc = this.props.event_detail.description;
    const godzina = this.props.event_detail.godzina_wizyty;
    const godzina2 = this.props.event_detail.godzina_wizyty2;
    const bussy = this.props.event_detail.bussy;
    const hourValue = godzina.substring(0, 2);
    const hourValue2 = godzina2.substring(0, 2);
    const overview = this.props.event_detail.overview;
    const rep = this.props.event_detail.rep;
    const activation = this.props.event_detail.activation;
    this.setState({
      edit: true,
      desc: desc,
      hourValue: hourValue,
      bussy: bussy,
      hourValue2: hourValue2,
      overview: overview,
      rep: rep,
      activation: activation,
    });
  };
  DeleateEvent = e => {
    this.props.deleateEvent(this.props.event_detail.id);
    this.setState({
      showModalEvent: false,
      description: '',
      bussy: true,
      overview: true,
      rep: true,
      activation: true,
      hourValue2: '20',
      hourValue: '06',
      edit: false,
    });
    store.dispatch({type: CLEAR_CLIENTS_DETAIL});
    store.dispatch({type: CLEAR_EVENT});
  };
  addClient = e => {
    const {first_name, stove, town, street, nr_house, tel} = this.state;
    const body = JSON.stringify({
      first_name,
      stove,
      town,
      street,
      nr_house,
      tel,
    });
    console.log(body);
    this.setState({modalVisibleClientAdd: false, modalVisibleClient: false});
    this.setState({
      first_name: '',
      stove: null,
      town: '',
      street: '',
      nr_house: '',
      tel: '',
    });
    this.props.add_client_to_calendar(body);
  };
  Save = e => {
    if (this.props.clients_detail) {
      const servisant = this.state.member;
      const client = this.props.clients_detail.id;
      const {hourValue, bussy, hourValue2, overview, rep, activation} =
        this.state;
      const data_wizyty = this.props.event_detail.data_wizyty;
      const description = this.state.desc;
      const godzina_wizyty = hourValue + ':' + '00' + ':' + '00';
      const godzina_wizyty2 = hourValue2 + ':' + '00' + ':' + '00';
      const body = {
        servisant,
        client,
        godzina_wizyty,
        godzina_wizyty2,
        description,
        data_wizyty,
        bussy,
        overview,
        rep,
        activation,
      };
      console.log(body);
      this.props.updateEvent(body, this.props.event_detail.id);
      this.setState({
        showModalEvent: false,
        description: '',
        bussy: true,
        overview: true,
        rep: true,
        activation: true,
        hourValue: '06',
        hourValue2: '20',
        edit: false,
      });
      store.dispatch({type: CLEAR_CLIENTS_DETAIL});
      store.dispatch({type: CLEAR_EVENT});
    } else {
      const {overview, rep, activation} = this.state;
      const client = null;
      const servisant = this.props.member_calendar.id;
      // { this.props.get_clients_detail ? client = this.props.get_clients_detail.id : client = null}
      const {hourValue, bussy, hourValue2} = this.state;
      const description = this.state.desc;
      const data_wizyty = this.props.event_detail.data_wizyty;
      const godzina_wizyty2 = hourValue2 + ':' + '00' + ':' + '00';
      const godzina_wizyty = hourValue + ':' + '00' + ':' + '00';
      const body = {
        servisant,
        client,
        godzina_wizyty,
        godzina_wizyty2,
        description,
        data_wizyty,
        bussy,
        overview,
        rep,
        activation,
      };
      console.log(body);
      this.props.updateEvent(body, this.props.event_detail.id);
      this.setState({
        showModalEvent: false,
        description: '',
        bussy: true,
        overview: true,
        rep: true,
        activation: true,
        hourValue: '06',
        hourValue: '20',
        edit: false,
      });
      store.dispatch({type: CLEAR_CLIENTS_DETAIL});
      store.dispatch({type: CLEAR_EVENT});
    }
  };

  showModal = data => {
    console.log(this.state.day);
    this.setState({modalVisible: true, bussy: true});
  };
  hideModal = data => {
    this.setState({modalVisible: false, bussy: true});
    store.dispatch({type: CLEAR_CLIENTS_DETAIL});
  };
  showModal2 = data => {
    this.setState({modalVisibleClient: true});
  };
  hideModal2 = data => {
    this.setState({modalVisibleClient: false});
  };
  hideModal3 = () => {
    this.setState({
      showModalEvent: false,
      edit: false,
      desc: '',
      hourValue: '06',
      hourValue2: '20',
      bussy: true,
      overview: true,
      rep: true,
      activation: true,
    });
    store.dispatch({type: CLEAR_CLIENTS_DETAIL});
    store.dispatch({type: CLEAR_EVENT});
  };

  render() {
    const noBussy = data => (
      <View>
        <TouchableOpacity
          key={data.id}
          style={{
            margin: 1,

            elevation: 4,
            backgroundColor: '#fff',
            borderRadius: 4,
          }}
          onPress={() => {
            this.setState({showModalEvent: true}), this.props.getEvent(data.id);
          }}>
          <View
            style={[
              data.done ? styles.btnDone : styles.btn,
              data.client
                ? {
                    borderTopWidth: 6,

                    borderTopColor:
                      colors[Math.floor(Math.random() * colors.length)],
                  }
                : null,
            ]}>
            {/* <Text style={styles.btnText}>{data.id}</Text> */}
            <Text style={styles.btnTextTime}>
              {data.godzina_wizyty.substring(0, 2)}-
              {data.godzina_wizyty2.substring(0, 2)}
            </Text>
            {data.client ? (
              <View>
                <Text style={styles.btnText}>{data.client.first_name}</Text>
                {/* <Text style={styles.btnText}>{data.client.second_name}</Text> */}
                <Text style={styles.btnText}>{data.client.town}</Text>
                <Text style={styles.btnText}>
                  {data.client.street} {data.client.nr_house}
                </Text>
              </View>
            ) : (
              <Text style={styles.btnText2}>{data.description}</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
    const isBussy = data => (
      <TouchableOpacity
        key={data.id}
        style={{
          margin: 1,

          elevation: 4,
          backgroundColor: '#fff',
          borderRadius: 4,
        }}
        onPress={() => {
          this.setState({showModalEvent: true}), this.props.getEvent(data.id);
        }}>
        <View style={[styles.btn, {backgroundColor: 'red'}]}>
          {/* <Text style={styles.btnText}>{data.id}</Text> */}
          <Text style={styles.btnTextTime}>{data.description}</Text>
        </View>
      </TouchableOpacity>
    );
    const element = data => {
      data.bussy ? noBussy(data) : isBussy(data);
    };
    const fetchDataCalendarChangeUser = async member => {
      const {weeks} = this.state;
      const firstWeek = weeks[0];
      const lastWeek = weeks[weeks.length - 1];
      // this.setState({member: sec});
      console.log('elo0022');
      console.log(member);
      console.log(weeks[0][0].format('YYYY-MM-DD'));
      console.log(weeks[weeks.length - 1][6].format('YYYY-MM-DD'));
      await this.props.getCalendarv6(
        member,
        weeks[0][0].format('YYYY-MM-DD'),
        weeks[weeks.length - 1][6].format('YYYY-MM-DD'),
      );
    };
    const renderItem = ({item}) => (
      <View key={item.id} style={styles.client}>
        <TouchableOpacity onPress={() => this.choiceClient(item.id)}>
          <Text style={{color: 'navy'}}>{item.first_name}</Text>
          <Text style={{color: 'black'}}>
            {item.town} {item.street} {item.nr_house} tel: {item.tel}
          </Text>
        </TouchableOpacity>
      </View>
    );

    const pickData = weekDates => {
      if (!Array.isArray(weekDates) || weekDates.length === 0) {
        return '';
      }

      const monthsInPolish = [
        'Styczeń',
        'Luty',
        'Marzec',
        'Kwiecień',
        'Maj',
        'Czerwiec',
        'Lipiec',
        'Sierpień',
        'Wrzesień',
        'Październik',
        'Listopad',
        'Grudzień',
      ];

      const startDate = new Date(weekDates[0]);
      const endDate = new Date(weekDates[weekDates.length - 1]);

      const startMonth = monthsInPolish[startDate.getMonth()];
      const endMonth = monthsInPolish[endDate.getMonth()];
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();

      if (startMonth === endMonth && startYear === endYear) {
        return `${startMonth} ${startYear}`;
      } else if (startYear === endYear) {
        return `${startMonth.slice(0, 3)}-${endMonth.slice(0, 3)} ${startYear}`;
      } else {
        return `${startMonth.slice(0, 3)}-${endMonth.slice(
          0,
          3,
        )} ${startYear}/${endYear}`;
      }
    };

    const {
      member,
      selectedOption,
      search,
      modalVisible,
      bussy,
      desc,
      hourValue,
      hourValue2,
      modalVisibleClient,
      showModalEvent,
      modalVisibleClientAdd,
      edit,
      stove,
      first_name,
      modalStove,
      town,
      street,
      nr_house,
      name,
      tel,
      workModal,
      description_work,
      overview,
      rep,
      activation,
      isLoadingPage,
    } = this.state;
    const {
      days,
      members,
      member_user,
      event_detail,
      weeks,
      member_calendar,
      refreshing,
    } = this.props;

    return (
      <View style={{width: '100%', height: '100%'}}>
        <StatusBar backgroundColor="#d3e0fe" barStyle={'dark-content'} />
        <View style={styles.containerModal}>{/* <RefreshControl /> */}</View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => this.setState({modalVisible: false})}>
          <TouchableOpacity
            style={styles.modalContainer}
            onPress={() => this.setState({modalVisible: false})}>
            <View style={styles.modalContent}>
              <TouchableWithoutFeedback>
                <View style={styles.modalView}>
                  {[member, ...this.props.members].map(itemValue => (
                    <TouchableOpacity
                      key={itemValue.id}
                      style={styles.option}
                      onPress={() => {
                        this.props.changeMemberCalendar(itemValue);
                        this.props.getCalendarv6(itemValue);
                        this.setState({modalVisible: false});
                      }}>
                      <Text style={styles.lessonsTitle}>
                        {itemValue.person.username}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableOpacity>
        </Modal>
        <View style={styles.header}>
          <View style={[styles.headerAction]}>
            {/* <Image
              alt=""
              style={styles.headerImg}
              source={require('../assets/BeautyTEXTTRANSPARENTBLACK.png')}
            /> */}
            {console.log(this.props.member_user.permissions)}
            {this.props.member_user.permissions == 'CE' ||
            this.props.member_user.permissions == 'SS' ? (
              <TouchableOpacity
                onPress={() => this.setState({modalVisible: true})}
                style={styles.headerMember}>
                <Text style={styles.lessonsTitle}>
                  {member_calendar.person.username}
                </Text>
                <FeatherIcon
                  name="chevrons-down"
                  size={24}
                  color="#185aca"
                  styles={{alignItems: 'flex-end'}}
                />
              </TouchableOpacity>
            ) : (
              <Text style={{flex: 1, paddingLeft: 10}}>
                {this.props.user.username}
              </Text>
            )}
          </View>

          <View style={[styles.headerAction, {alignItems: 'flex-end'}]}>
            <TouchableOpacity
              style={styles.headerBadge}
              onPress={
                // handle onPress
                this.loadToday
              }>
              {/* <Text>Today</Text> */}
              <FeatherIcon name="bookmark" size={26} color="#185aca" />
              {/* <FeatherIcon name="more-vertical" size={24} /> */}
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#d3e0fe',
          }}>
          <ScrollView
            style={{borderRadius: 40}}
            horizontal
            pagingEnabled
            // onScrollEndDrag={this.handleScrollEnd}
            showsHorizontalScrollIndicator={false}
            ref={this.reff}
            onScroll={this.handleScroll}
            scrollEventThrottle={0} // Częstotliwość zdarzenia onScroll
            // scrollTo={}
          >
            {weeks.map((item, index) => {
              const clientCountPon = clientCount(
                days[item[1].format('YYYY-MM-DD')],
              );
              const clientCountWto = clientCount(
                days[item[2].format('YYYY-MM-DD')],
              );
              const clientCountSro = clientCount(
                days[item[3].format('YYYY-MM-DD')],
              );
              const clientCountCzw = clientCount(
                days[item[4].format('YYYY-MM-DD')],
              );
              const clientCountPnt = clientCount(
                days[item[5].format('YYYY-MM-DD')],
              );
              const clientCountWeek =
                clientCountPon +
                clientCountWto +
                clientCountSro +
                clientCountCzw +
                clientCountPnt;
              return (
                <View key={index} style={styles.screen}>
                  <View style={styles.calendarHeder}>
                    <View style={{flex: 1, width: 40}}>
                      <Text
                        style={[
                          styles.day,
                          {
                            textAlign: 'left',
                          },
                        ]}></Text>
                    </View>
                    <View>
                      <Text style={styles.eventsTitle}>{pickData(item)}</Text>
                    </View>
                    <View style={{flex: 1, width: 40}}>
                      <Text
                        style={[
                          styles.day,
                          {
                            textAlign: 'right',
                          },
                        ]}>
                        {days[item[1].format('YYYY-MM-DD')] ? (
                          <>
                            <FeatherIcon
                              name="user"
                              color="#2c2c2c"
                              size={15}
                            />{' '}
                            {clientCountWeek}{' '}
                            <FeatherIcon name="eye" color="#2c2c2c" size={15} />{' '}
                            {clientCountWeek}{' '}
                          </>
                        ) : null}
                      </Text>
                    </View>
                  </View>
                  {/* Tutaj renderuj zawartość ekranu */}
                  <ScrollView
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={this.onRefresh}
                      />
                    }>
                    <View style={[styles.containert, {width: width}]}>
                      {/* <> */}
                      <Table borderStyle={{borderColor: 'transparent'}}>
                        {/* {this.props.mon.map()} */}
                        <TouchableOpacity
                          onPress={() => {
                            store.dispatch({
                              type: EVENT_DATE,
                              payload: item[1].format('YYYY-MM-DD'),
                            }),
                              this.props.navigation.navigate('AddEvent');
                          }}>
                          <Row
                            data={[
                              <Text style={styles.text}>
                                Pon&nbsp;{item[1].format('MM-DD')}{' '}
                                {days[item[1].format('YYYY-MM-DD')] ? (
                                  <>
                                    <FeatherIcon
                                      name="user"
                                      color="#2c2c2c"
                                      size={12}
                                    />
                                    {clientCountPon}{' '}
                                    <FeatherIcon
                                      name="eye"
                                      color="#2c2c2c"
                                      size={12}
                                    />
                                    {clientCountPon}
                                  </>
                                ) : null}
                              </Text>,
                            ]}
                            style={
                              this.state.today == item[1].format('YYYY-MM-DD')
                                ? styles.head1
                                : styles.head
                            }
                            textStyle={styles.text}
                          />
                          <TableWrapper style={styles.cell}>
                            <Row data="" style={styles.singleHead} />
                            <TableWrapper style={{flexDirection: 'column'}}>
                              {days[item[1].format('YYYY-MM-DD')] ? (
                                <>
                                  {days[item[1].format('YYYY-MM-DD')].map(
                                    event => (
                                      <Cell
                                        key={event.id}
                                        data={
                                          event.bussy
                                            ? noBussy(event)
                                            : isBussy(event)
                                        }
                                        textStyle={styles.text}
                                      />
                                    ),
                                  )}
                                </>
                              ) : null}
                              {/* <Cell data={element(3)} textStyle={styles.text}/> */}
                            </TableWrapper>
                          </TableWrapper>
                        </TouchableOpacity>
                      </Table>
                      <Table borderStyle={{borderColor: 'transparent'}}>
                        <TouchableOpacity
                          onPress={() => {
                            store.dispatch({
                              type: EVENT_DATE,
                              payload: item[2].format('YYYY-MM-DD'),
                            }),
                              this.props.navigation.navigate('AddEvent');
                          }}>
                          <Row
                            data={[
                              <Text style={styles.text}>
                                Wto&nbsp;{item[2].format('MM-DD')}{' '}
                                {days[item[2].format('YYYY-MM-DD')] ? (
                                  <>
                                    <FeatherIcon
                                      name="user"
                                      color="#2c2c2c"
                                      size={12}
                                    />
                                    {clientCountWto}{' '}
                                    <FeatherIcon
                                      name="eye"
                                      color="#2c2c2c"
                                      size={12}
                                    />
                                    {clientCountWto}
                                  </>
                                ) : null}
                              </Text>,
                            ]}
                            style={
                              this.state.today == item[2].format('YYYY-MM-DD')
                                ? styles.head1
                                : styles.head
                            }
                            textStyle={styles.text}
                          />
                          <TableWrapper style={styles.cell}>
                            <Row data="" style={styles.singleHead} />
                            <TableWrapper style={{flexDirection: 'column'}}>
                              {days[item[2].format('YYYY-MM-DD')] ? (
                                <>
                                  {days[item[2].format('YYYY-MM-DD')].map(
                                    event => (
                                      <Cell
                                        key={event.id}
                                        data={
                                          event.bussy
                                            ? noBussy(event)
                                            : isBussy(event)
                                        }
                                        textStyle={styles.text}
                                      />
                                    ),
                                  )}
                                </>
                              ) : null}
                            </TableWrapper>
                          </TableWrapper>
                        </TouchableOpacity>
                      </Table>
                      <Table borderStyle={{borderColor: 'transparent'}}>
                        <TouchableOpacity
                          onPress={() => {
                            store.dispatch({
                              type: EVENT_DATE,
                              payload: item[3].format('YYYY-MM-DD'),
                            }),
                              this.props.navigation.navigate('AddEvent');
                          }}>
                          <Row
                            data={[
                              <Text style={styles.text}>
                                Śro&nbsp;{item[3].format('MM-DD')}{' '}
                                {days[item[3].format('YYYY-MM-DD')] ? (
                                  <>
                                    <FeatherIcon
                                      name="user"
                                      color="#2c2c2c"
                                      size={12}
                                    />
                                    {clientCountSro}{' '}
                                    <FeatherIcon
                                      name="eye"
                                      color="#2c2c2c"
                                      size={12}
                                    />
                                    {clientCountSro}
                                  </>
                                ) : null}
                              </Text>,
                            ]}
                            style={
                              this.state.today == item[3].format('YYYY-MM-DD')
                                ? styles.head1
                                : styles.head
                            }
                            textStyle={styles.text}
                          />
                          <TableWrapper style={styles.cell}>
                            {/* <Row data="" style={styles.singleHead}/> */}
                            <TableWrapper style={{flexDirection: 'column'}}>
                              {days[item[3].format('YYYY-MM-DD')] ? (
                                <>
                                  {days[item[3].format('YYYY-MM-DD')].map(
                                    event => (
                                      <Cell
                                        key={event.id}
                                        data={
                                          event.bussy
                                            ? noBussy(event)
                                            : isBussy(event)
                                        }
                                        textStyle={styles.text}
                                      />
                                    ),
                                  )}
                                </>
                              ) : null}
                            </TableWrapper>
                          </TableWrapper>
                        </TouchableOpacity>
                      </Table>
                      <Table borderStyle={{borderColor: 'transparent'}}>
                        <TouchableOpacity
                          onPress={() => {
                            store.dispatch({
                              type: EVENT_DATE,
                              payload: item[4].format('YYYY-MM-DD'),
                            }),
                              this.props.navigation.navigate('AddEvent');
                          }}>
                          <Row
                            data={[
                              <Text style={styles.text}>
                                Czw&nbsp;{item[4].format('MM-DD')}{' '}
                                {days[item[4].format('YYYY-MM-DD')] ? (
                                  <>
                                    <FeatherIcon
                                      name="user"
                                      color="#2c2c2c"
                                      size={12}
                                    />
                                    {clientCountCzw}{' '}
                                    <FeatherIcon
                                      name="eye"
                                      color="#2c2c2c"
                                      size={12}
                                    />
                                    {clientCountCzw}
                                  </>
                                ) : null}
                              </Text>,
                            ]}
                            style={
                              this.state.today == item[4].format('YYYY-MM-DD')
                                ? styles.head1
                                : styles.head
                            }
                            textStyle={styles.text}
                          />
                          <TableWrapper style={styles.cell}>
                            {/* <Row data="" style={styles.singleHead}/> */}
                            <TableWrapper style={{flexDirection: 'column'}}>
                              {days[item[4].format('YYYY-MM-DD')] ? (
                                <>
                                  {days[item[4].format('YYYY-MM-DD')].map(
                                    event => (
                                      <Cell
                                        key={event.id}
                                        data={
                                          event.bussy
                                            ? noBussy(event)
                                            : isBussy(event)
                                        }
                                        textStyle={styles.text}
                                      />
                                    ),
                                  )}
                                </>
                              ) : null}
                            </TableWrapper>
                          </TableWrapper>
                        </TouchableOpacity>
                      </Table>
                      <Table borderStyle={{borderColor: 'transparent'}}>
                        <TouchableOpacity
                          onPress={() => {
                            store.dispatch({
                              type: EVENT_DATE,
                              payload: item[5].format('YYYY-MM-DD'),
                            }),
                              this.props.navigation.navigate('AddEvent');
                          }}>
                          <Row
                            data={[
                              <Text style={styles.text}>
                                Pnt&nbsp;{item[5].format('MM-DD')}{' '}
                                {days[item[5].format('YYYY-MM-DD')] ? (
                                  <>
                                    <FeatherIcon
                                      name="user"
                                      color="#2c2c2c"
                                      size={12}
                                    />
                                    {clientCountPnt}{' '}
                                    <FeatherIcon
                                      name="eye"
                                      color="#2c2c2c"
                                      size={12}
                                    />
                                    {clientCountPnt}
                                  </>
                                ) : null}
                              </Text>,
                            ]}
                            style={
                              this.state.today == item[5].format('YYYY-MM-DD')
                                ? styles.head1
                                : styles.head
                            }
                            textStyle={styles.text}
                          />
                          <TableWrapper style={styles.cell}>
                            {/* <Row data="" style={styles.singleHead}/> */}
                            <TableWrapper style={{flexDirection: 'column'}}>
                              {days[item[5].format('YYYY-MM-DD')] ? (
                                <>
                                  {days[item[5].format('YYYY-MM-DD')].map(
                                    event => (
                                      <Cell
                                        key={event.id}
                                        data={
                                          event.bussy
                                            ? noBussy(event)
                                            : isBussy(event)
                                        }
                                        textStyle={styles.text}
                                      />
                                    ),
                                  )}
                                </>
                              ) : null}
                            </TableWrapper>
                          </TableWrapper>
                        </TouchableOpacity>
                      </Table>
                      {/* </> */}
                    </View>
                    <View style={{height: 150}} />
                  </ScrollView>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  members: state.member.members,
  member_user: state.member.member_user,
  member_calendar: state.member.member_calendar,
  event_detail: state.calendar.event_detail,
  refreshing: state.calendar.refreshing,

  days: state.calendar.days,
  weeks: state.calendar.weeks,
  clients_list: state.clients.clients_list,
  clients_detail: state.clients.clients_detail,
  stove_list: state.stove.stove_list,
  Loading: state.calendar.Loading,
});

export default connect(mapStateToProps, {
  getMembers,
  changeMemberCalendar,
  getCalendarv4,
  getCalendarv5,
  getCalendarv6,
  getNextCalendar,
  getPrevCalendar,
  addEvent,
  deleateEvent,
  updateEvent,
  getEvent,
  addWork,
  getCalendarToday,
  refreshCalendar,
})(Calendary);

const styles = StyleSheet.create({
  eventsTitle: {
    // width: 100,
    fontSize: 20,
    fontWeight: '700',
    color: '#2c2c2c',
    justifyContent: 'center',

    // marginBottom: 12,
  },
  calendarHeder: {
    // width: '100%',
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
    // justifyContent: 'space-between',
    marginVertical: 5,
    marginHorizontal: 30,
  },
  screen: {
    // width,
    // borderLeftWidth: 1,
    // borderRightWidth: 1,
    // borderColor: 'red',
    // marginHorizontal: 1,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 40,
  },
  headerBadge: {
    backgroundColor: '#fff',
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  day: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2c2c2c',
  },
  lessonsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#185aca',
    // marginBottom: 12,
  },
  headerMember: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    width: '100%',
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    paddingHorizontal: 16,
    elevation: 5,
    // justifyContent: 'center',
  },
  headerAction: {
    flex: 1,
    height: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  header: {
    // height: 50,
    paddingHorizontal: 10,
    backgroundColor: '#d3e0fe',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  container: {
    height: 100,
    // flex: 1,
    // paddingTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
    // paddingTop:20
  },
  client: {
    width: '100%',
    flex: 1,
    // paddingTop: 10,
    // flex: 1,
    marginTop: 2,
    // width: '90%',
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    // paddingTop:20
  },
  conter: {
    // paddingBottom: 100,
    // width: '100%',
    // height: 100,
    // flex: 1,
    //   justifyContent: 'center',
    //   alignItems: 'center'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
  },

  modalView: {
    backgroundColor: '#d3e0fe',
    borderRadius: 20,
    padding: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  option: {
    width: '100%',
    borderRadius: 15,
    textAlign: 'left',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    paddingVertical: 10,
    marginVertical: 3,
    // borderBottomWidth: 1,
    // borderBottomColor: '#cccccc',
  },
  buttonAdd: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: 'green',
  },
  buttonClient: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: 'lightblue',
  },
  tekst: {
    fontSize: 26,
  },
  tekst3: {
    fontSize: 20,
  },
  buttonClose: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: 'red',
  },
  buttonOpen: {
    borderRadius: 20,
    padding: 10,

    elevation: 2,
    backgroundColor: 'lightgrey',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  search: {
    flex: 1,
    backgroundColor: 'lightblue',
    borderRadius: 100,
    paddingLeft: 10,
  },
  modalText: {
    marginBottom: 15,
    paddingTop: 16,
    textAlign: 'center',
  },
  checkbox: {
    alignSelf: 'center',
  },
  dateText: {
    fontSize: 26,
    color: 'green',
  },
  timeText: {
    fontSize: 23,
    color: '#ff00ff',
  },
  textEvent: {
    fontSize: 18,
  },
  TextStyle2: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  TextStyle3: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'left',
  },
  labele: {
    padding: 5,
    flexDirection: 'row',
    borderRadius: 100,
    backgroundColor: 'lightgrey',
    marginTop: 10,
  },
  cell: {width: 75},
  containert: {
    paddingTop: 5,
    flexDirection: 'row',
    // height: '100%',
    justifyContent: 'center',
  },
  head: {height: 40, backgroundColor: '#808B97', borderRadius: 2, margin: 1},
  head1: {height: 40, backgroundColor: '#dfa8ff', borderRadius: 2, margin: 1},
  text: {margin: 0, textAlign: 'center', fontSize: 12},
  row: {flexDirection: 'row', backgroundColor: '#FFF1C1'},
  btn: {
    width: '100%',
    height: '100%',
    backgroundColor: '#a4c2f5',
    borderRadius: 4,
    // elevation: 4,
  },
  btnDone: {
    width: '100%',
    height: '100%',
    backgroundColor: '#999999',
    borderRadius: 4,
    // elevation: 4,
  },
  containerModal: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  touchableButton: {
    width: '80%',
    margin: 3,
    padding: 10,
    backgroundColor: '#9c27b0',
  },
  touchableButton2: {
    width: '80%',
    padding: 10,
    margin: 3,
    backgroundColor: '#7cd7b2',
  },
  button: {
    borderRadius: 9999,
    padding: 10,
    // elevation: 2,
    backgroundColor: '#008BCC',
  },
  buttonMake: {
    backgroundColor: '#ee7634',
  },
  buttonWork: {
    backgroundColor: '#90f880',
  },
  btnText: {textAlign: 'center', color: 'black', fontSize: 12},
  btnTextTime: {textAlign: 'center', color: 'black', fontSize: 12},
  btnText2: {textAlign: 'center', fontSize: 9},
  singleHead: {width: 80, height: 40, backgroundColor: '#c8e1ff'},

  radio: {
    position: 'relative',
    paddingTop: 12,
    paddingRight: 24,
    paddingBottom: 12,
    paddingLeft: 0,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  radioWrapper: {
    marginLeft: 24,
    borderTopWidth: 1,
    borderColor: '#e8e8e8',
  },
  radioIcon: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: '#000',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 2,
  },
  radioCheck: {
    width: 24,
    height: 24,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    borderWidth: 1,
    borderColor: '#007bff',
  },
  radioCheckActive: {
    backgroundColor: '#007bff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    // backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    // elevation: 5,
  },
});
