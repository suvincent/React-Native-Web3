import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import Home from '../screen/Home'
import GenKey from '../screen/GenKey'
import Uport from '../screen/Uport'
const StackNavigator = createStackNavigator(
  {
    Home: {
      screen: Home
    },
    GenKey: {
      screen: GenKey
    },
    Uport:{
      screen:Uport
    }
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
    mode: 'modal'
  }
)

export default createAppContainer(StackNavigator)