import React from 'react';
import { StyleSheet, View ,FlatList} from 'react-native';
import { Text, FAB, List ,Card,Paragraph ,Title ,Button } from 'react-native-paper'



 class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latestBlock: {},
      notes : undefined
    }
    this.addNote = this.addNote.bind(this)
  }

  componentWillMount() {
    // web3.eth.getBlock('latest') 
    //   .then(latestBlock => {
    //     // console.log(latestBlock);
    //     this.setState({ latestBlock });
    //   });
  }

   addNote(note) {
    // note.id = this.state.notes.length + 1
    this.setState({
        notes: note
    })
  }

  render() {
    // const latestBlockNumber = this.state.latestBlock.number;
    const item = this.state.notes
    return (
        <>
      <View style={styles.container}>
        <Text>Latest ethereum block is: </Text>
        <Text>Check your console!</Text>
        <Text>You should find extra info on the latest ethereum block.</Text>
        <Button onPress={() =>
          this.props.navigation.navigate('Uport',{
              addr :this.state.notes.addr,
              prikey : this.state.notes.prikey
          })
        }  mode="contained">Uport Registry</Button>
      </View>
      {(!this.state.notes)?
        <View style={styles.titleContainer}>
            <Text style={styles.title}>You do not have any keys</Text>
        </View>
        :
        
            <>
            <Card>
              {/* <Card.Title title="private key" subtitle={item.prikey} />
              <Card.Actions>
                 <Button onPress={()=> {if(item)Clipboard.setString(item.prikey)}}>Copy</Button>
              </Card.Actions> */}
              <Card.Title title="public key" subtitle={item.publicKey} />
              <Card.Actions>
                {/* <Button onPress={()=> {if(item)Clipboard.setString(item.publicKey)}}>Copy</Button> */}
              </Card.Actions>
              <Card.Title title="Eth address" subtitle={item.addr} />
              <Card.Actions>
                {/* <Button onPress={()=> {if(item)Clipboard.setString(item.addr)}}>Copy</Button> */}
              </Card.Actions>
            </Card>
            </>
          
        }
      <FAB
      style={styles.fab}
      small
      icon='plus'
      label='Set private key'
      // add a second parameter object
      onPress={() =>
          this.props.navigation.navigate('GenKey',{
              addNote : this.addNote
          })
        }
      />
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    margin: 20,
  },
  fab: {
    position: 'absolute',
    margin: 30,
    right: 0,
    top: 50
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  title: {
    fontSize: 20
  },
});

export default (Home)