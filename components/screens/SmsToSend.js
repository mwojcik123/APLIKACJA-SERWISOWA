import {
  sendSMSoneVer2,
  getSmsList,
  getSmsNextPage,
  getSmsListDay,
  SendSMSList,
  getSmsDetail,
  done,
  noDone,
} from '../actions/sms';
import {SMS_LIST_DAY_DELEATE} from '../actions/types';
import {updateGroup} from '../actions/group';
import React, {useEffect, useRef, useState} from 'react';
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
  RefreshControl,
} from 'react-native';
import {connect} from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import FeatherIcon from 'react-native-vector-icons/Feather';
import store from '../store';
const {width, height} = Dimensions.get('window');
const CONTACTS = [
  {
    id: 1,
    client: {
      id: 2853,
      first_name: 'Kalika Ewa',
      town: 'Kęty',
      street: 'Świętokrzyska',
      nr_house: '19',
      tel: '660426325',
      tel2: '',
      color: '#808000',
    },
    checked: false,
    data_wizyty: '2023-05-22',
  },
  {
    id: 2,
    client: {
      id: 2902,
      first_name: 'Tatoń',
      town: 'Kozy',
      street: 'Nadbrzezna',
      nr_house: '17',
      tel: '508286355',
      tel2: '',
      color: '#32CD32',
    },
    checked: false,
    data_wizyty: '2023-05-22',
  },
  {
    id: 3,
    client: {
      id: 2940,
      first_name: 'Wykręt',
      town: 'Rajsko',
      street: 'Cyklamenów',
      nr_house: '7',
      tel: '666367234',
      tel2: '',
      color: '#800080',
    },
    checked: false,
    data_wizyty: '2023-05-22',
  },
  {
    id: 1,
    client: {
      id: 2924,
      first_name: 'Dyrcz',
      town: 'Frydrychowice',
      street: 'Spacerowa',
      nr_house: '6',
      tel: '728470229',
      tel2: '',
      color: '#DFAEB4',
    },
    checked: false,
    error: false,
    data_wizyty: '2023-05-23',
  },
  {
    id: 2,
    client: {
      id: 2925,
      first_name: 'Maślanka',
      town: 'Wieprz',
      street: 'Wadowicka',
      nr_house: '37',
      tel: '728470229',
      tel2: '',
      color: '#DFAEB4',
    },
    checked: false,
    error: false,
    data_wizyty: '2023-05-23',
  },
  {
    id: 3,
    client: {
      id: 2919,
      first_name: 'Pyrek',
      town: 'Wysoka',
      street: '. Niziny 15',
      nr_house: '107A',
      tel: '605309781',
      tel2: '',
      color: '#DFAEB4',
    },
    checked: false,
    error: false,
    data_wizyty: '2023-05-23',
  },
  {
    id: 4,
    client: {
      id: 2917,
      first_name: 'Grygierczyk',
      town: 'Brzeszcze',
      street: 'Narutowicza',
      nr_house: '23/17',
      tel: '696077391',
      tel2: '',
      color: '#DFAEB4',
    },
    checked: false,
    error: false,
    data_wizyty: '2023-05-23',
  },
  {
    id: 5,
    client: {
      id: 2941,
      first_name: 'Kwaśniak',
      town: 'Bulowice',
      street: 'Bielska',
      nr_house: '273',
      tel: '883740410',
      tel2: '',
      color: '#DFAEB4',
    },
    checked: false,
    error: false,
    data_wizyty: '2023-05-23',
  },
];

export function SmsToSend(props) {
  const {sms_detail} = props;
  const ref = useRef();
  const refDetail = useRef();
  const ref2 = useRef();
  const [smsNote, setNote] = useState(props.group.smsNote);
  const [sections, setSections] = useState([]);
  useEffect(() => {
    props.getSmsList();
  }, []);

  useEffect(() => {
    const sectionsMap = props.sms_list.reduce((acc, item) => {
      const first_name = item.data_wizyty;

      return Object.assign(acc, {
        [first_name]: [...(acc[first_name] || []), item],
      });
    }, {});

    const sections = Object.entries(sectionsMap)
      .map(([letter, items]) => ({
        letter,
        items,
      }))
      .sort((a, b) => new Date(b.letter) - new Date(a.letter)); // Sortowanie dat w odwrotnej kolejności

    setSections(sections);
  }, [props.sms_list]);

  const EditNote = () => {
    setNote(props.group.smsNote);
    ref2.current.open();
  };
  const updateNote = () => {
    props.updateGroup({smsNote});
    ref2.current.close();
  };

  //   const sections = React.useMemo(() => {
  //     const sectionsMap = props.sms_list.reduce((acc, item) => {
  //       const first_name = item.data_wizyty;

  //       return Object.assign(acc, {
  //         [first_name]: [...(acc[first_name] || []), item],
  //       });
  //     }, {});

  //     return Object.entries(sectionsMap)
  //       .map(([letter, items]) => ({
  //         letter,
  //         items,
  //       }))
  //       .sort((a, b) => a.letter.localeCompare(b.letter));
  //   }, []);

  return (
    <View style={{width: '100%', height: '100%', backgroundColor: '#d3e0fe'}}>
      <View style={[styles.header]}>
        <View style={[styles.headerAction, {alignItems: 'flex-end'}]}>
          <TouchableOpacity
            style={[styles.headerBadge, {width: 46}]}
            onPress={
              // handle onPress
              () => props.navigation.goBack()
            }>
            {/* <Text>Today</Text> */}
            <FeatherIcon name="chevron-left" size={26} color="#185aca" />
            {/* <FeatherIcon name="more-vertical" size={24} /> */}
          </TouchableOpacity>
        </View>
        <View style={[styles.headerAction, {alignItems: 'flex-end'}]}>
          <TouchableOpacity
            style={styles.headerBadge}
            onPress={
              // handle onPress
              EditNote
            }>
            <Text style={styles.lessonsTitle}>TREŚĆ SMS'u</Text>
            {/* <FeatherIcon name="chevron-left" size={26} color="#185aca" /> */}
            {/* <FeatherIcon name="more-vertical" size={24} /> */}
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={sections}
        keyExtractor={item => item.letter}
        onEndReached={() => props.getSmsNextPage()}
        refreshControl={
          <RefreshControl
            refreshing={props.isLoading}
            onRefresh={props.getSmsList}
          />
        }
        renderItem={({item: {letter, items}}) => (
          <View style={styles.section} key={letter}>
            <View style={styles.stats}>
              <View style={styles.statsItem}>
                <FeatherIcon name="calendar" color="#2c2c2c" size={20} />
                <Text style={styles.day}> {letter}</Text>
              </View>
              {/* GRUPOWE WYSYŁANE SMSSÓW */}
              {/* <TouchableOpacity
                style={styles.statsItem}
                onPress={() => {
                  props.getSmsListDay(letter), ref.current.open();
                }}>
                <Text style={styles.done}>Wyślij SMS'y</Text>
              </TouchableOpacity> */}
            </View>
            <View style={styles.sectionItems}>
              {items.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.cardWrapper,
                    index == 0 && {borderTopWidth: 0},
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      // handle onPress
                      refDetail.current.open();
                      props.getSmsDetail(item.id);
                    }}>
                    <View style={styles.card}>
                      <View
                        style={[
                          styles.cardImg,
                          styles.cardAvatar,
                          {backgroundColor: item.client.color},
                        ]}>
                        <Text style={styles.cardAvatarText}>
                          {item.client.first_name[0]}
                        </Text>
                      </View>

                      <View style={styles.cardBody}>
                        <Text style={styles.cardTitle}>
                          {item.client.first_name}
                        </Text>
                        <Text style={{color: '#444444'}}>
                          <FeatherIcon
                            name="map-pin"
                            color="#444444"
                            size={14}
                          />{' '}
                          {item.client.town}
                        </Text>
                        <Text style={{color: '#444444'}}>
                          <FeatherIcon name="phone" color="#444444" size={14} />{' '}
                          {item.client.tel}
                        </Text>
                      </View>
                      <View style={styles.cardAction}>
                        {!item.error ? null : ( //   <FeatherIcon color="#ff1111" name={'x'} size={25} />
                          <FeatherIcon
                            color="#ff1111"
                            name={'alert-octagon'}
                            size={25}
                          />
                        )}
                      </View>
                      <View style={styles.cardAction}>
                        {!item.checked ? (
                          <FeatherIcon color="#444444" name={'x'} size={25} />
                        ) : (
                          <FeatherIcon
                            color="#236a23"
                            name={'check-circle'}
                            size={25}
                          />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
      />
      <RBSheet
        height={660}
        draggable
        openDuration={100}
        ref={ref}
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

          <Text style={styles.sheetHeaderTitle}>Wyślij SMS'y</Text>

          <TouchableOpacity onPress={() => ref.current.close()}>
            <View style={{width: 60, alignItems: 'flex-end'}}>
              <Text style={styles.buttonClose}>Zamknij</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={[styles.sheetBody]}>
          {!props.isLoadingDay ? (
            <View style={styles.form}>
              <Text style={styles.sectionTitle}>TREŚĆ</Text>

              <ScrollView
                style={{
                  marginVertical: 4,
                  marginVertical: 8,
                  height: 300,
                }}>
                {props.sms_list_day.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles.cardWrapper,
                      index == 0 && {borderTopWidth: 0},
                    ]}>
                    <View
                      onPress={() => {
                        // handle onPress
                      }}>
                      <View style={styles.card}>
                        <View
                          style={[
                            styles.cardImg,
                            styles.cardAvatar,
                            {backgroundColor: item.client.color},
                          ]}>
                          <Text style={styles.cardAvatarText}>
                            {item.client.first_name[0]}
                          </Text>
                        </View>

                        <View style={styles.cardBody}>
                          <Text style={styles.cardTitle}>
                            {item.client.first_name}
                          </Text>

                          <Text style={{color: '#444444'}}>
                            <FeatherIcon
                              name="phone"
                              color="#444444"
                              size={14}
                            />{' '}
                            {item.client.tel}
                          </Text>
                        </View>

                        <View style={styles.cardAction}>
                          <TouchableOpacity
                            onPress={() =>
                              store.dispatch({
                                type: SMS_LIST_DAY_DELEATE,
                                payload: item.id,
                              })
                            }>
                            <FeatherIcon color="#ff1111" name={'x'} size={25} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <View>
                <Text style={styles.sectionTitle}>TREŚĆ</Text>
                <View style={styles.cardWrapper}>
                  <Text style={styles.tekst3}>{props.group.smsNote}</Text>
                </View>
              </View>
              <View style={{flex: 1, marginVertical: 4, marginVertical: 8}}>
                <TouchableOpacity
                  style={styles.headerBadgeButtons}
                  onPress={() => props.SendSMSList()}>
                  {/* <FeatherIcon name="map-pin" size={20} color="black" /> */}
                  <Text style={styles.textTagline}>Wyślij</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <ActivityIndicator size={'large'} />
          )}
        </View>
      </RBSheet>

      <RBSheet
        height={500}
        draggable
        openDuration={0}
        ref={refDetail}
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

          <Text style={styles.sheetHeaderTitle}>Wyślij SMS'y</Text>

          <TouchableOpacity onPress={() => refDetail.current.close()}>
            <View style={{width: 60, alignItems: 'flex-end'}}>
              <Text style={styles.buttonClose}>Zamknij</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={[styles.sheetBody]}>
          {!props.isLoadingDetail ? (
            <View style={styles.form}>
              {sms_detail ? (
                <>
                  <Text style={styles.sectionTitle}>
                    Klient length {props.group.smsNote.length}{' '}
                  </Text>
                  <View style={[styles.cardWrapper]}>
                    <View
                      onPress={() => {
                        // handle onPress
                      }}>
                      <View style={styles.card}>
                        <View
                          style={[
                            styles.cardImg,
                            styles.cardAvatar,
                            {backgroundColor: sms_detail.client.color},
                          ]}>
                          <Text style={styles.cardAvatarText}>
                            {sms_detail.client.first_name[0]}
                          </Text>
                        </View>

                        <View style={styles.cardBody}>
                          <Text style={styles.cardTitle}>
                            {sms_detail.client.first_name}
                          </Text>

                          <Text style={{color: '#444444'}}>
                            <FeatherIcon
                              name="phone"
                              color="#444444"
                              size={14}
                            />{' '}
                            {sms_detail.client.tel}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </>
              ) : null}

              <View>
                <Text style={styles.sectionTitle}>TREŚĆ</Text>
                <View style={styles.cardWrapper}>
                  <Text style={styles.tekst3}>{props.group.smsNote}</Text>
                </View>
              </View>
              <View style={{flex: 1}}>
                <View style={{flex: 1, marginVertical: 4, marginVertical: 8}}>
                  <TouchableOpacity
                    style={styles.headerBadgeButtons}
                    onPress={() => {
                      props.sendSMSoneVer2(sms_detail.client.tel);
                    }}>
                    {/* <FeatherIcon name="map-pin" size={20} color="black" /> */}
                    <Text style={styles.textTagline}>Wyślij</Text>
                  </TouchableOpacity>
                </View>
                {sms_detail ? (
                  <>
                    {!sms_detail.checked ? (
                      <View
                        style={{
                          flex: 1,
                          top: 35,
                          marginVertical: 4,
                          marginVertical: 8,
                        }}>
                        <TouchableOpacity
                          style={styles.headerBadgeButtonsNoDone}
                          onPress={() => {
                            props.done(sms_detail.id),
                              refDetail.current.close();
                          }}>
                          {/* <FeatherIcon name="map-pin" size={20} color="black" /> */}
                          <Text style={styles.textTagline}>Zrobione</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View
                        style={{
                          flex: 1,
                          top: 35,
                          marginVertical: 4,
                          marginVertical: 8,
                        }}>
                        <TouchableOpacity
                          style={styles.headerBadgeButtonsDone}
                          onPress={() => {
                            props.noDone(sms_detail.id),
                              refDetail.current.close();
                          }}>
                          {/* <FeatherIcon name="map-pin" size={20} color="black" /> */}
                          <Text style={styles.textTagline}>Nie Zrobione</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                ) : null}
              </View>
            </View>
          ) : (
            <ActivityIndicator size={'large'} />
          )}
        </View>
      </RBSheet>

      <RBSheet
        height={300}
        draggable
        openDuration={100}
        ref={ref2}
        closeOnPressMask={true}
        closeOnPressBack={true}
        customModalProps={{
          animationType: 'slide',
          statusBarTranslucent: true,
        }}
        customStyles={{
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
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

          <Text style={styles.sheetHeaderTitle}>Treść SMS'ów</Text>

          <TouchableOpacity onPress={updateNote}>
            <View style={{width: 60, alignItems: 'flex-end'}}>
              <Text style={styles.done}>Zapisz</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.sheetBody}>
          <Text style={styles.sectionTitle}>
            Klient length {smsNote.length}{' '}
          </Text>
          <TextInput
            editable
            returnKeyType="go"
            blurOnSubmit={true}
            multiline
            numberOfLines={4}
            placeholder="Wiadomość"
            maxLength={300}
            onChangeText={smsNote => setNote(smsNote)}
            value={smsNote}
            style={{
              backgroundColor: '#f1f5f9',
              paddingHorizontal: 16,
              borderRadius: 12,
              fontSize: 15,
              fontWeight: '500',
              color: '#222',
              textAlignVertical: 'top',
            }}
          />
        </View>
      </RBSheet>
    </View>
  );
}
const mapStateToProps = state => ({
  sms_list: state.sms.sms_list,
  sms_list_day: state.sms.sms_list_day,
  sms_detail: state.sms.sms_detail,
  isLoading: state.sms.isLoading,
  isLoadingDay: state.sms.isLoadingDay,
  isLoadingDetail: state.sms.isLoadingDetail,
  group: state.group.group,
});

export default connect(mapStateToProps, {
  sendSMSoneVer2,
  getSmsList,
  getSmsNextPage,
  getSmsListDay,
  SendSMSList,
  updateGroup,
  getSmsDetail,
  done,
  noDone,
})(SmsToSend);

const styles = StyleSheet.create({
  lessonsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#185aca',
    // marginBottom: 12,
    marginHorizontal: 12,
  },
  headerBadgeButtons2: {
    flexDirection: 'row',
    backgroundColor: '#d3e0fe',
    width: '100%',
    paddingVertical: 10,
    // height: 46,
    elevation: 5,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
  },
  header: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  title2: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 0,
    // textAlign: 'right',
  },
  tekst3: {
    fontSize: 13,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 0,
    // textAlign: 'right',
  },
  /** Section */
  section: {
    paddingVertical: 6,
    marginHorizontal: 6,
    marginTop: 12,
    paddingLeft: 24,
    paddingRight: 24,
    backgroundColor: '#fff',
    borderRadius: 40,
  },

  sectionItems: {
    marginTop: 8,
  },
  /** Card */
  card: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardWrapper: {
    // borderColor: '#d6d6d6',
    // borderTopWidth: 1,
    paddingHorizontal: 14,
  },
  cardImg: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
  cardAvatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9ca1ac',
  },
  cardAvatarText: {
    fontSize: 22,
    fontWeight: '400',
    color: '#fff',
  },
  cardBody: {
    marginRight: 'auto',
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  cardPhone: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    color: '#616d79',
    marginTop: 3,
  },
  cardAction: {
    paddingRight: 16,
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
    backgroundColor: '#d3e0fe',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerBadgeButtonsDone: {
    backgroundColor: '#999999',
    flexDirection: 'row',

    width: '100%',
    height: 45,
    paddingVertical: 10,
    // height: 46,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBadgeButtonsNoDone: {
    flexDirection: 'row',
    backgroundColor: '#a4c2f5',
    width: '100%',
    height: 45,
    paddingVertical: 10,
    // height: 46,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  day: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c2c2c',
    // marginBottom: 12,
  },
  headerBadge: {
    backgroundColor: '#fff',
    // width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
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
  textTagline: {
    // textAlign: 'center',

    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
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
    // flexGrow: 1,

    // height: 300,
    // width: '100%',
    paddingHorizontal: 6,
    paddingVertical: 14,
  },
  done: {
    fontSize: 16,
    fontWeight: '600',
    color: '#236a23',
  },
  buttonContainerX3: {
    flex: 1,
    justifyContent: 'center', // Centrowanie w pionie
    alignItems: 'center',
    bottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    letterSpacing: 0.33,
    fontWeight: '500',
    color: '#a69f9f',
    textTransform: 'uppercase',
  },
  buttonClose: {
    color: '#ff7a55',
    fontSize: 16,
    fontWeight: '600',
  },
});
