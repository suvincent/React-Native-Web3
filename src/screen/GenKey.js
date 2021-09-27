
import React from 'react'
import { StyleSheet, View,FlatList} from 'react-native'
import { IconButton, TextInput, FAB ,Card, Button} from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Buffer } from 'buffer';
// global.Buffer = Buffer;
// const crypto = require('crypto'); 
// global.crypto = crypto;
import Header from '../components/Header'

const EthUtil = require('ethereumjs-util');
const Wallet = require('ethereumjs-wallet');
const privateKeyToPublicKey = require('ethereum-private-key-to-public-key')
const STORAGE_KEY = '@save_sk'

 class GenKey extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            prikey: "",
            store:null
        }
        this.checkexist = this.checkexist.bind(this)
        this.onSaveNote = this.onSaveNote.bind(this)
        this.GenPkandAddr = this.GenPkandAddr.bind(this)
        this.SavetoStorage = this.SavetoStorage.bind(this)
        this.GetfromStorage = this.GetfromStorage.bind(this)
    }

  componentDidMount(){
    // this.removeKey()
    this.GetfromStorage()
  }
  async removeKey(){
    await AsyncStorage.removeItem(STORAGE_KEY)
  }
  onSaveNote() {
    let result = this.GenPkandAddr()
    if(result == "fail")
    {
      this.setState({prikey:""})
      return
    }

    // console.log(this.checkexist())
    this.props.navigation.state.params.addNote(result)
    this.props.navigation.goBack()
  }
  GenPkandAddr(){
    // Get a wallet instance from a private key
    try{
      const prikey = this.state.prikey
      let temp = '0x'+prikey;
      console.log(this.state.prikey)

      const privateKeyBuffer = EthUtil.toBuffer(temp);
      const wallet = Wallet.default.fromPrivateKey(privateKeyBuffer);
      
      // Get a public key
      const p = wallet.getPublicKeyString();                         
      const publicKey = privateKeyToPublicKey(prikey).toString('hex')
      
      // const publicKey = "QAQ"

      // validate
      // 看看hash後的後20個buffer是否跟address一樣
      var addr = EthUtil.keccakFromHexString(p);
      // var addr = "Cool";
      addr = '0x'+ addr.toString('hex',12,32);
      return {
        prikey,
        publicKey,
        addr
      }
    }
    catch(e){
      return "fail"
    }
  }
  checkexist(){
    var flag = false;
    this.state.store.forEach(k => {
      if(k == this.state.prikey){
        flag = true
      }
    });
    return flag
  }
  async SavetoStorage(){
    try {
      // check correct
      let result = this.GenPkandAddr()
      if(result == "fail"){
        this.setState({prikey:""})
        return
      }

      // check exist or not
      let exist = this.checkexist()
      if (exist){
        return
      }
      let value = await AsyncStorage.getItem(STORAGE_KEY)
      if (value !== null) {
        // We have data!!
        value = (JSON.parse(value));
        value.push(this.state.prikey)
      }else{
        value = [this.state.prikey]
      }
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue)
    } catch (e) {
      // saving error
      console.log(e.message)
    }
  }
  async GetfromStorage (){
    let value = await AsyncStorage.getItem(STORAGE_KEY)
      if (value !== null) {
        // We have data!!
        value = (JSON.parse(value));
      }else{
        value = []
      }
      console.log("storage",value)
      this.setState({store:value})
  }
  render() {
  return (
    <>
      <Header titleText='Add a new note' />
      {/* <IconButton
        icon='close'
        size={25}
        color='white'
        onPress={() => this.props.navigation.goBack()}
        style={styles.iconButton}
      /> */}
      <View style={styles.container}>
        <TextInput
          label='Add private key Here'
          value={this.state.prikey}
          mode='outlined'
          onChangeText={(text)=>{this.setState({prikey:text})}}
          style={styles.title}
        />
        {
          (this.state.store)?
          <>
          <FlatList
            data={this.state.store}
            renderItem={({ item ,index}) => {
              // console.log(item)
              return(
              <>
              <Card>
                <Card.Title title={"private key "+index.toString()} subtitle={item} />
                <Card.Actions>
                  <Button onPress={()=>{this.setState({prikey:item})}}>Use</Button>
                  {/* <Button onPress={()=>{console.log("delete")}}>delete</Button> */}
                </Card.Actions>
              </Card>
              </>
            )}}
          />
          </>
          :<></>
        }
        
        <FAB
          style={styles.fab}
          small
          icon='check'
          label='Go back'
          disabled={this.state.prikey == '' ? true : false}
          onPress={this.onSaveNote}
        />
        <FAB
          style={styles.fab2}
          small
          label='save'
          disabled={this.state.prikey == '' ? true : false}
          onPress={async()=>{
            await this.SavetoStorage()
            await this.GetfromStorage()
          }}
        />
      </View>
    </>
  )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 20
      },
      iconButton: {
        backgroundColor: 'rgba(46, 113, 102, 0.8)',
        position: 'absolute',
        right: 0,
        top: 40,
        margin: 10
      },
      title: {
        fontSize: 24,
        marginBottom: 20
      },
      text: {
        height: 300,
        fontSize: 16
      },
      fab: {
        position: 'absolute',
        margin: 20,
        right: 0,
        bottom: 0
      },
      fab2: {
        position: 'absolute',
        margin: 20,
        left: 0,
        bottom: 0
      }
})

export default (GenKey)