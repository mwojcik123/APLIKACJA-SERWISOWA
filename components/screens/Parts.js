import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {
  getAllParts,
  getAvilableParts,
  partsQuantity,
  getPartsDetail,
  partsback,
} from '../actions/parts';
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
  Linking,
  Platform,
  Pressable,
} from 'react-native';

export class Parts extends Component {
  state = {
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
  static propTypes = {
    parts_list: PropTypes.array.isRequired,
  };
  componentDidMount() {
    // this.props.getAvilableParts();
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
  oneLess = () => {
    const {quantity} = this.state;
    const quantityplusone = parseInt(quantity) - 1;
    this.setState({quantity: quantityplusone.toString()});
  };
  search = () => {
    const {search, click} = this.state;
    if (click) {
      this.props.getAllParts(search);
    } else {
      this.props.getAvilableParts(search);
    }
  };
  hideModal = e => {
    this.setState({modalVisible: false, description_work: ''});
  };
  //   showModal2 = (data) => {
  //     this.setState({ modalVisible2: true });
  //   };
  showModal = e => {
    this.setState({modalVisible: true});
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
    this.setState({modalVisible: false, edit: false});
    const {quantity} = this.state;

    const body = JSON.stringify({
      quantity,
    });
    this.setState({
      description_work: '',
    });
    this.props.partsQuantity(body, this.props.parts_detail.id);
  };
  render() {
    const {modalVisible, search, description_work, quantity, edit, click} =
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
              {/* <Image source={minus} style={styles.image} /> */}
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
              {/* <Image source={plus} style={styles.image} /> */}
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

    const work = item => (
      <TouchableOpacity
        key={item.id}
        onPress={() => {
          this.props.getPartsDetail(item.id), this.showModal();
        }}>
        <View style={styles.events}>
          {/* <View>
              <Text style = {styles.TimeText}>{item.godzina_wizyty.substring(0,5)}</Text>
              {item.client ? 
                <Text>{item.client.first_name}</Text>
                :<></>
            }
            </View> */}
          <View style={styles.eventInside}>
            <Text style={styles.TextID}>{item.catalog_id}</Text>
            {item.description.length < 17 ? (
              <Text style={styles.TextDesc}>{item.description}</Text>
            ) : (
              <Text style={styles.TextDesc}>
                {item.description.substring(0, 17)}...
              </Text>
            )}
          </View>
          {item.quantity > 0 ? (
            <Text style={styles.TextQuantity2}>{item.quantity}</Text>
          ) : (
            <Text style={styles.TextQuantity}>{item.quantity}</Text>
          )}
        </View>
      </TouchableOpacity>
    );

    return (
      <Fragment>
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
                        onPress={() => this.props.navigation.goBack()}>
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

        <View>
          <View style={{flexDirection: 'row'}}>
            <Pressable
              style={!click ? styles.avilable : styles.disable}
              onPress={() => {
                this.setState({click: false});
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({click: false});
                }}>
                <Text style={[styles.tekst, {color: 'white', fontSize: 23}]}>
                  {'Magazyn'}
                </Text>
              </TouchableOpacity>
            </Pressable>

            <Pressable
              style={click ? styles.avilable : styles.disable}
              onPress={() => {
                this.setState({click: true});
              }}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Text style={[styles.tekst, {color: 'white', fontSize: 23}]}>
                  {'Wszystkie'}
                </Text>
              </TouchableOpacity>
            </Pressable>
          </View>
          <View style={styles.labele}>
            <TextInput
              style={styles.search}
              placeholder="Search"
              value={search}
              name="search"
              // onChangeText={}
              // scrollto={true}
              onChangeText={search => this.setState({search: search, page: 1})}
              // secureTextEntry
            />
            {/* <Button style={{ borderRadius: 20}} title="szukaj" onPress={this.Search} /> */}
            <TouchableOpacity
              style={[
                {padding: 10, elevation: 1, borderRadius: 25},
                styles.buttonAdd,
              ]}
              onPress={this.search}>
              <Text style={[styles.tekst, {color: 'white'}]}>SZUKAJ</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.list}>
          <Text style={{backgroundColor: 'red'}}>{this.props.event_data}</Text>
          {this.props.parts_list.map(item => work(item))}
        </ScrollView>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  parts_list: state.parts.parts_list,
  detailLoading: state.parts.detailLoading,
  parts_detail: state.parts.parts_detail,
  event_data: state.calendar.event_data,
});
const styles = StyleSheet.create({
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
  container: {
    // padding: 20,
    backgroundColor: 'lightblue',
    marginTop: 1,
    marginLeft: 5,
    marginRight: 5,
    paddingLeft: 4,
    flex: 1,
    borderRadius: 5,

    height: 40,
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
    padding: 10,
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
    width: 50,
    height: 50,
    resizeMode: 'cover', // Możesz dostosować sposób dopasowywania obrazu
  },
  numberText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
});

export default connect(mapStateToProps, {
  getAllParts,
  getAvilableParts,
  partsQuantity,
  getPartsDetail,
  partsback,
})(Parts);
