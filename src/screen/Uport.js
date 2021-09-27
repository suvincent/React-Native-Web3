
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { IconButton, TextInput, FAB, Button,DataTable ,Text } from 'react-native-paper'
// import { Buffer } from 'buffer';
// global.Buffer = Buffer;
// const crypto = require('crypto'); 
// global.crypto = crypto;
import Header from '../components/Header'
import bs58 from 'bs58'
// import { getWeb3 } from '../web3/getWeb3'
const DidRegistryContract = require('ethr-did-registry')
const Web3 = require('web3');
// const web3 =  getWeb3("b1d134dbf0c9b98bed1a8c9ebe00e6af0e941d930b246d5948ac90a3075a143b")
const web3 = new Web3(
  new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/9f86490b4b644532bfb6e4f26a7ab590'),
);

 class Uport extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            addr:this.props.navigation.state.params.addr,
            attibuteList:[],
            web3:null,
            contract:
            new web3.eth.Contract(
                DidRegistryContract.abi,
                // deployedNetwork && deployedNetwork.address,
                "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b"
              )
        }
        // console.log(props.web3)
        this.Init = this.Init.bind(this)
        this.getHistory = this.getHistory.bind(this)
        this.TurnRawtoReadable = this.TurnRawtoReadable.bind(this)
        // this.Init()
    }
    async Init(){
        // const web3 = await getWeb3(this.props.navigation.state.params.prikey)
        const contract = new web3.eth.Contract(
            DidRegistryContract.abi,
            // deployedNetwork && deployedNetwork.address,
            "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b"
          )
        this.setState({
            // web3:web3,
            contract:contract
        })
   }
  
   async getHistory(){
    // let result = await contract.methods.identityOwner(accounts[0]).call()
    // console.log(this.props.contract)
    
    const {addr,contract} = this.state
    if(!contract){
        console.log("error")
        // this.Init()
        return
    }
    var accounts = [addr]
    console.log(accounts)
    const history = []
    let previousChange = await contract.methods.changed(accounts[0]).call()
    // console.log(typeof(previousChange))
    while (previousChange) {
      if(previousChange === "0")break
        await contract.getPastEvents('DIDAttributeChanged', {
          filter: {id: [accounts[0]]},  
          fromBlock: previousChange,
          toBlock: previousChange
        }, (error, events) => { 
    
          if (!error){
            var obj=JSON.parse(JSON.stringify(events));
            var array = Object.keys(obj)
            for(let index in array){
              let event = obj[array[index]].returnValues
              history.unshift(event)
              previousChange = event.previousChange
            }
          }
          else {
            console.log(error)
          }})
    }
    // console.log(history)
    // this.setState({attibuteList:history})
    this.TurnRawtoReadable(history)
  }

  async TurnRawtoReadable(inputList){
    if(inputList.length === 0){
      alert("please get raw history first!")
    }
    let newList = []
    inputList.forEach(async(row) => {
      // console.log(row.value)
      let cut = this.CutTailZero(row.name)
      let nv = row.value;
      try{
        // 如果長度 == hash => 轉hash to IPFS hash
        if(nv.length === "0x3b0326dd6d55bc8100afc3e7f2e8b8626e917dc0ccbf96b7016785b42b9ce29e".length)
          nv = this.getIpfsHashFromBytes32(row.value);
        else // 轉乘ascii
          nv=this.CutTailZero(row.value)
      }
      catch(err){
        console.log(err.message)
      }
      // console.log(nv)
      let newrow = {
        name: cut,
        value:nv,
        previousChange:row.previousChange
      }
      newList.push(newrow);
    
    this.setState({attibuteList : newList})
    })
  }
   getIpfsHashFromBytes32(bytes32Hex) {
    // Add our default ipfs values for first 2 bytes:
    // function:0x12=sha2, size:0x20=256 bits
    // and cut off leading "0x"
    const hashHex = "1220" + bytes32Hex.slice(2)
    const hashBytes = Buffer.from(hashHex, 'hex');
    const hashStr = bs58.encode(hashBytes)
    return hashStr
  }

   CutTailZero(hex) {
    var str = "";
    var i = 0, l = hex.length;
    if (hex.substring(0, 2) === '0x') {
      i = 2;
    }
    for (; i < l; i+=2) {
      var code = parseInt(hex.substr(i, 2), 16);
      if(code !== 0) {
        str += String.fromCharCode(code);
      }
    }
    return str;
  }
  render() {
  return (
    <>
      <Header titleText='Uport' />
      
      <View style={styles.container}>
        <Text style={styles.titleContainer}> {this.state.addr} </Text>
        {/* <Button mode="contained" onPress={this.getHistory}>get History</Button> */}
        <DataTable>
            <DataTable.Header>
                <DataTable.Title >key</DataTable.Title>
                <DataTable.Title >value</DataTable.Title>
            </DataTable.Header>
            {this.state.attibuteList.map((item,index)=>{
                // console.log("item",item,index)
                return (
                    
                    <DataTable.Row key={index}>
                        <DataTable.Cell>{item.name}</DataTable.Cell>
                        <DataTable.Cell>{item.value}</DataTable.Cell>
                    </DataTable.Row>
                    
                )
            })}
        </DataTable>
        <FAB
          style={styles.fab2}
          small
          label='get History'
          onPress={this.getHistory}
        />
        <FAB
          style={styles.fab}
          small
          icon='check'
          onPress={() => this.props.navigation.goBack()}
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
      titleContainer: {
        textAlign: 'center',
        // justifyContent: 'center',
        // flex: 1
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

export default Uport