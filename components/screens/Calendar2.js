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
  ScrollView,
  Button,
  TouchableOpacity,
  Dimensions,
  FlatList,
  TextInput,
  Modal,
  Pressable,
  RefreshControl,
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
    const element = data => (
      <View style={{margin: 1}}>
        {data.bussy ? noBussy(data) : isBussy(data)}
      </View>
    );
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
      isLoadingPage,
    } = this.state;
    const {days, members, event_detail, weeks, member_calendar, refreshing} =
      this.props;
    return (
      <View style={{width: '100%', height: '100%'}}>
        <View style={styles.containerModal}>
          {/* <RefreshControl /> */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={workModal}
            onRequestClose={() => {
              this.hideModalWork;
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text>Opis:</Text>
                <View
                  style={{
                    width: 250,
                    // backgroundColor: "red",
                    borderBottomColor: '#000000',
                    borderWidth: 1,
                  }}>
                  <TextInput
                    multiline
                    numberOfLines={4}
                    onChangeText={description_work =>
                      this.setState({description_work: description_work})
                    }
                    value={description_work}
                    style={{padding: 10, width: '95%'}}></TextInput>
                </View>

                <Pressable
                  style={[styles.button, styles.buttonAdd]}
                  onPress={this.addWork}>
                  <Text>Dodaj</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={this.hideModalWork}>
                  <Text>Zamknij</Text>
                </Pressable>
                <View style={{flexDirection: 'row', marginTop: 20}}></View>
              </View>
            </View>
          </Modal>
          {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showModalEvent}
            onRequestClose={() => {
              this.hideModal;
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={{fontSize: 22, fontWeight: 'bold'}}>
                  Wydarzenie:
                </Text>
                {edit ? (
                  <View style={{alignItems: 'center'}}>
                    <Text style={styles.modalText}>{this.state.day}</Text>
                    <View
                      style={
                        bussy
                          ? {
                              flexDirection: 'row',
                              backgroundColor: 'lightblue',
                              borderRadius: 10,
                            }
                          : {
                              flexDirection: 'row',
                              backgroundColor: 'lightgrey',
                              borderRadius: 10,
                            }
                      }>
                      <Text style={{fontSize: 26}}>{'Godzina od    '}</Text>
                      <Picker
                        selectedValue={hourValue}
                        style={{height: 20, width: 100}}
                        // color = "#f194ff"
                        onValueChange={(itemValue, itemIndex) => {
                          this.setState({hourValue: itemValue});
                          // console.log(this.props.tue.events)
                          // console.log(this.props.tue.events)
                        }}>
                        {this.state.hours.map(item => (
                          <Picker.Item label={item} value={item} />
                        ))}
                      </Picker>
                      <Text style={{fontSize: 26}}>{'do '}</Text>
                      <Picker
                        selectedValue={hourValue2}
                        style={{height: 30, width: 100}}
                        // color = "#f194ff"
                        onValueChange={(itemValue, itemIndex) => {
                          this.setState({hourValue2: itemValue});
                          // console.log(this.props.tue.events)
                          // console.log(this.props.tue.events)
                        }}>
                        {this.state.hours.map(item => (
                          <Picker.Item label={item} value={item} />
                        ))}
                      </Picker>
                    </View>
                    <Text style={{fontSize: 18}}>Opis:</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginVertical: 8,
                        justifyContent: 'flex-start',
                        width: '100%',
                      }}>
                      <Text
                        style={{
                          fontSize: 18,
                          flex: 1,
                          width: '100%',
                          justifyContent: 'flex-start',
                        }}>
                        Przegląd
                      </Text>
                      <BouncyCheckbox
                        size={25}
                        fillColor="black"
                        unfillColor="#008888"
                        // text="Zajęty Termin"
                        isChecked={!overview}
                        style={{flex: 1, width: '100%'}}
                        iconStyle={{borderColor: 'black'}}
                        // textStyle={{ fontFamily: "JosefinSans-Regular" }}
                        onPress={bussy => {
                          this.setState({overview: !overview});
                        }}
                        // onValueChange={(newValue) => setToggleCheckBox(newValue)}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginVertical: 8,
                        justifyContent: 'flex-start',
                        width: '100%',
                      }}>
                      <Text
                        style={{
                          fontSize: 18,
                          flex: 1,
                          width: '100%',
                          justifyContent: 'flex-start',
                        }}>
                        Naprawa
                      </Text>
                      <BouncyCheckbox
                        size={25}
                        fillColor="black"
                        unfillColor="#FFFF00"
                        isChecked={!rep}
                        // text="Zajęty Termin"
                        style={{flex: 1, width: '100%'}}
                        iconStyle={{borderColor: 'black'}}
                        // textStyle={{ fontFamily: "JosefinSans-Regular" }}
                        onPress={bussy => {
                          this.setState({rep: !rep});
                        }}
                        // onValueChange={(newValue) => setToggleCheckBox(newValue)}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginVertical: 8,
                        justifyContent: 'flex-start',
                        width: '100%',
                      }}>
                      <Text
                        style={{
                          fontSize: 18,
                          flex: 1,
                          width: '100%',
                          justifyContent: 'flex-start',
                        }}>
                        Uruchomienie
                      </Text>
                      <BouncyCheckbox
                        size={25}
                        fillColor="black"
                        unfillColor="#FF00FF"
                        isChecked={!activation}
                        // text="Zajęty Termin"
                        style={{flex: 1, width: '100%'}}
                        iconStyle={{borderColor: 'black'}}
                        // textStyle={{ fontFamily: "JosefinSans-Regular" }}
                        onPress={bussy => {
                          this.setState({activation: !activation});
                        }}
                        // onValueChange={(newValue) => setToggleCheckBox(newValue)}
                      />
                    </View>
                    <View
                      style={{
                        width: 250,
                        // backgroundColor: "red",
                        borderBottomColor: '#000000',
                        borderWidth: 1,
                      }}>
                      <TextInput
                        placeholder="Opis"
                        style={{margin: 10}}
                        numberOfLines={4}
                        // keyboardType={"numeric"}
                        value={desc}
                        name="desc"
                        onChangeText={desc => this.setState({desc: desc})}
                      />
                    </View>
                    <Text style={{fontSize: 18}}>Klient:</Text>

                    <TouchableOpacity
                      disabled={!bussy}
                      style={
                        bussy
                          ? [
                              styles.buttonClient,
                              {backgroundColor: 'lightblue'},
                            ]
                          : styles.buttonOpen
                      }
                      onPress={this.showModal2}>
                      {this.props.clients_detail ? (
                        <Text style={[styles.textStyle, {fontSize: 22}]}>
                          {this.props.clients_detail.first_name}
                        </Text>
                      ) : (
                        <Text style={[styles.textStyle, {fontSize: 22}]}>
                          Wybierz klienta
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    {event_detail.bussy ? (
                      <View>
                        <Text style={styles.dateText}>
                          Data: {event_detail.data_wizyty}
                        </Text>
                        <Text style={styles.timeText}>
                          Godzina: {event_detail.godzina_wizyty.substring(0, 2)}
                          -{event_detail.godzina_wizyty2.substring(0, 2)}
                        </Text>

                        {event_detail.client ? (
                          <View>
                            <Text style={styles.textEvent}>
                              {event_detail.client.first_name}
                            </Text>
                            <Text style={styles.textEvent}>
                              {event_detail.client.town} Ul:{' '}
                              {event_detail.client.street}{' '}
                              {event_detail.client.nr_house}
                            </Text>
                            <Text style={styles.textEvent}>
                              Tel: {event_detail.client.tel}
                            </Text>
                          </View>
                        ) : (
                          <View></View>
                        )}
                        {event_detail.overview ? null : (
                          <Text
                            style={[
                              styles.TextStyle3,
                              {
                                color: '#008888',
                                textShadowColor: 'black',
                                textShadowOffset: {width: 1},
                                textShadowRadius: 1,
                              },
                            ]}>
                            - Przegląd
                          </Text>
                        )}
                        {event_detail.rep ? null : (
                          <Text
                            style={[
                              styles.TextStyle3,
                              {
                                color: '#FFFF00',
                                textShadowColor: 'black',
                                textShadowOffset: {width: 1},
                                textShadowRadius: 1,
                              },
                            ]}>
                            - Naprawa
                          </Text>
                        )}
                        {event_detail.activation ? null : (
                          <Text
                            style={[
                              styles.TextStyle3,
                              {
                                color: '#FF00FF',
                                textShadowColor: 'black',
                                textShadowOffset: {width: 1},
                                textShadowRadius: 1,
                              },
                            ]}>
                            - Uruchomienie
                          </Text>
                        )}
                        <Text style={styles.textEvent}>
                          Opis: {event_detail.description}
                        </Text>
                        {event_detail.client ? (
                          <View
                            style={{
                              justifyContent: 'center',
                              marginTop: 20,
                            }}>
                            <TouchableOpacity
                              onPress={() =>
                                this.makeCall(event_detail.client.tel)
                              }
                              activeOpacity={0.7}
                              style={styles.touchableButton}>
                              <Text style={styles.TextStyle2}>Zadzwoń</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() => this.makeNAV(event_detail.client)}
                              activeOpacity={0.7}
                              style={styles.touchableButton2}>
                              <Text style={styles.TextStyle2}>Nawiguj</Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <View></View>
                        )}
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                          }}>
                          {!this.props.event_detail.done ? (
                            <Pressable
                              style={[styles.button, styles.buttonMake]}
                              onPress={this.Done}>
                              <Text>Zrobione</Text>
                            </Pressable>
                          ) : (
                            <Pressable
                              style={[styles.button, styles.buttonMake]}
                              onPress={this.noDone}>
                              <Text> Nie Zrobione</Text>
                            </Pressable>
                          )}
                          {this.props.event_detail.bussy ? (
                            <Pressable
                              style={[styles.button, styles.buttonWork]}
                              onPress={() => {
                                this.setState({workModal: true});
                              }}>
                              <Text>Naprawa</Text>
                            </Pressable>
                          ) : (
                            <View></View>
                          )}
                        </View>
                      </View>
                    ) : (
                      <View
                        style={{
                          backgroundColor: 'red',
                          borderRadius: 10,
                          margin: 10,
                          padding: 5,
                        }}>
                        <Text style={[styles.dateText, {color: 'white'}]}>
                          Data: {event_detail.data_wizyty}
                        </Text>
                        <Text style={{color: 'white'}}>
                          Opis: {event_detail.description}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
                <View style={{flexDirection: 'row', marginTop: 20}}>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.buttonClose,
                      {backgroundColor: 'red', width: 90},
                    ]}
                    onPress={this.DeleateEvent}>
                    <Text style={styles.textStyle}>Usuń</Text>
                  </TouchableOpacity>
                  {!edit ? (
                    <TouchableOpacity
                      style={[
                        styles.button,
                        styles.buttonClose,
                        {backgroundColor: 'blue', width: 90},
                      ]}
                      onPress={this.Edit}>
                      <Text style={styles.textStyle}>Edytuj</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[
                        styles.button,
                        styles.buttonClose,
                        {backgroundColor: 'green', width: 90},
                      ]}
                      onPress={this.Save}>
                      <Text style={styles.textStyle}>Zapisz</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.buttonClose,
                      {backgroundColor: 'grey', width: 90},
                    ]}
                    onPress={this.hideModal3}>
                    <Text style={styles.textStyle}>Zamknij</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              this.hideModal;
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={{fontSize: 22, fontWeight: 'bold'}}>
                  Dodaj Wizytesssss:
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <BouncyCheckbox
                    size={25}
                    fillColor="red"
                    unfillColor="#FFFFFF"
                    // text="Zajęty Termin"
                    iconStyle={{borderColor: 'red'}}
                    // textStyle={{ fontFamily: "JosefinSans-Regular" }}
                    onPress={bussy => {
                      this.setState({bussy: !bussy}),
                        store.dispatch({type: CLEAR_CLIENTS_DETAIL});
                    }}
                    // onValueChange={(newValue) => setToggleCheckBox(newValue)}
                  />
                  <Text style={{fontSize: 18}}>zajęty termin</Text>
                </View>

                <View
                  style={
                    bussy
                      ? {
                          flexDirection: 'row',
                          backgroundColor: 'lightblue',
                          borderRadius: 10,
                        }
                      : {
                          flexDirection: 'row',
                          backgroundColor: 'lightgrey',
                          borderRadius: 10,
                        }
                  }>
                  <Text style={{fontSize: 15}}>{'Godzina od    '}</Text>
                  <Picker
                    selectedValue={hourValue}
                    style={{height: 20, width: 100}}
                    // color = "#f194ff"
                    onValueChange={(itemValue, itemIndex) => {
                      this.setState({hourValue: itemValue});
                      // console.log(this.props.tue.events)
                      // console.log(this.props.tue.events)
                    }}>
                    {this.state.hours.map(item => (
                      <Picker.Item label={item} value={item} />
                    ))}
                  </Picker>
                  <Text style={{fontSize: 15}}>{'do'}</Text>
                  <Picker
                    selectedValue={hourValue2}
                    style={{height: 30, width: 100}}
                    // color = "#f194ff"
                    onValueChange={(itemValue, itemIndex) => {
                      this.setState({hourValue2: itemValue});
                      // console.log(this.props.tue.events)
                      // console.log(this.props.tue.events)
                    }}>
                    {this.state.hours.map(item => (
                      <Picker.Item label={item} value={item} />
                    ))}
                  </Picker>
                </View>
                <Text style={{fontSize: 18}}>Opis:</Text>

                <View style={[styles.radioWrapper]}>
                  <TouchableOpacity
                  // onPress={() => {
                  //   setValue(index);
                  // }}
                  >
                    <View style={styles.radio}>
                      <View style={styles.radioIcon}>
                        <FeatherIcon color="#fff" name={'eye'} size={20} />
                      </View>

                      <Text style={styles.radioLabel}>{'Przegląd'}</Text>

                      <View
                        style={[
                          styles.radioCheck,
                          // isActive && styles.radioCheckActive,
                        ]}></View>
                    </View>
                  </TouchableOpacity>
                </View>
                {/* <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: 4,
                    justifyContent: 'flex-start',
                    width: '100%',
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      flex: 1,
                      width: '100%',
                      justifyContent: 'flex-start',
                    }}>
                    Przegląd
                  </Text>
                  <BouncyCheckbox
                    size={25}
                    fillColor="black"
                    unfillColor="#008888"
                    // text="Zajęty Termin"
                    style={{flex: 1, width: '100%'}}
                    iconStyle={{borderColor: 'black'}}
                    // textStyle={{ fontFamily: "JosefinSans-Regular" }}
                    onPress={overview => {
                      this.setState({overview: !this.state.overview});
                    }}
                    // onValueChange={(newValue) => setToggleCheckBox(newValue)}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: 4,

                    justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  <Text
                    style={{
                      fontSize: 18,

                      width: '100%',
                      justifyContent: 'center',
                    }}>
                    Naprawa
                  </Text>
                  <BouncyCheckbox
                    size={25}
                    fillColor="black"
                    unfillColor="#FFFF00"
                    // text="Zajęty Termin"
                    style={{}}
                    iconStyle={{justifyContent: 'center', marginLeft: 'auto'}}
                    // textStyle={{ fontFamily: "JosefinSans-Regular" }}
                    onPress={rep => {
                      this.setState({rep: !this.state.rep});
                    }}
                    // onValueChange={(newValue) => setToggleCheckBox(newValue)}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: 4,
                    justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      flex: 1,
                      width: '100%',
                      justifyContent: 'space-between',
                    }}>
                    Uruchomienie
                  </Text>
                  <BouncyCheckbox
                    size={25}
                    fillColor="black"
                    unfillColor="#FF00FF"
                    // text="Zajęty Termin"
                    style={{flex: 1, width: '100%'}}
                    iconStyle={{borderColor: 'black'}}
                    // textStyle={{ fontFamily: "JosefinSans-Regular" }}
                    onPress={activation => {
                      this.setState({activation: !this.state.activation});
                    }}
                    // onValueChange={(newValue) => setToggleCheckBox(newValue)}
                  />
                </View>
                <View
                  style={{
                    width: 250,
                    // backgroundColor: "red",
                    borderBottomColor: '#000000',
                    borderWidth: 1,
                  }}>
                  <TextInput
                    placeholder="Opis"
                    style={{margin: 10}}
                    numberOfLines={4}
                    // keyboardType={"numeric"}
                    value={desc}
                    name="desc"
                    onChangeText={desc => this.setState({desc: desc})}
                  />
                </View> */}
                <Text style={{fontSize: 18}}>Klient:</Text>

                <TouchableOpacity
                  disabled={!bussy}
                  style={bussy ? styles.buttonClient : styles.buttonOpen}
                  onPress={this.showModal2}>
                  {this.props.clients_detail ? (
                    <Text style={[styles.textStyle, {fontSize: 22}]}>
                      {this.props.clients_detail.first_name}{' '}
                    </Text>
                  ) : (
                    <Text style={[styles.textStyle, {fontSize: 22}]}>
                      Wybierz klienta
                    </Text>
                  )}
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    marginBottom: 20,
                  }}>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.buttonClose,
                      {backgroundColor: 'green', width: 100},
                    ]}
                    onPress={this.addVisit}>
                    <Text style={styles.textStyle}>Dodaj</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.buttonClose,
                      {backgroundColor: 'red', width: 100},
                    ]}
                    onPress={this.hideModal}>
                    <Text style={styles.textStyle}>Zamknij</Text>
                  </TouchableOpacity>
                </View>

                {/* <Button onPress={()=>console.log(this.state.phones)} title={"sdasd"}/> */}
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalStove}
            onRequestClose={() => {
              this.setState({modalStove: false});
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={{fontSize: 22, fontWeight: 'bold'}}>
                  Dodaj Piec
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    flexDirection: 'row',
                    margin: 15,
                  }}>
                  <Text
                    style={[
                      styles.tekst,
                      {flex: 1, width: '100%', fontSize: 26},
                    ]}>
                    Nazwa:{' '}
                  </Text>
                  <TextInput
                    placeholder="Nazwa"
                    value={name}
                    height={40}
                    backgroundColor={'lightblue'}
                    name="name"
                    style={{paddingLeft: 5, flex: 1, width: '100%'}}
                    // onChangeText={}
                    // scrollto={true}
                    onChangeText={name => this.setState({name: name})}
                    // secureTextEntry
                  />
                </View>
                <View style={{flexDirection: 'row', marginTop: 40}}>
                  <Pressable
                    style={[styles.button, styles.buttonAdd, {width: 100}]}
                    onPress={this.addStove}>
                    <Text style={styles.textStyle}>Dodaj</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonClose, {width: 100}]}
                    onPress={this.closeStove}>
                    <Text style={styles.textStyle}>Zamknij</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleClientAdd}
            onRequestClose={() => {
              this.setState({modalVisibleClientAdd: false});
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    fontSize: 26,
                    marginBottom: 20,
                  }}>
                  Dodaj Klienta
                </Text>
                <View
                  style={[
                    {flexDirection: 'row', borderWidth: 1},
                    styles.tekst3,
                  ]}>
                  <Text style={[styles.tekst3, {flex: 1, width: '100%'}]}>
                    Imie i Nazwisko:{' '}
                  </Text>
                  <TextInput
                    style={{flex: 1, width: '100%'}}
                    placeholder="Imie i Nazwisko"
                    value={first_name}
                    name="first_name"
                    backgroundColor="lightblue"
                    // borderRadius={10}
                    padding={3}
                    // onChangeText={}
                    // scrollto={true}
                    onChangeText={first_name =>
                      this.setState({first_name: first_name})
                    }
                    // secureTextEntry
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    borderWidth: 1,
                    marginTop: 1,
                  }}>
                  <Text style={[{flex: 1, width: '100%'}, styles.tekst3]}>
                    Miejscowość:{' '}
                  </Text>
                  <TextInput
                    style={{flex: 1, width: '100%'}}
                    placeholder="Miejscowość"
                    value={town}
                    name="town"
                    backgroundColor="lightblue"
                    // borderRadius={10}
                    padding={3}
                    // onChangeText={}
                    // scrollto={true}
                    onChangeText={town => this.setState({town: town})}
                    // secureTextEntry
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderWidth: 1,
                    marginTop: 1,
                  }}>
                  <Text style={[{flex: 1, width: '100%'}, styles.tekst3]}>
                    Ulica:{' '}
                  </Text>
                  <TextInput
                    style={{flex: 1, width: '100%'}}
                    placeholder="Ulica"
                    value={street}
                    name="street"
                    backgroundColor="lightblue"
                    // borderRadius={10}
                    padding={3}
                    // onChangeText={}
                    // scrollto={true}
                    onChangeText={street => this.setState({street: street})}
                    // secureTextEntry
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderWidth: 1,
                    marginTop: 1,
                  }}>
                  <Text style={[{flex: 1, width: '100%'}, styles.tekst3]}>
                    Nr:{' '}
                  </Text>
                  <TextInput
                    style={{flex: 1, width: '100%'}}
                    placeholder="Nr"
                    value={nr_house}
                    name="nr_house"
                    backgroundColor="lightblue"
                    // borderRadius={10}
                    padding={3}
                    // onChangeText={}
                    // scrollto={true}
                    onChangeText={nr_house =>
                      this.setState({nr_house: nr_house})
                    }
                    // secureTextEntry
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderWidth: 1,
                    marginTop: 1,
                  }}>
                  <Text style={[{flex: 1, width: '100%'}, styles.tekst3]}>
                    Tel:{' '}
                  </Text>
                  <TextInput
                    style={{flex: 1, width: '100%'}}
                    placeholder="+48 000-000-000"
                    value={tel}
                    name="tel"
                    keyboardType="numeric"
                    backgroundColor="lightblue"
                    // borderRadius={10}
                    padding={3}
                    // onChangeText={}
                    // scrollto={true}
                    onChangeText={tel => this.setState({tel: tel})}
                    // secureTextEntry
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    backgroundColor: 'lightblue',
                    borderRadius: 10,
                    margin: 15,
                  }}>
                  <Picker
                    selectedValue={stove}
                    style={{height: 50, width: 200}}
                    // color = "#f194ff"
                    onValueChange={stove => this.setState({stove: stove})}>
                    <Picker.Item label={'Brak Pieca'} value={null} />
                    {this.props.stove_list.map(item => (
                      <Picker.Item label={item.name} value={item.id} />
                    ))}
                  </Picker>
                  <Pressable
                    style={[
                      styles.button,
                      styles.buttonAdd,
                      {borderRadius: 10, marginTop: 10},
                    ]}
                    onPress={this.showModalStove}>
                    <Text style={styles.textStyle}>Dodaj Piec</Text>
                  </Pressable>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Pressable
                    style={[styles.button, styles.buttonAdd, {width: 100}]}
                    onPress={this.addClient}>
                    <Text style={styles.textStyle}>Dodaj</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonClose, {width: 100}]}
                    onPress={() =>
                      this.setState({modalVisibleClientAdd: false})
                    }>
                    <Text style={styles.textStyle}>Zamknij</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleClient}
            onRequestClose={() => {
              this.hideModal2;
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={{fontSize: 22, fontWeight: 'bold'}}>Klienci:</Text>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.buttonClose,
                    {width: '100%', backgroundColor: 'grey'},
                  ]}
                  onPress={() => {
                    store.dispatch({type: CLEAR_CLIENTS_DETAIL}),
                      this.setState({modalVisibleClient: false});
                  }}>
                  <Text style={styles.textStyle}>Bez Klienta</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.buttonClose,
                    {width: '100%', backgroundColor: 'darkgreen'},
                  ]}
                  onPress={() => {
                    this.setState({modalVisibleClientAdd: true});
                  }}>
                  <Text style={styles.textStyle}>Dodaj Klienta+</Text>
                </TouchableOpacity>
                <View style={{flexDirection: 'row'}}>
                  <TextInput
                    style={styles.search}
                    placeholder="search"
                    value={search}
                    name="search"
                    // onChangeText={}
                    // scrollto={true}
                    onChangeText={search => this.setState({search: search})}
                    // secureTextEntry
                  />
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClient]}
                    onPress={this.Search}>
                    <Text style={styles.textStyle}>Szukaj</Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  style={{width: '100%'}}
                  data={this.props.clients_list.results}
                  renderItem={renderItem}
                  keyExtractor={item => item.id}
                />

                <Button
                  style={[styles.inputContainer]}
                  title="Zamknij"
                  color={'red'}
                  onPress={() => this.setState({modalVisibleClient: false})}
                />
              </View>
            </View>
          </Modal>
        </View>

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
              <Picker
                selectedValue={member_calendar}
                style={{height: 30, width: 150}}
                // color = "#f194ff"
                onValueChange={(itemValue, itemIndex) => {
                  this.props.changeMemberCalendar(itemValue);
                  this.props.getCalendarv6(itemValue);
                }}>
                <Picker.Item label={this.props.user.username} value={member} />
                {members.map(item => (
                  <Picker.Item label={item.person.username} value={item} />
                ))}
              </Picker>
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
              <FeatherIcon name="chevrons-down" size={24} color="white" />
              {/* <FeatherIcon name="more-vertical" size={24} /> */}
            </TouchableOpacity>
          </View>
        </View>

        <View style={{width: '100%', height: '100%'}}>
          {/* <View style={styles.container}>
          {this.props.member_user.permissions == 'CE' ||
          this.props.member_user.permissions == 'SS' ? (
            <Picker
              selectedValue={member}
              style={{height: 30, width: 150}}
              // color = "#f194ff"
              onValueChange={(itemValue, itemIndex) => {
                this.setState({member: itemValue}),
                  this.props.getCalendar(
                    itemValue,
                    this.state.next_week,
                    this.state.prev_week,
                  );
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
        </View> */}
          <ScrollView
            horizontal
            pagingEnabled
            // onScrollEndDrag={this.handleScrollEnd}
            showsHorizontalScrollIndicator={false}
            ref={this.reff}
            onScroll={this.handleScroll}
            scrollEventThrottle={0} // Częstotliwość zdarzenia onScroll
            // scrollTo={}
          >
            {weeks.map((item, index) => (
              <View key={index} style={styles.screen}>
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
                          data={['Pon\n' + item[1].format('YYYY-MM-DD')]}
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
                                      data={element(event)}
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
                          data={['Wto\n' + item[2].format('YYYY-MM-DD')]}
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
                                      data={element(event)}
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
                          data={['Śro\n' + item[3].format('YYYY-MM-DD')]}
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
                                      data={element(event)}
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
                          data={['Czw\n' + item[4].format('YYYY-MM-DD')]}
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
                                      data={element(event)}
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
                          data={['Pnt\n' + item[5].format('YYYY-MM-DD')]}
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
                                      data={element(event)}
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
            ))}
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
  screen: {
    width,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  headerBadge: {
    backgroundColor: 'red',
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAction: {
    flex: 1,
    height: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  header: {
    height: 50,
    paddingHorizontal: 10,
    backgroundColor: '#d3e0fe',
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
  },

  modalView: {
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
  head: {height: 40, backgroundColor: '#808B97', borderRadius: 2, margin: 1},
  head1: {height: 40, backgroundColor: '#d4df00', borderRadius: 2, margin: 1},
  text: {margin: 0, textAlign: 'center', fontSize: 12},
  row: {flexDirection: 'row', backgroundColor: '#FFF1C1'},
  btn: {
    width: '100%',
    height: '100%',
    backgroundColor: '#a4c2f5',
    borderRadius: 4,
  },
  btnDone: {
    width: '100%',
    height: '100%',
    backgroundColor: '#999999',
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
  btnText: {textAlign: 'center', color: '#fff', fontSize: 12},
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
});
