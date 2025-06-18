import React, {Component, Fragment, createRef} from 'react';
import {connect} from 'react-redux';
import {addWork} from '../actions/works';
import moment from 'moment';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  Linking,
  Dimensions,
  FlatList,
  FlatListType,
  RefreshControl,
} from 'react-native';
import {getMembers} from '../actions/member';
import {get_stove, add_stove} from '../actions/stove';
import {
  get_clients_list,
  get_clients_detail,
  add_client_to_calendar,
} from '../actions/clients';
import {cellphones} from '../reducers/clients';
import PropTypes from 'prop-types';
import {
  getCalendar,
  getCalendarNext,
  getCalendarPrev,
  addEvent,
  deleateEvent,
  updateEvent,
  getEvent,
} from '../actions/calendar';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from 'react-native-table-component';
import store from '../store';
import {CLEAR_CLIENTS_DETAIL, CLEAR_EVENT} from '../actions/types';
import {Picker} from '@react-native-picker/picker';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {FlashList} from '@shopify/flash-list';
// import SMS form

import BouncyCheckbox from 'react-native-bouncy-checkbox';

class Calendary extends Component {
  constructor(props) {
    super(props);
    this.reff = createRef();
    this.thisweek = moment().startOf('week');
    this.today = moment().startOf('day').format('dd, MMMM D');
    this.state = {
      weeks: [
        this.generateWeek(this.thisweek.clone().subtract(1, 'week')),
        this.generateWeek(this.thisweek),
        this.generateWeek(this.thisweek.clone().add(1, 'week')),
      ],
      name: '',
      member: this.props.member_user.id,
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
      flatListRefreshing: false,
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
      minutes: [
        '00',
        '10',
        '15',
        '20',
        '25',
        '30',
        '35',
        '40',
        '45',
        '50',
        '55',
      ],
      hourValue: '06',
      hourValue2: '20',
      minuteValue: '00',
    };
  }

  static propTypes = {
    mon: PropTypes.object.isRequired,
    tue: PropTypes.object.isRequired,
    wed: PropTypes.object.isRequired,
    thu: PropTypes.object.isRequired,
    fri: PropTypes.object.isRequired,
    sat: PropTypes.object.isRequired,
    sun: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    member_user: PropTypes.object.isRequired,
    members: PropTypes.array.isRequired,
    getCalendar: PropTypes.func.isRequired,
    add_client: PropTypes.func.isRequired,
    addWork: PropTypes.func.isRequired,
    clients_list: PropTypes.array.isRequired,
    get_clients_detail: PropTypes.func.isRequired,
    addEvent: PropTypes.func.isRequired,
    deleateEvent: PropTypes.func.isRequired,
    updateEvent: PropTypes.func.isRequired,
  };
  generateWeek(startDate) {
    const daysInWeek = [];
    for (let i = 0; i < 7; i++) {
      daysInWeek.push(startDate.clone().add(i, 'days'));
    }
    return daysInWeek;
  }
  componentDidMount() {
    this.props.getMembers();
    this.props.get_stove();

    // store.dispatch({
    //     type: CALENDAR_MEMBER,
    //     payload: this.props.user,
    // });
    // this.setState({})
    this.props.getCalendar(
      this.props.member_user.id,
      this.state.next_week,
      this.state.prev_week,
      this.reff,
    );
    setTimeout(
      () => this.reff.current.scrollToIndex({index: 1, animated: false}),
      500,
    );

    // this.props.getCalendarNext(this.state.member);
    // this.props.getCalendarPrev(this.state.member, null);

    // this.setState({selectedValue: this.props.user.id})
  }
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
      const servisant = this.state.member;
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
      const servisant = this.state.member;
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
      const servisant = this.state.member;
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
  Next = event => {
    // const offsetX = event.nativeEvent.contentOffset.x;
    this.setState({flatListRefreshing: true});
    // if (offsetX <= 0) {
    this.props.getCalendarNext(this.state.member, this.reff);
    // }
    this.setState({flatListRefreshing: false});

    // this.setState({flatListRefreshing: false});
  };
  renderPreviousWeeks() {
    // this.setState({flatListRefreshing: true});
    // const firstWeek = this.state.weeks[0];
    // const previousWeek = this.generateWeek(
    //   firstWeek.clone().subtract(1, 'week'),
    // );
    // this.setState({weeks: [previousWeek, ...this.state.weeks]});
    // this.reff.current.scrollToIndex({index: 1, animated: false});
    // this.setState({flatListRefreshing: false});
    this.setState({flatListRefreshing: true});

    console.log(this.state.flatListRefreshing);
    console.log('elo');

    const firstWeek = this.state.weeks[0];
    if (!firstWeek) return; // Sprawdzenie, czy firstWeek istnieje
    const previousWeek = this.generateWeek(
      firstWeek[0].clone().subtract(1, 'week'),
    ); // Użyj pierwszego dnia pierwszego tygodnia
    this.setState(prevState => ({
      weeks: [previousWeek, ...prevState.weeks],
    }));
    this.reff.current.scrollToIndex({index: 1, animated: false});
    this.setState({flatListRefreshing: false});
  }
  renderNextWeek() {
    // const lastWeek = this.state.weeks[this.state.weeks.length - 1];
    // const nextWeek = this.generateWeek(lastWeek.clone().add(1, 'week'));
    // this.setState({weeks: [...this.state.weeks, nextWeek]});
    const lastWeek = this.state.weeks[this.state.weeks.length - 1][0];
    const nextWeek = this.generateWeek(lastWeek.clone().add(1, 'week'));
    this.setState(prevState => ({
      weeks: [...prevState.weeks, nextWeek],
    }));
  }

  handleScroll = event => {
    const offsetX = event.nativeEvent.contentOffset.x;

    if (offsetX <= 0) {
      this.setState({flatListRefreshing: true});
      console.log(this.state.flatListRefreshing);
      console.log('elo');
      const firstWeek = this.state.weeks[0];
      if (!firstWeek) return; // Sprawdzenie, czy firstWeek istnieje
      const previousWeek = this.generateWeek(
        firstWeek[0].clone().subtract(1, 'week'),
      ); // Użyj pierwszego dnia pierwszego tygodnia
      this.setState(prevState => ({
        weeks: [previousWeek, ...prevState.weeks],
      }));
      this.reff.current.scrollToIndex({index: 1, animated: false});

      this.setState({flatListRefreshing: false});
      console.log(this.state.flatListRefreshing);

      // this.reff.current.scrollToIndex({index: 1, animated: false});
      // this.props.getCalendarPrev(this.state.member, this.reff);
    }
    // this.setState({flatListRefreshing: false});
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
    const {members, event_detail} = this.props;
    const {
      member,
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
    } = this.state;
    const mon = this.props.mon.day;
    const state = this.state;

    const noBussy = data => (
      <TouchableOpacity
        key={data.id}
        onPress={() => {
          this.setState({showModalEvent: true}), this.props.getEvent(data.id);
        }}>
        <View style={data.done ? styles.btnDone : styles.btn}>
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
    );
    const isBussy = data => (
      <TouchableOpacity
        key={data.id}
        onPress={() => {
          this.setState({showModalEvent: true}), this.props.getEvent(data.id);
        }}>
        <View style={[styles.btn, {backgroundColor: 'red'}]}>
          {/* <Text style={styles.btnText}>{data.id}</Text> */}
          <Text style={styles.btnTextTime}>{data.description}</Text>
        </View>
      </TouchableOpacity>
    );

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
    const daysInWeek = item => {
      // console.log(daysInWeek);
      // console.log(this.today);
      return (
        <View>
          <View style={[styles.containert, {width: width}]}>
            {/* <> */}
            <Table borderStyle={{borderColor: 'red'}}>
              {/* {this.props.mon.map()} */}
              <TouchableOpacity>
                <Row
                  data={['Pon\n' + item[1].format('YYYY-MM-DD')]}
                  style={styles.head}
                  textStyle={styles.text}
                />
                <TableWrapper style={styles.cell}>
                  <Row data="" style={styles.singleHead} />
                  <TableWrapper style={{flexDirection: 'column'}}>
                    {/* {item.mon.events.map(event => (
                      <Cell
                        key={event.id}
                        data={element(event)}
                        textStyle={styles.text}
                      />
                    ))} */}
                    {/* <Cell data={element(3)} textStyle={styles.text}/> */}
                  </TableWrapper>
                </TableWrapper>
              </TouchableOpacity>
            </Table>
            <Table borderStyle={{borderColor: 'transparent'}}>
              <TouchableOpacity>
                <Row
                  data={['Wto\n' + item[2].format('YYYY-MM-DD')]}
                  style={styles.head}
                  textStyle={styles.text}
                />
                <TableWrapper style={styles.cell}>
                  <Row data="" style={styles.singleHead} />
                  <TableWrapper style={{flexDirection: 'column'}}>
                    {/* {item.tue.events.map(event => (
                      <Cell
                        key={event.id}
                        data={element(event)}
                        textStyle={styles.text}
                      />
                    ))} */}
                  </TableWrapper>
                </TableWrapper>
              </TouchableOpacity>
            </Table>
            <Table borderStyle={{borderColor: 'transparent'}}>
              <TouchableOpacity>
                <Row
                  data={['Śro\n' + item[3].format('YYYY-MM-DD')]}
                  style={styles.head}
                  textStyle={styles.text}
                />
                <TableWrapper style={styles.cell}>
                  {/* <Row data="" style={styles.singleHead}/> */}
                  <TableWrapper style={{flexDirection: 'column'}}>
                    {/* {item.wed.events.map(event => (
                      <Cell
                        key={event.id}
                        data={element(event)}
                        textStyle={styles.text}
                      />
                    ))} */}
                  </TableWrapper>
                </TableWrapper>
              </TouchableOpacity>
            </Table>
            <Table borderStyle={{borderColor: 'transparent'}}>
              <TouchableOpacity>
                <Row
                  data={['Czw\n' + item[4].format('YYYY-MM-DD')]}
                  style={styles.head}
                  textStyle={styles.text}
                />
                <TableWrapper style={styles.cell}>
                  {/* <Row data="" style={styles.singleHead}/> */}
                  <TableWrapper style={{flexDirection: 'column'}}>
                    {/* {item.thu.events.map(event => (
                      <Cell
                        key={event.id}
                        data={element(event)}
                        textStyle={styles.text}
                      />
                    ))} */}
                  </TableWrapper>
                </TableWrapper>
              </TouchableOpacity>
            </Table>
            <Table borderStyle={{borderColor: 'transparent'}}>
              <TouchableOpacity>
                <Row
                  data={['Pnt\n' + item[5].format('YYYY-MM-DD')]}
                  style={styles.head}
                  textStyle={styles.text}
                />
                <TableWrapper style={styles.cell}>
                  {/* <Row data="" style={styles.singleHead}/> */}
                  <TableWrapper style={{flexDirection: 'column'}}>
                    {/* {item.fri.events.map(event => (
                      <Cell
                        key={event.id}
                        data={element(event)}
                        textStyle={styles.text}
                      />
                    ))} */}
                  </TableWrapper>
                </TableWrapper>
              </TouchableOpacity>
            </Table>
            {/* </> */}
          </View>

          <View style={{height: height - 300}} />
        </View>
      );
    };

    const element = data => (
      <View style={{margin: 1}}>
        {data.bussy ? noBussy(data) : isBussy(data)}
      </View>
    );
    const {width, height} = Dimensions.get('window');
    return (
      <View style={{width: '100%', height: '100%'}}>
        <View style={styles.header}>
          <View style={[styles.headerAction]}>
            {/* <Image
              alt=""
              style={styles.headerImg}
              source={require('../assets/BeautyTEXTTRANSPARENTBLACK.png')}
            /> */}
          </View>

          <View style={[styles.headerAction, {alignItems: 'flex-end'}]}>
            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}>
              <FeatherIcon name="more-vertical" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.container}>
          {this.props.member_user.permissions == 'CE' ||
          this.props.member_user.permissions == 'SS' ? (
            <Picker
              selectedValue={member}
              style={{height: 30, width: 150}}
              // color = "#f194ff"
              onValueChange={(itemValue, itemIndex) => {
                this.setState({member: itemValue});
                // this.props.getCalendar(
                //   itemValue,
                //   this.state.next_week,
                //   this.state.prev_week,
                // );
                // console.log(this.props.tue.events)
                // console.log(this.props.tue.events)
              }}>
              <Picker.Item
                label={this.props.user.username}
                value={this.props.member_user.id}
              />
              {members.map(item => (
                <Picker.Item label={item.person.username} value={item.id} />
              ))}
            </Picker>
          ) : (
            <Text style={{flex: 1, paddingLeft: 10}}>
              {this.props.user.username}
            </Text>
          )}
          <View style={{flexDirection: 'column', paddingLeft: 10}}>
            <View style={{flexDirection: 'row', marginRight: 5}}>
              <TouchableOpacity>
                <Button
                  color="blue"
                  width="20px"
                  title="<<prev"
                  onPress={this.PrevWeek}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Button
                  color="green"
                  width="20px"
                  title="ten Tydzień"
                  onPress={this.Today}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Button
                  color="blue"
                  width="20px"
                  title="next>>"
                  onPress={this.NextWeek}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity>
              <Button
                color="purple"
                width="20px"
                title="odśwież"
                onPress={this.Reload}
              />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView style={styles.conter}>
          <FlatList
            ref={this.reff}
            data={this.state.weeks}
            keyExtractor={(item, index) => index}
            refreshing={this.state.flatListRefreshing}
            bounces={true}
            snapToInterval={width}
            // height={'100%'}
            horizontal
            onScroll={this.handleScroll}
            contentContainerStyle={{flexGrow: 1}}
            // contentContainerStyle={{height: 100}}
            removeClippedSubviews={true}
            maxToRenderPerBatch={3}
            initialNumToRender={1}
            showsHorizontalScrollIndicator={false}
            onEndReached={() => this.renderNextWeek()}
            // onEndReachedThreshold={0.7}
            // onEndReached={
            // null
            // this.Next
            // this.reff.current.scrollToIndex({index: 1, animated: false});
            // }
            // contentContainerStyle={styles.containerGap32}
            decelerationRate={4}
            renderItem={({item}) =>
              // <View style={{}}>

              daysInWeek(item)
            }
          />
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => ({
  user: state.auth.user,
  members: state.member.members,
  member_user: state.member.member_user,
  event_detail: state.calendar.event_detail,
  mon: state.calendar.mon,
  tue: state.calendar.tue,
  wed: state.calendar.wed,
  thu: state.calendar.thu,
  fri: state.calendar.fri,
  sat: state.calendar.sat,
  sun: state.calendar.sun,
  days: state.calendar.days,
  clients_list: state.clients.clients_list,
  clients_detail: state.clients.clients_detail,
  stove_list: state.stove.stove_list,
});

export default connect(mapStateToProps, {
  getMembers,
  add_client_to_calendar,
  getCalendar,
  getCalendarNext,
  getCalendarPrev,
  get_clients_list,
  get_clients_detail,
  addEvent,
  deleateEvent,
  updateEvent,
  getEvent,
  get_stove,
  add_stove,
  addWork,
})(Calendary);

const styles = StyleSheet.create({
  headerAction: {
    flex: 1,
    height: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 300,
    marginTop: 50,
  },

  modalView: {
    marginTop: 90,
    backgroundColor: 'white',
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
    paddingTop: 30,
    flexDirection: 'row',
    // height: '100%',
    justifyContent: 'center',
  },
  head: {height: 40, backgroundColor: '#808B97'},
  text: {margin: 0, textAlign: 'center', fontSize: 12},
  row: {flexDirection: 'row', backgroundColor: '#FFF1C1'},
  btn: {
    width: '100%',
    height: '100%',
    backgroundColor: '#78B7BB',
    borderRadius: 4,
  },
  btnDone: {
    width: '100%',
    height: '100%',
    backgroundColor: '#a0a01a',
    borderRadius: 4,
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
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonMake: {
    backgroundColor: '#ee7634',
  },
  buttonWork: {
    backgroundColor: '#90f880',
  },
  btnText: {textAlign: 'center', color: '#fff', fontSize: 12},
  btnTextTime: {textAlign: 'center', color: 'black', fontSize: 12},
  btnText2: {textAlign: 'center', fontSize: 9},
  singleHead: {width: 80, height: 40, backgroundColor: '#c8e1ff'},
});
