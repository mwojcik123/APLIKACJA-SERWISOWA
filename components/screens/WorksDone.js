import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import store from '../store';
import {add_stove} from '../actions/stove';
import {
  getWorks,
  getWorksServisant,
  getWorkDetail,
  updateWork,
  deleateWork,
  getWorksDone,
  updateWorkDone,
  worksDone,
  updateWorkNotDone,
  get_works_done_next_page,
} from '../actions/works';
import {Picker} from '@react-native-picker/picker';
import {WORKS_DETAIL_CLEAR} from '../actions/types';
import LinearGradient from 'react-native-linear-gradient';
import FeatherIcon from 'react-native-vector-icons/Feather';
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
  Linking,
  Platform,
  Pressable,
  FlatList,
  Dimensions,
  RefreshControl,
} from 'react-native';
const {width, height} = Dimensions.get('window');
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

export class Works extends Component {
  state = {
    search: '',
    page: 1,
    modalVisible: false,
    description_work: '',
    first_name: '',
    second_name: '',
    town: '',
    street: '',
    nr_house: '',
    name: '',
    stove: null,
    tel: '',
    edit: false,
    click: false,
    MY: true,
    ALL: false,
    DONE: false,
  };
  static propTypes = {
    works_list_done: PropTypes.object.isRequired,
    works_loading: PropTypes.bool.isRequired,
  };
  componentDidMount() {
    // Ustawienie nasłuchiwania zdarzenia
    this.listener = this.props.navigation.addListener('focus', () => {
      this.props.worksDone();
    });
    this.props.getWorksDone();
    // });
  }

  componentWillUnmount() {
    // Usunięcie nasłuchiwania zdarzenia przed odmontowaniem komponentu
    this.listener();
  }
  //   // onChange = (e) => this.setState({ [e.target.name]: e.target.value });
  //   showModal = (data) => {
  //     this.setState({ modalVisible: true });
  //     this.props.get_stove();
  //   };

  hideModal = e => {
    this.setState({modalVisible: false, description_work: ''});
  };
  //   showModal2 = (data) => {
  //     this.setState({ modalVisible2: true });
  //   };
  showModal = e => {
    this.setState({modalVisible: true});
  };

  onRefresh = e => {
    this.props.getWorksDone();
  };
  //   showModal3 = (data) => {
  //     this.setState({ modalVisible3: true });
  //   };
  //   hideModal3 = (e) => {
  //     store.dispatch({ type: CLEAR_CLIENTS_DETAIL });
  //     this.setState({ modalVisible3: false, edit: false });
  //     this.setState({
  //       first_name: "",
  //       second_name: "",
  //       stove: null,
  //       town: "",
  //       street: "",
  //       nr_house: "",
  //       tel: "",
  //     });
  //   };
  //   hideModal4 = (e) => {
  //     this.setState({ modalVisible4: false });
  //   };

  onChange = e => this.setState({[e.target.name]: e.target.value});

  onChangeMY = e => {
    this.setState({MY: true, ALL: false, DONE: false});
    this.props.getWorksServisant();
  };
  onChangeALL = e => {
    this.setState({MY: false, ALL: true, DONE: false});
    this.props.getWorks();
  };
  onChangeDONE = e => {
    this.setState({MY: false, ALL: false, DONE: true});
    this.props.getWorksDone();
  };
  //   makeCall = (tel) => {
  //     let phoneNumber = "";

  //     if (Platform.OS === "android") {
  //       phoneNumber = `tel:${tel}`;
  //     } else {
  //       phoneNumber = `telprompt:${tel}`;
  //     }

  //     Linking.openURL(phoneNumber);
  //   };
  edit = e => {
    this.setState({
      edit: !this.state.edit,
      description_work: this.props.works_detail.description_work,
    });
  };
  Done = e => {
    this.setState({modalVisible: false, edit: false});
    const body = JSON.stringify({
      done: true,
    });
    this.props.updateWorkDone(body, this.props.works_detail.id);
  };
  NoDone = e => {
    this.setState({modalVisible: false, edit: false});
    const body = JSON.stringify({
      done: false,
    });
    this.props.updateWorkNotDone(body, this.props.works_detail.id);
  };
  //   lastVisits = (e) => {
  //     this.props.getClientEvents(this.props.clients_detail.id);
  //     this.setState({ modalVisible4: true });
  //   };
  save = e => {
    this.setState({modalVisible: false, edit: false});
    const {description_work} = this.state;
    const servisant = this.props.works_detail.servisant.id;
    const event = this.props.works_detail.event.id;

    const body = JSON.stringify({
      description_work,
      servisant,
      event,
    });
    this.setState({
      description_work: '',
    });
    this.props.updateWork(body, this.props.works_detail.id);
  };
  //   deleate = (e) => {
  //       this.prop
  //   }
  //   Search = (e) => {
  //     e.preventDefault();
  //     const { search, page } = this.state;
  //     this.props.get_clients_list(search, page);
  //   };
  //   pagePrev = (e) => {
  //     e.preventDefault();
  //     const { search, page } = this.state;
  //     this.setState({ page: this.state.page - 1 });
  //     this.props.get_clients_list(search, page - 1);
  //   };
  //   pageNext = (e) => {
  //     e.preventDefault();
  //     const { search, page } = this.state;
  //     this.setState({ page: this.state.page + 1 });
  //     this.props.get_clients_list(search, page + 1);
  //   };
  //   addClient = (e) => {
  //     const { first_name, second_name, stove, town, street, nr_house, tel } =
  //       this.state;
  //     const body = JSON.stringify({
  //       first_name,
  //       second_name,
  //       stove,
  //       town,
  //       street,
  //       nr_house,
  //       tel,
  //     });
  //     console.log(body);
  //     this.setState({ modalVisible: false });
  //     this.setState({
  //       first_name: "",
  //       second_name: "",
  //       stove: null,
  //       town: "",
  //       street: "",
  //       nr_house: "",
  //       tel: "",
  //     });
  //     this.props.add_client(body);
  //   };
  //   addStove = (e) => {
  //     const { name } = this.state;
  //     const body = JSON.stringify({ name });
  //     console.log(body);
  //     this.setState({ modalVisible2: false });
  //     this.setState({ name: "" });
  //     this.props.add_stove(body);
  //   };
  render() {
    const {modalVisible, description_work, edit, click, MY, ALL, DONE} =
      this.state;

    const client = data => (
      <View>
        <Text style={styles.NameText}>
          {data.first_name} {data.second_name}
        </Text>
        <Text style={styles.textStyle}>
          {data.town} Ul: {data.street} {data.nr_house}
        </Text>
        <Text style={styles.textStyle}>tel: {data.tel}</Text>
        {data.stove ? (
          <Text style={styles.textStyle}>Piec: {data.stove.name}</Text>
        ) : (
          <></>
        )}
      </View>
    );

    const event = item => (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View key={item.id}>
          <View style={styles.events}>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.TimeText}>{item.data_wizyty}</Text>
              <Text>Godzina:</Text>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
                {item.godzina_wizyty.substring(0, 2)}-
                {item.godzina_wizyty2.substring(0, 2)}
              </Text>
              {/* {item.client ? 
                <Text>{item.client.first_name}</Text>
                :<></>
            } */}
            </View>
            <View style={styles.leftBox}>
              {item.client ? (
                <View>
                  <Text style={styles.NameText}>
                    {item.client.first_name} {item.client.second_name}
                  </Text>
                  <Text>
                    {item.client.town} {item.client.street}{' '}
                    {item.client.nr_house}
                  </Text>
                  <Text style={styles.TelText}>Tel: {item.client.tel}</Text>
                  {item.client.stove ? (
                    <Text>Piec: {item.client.stove.name}</Text>
                  ) : (
                    <></>
                  )}
                </View>
              ) : (
                <View></View>
              )}
              <View style={{width: '90%'}}>
                <Text style={styles.desc}>Opis: {item.description}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{flex: 1}}>
          <Text>sdsdsd</Text>
        </View>
      </View>
    );

    {
      /* <TouchableOpacity
              style={styles.container}
              onPress={() => this.ClientDetail(item.id)}>
              <View
                style={[
                  styles.leftClient,
                  {
                    backgroundColor:
                      colors[Math.floor(Math.random() * colors.length)],
                  },
                ]}>
                <FeatherIcon name="user" size={45} color={'white'} />
              </View>
              <View style={styles.rightClient}>
                <Text style={{color: '#185aca', fontSize: 17}}>
                  {item.first_name} {item.second_name}
                </Text>
                <Text style={{color: '#333333'}}>
                  <FeatherIcon name="map-pin" color="#333333" size={14} />{' '}
                  {item.town} {item.street} {item.nr_house}
                </Text>
                <Text style={{color: '#444444'}}>
                  <FeatherIcon name="phone" color="#444444" size={14} />{' '}
                  {item.tel}
                </Text>
              </View>
            </TouchableOpacity>
             */
    }
    const work = item => (
      <TouchableOpacity
        style={{
          flex: 1,
          elevation: 10,

          borderRadius: 20,
          elevation: 3,
          marginHorizontal: 12,
          marginVertical: 3,
          backgroundColor: '#ffffff',
          alignItems: 'center',
        }}
        onPress={() => {
          this.props.getWorkDetail(item.id),
            this.props.navigation.navigate('ShowWork');
        }}>
        <LinearGradient
          colors={['#999999', '#999999', '#eeeeee', '#eeeeee']}
          start={{x: 0, y: 0.5}}
          end={{x: 1, y: 0.5}}
          style={{
            flex: 1,

            flexDirection: 'row',

            borderRadius: 20,
          }}>
          <View style={[styles.card]}>
            {/* <Text style={styles.cardIcon}>
                  {item.godzina_wizyty.substring(0, 2)}-
                  {item.godzina_wizyty2.substring(0, 2)}
                </Text> */}
            <View style={styles.stats}>
              <View style={styles.statsItem}>
                <FeatherIcon name="calendar" color="#185aca" size={24} />
                <Text style={styles.statsItemText}>
                  {item.event.data_wizyty}
                </Text>
              </View>
              {/* <View style={styles.statsItem}>
                    <FeatherIcon name="grid" color="#185aca" size={16} />
                    <Text style={styles.statsItemText}>8 lessons</Text>
                  </View> */}
            </View>

            <View>
              <View style={styles.clientCard}>
                {item.event.client ? (
                  <View style={styles.container2}>
                    <View
                      style={[
                        styles.leftClient,
                        {
                          backgroundColor: item.event.client.color,
                        },
                      ]}>
                      <Text style={styles.cardAvatarText}>
                        {item.event.client.first_name[0]}
                      </Text>
                    </View>
                    <View>
                      <View style={styles.rightClient}>
                        <Text style={{color: 'black', fontSize: 14}}>
                          {item.event.client.first_name.length > 18
                            ? item.event.client.first_name.substring(0, 15) +
                              '...'
                            : item.event.client.first_name}
                        </Text>
                        <Text style={{color: '#333333'}}>
                          <FeatherIcon
                            name="map-pin"
                            color="#333333"
                            size={12}
                          />{' '}
                          {(
                            item.event.client.town +
                            ' ' +
                            item.event.client.street +
                            ' ' +
                            item.event.client.nr_house
                          ).length > 18
                            ? (
                                item.event.client.town +
                                ' ' +
                                item.event.client.street +
                                ' ' +
                                item.event.client.nr_house
                              ).substring(0, 15) + '...'
                            : item.event.client.town +
                              ' ' +
                              item.event.client.street +
                              ' ' +
                              item.event.client.nr_house}
                        </Text>
                        <Text style={{color: '#444444'}}>
                          <FeatherIcon name="phone" color="#444444" size={12} />{' '}
                          {item.event.client.tel}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : null}
              </View>
              <Text style={styles.desc}>
                <FeatherIcon name="edit" color="black" size={16} />{' '}
                {item.event.description}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
              style={{
                marginLeft: 'auto',
              }}>
              {/* <View style={styles.cardAction}>
                    <FeatherIcon color="#fff" name="download" size={20} />
                  </View> */}
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              // backgroundColor: '#fff',
              paddingVertical: 10,
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
              paddingRight: 10,
            }}>
            <Text
              style={{
                // fontStyle: 'italic',
                color: '',
                fontSize: 17,
                fontWeight: '700',
                textAlign: 'right',
                color: '#185aca',
              }}>
              {item.servisant.person.username}
            </Text>
            {item.description_work.length < 50 ? (
              <Text style={{color: '#444444', fontSize: 12}}>
                {item.description_work}
              </Text>
            ) : (
              <Text style={{color: '#444444', fontSize: 12}}>
                {item.description_work.substring(0, 50)}...
              </Text>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );

    // const event = (item) => (
    //   <View style={styles.events} key={item.id}>
    //     <View>
    //       <Text style={styles.TimeText}>{item.data_wizyty}</Text>
    //       {/* {item.client ?
    //           <Text>{item.client.first_name}</Text>
    //           :<></>
    //       } */}
    //     </View>
    //     <View style={styles.leftBox}>
    //       {item.servisant ? (
    //         <View>
    //           <Text style={styles.NameText}>
    //             Pracownik: {item.servisant.person.username}
    //           </Text>
    //           <Text style={styles.tekst}>
    //             Godzina: {item.godzina_wizyty.substring(0, 5)}
    //           </Text>
    //           <Text style={styles.tekst}>Opis:</Text>
    //           <Text style={styles.tekst}>{item.description}</Text>
    //           {/* <Text>{item.client.town} {item.client.street} {item.client.nr_house}</Text>
    //             <Text style={styles.TelText}>Tel: {item.client.tel}</Text> */}
    //         </View>
    //       ) : (
    //         <Text>Kliknij by zobaczyć więcej</Text>
    //       )}
    //     </View>
    //   </View>
    // );

    const stoves = item => (
      <View>
        {item.stove ? (
          <Text style={styles.tekst}>Piec: {item.stove.name}</Text>
        ) : (
          <></>
        )}
      </View>
    );
    // const client = (item) => (
    //   <View>
    //     {!edit ? (
    //       <View>
    //         <Text style={styles.tekst}>Imie: {item.first_name}</Text>
    //         <Text style={styles.tekst}>Nazwisko: {item.second_name}</Text>
    //         <Text style={styles.tekst}>Miejscowość: {item.town}</Text>
    //         <Text style={styles.tekst}>Ulica: {item.street}</Text>
    //         <Text style={styles.tekst}>Nr: {item.nr_house}</Text>
    //         <Text style={styles.tekst}>Tel: {item.tel}</Text>
    //         {stoves(item)}
    //       </View>
    //     ) : (
    //       <View>
    //         <View style={{ flexDirection: "row" }}>
    //           <Text style={styles.tekst}>Imie: </Text>
    //           <TextInput
    //             // style={styles.search}
    //             placeholder="Imie"
    //             value={first_name}
    //             defaultValue={item.first_name}
    //             name="first_name"
    //             // onChangeText={}
    //             // scrollto={true}
    //             onChangeText={(first_name) =>
    //               this.setState({ first_name: first_name })
    //             }
    //             // secureTextEntry
    //           />
    //         </View>
    //         <View style={{ flexDirection: "row" }}>
    //           <Text style={styles.tekst}>Nazwisko: </Text>
    //           <TextInput
    //             // style={styles.search}
    //             placeholder="Nazwisko"
    //             value={second_name}
    //             defaultValue={item.second_name}
    //             name="second_name"
    //             // onChangeText={}
    //             // scrollto={true}
    //             onChangeText={(second_name) =>
    //               this.setState({ second_name: second_name })
    //             }
    //             // secureTextEntry
    //           />
    //         </View>
    //         <View style={{ flexDirection: "row" }}>
    //           <Text style={styles.tekst}>Miejscowość: </Text>
    //           <TextInput
    //             // style={styles.search}
    //             placeholder="Miejscowość"
    //             value={town}
    //             defaultValue={item.town}
    //             name="town"
    //             // onChangeText={}
    //             // scrollto={true}
    //             onChangeText={(town) => this.setState({ town: town })}
    //             // secureTextEntry
    //           />
    //         </View>
    //         <View style={{ flexDirection: "row" }}>
    //           <Text style={styles.tekst}>Ulica: </Text>
    //           <TextInput
    //             // style={styles.search}
    //             placeholder="Miejscowość"
    //             value={street}
    //             defaultValue={item.street}
    //             name="street"
    //             // onChangeText={}
    //             // scrollto={true}
    //             onChangeText={(street) => this.setState({ street: street })}
    //             // secureTextEntry
    //           />
    //         </View>
    //         <View style={{ flexDirection: "row" }}>
    //           <Text style={styles.tekst}>Nr: </Text>
    //           <TextInput
    //             // style={styles.search}
    //             placeholder="Nr"
    //             value={nr_house}
    //             defaultValue={item.nr_house}
    //             name="nr_house"
    //             // onChangeText={}
    //             // scrollto={true}
    //             onChangeText={(nr_house) =>
    //               this.setState({ nr_house: nr_house })
    //             }
    //             // secureTextEntry
    //           />
    //         </View>
    //         <View style={{ flexDirection: "row" }}>
    //           <Text style={styles.tekst}>Tel: </Text>
    //           <TextInput
    //             // style={styles.search}
    //             placeholder="Tel"
    //             value={tel}
    //             defaultValue={item.tel}
    //             name="tel"
    //             // onChangeText={}
    //             // scrollto={true}
    //             onChangeText={(tel) => this.setState({ tel: tel })}
    //             // secureTextEntry
    //           />
    //         </View>
    //         <Picker
    //           selectedValue={stove}
    //           style={{ height: 50, width: 150 }}
    //           // color = "#f194ff"
    //           onValueChange={(stove) => this.setState({ stove: stove })}
    //         >
    //           <Picker.Item label={"Brak Pieca"} value={null} />
    //           {this.props.stove_list.map((item) => (
    //             <Picker.Item label={item.name} value={item.id} />
    //           ))}
    //         </Picker>
    //       </View>
    //     )}
    //   </View>
    // );
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#d3e0fe',
          paddingTop: 10,
        }}>
        <View style={styles.screen}>
          {/* <View style={styles.screen}></View> */}
          <View style={styles.calendarHeder}>
            <View style={{flex: 1, width: 40}}>
              <Text style={{textAlign: 'left'}}>
                <FeatherIcon name="chevron-left" color="#2c2c2c" size={24} />
              </Text>
            </View>
            <View>
              <Text style={styles.eventsTitle}>Zrobione Naprawy</Text>
            </View>
            <View style={{flex: 1, width: 40}}>
              <Text style={{textAlign: 'right'}}>
                {/* <FeatherIcon name="chevron-right" color="#2c2c2c" size={24} /> */}
              </Text>
            </View>
          </View>

          {!this.props.works_loading ? (
            <>
              <FlatList
                style={{width: width}}
                data={this.props.works_list_done}
                keyExtractor={item => item.id}
                bounces={false}
                refreshControl={
                  <RefreshControl
                    refreshing={this.props.refreshing_done}
                    onRefresh={this.onRefresh}
                  />
                }
                // snapToInterval={width}
                vertical
                // removeClippedSubviews={true}
                // maxToRenderPerBatch={30}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.containerGap32}
                // decelerationRate={0}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                renderItem={({item}) => work(item)}
                onEndReached={() => {
                  this.props.get_works_done_next_page();
                }}
              />
              {!this.props.works_list_done[0] ? (
                <View style={[styles.eventsNone, {width: width}]}>
                  <Text>Brak Napraw.</Text>
                </View>
              ) : (
                <></>
              )}
            </>
          ) : (
            <View
              style={{
                width: '100%',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 22,
              }}>
              <Text>Loading...</Text>
            </View>
          )}

          <View style={{flex: 1}}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                this.hideModal;
              }}>
              <View style={styles.centeredView}>
                {!this.props.detailLoading ? (
                  <View style={styles.modalView}>
                    <View>
                      {this.props.parts_detail ? (
                        event(this.props.parts_detail)
                      ) : (
                        <></>
                      )}
                    </View>

                    <View>
                      <View style={{marginTop: 20}}>
                        <View style={{paddingTop: 20}}>
                          <Pressable
                            style={[styles.button, styles.buttonGrey]}
                            onPress={this.hideModal}>
                            <Text style={styles.textStyle}>Zamknij</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.modalView}>
                    <Text style={{fontSize: 32, fontWeight: 'bold'}}>
                      Loading...
                    </Text>
                    <View>
                      <View style={{marginTop: 20}}>
                        <View style={{paddingTop: 20}}>
                          <Pressable
                            style={[styles.button, styles.buttonGrey]}
                            onPress={this.hideModal}>
                            <Text style={styles.textStyle}>Zamknij</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </Modal>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  works_loading: state.works.works_loading,
  works_list_done: state.works.works_list_done,
  member_user: state.member.member_user,
  works_detail: state.works.works_detail,
  next_done: state.works.next_done,
  refreshing_all: state.works.refreshing_all,
  refreshing_your: state.works.refreshing_your,
  refreshing_done: state.works.refreshing_done,
  //   clients_detail: state.clients.clients_detail,
  //   stove_list: state.stove.stove_list,
  //   client_events: state.calendar.clients_events,
  //   loading_client_events: state.calendar.loading_client_events,
});
const styles = StyleSheet.create({
  cardAvatarText: {
    fontSize: 32,
    fontWeight: '400',
    color: '#fff',
  },
  container: {
    // padding: 20,
    backgroundColor: 'lightgreen',
    marginTop: 1,
    marginLeft: 5,
    marginRight: 5,
    paddingLeft: 4,
    flex: 1,
    borderRadius: 5,

    height: 40,
  },
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    height: '100%',
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
  eventsTitle: {
    // width: 100,
    fontSize: 20,
    fontWeight: '700',
    color: '#2c2c2c',
    justifyContent: 'center',

    // marginBottom: 12,
  },
  list: {
    marginTop: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  NameText: {
    fontSize: 15,
    justifyContent: 'center',
    alignItems: 'center',
    fontStyle: 'italic',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  leftBox: {
    marginLeft: 5,
    borderWidth: 2,
    borderColor: 'white',
    flex: 2,
    backgroundColor: '#a4c2f5',
    // padding: 5,
    borderRadius: 10,
  },
  TimeText: {
    fontSize: 24,
    color: 'white',
  },
  disable: {
    padding: 10,
    elevation: 2,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    margin: 1,
    borderRadius: 7,
  },
  desc: {
    fontSize: 12,
    width: 200,
  },

  avilable: {
    padding: 10,
    elevation: 2,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    margin: 1,
    borderRadius: 7,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#ff0000',
  },
  buttonEdit: {
    backgroundColor: '#0000ff',
  },
  buttonDone: {
    backgroundColor: 'orange',
  },
  buttonSave: {
    backgroundColor: '#00ff00',
  },
  buttonAdd: {
    backgroundColor: '#00ff00',
  },
  buttonGrey: {
    backgroundColor: 'grey',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    // textAlign: "center",
  },
  labele: {
    flexDirection: 'row',
    borderRadius: 100,
    backgroundColor: 'lightgrey',
    marginTop: 10,
  },
  touchableButton: {
    // width: '80%',
    justifyContent: 'center',
    padding: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: '#9c27b0',
  },
  eventsNone: {
    width: '100%',
    height: 100,
    // backgroundColor: 'lightyellow',
    marginTop: 1,
    borderRadius: 10,
    padding: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // textStyle: {
  //   fontSize: 20,
  //   color: "grey"
  // },
  tekst: {
    fontSize: 15,
  },
  doneEvent: {
    width: '100%',
    height: 150,
    margin: 1,
    backgroundColor: '#a0a01a',
    marginTop: 1,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
  },
  search: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
  },

  cell: {width: 75},
  containert: {
    paddingTop: 30,
    flexDirection: 'row',
    width: '100%',
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
  btnText: {textAlign: 'center', color: '#fff', fontSize: 12},
  btnTextTime: {textAlign: 'center', color: 'black', fontSize: 12},
  btnText2: {textAlign: 'center', fontSize: 9},
  singleHead: {width: 80, height: 40, backgroundColor: '#c8e1ff'},

  TelText: {
    fontSize: 13,
    color: 'white',
  },

  textDescription: {
    fontSize: 14,
    color: 'grey',
  },
  // NameText: {
  //   fontSize: 25,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  container2: {
    // borderBottomWidth: 1,

    // padding: 20,
    flexDirection: 'row',
    // backgroundColor: 'white',
    marginTop: 2,
    // maxWidth: '100%',
    marginLeft: 5,

    marginRight: 5,
    paddingLeft: 4,
    // flex: 1,
    borderRadius: 5,

    // height: 40,
  },
  // btn: {
  //   width: '100%',
  //   height: '100%',
  //   backgroundColor: '#a4c2f5',
  //   borderRadius: 4,
  // },
  // btnDone: {
  //   width: '100%',
  //   height: '100%',
  //   backgroundColor: '#999999',
  //   borderRadius: 4,
  // },
  events: {
    flex: 1,
    // width: '100%',
    height: 150,
    // margin: 1,
    backgroundColor: '#fff',
    marginTop: 1,
    borderRadius: 10,
    // padding: 12,
    flexDirection: 'row',
  },
  rightBox: {
    marginLeft: 5,
    flex: 1,
    // backgroundColor: "lightblue",
    padding: 5,
    // borderRadius: 10,
  },
  bussyEvents: {
    width: '100%',
    height: 100,
    backgroundColor: 'red',
    marginTop: 1,
    borderRadius: 10,
    padding: 4,
    flexDirection: 'row',
  },
  inputContainer: {
    // position: "absolute",
    // flexDirection:"row",
    width: '100%',
    // margin: 10,?

    // right: 40,
    // top: 5,
    bottom: 0,
  },
  rightClient: {
    marginHorizontal: 5,
    paddingHorizontal: 5,
    borderLeftWidth: 1,
    marginVertical: 1,
    borderColor: '#d6d6d6',
  },
  leftClient: {
    aspectRatio: 1 / 1,
    // margin: 2,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#9ca1ac',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9999,
  },
  container: {
    // marginVertical: 2,
    // borderBottomWidth: 1,

    // padding: 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    // marginTop: 2,
    // maxWidth: '100%',
    marginLeft: 5,

    // marginRight: 5,
    // paddingLeft: 4,
    // paddingVertical: 5,
    // flex: 1,
    borderRadius: 10,

    // height: 40,
  },
  card: {
    flex: 2,

    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
    // backgroundColor: '#a4c2f5',
    // borderRadiusT: 20,
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    borderColor: '#d3e0fe',
    justifyContent: 'flex-start',
  },
  stats: {
    // marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  statsItemText: {
    marginLeft: 4,
    fontSize: 20,
    fontWeight: '600',
    color: '#185aca',
  },
});

export default connect(mapStateToProps, {
  getWorksServisant,
  getWorks,
  getWorksDone,
  updateWorkDone,
  getWorkDetail,
  updateWork,
  deleateWork,
  add_stove,
  worksDone,
  updateWorkNotDone,
  get_works_done_next_page,
})(Works);
