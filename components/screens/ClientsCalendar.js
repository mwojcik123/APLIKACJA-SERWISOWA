import React, {Component, Fragment, createRef} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import store from '../store';
import {
  get_clients_detail,
  get_clients_list,
  add_client,
  update_client,
  get_clients_next_page,
  add_client_to_calendar,
} from '../actions/clients';
import {getClientEvents} from '../actions/calendar';
import {add_stove, get_stove} from '../actions/stove';
import {Picker} from '@react-native-picker/picker';
import {CLEAR_CLIENTS_DETAIL} from '../actions/types';
import RBSheet from 'react-native-raw-bottom-sheet';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  Modal,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Link} from '@react-navigation/native';
import AnimatedAbsoluteButton from 'react-native-animated-absolute-buttons/AnimatedAbsoluteButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
const {width, height} = Dimensions.get('window');
export class Clients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadMore: false,
      search: '',
      page: 1,
      modalVisible: false,
      modalVisible2: false,
      modalVisible3: false,
      modalVisible4: false,
      first_name: '',
      town: '',
      street: '',
      nr_house: '',
      name: '',
      stove: null,
      tel: '',
      tel2: '',
      edit: false,
    };
    this.flatListRef = createRef();
    this.sheetAddClient = createRef();

    this.formName = createRef();
    this.formTown = createRef();
    this.formStreet = createRef();
    this.formNr_house = createRef();
    this.formTel = createRef();
    this.formTel2 = createRef();
  }

  static propTypes = {
    clients_list: PropTypes.object.isRequired,
    stove_list: PropTypes.array.isRequired,
    get_clients_list: PropTypes.func.isRequired,
    add_client: PropTypes.func.isRequired,
    add_stove: PropTypes.func.isRequired,
    get_stove: PropTypes.func.isRequired,
    get_clients_next_page: PropTypes.func.isRequired,
    update_client: PropTypes.func.isRequired,
    clients_events: PropTypes.array.isRequired,
    loading_client_events: PropTypes.bool.isRequired,
  };
  componentDidMount() {
    this.props.get_stove();
    this.props.get_clients_list('', 1);
  }

  onChange = e => this.setState({[e.target.name]: e.target.value});
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

  edit = e => {
    this.setState({
      edit: !this.state.edit,
      first_name: this.props.clients_detail.first_name,
      town: this.props.clients_detail.town,
      street: this.props.clients_detail.street,
      nr_house: this.props.clients_detail.nr_house,
      tel: this.props.clients_detail.tel,
    });
    if (this.props.clients_detail.stove && this.state.edit == false) {
      this.setState({stove: this.props.clients_detail.stove.id});
    }
  };
  lastVisits = e => {
    this.props.getClientEvents(this.props.clients_detail.id);
    this.setState({modalVisible4: true});
  };

  save = e => {
    this.setState({modalVisible3: false, edit: false});
    const {first_name, stove, town, street, nr_house, tel} = this.state;
    const body = JSON.stringify({
      first_name,
      stove,
      town,
      street,
      nr_house,
      tel,
    });
    this.setState({
      first_name: '',
      stove: null,
      town: '',
      street: '',
      nr_house: '',
      tel: '',
    });
    this.props.update_client(body, this.props.clients_detail.id);
  };
  Search = e => {
    e.preventDefault();
    this.flatListRef.scrollToOffset({animated: true, offset: 0});
    const {search, page} = this.state;
    this.props.get_clients_list(search, page);
  };
  ClientDetail = e => {
    this.props.get_clients_detail(e);
    this.props.navigation.goBack();
  };

  addClient = e => {
    const {first_name, stove, town, street, nr_house, tel, tel2} = this.state;
    const body = JSON.stringify({
      first_name,
      stove,
      town,
      street,
      nr_house,
      tel,
      tel2,
    });
    console.log(body);
    this.sheetAddClient.current.close();
    this.setState({
      first_name: '',
      stove: null,
      town: '',
      street: '',
      nr_house: '',
      tel: '',
      tel2: '',
    });
    this.props.add_client_to_calendar(body);
    this.props.navigation.goBack();
  };

  async req() {
    await this.props.get_clients_next_page();
  }

  handleScroll = async e => {
    e.preventDefault();
    const offset = e.nativeEvent.contentOffset.y;
    const contentHeight = e.nativeEvent.contentSize.height;
    const scrollViewHeight = height;
    if (offset > contentHeight - scrollViewHeight + 50) {
      // const {loadMore} = this.state;
      if (this.props.isLoading) {
        return;
      }
      await this.props.get_clients_next_page();
      // this.setState({loadMore: true});
    }
  };

  addStove = e => {
    const {name} = this.state;
    const body = JSON.stringify({name});
    console.log(body);
    this.setState({modalVisible2: false});
    this.setState({name: ''});
    this.props.add_stove(body);
  };
  render() {
    const {clients_detail, loading_client_events} = this.props;
    const {
      search,
      modalVisible,
      edit,
      modalVisible2,
      modalVisible3,
      modalVisible4,
      stove,
      first_name,
      town,
      street,
      nr_house,
      name,
      tel,
      tel2,
    } = this.state;

    const event = item => (
      <View style={styles.events} key={item.id}>
        <View>
          <Text style={styles.TimeText}>{item.data_wizyty}</Text>
          {/* {item.client ? 
              <Text>{item.client.first_name}</Text>
              :<></>
          } */}
        </View>
        <View style={styles.leftBox}>
          {item.servisant ? (
            <View>
              <Text style={styles.NameText}>
                Pracownik: {item.servisant.person.username}
              </Text>
              <Text style={styles.tekst}>
                Godzina: {item.godzina_wizyty.substring(0, 5)}
              </Text>
              <Text style={styles.tekst}>Opis:</Text>
              <View style={{width: '80%'}}>
                <Text style={{fontSize: 10}}>{item.description}</Text>
              </View>
              {/* <Text>{item.client.town} {item.client.street} {item.client.nr_house}</Text>
                <Text style={styles.TelText}>Tel: {item.client.tel}</Text> */}
            </View>
          ) : (
            <Text>Kliknij by zobaczyć więcej</Text>
          )}
        </View>
      </View>
    );

    const stoves = item => (
      <View>
        {item.stove ? (
          <Text style={styles.tekst}>Piec: {item.stove.name}</Text>
        ) : (
          <></>
        )}
      </View>
    );

    return (
      <View style={{width: '100%', height: '100%', backgroundColor: '#d3e0fe'}}>
        <View style={[styles.header]}>
          <View style={[styles.headerAction, {alignItems: 'flex-end'}]}>
            <TouchableOpacity
              style={styles.headerBadge}
              onPress={
                // handle onPress
                () => this.props.navigation.goBack()
              }>
              {/* <Text>Today</Text> */}
              <FeatherIcon name="chevron-left" size={26} color="#185aca" />
              {/* <FeatherIcon name="more-vertical" size={24} /> */}
            </TouchableOpacity>
          </View>

          <View style={styles.inputBox}>
            <TextInput
              style={styles.searchInput}
              placeholder="Wyszukaj klientów..."
              returnKeyType="search"
              value={this.state.search}
              onChangeText={search => this.setState({search: search})}
              onSubmitEditing={this.Search}
            />
            {/* <FeatherIcon name="user" size={45} color={'black'} /> */}
            <View style={styles.iconContainer}>
              {this.state.search == '' ? null : (
                <TouchableOpacity
                  activeOpacity={0.1}
                  style={styles.searchIcon}
                  onPress={() => this.setState({search: ''})}>
                  <AntDesign name="closecircleo" color={'#ff7a55'} size={22} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <FlatList
          ref={ref => {
            this.flatListRef = ref;
          }}
          data={this.props.clients_list}
          keyExtractor={item => item.id}
          bounces={false}
          // snapToInterval={width}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          // removeClippedSubviews={true}
          vertical
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.containerGap32}
          onEndReached={() => this.props.get_clients_next_page()}
          // decelerationRate={0}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                style={styles.container}
                // activeOpacity={0.7}
                onPress={() => {
                  this.ClientDetail(item.id);
                }}>
                <View
                  style={[
                    styles.leftClient,
                    {
                      backgroundColor: item.color,
                    },
                  ]}>
                  <Text style={styles.cardAvatarText}>
                    {item.first_name[0]}
                  </Text>
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
            );
          }}
        />
        <View>
          {/* <ScrollView
            ref={this.flatListRef}
            style={{width: width, padding: 5}}
            onScroll={this.handleScroll}>
            {this.props.clients_list.map(item => (
              <TouchableOpacity
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
            ))}
            <View style={{height: 5}}></View>
          </ScrollView> */}
          {this.props.isLoading ? (
            <View style={styles.buttonContainerX3}>
              <ActivityIndicator size="large" color={'black'} />
            </View>
          ) : null}
          <View style={styles.buttonContainerX}>
            <TouchableOpacity
              onPress={() => this.sheetAddClient.current.open()}
              style={styles.buttonX}>
              <AntDesign name="adduser" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <RBSheet
            height={550}
            draggable
            openDuration={250}
            ref={this.sheetAddClient}
            //   closeOnPressMask={false}
            closeOnPressBack={true}
            customModalProps={{
              animationType: 'slide',
              statusBarTranslucent: true,
            }}
            customStyles={{
              container: {
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
                // backgroundColor: '#d3e0fe',
              },
              wrapper: {
                backgroundColor: '#0000003e',
              },
              draggableIcon: {
                width: 80,
              },
            }}>
            <View style={styles.sheetHeader}>
              <View style={{width: 60}} />

              <Text style={styles.sheetHeaderTitle}>Dodaj Klienta</Text>

              <TouchableOpacity
                onPress={() => this.sheetAddClient.current.close()}>
                <View style={{width: 60, alignItems: 'flex-end'}}>
                  <Text style={styles.done}>Zamknij</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={[styles.sheetBody]}>
              <View style={styles.form}>
                <View style={styles.input}>
                  <Text style={styles.inputLabel}>Imie i Nazwisko</Text>

                  <TextInput
                    // autoCapitalize="none"
                    ref={this.formName}
                    autoCorrect={false}
                    blurOnSubmit={false}
                    onSubmitEditing={() => {
                      this.formTown.current.focus();
                    }}
                    keyboardType="default"
                    returnKeyType="go"
                    onChangeText={first_name =>
                      this.setState({first_name: first_name})
                    }
                    placeholder="Andrzej Nowak"
                    placeholderTextColor="#d3d3d3"
                    style={styles.inputControl}
                    value={first_name}
                  />
                </View>

                <View style={styles.input}>
                  <Text style={styles.inputLabel}>Miejscowość</Text>

                  <TextInput
                    ref={this.formTown}
                    // autoCapitalize="none"
                    onSubmitEditing={() => {
                      setTimeout(() => console.log('s'), 0),
                        this.formStreet.current.focus();
                    }}
                    autoCorrect={false}
                    blurOnSubmit={false}
                    keyboardType="default"
                    returnKeyType="go"
                    onChangeText={town => this.setState({town: town})}
                    placeholder="Warszawa"
                    placeholderTextColor="#d3d3d3"
                    style={styles.inputControl}
                    value={town}
                  />
                </View>
                <View style={styles.input}>
                  <Text style={styles.inputLabel}>Ulica</Text>

                  <TextInput
                    // autoCapitalize="none"
                    onSubmitEditing={() => this.formNr_house.current.focus()}
                    ref={this.formStreet}
                    autoCorrect={false}
                    blurOnSubmit={false}
                    keyboardType="default"
                    returnKeyType="go"
                    onChangeText={street => this.setState({street: street})}
                    placeholder="Miczkiewicza"
                    placeholderTextColor="#d3d3d3"
                    style={styles.inputControl}
                    value={street}
                  />
                </View>
                <View style={styles.input}>
                  <Text style={styles.inputLabel}>Nr</Text>

                  <TextInput
                    // autoCapitalize="none"
                    ref={this.formNr_house}
                    blurOnSubmit={false}
                    onSubmitEditing={() => this.formTel.current.focus()}
                    autoCorrect={false}
                    keyboardType="default"
                    returnKeyType="go"
                    onChangeText={nr_house =>
                      this.setState({nr_house: nr_house})
                    }
                    placeholder="35"
                    placeholderTextColor="#d3d3d3"
                    style={styles.inputControl}
                    value={nr_house}
                  />
                </View>
                <View style={styles.input}>
                  <Text style={styles.inputLabel}>Tel</Text>

                  <TextInput
                    onSubmitEditing={() => this.formTel2.current.focus()}
                    ref={this.formTel}
                    blurOnSubmit={false}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="numeric"
                    returnKeyType="go"
                    onChangeText={tel => this.setState({tel: tel})}
                    placeholder="+48 123456789"
                    placeholderTextColor="#d3d3d3"
                    style={styles.inputControl}
                    value={tel}
                  />
                </View>
                <View style={styles.input}>
                  <Text style={styles.inputLabel}>Drugi Tel:</Text>

                  <TextInput
                    ref={this.formTel2}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="numeric"
                    returnKeyType="done"
                    onChangeText={tel2 => this.setState({tel2: tel2})}
                    placeholder="+48 123456789"
                    placeholderTextColor="#d3d3d3"
                    style={styles.inputControl}
                    value={tel2}
                  />
                </View>

                <View style={{flex: 1, marginVertical: 4, marginVertical: 8}}>
                  <TouchableOpacity
                    style={styles.headerBadgeButtons}
                    onPress={this.addClient}>
                    {/* <FeatherIcon name="map-pin" size={20} color="black" /> */}
                    <Text style={styles.textTagline}>Dodaj</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </RBSheet>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  clients_list: state.clients.clients_list,
  isLoading: state.clients.isLoading,
  clients_detail: state.clients.clients_detail,
  stove_list: state.stove.stove_list,
  // clients_events: state.calendar.clients_events,
  // loading_client_events: state.calendar.loading_client_events,
});
const styles = StyleSheet.create({
  cardAvatarText: {
    fontSize: 40,
    fontWeight: '400',
    color: '#fff',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  sheetHeaderTitle: {
    fontSize: 20,
    color: '#161616',
    fontWeight: '600',
  },
  inputBox: {
    flex: 1,
    display: 'flex',
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginHorizontal: 2,
    marginVertical: 3,
    elevation: 2,
    // borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 9999,
    // borderColor: COLORS.grey,
    // borderRadius: BORDER_RADIUS.radius_25,
    flexDirection: 'row',
  },
  iconContainer: {
    minWidth: '10%',
    direction: 'rtl',
    flexDirection: 'row-reverse',
    flexWrap: 'nowrap',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // justifyContent: 'space-between',
  },
  searchIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  form: {
    paddingHorizontal: 24,
  },
  sheetBody: {
    // flexGrow: 1,

    // height: 300,
    // width: '100%',
    // backgroundColor: '#185aca',
    paddingHorizontal: 4,
    paddingVertical: 14,
  },
  headerAction: {
    // flex: 1,
    marginHorizontal: 8,
    height: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  done: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff7a55',
  },
  add: {
    fontSize: 16,
    fontWeight: '600',
    color: '#236a23',
  },
  buttonContainerX: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    right: 10,
    elevation: 14,
  },
  buttonContainerX2: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 100,
    right: 10,
  },
  buttonContainerX3: {
    flex: 1,
    justifyContent: 'center', // Centrowanie w pionie
    alignItems: 'center',
    bottom: 20,
  },
  buttonX: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#185aca',
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 65,
    height: 65,

    borderRadius: 100,
  },
  buttonTextX: {
    color: 'white',
    fontWeight: 'bold',
  },
  radio: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  radioLabel: {
    fontSize: 17,

    fontWeight: '500',
    color: '#000',
    marginLeft: 12,
    marginRight: 'auto',
  },
  radioLabel3: {
    // flex: 1,
    // paddingLeft: 0,
    fontWeight: 'bold',
    fontSize: 12,
    // fontWeight: '500',
    color: '#000',
    marginLeft: 4,
    marginRight: 'auto',
  },
  header: {
    height: 50,
    paddingHorizontal: 10,
    paddingHorizontal: 10,
    backgroundColor: '#d3e0fe',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  searchInput: {
    width: '90%',
    // borderWidth: 1,
    // borderColor: '#ccc',
    // padding: 5,
    // paddingHorizontal: 15,
    // borderRadius: 100,
  },
  container: {
    marginVertical: 2,
    // borderBottomWidth: 1,

    // padding: 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 2,
    // maxWidth: '100%',
    marginLeft: 5,

    marginRight: 5,
    paddingLeft: 4,
    paddingVertical: 5,
    // flex: 1,
    // borderRadius: 10,
    borderTopLeftRadius: 99,
    borderBottomLeftRadius: 99,
    borderRadius: 30,
    elevation: 5,

    // height: 40,
  },
  containerGap32: {
    // margin,
    // gap: MARGIN_PADDING.mp_10,
    paddingHorizontal: 5,
  },

  NameText: {
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
    fontStyle: 'italic',
  },

  leftBox: {
    marginLeft: 10,
  },
  TimeText: {
    fontSize: 18,
    color: 'white',
  },
  tekst: {
    fontSize: 20,
  },
  search: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
  },

  events: {
    flex: 1,
    width: '100%',
    height: 150,
    // margin:2,
    backgroundColor: 'lightblue',
    marginTop: 1,
    borderRadius: 10,
    padding: 4,
    flexDirection: 'row',
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
    // borderWidth: 1,
    elevation: 5,
    borderColor: '#fff',
    backgroundColor: '#9ca1ac',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9999,
  },
  inputControl: {
    height: 40,
    backgroundColor: '#f3eff6',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  inputLabel: {
    width: 111,
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
    marginLeft: 12,
    marginRight: 'auto',
  },
  headerBadgeButtons: {
    flexDirection: 'row',
    backgroundColor: '#98fb98',
    width: '100%',
    height: 45,
    paddingVertical: 10,
    // height: 46,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTagline: {
    // textAlign: 'center',

    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
});

export default connect(mapStateToProps, {
  add_stove,
  get_stove,
  get_clients_list,
  get_clients_detail,
  add_client,
  update_client,
  getClientEvents,
  get_clients_next_page,
  add_client_to_calendar,
})(Clients);
