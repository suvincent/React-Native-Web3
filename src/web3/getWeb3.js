var PrivateKeyProvider = require("truffle-privatekey-provider");
// var HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require('web3');

export  function getWeb3 (sk){
    // const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/9f86490b4b644532bfb6e4f26a7ab590'))
    try {
    const web3 = new Web3(new PrivateKeyProvider("b1d134dbf0c9b98bed1a8c9ebe00e6af0e941d930b246d5948ac90a3075a143b",'wss://ropsten.infura.io/v3/9f86490b4b644532bfb6e4f26a7ab590'))
    // const provider=new HDWalletProvider([sk],"https://ropsten.infura.io/v3/9f86490b4b644532bfb6e4f26a7ab590")
    // const web3=new Web3(provider)
    
    return web3
    }
    catch(e){
        console.log(e.message)
        return "qq"
    }
}