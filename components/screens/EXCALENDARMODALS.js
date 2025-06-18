<View style={styles.containerModal}>
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
  <Modal
    animationType="slide"
    transparent={true}
    visible={showModalEvent}
    onRequestClose={() => {
      this.hideModal;
    }}>
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={{fontSize: 22, fontWeight: 'bold'}}>Wydarzenie:</Text>
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
                  ? [styles.buttonClient, {backgroundColor: 'lightblue'}]
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
                  Godzina: {event_detail.godzina_wizyty.substring(0, 2)}-
                  {event_detail.godzina_wizyty2.substring(0, 2)}
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
                      onPress={() => this.makeCall(event_detail.client.tel)}
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
  <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => {
      this.hideModal;
    }}>
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={{fontSize: 22, fontWeight: 'bold'}}>Dodaj Wizyte:</Text>
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
        <Text style={{fontSize: 26, margin: 9, fontStyle: 'italic'}}>
          {this.state.day}
        </Text>
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
          <Text style={{fontSize: 26}}>{'do'}</Text>
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
            // text="Zajęty Termin"
            style={{flex: 1, width: '100%'}}
            iconStyle={{borderColor: 'black'}}
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
        </View>
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
        <Text style={{fontSize: 22, fontWeight: 'bold'}}>Dodaj Piec</Text>
        <View style={{borderWidth: 1, flexDirection: 'row', margin: 15}}>
          <Text style={[styles.tekst, {flex: 1, width: '100%', fontSize: 26}]}>
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
        <View style={[{flexDirection: 'row', borderWidth: 1}, styles.tekst3]}>
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
            onChangeText={first_name => this.setState({first_name: first_name})}
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
          <Text style={[{flex: 1, width: '100%'}, styles.tekst3]}>Ulica: </Text>
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
          <Text style={[{flex: 1, width: '100%'}, styles.tekst3]}>Nr: </Text>
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
            onChangeText={nr_house => this.setState({nr_house: nr_house})}
            // secureTextEntry
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            borderWidth: 1,
            marginTop: 1,
          }}>
          <Text style={[{flex: 1, width: '100%'}, styles.tekst3]}>Tel: </Text>
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
            onPress={() => this.setState({modalVisibleClientAdd: false})}>
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
</View>;
