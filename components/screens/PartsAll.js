import React, {Component, Fragment, createRef} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import store from '../store';
import PartsItem from '../common/PartsItem';
import minus from '../assets/images/minus.png';
import plus from '../assets/images/plus.png';
import {
  getAllParts,
  getAvilableParts,
  partsQuantity,
  getPartsDetail,
  partsback,
  partsAll,
  partsAvilable,
  get_parts_all_next_page,
  partsChangeColor,
  partsChangeQuantity,
} from '../actions/parts';
import FeatherIcon from 'react-native-vector-icons/Feather';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Linking,
  Platform,
  Pressable,
  FlatList,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

const colors = [
  '#6874e7',
  '#b8304f',
  '#BA55D3',
  '#758E4F',
  '#fa3741',
  '#F26419',
  '#F6AE2D',
  '#DFAEB4',
  '#7A93AC',
  '#33658A',
  '#3d2b56',

  '#171A21',
];
const CIRCLE_SIZE = 40;
const CIRCLE_RING_SIZE = 2;
const {width, height} = Dimensions.get('window');
export class PartsAll extends Component {
  constructor(props) {
    console.log(props);
    super(props);

    this.state = {
      search: '',
      quantity: '0',
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
    };
    this.sheet = createRef();
  }
  static propTypes = {
    parts_list_all: PropTypes.array.isRequired,
    search: PropTypes.string.isRequired,
    searchToogle: PropTypes.bool.isRequired,
    get_parts_next_page: PropTypes.func.isRequired,
  };

  componentDidMount() {
    // Ustawienie nasłuchiwania zdarzenia
    // console.log(this.props.searchToogle);
    // console.log(this.props.search);
    this.props.getAllParts();
    this.listener = this.props.navigation.addListener('focus', () =>
      this.props.partsAll(),
    );
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
  oneMore = () => {
    const {quantity} = this.state;
    const quantityplusone = parseInt(quantity) + 1;
    this.setState({quantity: quantityplusone.toString()});
  };
  onRefresh = () => {
    this.props.getAllParts();
  };
  oneLess = () => {
    const {quantity} = this.state;
    const quantityplusone = parseInt(quantity) - 1;
    this.setState({quantity: quantityplusone.toString()});
  };
  // search = () => {
  //   const {search, click} = this.state;
  //   if (click) {
  //     this.props.getAllParts(this.props.search);
  //   } else {
  //     this.props.getAvilableParts(this.props.search);
  //   }
  // };
  hideModal = e => {
    this.setState({modalVisible: false, description_work: ''});
  };
  //   showModal2 = (data) => {
  //     this.setState({ modalVisible2: true });
  //   };
  showModal = e => {
    this.setState({modalVisible: true});
  };

  handleScroll = e => {
    // e.preventDefault();
    const offset = e.nativeEvent.contentOffset.y;
    const contentHeight = e.nativeEvent.contentSize.height;
    const scrollViewHeight = height;
    // console.log(offset);
    // console.log(contentHeight - width - 1);

    if (offset >= contentHeight - scrollViewHeight) {
      e.preventDefault();
      this.props.get_parts_all_next_page();
    }
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
  //   makeCall = (tel) => {
  //     let phoneNumber = "";

  //     if (Platform.OS === "android") {
  //       phoneNumber = `tel:${tel}`;
  //     } else {
  //       phoneNumber = `telprompt:${tel}`;
  //     }

  //     Linking.openURL(phoneNumber);
  //   };
  back = e => {
    this.setState({modalVisible: false, edit: false});
    this.props.partsback(this.props.parts_detail.id);
  };
  edit = e => {
    this.setState({
      edit: !this.state.edit,
      quantity: this.props.parts_detail.quantity.toString(),
    });
  };
  //   lastVisits = (e) => {
  //     this.props.getClientEvents(this.props.clients_detail.id);
  //     this.setState({ modalVisible4: true });
  //   };
  save = e => {
    // this.setState({modalVisible: false, edit: false});
    this.sheet.current.close();
    const {quantity, value} = this.state;
    const {color} = this.props;

    const body = JSON.stringify({
      quantity,
      color,
    });

    this.props.partsQuantity(body, this.props.parts_detail.id);
  };
  render() {
    const {modalVisible, search, description_work, edit, click} = this.state;
    const {parts_detail, color, quantity, refreshingAll} = this.props;
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
      <View>
        <Text
          style={{
            fontSize: 32,
            fontWeight: 'bold',
            color: 'black',
            textAlign: 'center',
          }}>
          {this.props.parts_detail.catalog_id}
        </Text>
        <View style={styles.leftBox}>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.TextDesc}>{item.description}</Text>
            <Text style={styles.TelText}>Cena Katalogowa: {item.price}</Text>
          </View>
        </View>
        {edit ? (
          <View style={styles.container2}>
            <TouchableOpacity
              onPress={this.oneLess}
              style={styles.imageContainer}>
              <Image source={minus} style={styles.image} />
            </TouchableOpacity>

            <View style={styles.numberContainer}>
              <TextInput
                onChangeText={quantity => this.setState({quantity: quantity})}
                style={styles.numberText}
                keyboardType="numeric"
                value={quantity}
                name="quantity"
              />
            </View>

            <TouchableOpacity
              onPress={this.oneMore}
              style={styles.imageContainer}>
              <Image source={plus} style={styles.image} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.container2}>
            <View style={styles.numberContainer}>
              <Text style={styles.numberText}>
                {this.props.parts_detail.quantity}
              </Text>
            </View>
          </View>
        )}
        {!edit ? (
          <Pressable
            style={[styles.button2, styles.buttonEdit]}
            onPress={this.edit}>
            <Text style={styles.textStyle}>Edytuj</Text>
          </Pressable>
        ) : (
          <Fragment>
            <View style={styles.container3}>
              <Pressable
                style={[styles.button2, styles.buttonSave]}
                onPress={this.save}>
                <Text style={styles.textStyle}>Zapisz</Text>
              </Pressable>

              <Pressable
                style={[styles.button2, styles.buttonClose]}
                onPress={this.edit}>
                <Text style={styles.textStyle}>Anuluj</Text>
              </Pressable>
            </View>
            <Pressable
              style={[styles.button2, styles.buttonEdit]}
              onPress={this.back}>
              <Text style={styles.textStyle}>Odeślij z Magazynu</Text>
            </Pressable>
          </Fragment>
        )}
      </View>
    );

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
              <Text style={styles.eventsTitle}>Wszystkie Części</Text>
            </View>
            <View style={{flex: 1, width: 40}}>
              <Text style={{textAlign: 'right'}}>
                {/* <FeatherIcon name="chevron-right" color="#2c2c2c" size={24} /> */}
              </Text>
            </View>
          </View>

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

            <FlatList
              style={{width: width}}
              data={this.props.parts_list_all}
              keyExtractor={item => item.id}
              bounces={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshingAll}
                  onRefresh={this.onRefresh}
                />
              }
              // snapToInterval={width}
              vertical
              // removeClippedSubviews={true}
              // maxToRenderPerBatch={30}
              showsHorizontalScrollIndicator={false}
              onEndReached={() => {
                this.props.get_parts_all_next_page();
                // console.log('assssssssssssss');
              }}
              contentContainerStyle={styles.containerGap32}
              // decelerationRate={0}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              renderItem={({item}) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.container}
                  onPress={() => {
                    this.sheet.current.open(),
                      this.props.getPartsDetail(item.id);
                  }}>
                  <View
                    style={[
                      styles.leftClient,
                      {
                        backgroundColor: item.color,
                      },
                    ]}>
                    <FeatherIcon name="settings" size={45} color={'white'} />
                  </View>
                  <View style={styles.rightClient}>
                    <Text style={{color: '#185aca', fontSize: 17}}>
                      {item.catalog_id}
                    </Text>
                    <Text style={{color: '#333333'}}>
                      <FeatherIcon name="edit" color="#333333" size={14} />{' '}
                      {item.description.length > 27
                        ? item.description.substring(0, 24) + '...'
                        : item.description}
                    </Text>
                    <Text style={{color: '#333333', fontSize: 12}}>
                      {item.price}
                      {' zł'}
                    </Text>
                  </View>
                  <View style={{marginLeft: 'auto', height: '100%'}}>
                    <Text
                      style={{
                        // textAlign: 'center',
                        // textAlign: 'right',
                        marginVertical: 14,
                        textAlignVertical: 'center',
                        fontSize: 24,
                        color: '#333333',
                        // position: 'absolute',
                        // top: '50%',
                      }}>
                      {item.quantity}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
        <RBSheet
          customStyles={{container: styles.sheet}}
          height={440}
          openDuration={250}
          ref={this.sheet}>
          <View style={styles.sheetHeader}>
            <View style={{width: 60}} />

            <Text style={styles.sheetHeaderTitle}>Część</Text>

            <TouchableOpacity onPress={this.save}>
              <View style={{width: 60, alignItems: 'flex-end'}}>
                <Text style={styles.done}>Zapisz</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.sheetBody}>
            {parts_detail.catalog_id ? (
              <View style={styles.container}>
                {/* {() => this.setState({value: parts_detail.color})} */}
                <View
                  style={[
                    styles.leftClient,
                    {
                      backgroundColor: color,
                    },
                  ]}>
                  <FeatherIcon name="settings" size={60} color={'white'} />
                </View>
                <View style={styles.rightClient}>
                  <Text style={{color: '#185aca', fontSize: 24}}>
                    {parts_detail.catalog_id}
                  </Text>
                  <Text style={{color: '#333333'}}>
                    <FeatherIcon name="edit" color="#333333" size={17} />{' '}
                    {parts_detail.description}
                  </Text>
                  <Text style={{color: '#333333', fontSize: 15}}>
                    {parts_detail.price}
                    {' zł'}
                  </Text>
                </View>
                <View style={{marginLeft: 'auto', height: '100%'}}>
                  <Text
                    style={{
                      // textAlign: 'center',
                      // textAlign: 'right',
                      marginVertical: 6,
                      textAlignVertical: 'center',
                      fontSize: 24,
                      color: '#333333',
                      // position: 'absolute',
                      // top: '50%',
                    }}></Text>
                </View>
              </View>
            ) : (
              <ActivityIndicator size="large" color="#185aca" />
            )}
            {parts_detail.catalog_id ? (
              <>
                <View style={styles.container2}>
                  <TouchableOpacity
                    onPress={() => this.props.partsChangeQuantity(quantity - 1)}
                    style={styles.imageContainer}>
                    <Image source={minus} style={styles.image} />
                  </TouchableOpacity>

                  <View style={styles.numberContainer}>
                    <TextInput
                      onChangeText={quantity =>
                        this.props.partsChangeQuantity(quantity)
                      }
                      style={styles.numberText}
                      keyboardType="numeric"
                      value={quantity.toString()}
                      // defaultValue={parts_detail.quantity}
                      name="quantity"
                    />
                  </View>

                  <TouchableOpacity
                    onPress={() => this.props.partsChangeQuantity(quantity + 1)}
                    style={styles.imageContainer}>
                    <Image source={plus} style={styles.image} />
                  </TouchableOpacity>
                </View>
                <View style={styles.group}>
                  {colors.map((item, index) => {
                    console.log(color);
                    const isActive = color === item;
                    return (
                      <View key={item}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.props.partsChangeColor(item);
                          }}>
                          <View
                            style={[
                              styles.circle,
                              isActive && {borderColor: item},
                            ]}>
                            <View
                              style={[
                                styles.circleInside,
                                {backgroundColor: item},
                              ]}
                            />
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    );
                  })}
                </View>
              </>
            ) : null}
          </View>
        </RBSheet>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  parts_list_all: state.parts.parts_list_all,
  detailLoading: state.parts.detailLoading,
  parts_detail: state.parts.parts_detail,
  color: state.parts.color,
  quantity: state.parts.quantity,
  searchToogle: state.parts.searchToogle,
  refreshingAll: state.parts.refreshingAll,
});
const styles = StyleSheet.create({
  eventsTitle: {
    // width: 100,
    fontSize: 20,
    fontWeight: '700',
    color: '#2c2c2c',
    justifyContent: 'center',

    // marginBottom: 12,
  },
  container: {
    marginVertical: 2,
    // borderBottomWidth: 1,

    // padding: 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 2,
    // maxWidth: '100%',
    marginHorizontal: 14,
    paddingLeft: 4,
    paddingVertical: 5,
    // flex: 1,
    borderRadius: 10,

    // height: 40,
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
  list: {
    marginTop: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flex: 1,
  },
  centeredView: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 200,
  },
  modalView: {
    margin: 5,
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
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
  containerGap32: {
    // margin,
    // gap: MARGIN_PADDING.mp_10,
    paddingHorizontal: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  // leftBox: {
  //   marginLeft: 5,
  //   borderWidth: 2,
  //   borderColor: 'white',
  //   // flex:1,
  //   backgroundColor: 'lightblue',
  //   padding: 5,
  //   borderRadius: 10,
  // },
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

  // textStyle: {
  //   fontSize: 20,
  //   color: "grey"
  // },
  tekst: {
    fontSize: 12,
  },

  TelText: {
    fontSize: 18,
    color: 'black',
  },

  // NameText: {
  //   fontSize: 25,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  centeredView: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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

  bussyEvents: {
    width: '100%',
    height: 100,
    backgroundColor: 'red',
    marginTop: 1,
    borderRadius: 10,
    padding: 4,
    flexDirection: 'row',
  },

  list: {
    marginTop: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  centeredView: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 5,
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
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
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
    fontStyle: 'italic',
  },
  button2: {
    marginTop: 40,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  leftBox: {
    marginLeft: 10,
  },
  TimeText: {
    fontSize: 18,
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
    margin: 4,
    backgroundColor: '#ff0000',
  },
  buttonEdit: {
    backgroundColor: '#0000ff',
  },
  buttonSave: {
    margin: 4,
    backgroundColor: '#00ff00',
  },
  buttonAdd: {
    backgroundColor: '#00ff00',
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
    padding: 1,
    flexDirection: 'row',
    borderRadius: 25,
    backgroundColor: 'lightgrey',
    marginTop: 8,
  },
  touchableButton: {
    // width: '80%',
    justifyContent: 'center',
    padding: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: '#9c27b0',
  },
  // textStyle: {
  //   fontSize: 20,
  //   color: "grey"
  // },
  tekst: {
    fontSize: 20,
  },
  search: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
  },
  touchableButton2: {
    width: '80%',
    padding: 10,
    margin: 3,
    backgroundColor: '#7cd7b2',
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

  bussyEvents: {
    width: '100%',
    height: 100,
    backgroundColor: 'red',
    marginTop: 1,
    borderRadius: 10,
    padding: 4,
    flexDirection: 'row',
  },
  TextStyle2: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
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
  container2: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 12,
  },
  container3: {
    margin: 5,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
  },
  numberContainer: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: 'cover', // Możesz dostosować sposób dopasowywania obrazu
  },
  numberText: {
    fontSize: 40,
    fontWeight: 'bold',
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
  group: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingVertical: 30,
    borderTopColor: '#d6d6d6',
    borderTopWidth: 1,
  },
  /** Placeholder */
  placeholder: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    height: 400,
    marginTop: 0,
    padding: 24,
    backgroundColor: 'transparent',
  },
  placeholderInset: {
    borderWidth: 4,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 9,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Sheet */
  sheet: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  sheetHeaderTitle: {
    fontSize: 20,
    color: '#161616',
    fontWeight: '600',
  },
  sheetBody: {
    padding: 24,
  },
  done: {
    fontSize: 16,
    fontWeight: '600',
    color: '#236a23',
  },
  /** Profile */
  profile: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  profileText: {
    fontSize: 34,
    fontWeight: '600',
    color: 'white',
  },
  /** Circle */
  circle: {
    width: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
    height: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
    borderRadius: 9999,
    backgroundColor: 'white',
    borderWidth: CIRCLE_RING_SIZE,
    borderColor: 'transparent',
    marginRight: 8,
    marginBottom: 12,
  },
  circleInside: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: 9999,
    position: 'absolute',
    top: CIRCLE_RING_SIZE,
    left: CIRCLE_RING_SIZE,
    elevation: 4,
  },
  /** Button */
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    padding: 14,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#000',
    marginBottom: 12,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
export default connect(mapStateToProps, {
  getAllParts,
  getAvilableParts,
  partsQuantity,
  getPartsDetail,
  partsback,
  partsAll,
  partsAvilable,
  get_parts_all_next_page,
  partsChangeQuantity,
  partsChangeColor,
})(PartsAll);
