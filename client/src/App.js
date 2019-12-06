import React, { Component } from "react";
import DefiInsure from "./contracts/DefiInsure.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {
    web3: null, 
    accounts: null, 
    contract: null,
    value1: '',
    value2: ''
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DefiInsure.networks[networkId];
      const instance = new web3.eth.Contract(
        DefiInsure.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  // getCompoundPositions
  handleChange1 = (e) => {
    this.setState({value1: e.target.value});
  }

  getCompoundPositions = async (e) => {
    e.preventDefault();

    const response = await this.state.contract.methods.getCompoundPositions(this.state.value1).call();
    console.log(response);
  }

  // getUniswapExchange
  handleChange2 = (e) => {
    this.setState({value2: e.target.value});
  }

  getUniswapExchange = async (e) => {
    e.preventDefault();

    const response = await this.state.contract.methods.getUniswapExchange(this.state.value2).call();
    console.log(response);
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div>
        <form onSubmit={this.getCompoundPositions}>
          <input 
            type="text" 
            placeholder="getCompoundPositions" 
            value={this.state.value1}
            onChange={this.handleChange1} />
          <button>Go</button>
        </form>
        <form onSubmit={this.getUniswapExchange}>
          <input 
            type="text" 
            placeholder="getUniswapExchange" 
            value={this.state.value2}
            onChange={this.handleChange2} />
          <button>Go</button>
        </form>
      </div>
    );
  }
}

export default App;
