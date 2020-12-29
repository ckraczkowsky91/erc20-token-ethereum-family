import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import KraczkowskyToken from "./contracts/KraczkowskyToken.json";
import KraczkowskyMarketplace from "./contracts/KraczkowskyMarketplace.json";
import getWeb3 from "./getWeb3";
import Web3 from 'web3';

import "./App.css";

class App extends Component {
  constructor(){
    super();
    this.state = {
      newAccount: null,
      storageValue: 0,
      web3: null,
      accounts: null,
      contract: null,
      tokenContract: null,
      marketplaceContract: null,
      bankAddress: null,
      activeAccount: '',
      receipientAddress: null
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleGift = this.handleGift.bind(this);
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      // const web3 = await getWeb3();
     const web3 = new Web3('http://127.0.0.1:8545');

     if(window.ethereum){
       window.web3 = new Web3(window.ethereum);
       await window.ethereum.enable().then((res) => {
         this.setState({
           activeAccount: res
         });
       });
       console.log(this.state.activeAccount);
     } else {
       console.log('MetaMask not installed');
     }
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );


      const tokenNetwork = KraczkowskyToken.networks[networkId];
      const tokenContract = new web3.eth.Contract(
        KraczkowskyToken.abi,
        tokenNetwork && tokenNetwork.address,
      );
      console.log('tokenContract', tokenContract);
      console.log(accounts[0]);
      const marketplaceNetwork = KraczkowskyMarketplace.networks[networkId];
      const marketplaceContract = new web3.eth.Contract(
        KraczkowskyToken.abi,
        marketplaceNetwork && marketplaceNetwork.address,
      );
      console.log('marketplaceContract',marketplaceContract);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3,
        accounts,
        contract: instance,
        tokenContract: tokenContract,
        marketplaceContract: marketplaceContract,
        bankAddress: accounts
      }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const {
      accounts,
      contract,
      tokenContract,
      bankAddress
    } = this.state;

    // Stores a given value, 5 by default.
    // // await contract.methods.set(5).send({ from: accounts[0] });
    //
    // // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();
    //
    // // Update state with the result.
    // this.setState({ storageValue: response });
    const contractValue = await tokenContract.methods.balanceOf(accounts[0]).call();
    this.setState({ value: contractValue });
  };

  handleChange(event){
    this.setState({
      receipientAddress: event.target.value
    });
  };

  handleBarter(event){
    event.preventDefault();
    console.log(document.querySelector('input[name="gift"]:checked').value);
  };

  handleClick(event){
    event.preventDefault();
    const value = 10;
    var custodianAddress = '0x7852037e44Ee8453469315dE351a2c7C45913B03';
    console.log(this.state.activeAccount[0]);
    // this.state.tokenContract.methods.balanceOf(custodianAddress).call().then(console.log);
    this.state.tokenContract.methods.transfer(this.state.activeAccount[0], value).send({ from: custodianAddress });
  };

  handleGift(event){
    event.preventDefault();
    const value = 1;
    this.state.tokenContract.methods.transfer(this.state.receipientAddress, value).send({ from: this.state.activeAccount[0]})
    console.log(this.state.receipientAddress);
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
        <p>Bank value = {this.state.value}</p>
        <button onClick={this.handleClick}>Get 10 KRZ</button>
        <form id="form">
          <input id="g1" type="radio" name="gift" value="hug"/>
          <label>Hug (1 KRZ)</label><br/>
          <input type="radio" name="gift" value="trash"/>
          <label>Take out trash (2 KRZ)</label><br/>
          <input type="radio" name="gift" value="dinner"/>
          <label>Make dinner (3 KRZ)</label><br/>
          <label>Receipient: </label>
          <input type="text" onChange={this.handleChange}/><br/>
          <input type="submit" value="Buy" onClick={this.handleGift}/>
          <input type="submit" value="Barter" onClick={this.handleBarter}/>
        </form>
      </div>
    );
  }
}

export default App;
