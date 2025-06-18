import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {addWork} from '../actions/works';

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
  NativeModules,
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

export class CalendarWeek extends Component {
  componentDidMount() {
    // Ustawienie nasłuchiwania zdarzenia
    this.listener = this.props.navigation.addListener('focus', () => {
      //   this.props.getCalendarNext(this.props.member_user.id);
    });
  }

  componentWillUnmount() {
    // Usunięcie nasłuchiwania zdarzenia przed odmontowaniem komponentu
    this.listener();
  }
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

    const element = data => (
      <View style={{margin: 1}}>
        {data.bussy ? noBussy(data) : isBussy(data)}
      </View>
    );
    const {width, height} = Dimensions.get('window');
    return (
      <Fragment>
        <View style={{width: '100%', height: '100%'}}>
          <ScrollView style={styles.conter}>
            <View style={{}}>
              <View>
                <View style={[styles.containert, {width: width}]}>
                  <Table borderStyle={{borderColor: 'red'}}>
                    {/* {this.props.mon.map()} */}
                    <TouchableOpacity
                      onPress={() => {
                        this.showModal(),
                          this.setState({
                            day: this.props.mon.day,
                            eventDay: 0,
                            phones: cellphones(this.props.mon.events),
                          });
                      }}>
                      <Row
                        data={['Pon\n' + this.props.mon.day]}
                        style={styles.head}
                        textStyle={styles.text}
                      />
                      <TableWrapper style={styles.cell}>
                        <Row data="" style={styles.singleHead} />
                        <TableWrapper style={{flexDirection: 'column'}}>
                          {this.props.mon.events.map(event => (
                            <Cell
                              key={event.id}
                              data={element(event)}
                              textStyle={styles.text}
                            />
                          ))}
                          {/* <Cell data={element(3)} textStyle={styles.text}/> */}
                        </TableWrapper>
                      </TableWrapper>
                    </TouchableOpacity>
                  </Table>
                  <Table borderStyle={{borderColor: 'transparent'}}>
                    <TouchableOpacity
                      onPress={() => {
                        this.showModal(),
                          this.setState({
                            day: this.props.tue.day,
                            eventDay: 1,
                            phones: cellphones(this.props.tue.events),
                          });
                      }}>
                      <Row
                        data={['Wto\n' + this.props.tue.day]}
                        style={styles.head}
                        textStyle={styles.text}
                      />
                      <TableWrapper style={styles.cell}>
                        <Row data="" style={styles.singleHead} />
                        <TableWrapper style={{flexDirection: 'column'}}>
                          {this.props.tue.events.map(event => (
                            <Cell
                              key={event.id}
                              data={element(event)}
                              textStyle={styles.text}
                            />
                          ))}
                        </TableWrapper>
                      </TableWrapper>
                    </TouchableOpacity>
                  </Table>
                  <Table borderStyle={{borderColor: 'transparent'}}>
                    <TouchableOpacity
                      onPress={() => {
                        this.showModal(),
                          this.setState({
                            day: this.props.wed.day,
                            eventDay: 2,
                            phones: cellphones(this.props.wed.events),
                          });
                      }}>
                      <Row
                        data={['Śro\n' + this.props.wed.day]}
                        style={styles.head}
                        textStyle={styles.text}
                      />
                      <TableWrapper style={styles.cell}>
                        {/* <Row data="" style={styles.singleHead}/> */}
                        <TableWrapper style={{flexDirection: 'column'}}>
                          {this.props.wed.events.map(event => (
                            <Cell
                              key={event.id}
                              data={element(event)}
                              textStyle={styles.text}
                            />
                          ))}
                        </TableWrapper>
                      </TableWrapper>
                    </TouchableOpacity>
                  </Table>
                  <Table borderStyle={{borderColor: 'transparent'}}>
                    <TouchableOpacity
                      onPress={() => {
                        this.showModal(),
                          this.setState({
                            day: this.props.thu.day,
                            eventDay: 3,
                            phones: cellphones(this.props.thu.events),
                          });
                      }}>
                      <Row
                        data={['Czw\n' + this.props.thu.day]}
                        style={styles.head}
                        textStyle={styles.text}
                      />
                      <TableWrapper style={styles.cell}>
                        {/* <Row data="" style={styles.singleHead}/> */}
                        <TableWrapper style={{flexDirection: 'column'}}>
                          {this.props.thu.events.map(event => (
                            <Cell
                              key={event.id}
                              data={element(event)}
                              textStyle={styles.text}
                            />
                          ))}
                        </TableWrapper>
                      </TableWrapper>
                    </TouchableOpacity>
                  </Table>
                  <Table borderStyle={{borderColor: 'transparent'}}>
                    <TouchableOpacity
                      onPress={() => {
                        this.showModal(),
                          this.setState({
                            day: this.props.fri.day,
                            eventDay: 4,
                            phones: cellphones(this.props.fri.events),
                          });
                      }}>
                      <Row
                        data={['Pnt\n' + this.props.fri.day]}
                        style={styles.head}
                        textStyle={styles.text}
                      />
                      <TableWrapper style={styles.cell}>
                        {/* <Row data="" style={styles.singleHead}/> */}
                        <TableWrapper style={{flexDirection: 'column'}}>
                          {this.props.fri.events.map(event => (
                            <Cell
                              key={event.id}
                              data={element(event)}
                              textStyle={styles.text}
                            />
                          ))}
                        </TableWrapper>
                      </TableWrapper>
                    </TouchableOpacity>
                  </Table>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  member_user: state.member.member_user,
  members: state.member.members,
  mon: state.calendar.mon,
  tue: state.calendar.tue,
  wed: state.calendar.wed,
  thu: state.calendar.thu,
  fri: state.calendar.fri,
  sat: state.calendar.sat,
  sun: state.calendar.sun,
  days: state.calendar.days,
});

export default connect(mapStateToProps, {
  add_client_to_calendar,
  getCalendar,
  getCalendarNext,
  getCalendarPrev,
  addEvent,
  deleateEvent,
  updateEvent,
})(CalendarWeek);

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
