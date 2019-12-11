import React, { Component } from "react";
import DefiInsure from "./contracts/DefiInsure.json";
import getWeb3 from "./getWeb3";
import ApiService from "./services";

import "./App.css";

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    value1: "",
    value2: "",
    totalDaiValue: 0,
    tokenDaiValue: 0
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
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  // xhrRequest = (url, callback) => {
  //   const xhr = new XMLHttpRequest();

  //   xhr.open('GET', url, true);
  //   xhr.send();

  //   xhr.onreadystatechange = (e) => {
  //     if (xhr.readyState === 4 && xhr.status === 200) {
  //       callback(xhr.responseText);
  //     } else if(xhr.status === 500) {
  //       console.log('500 Error');
  //     }
  //   }
  // }

  // getCompoundPositions
  handleChange1 = e => {
    this.setState({ value1: e.target.value });
  };

  // getCompoundPositions = (e) => {
  //   e.preventDefault();

  //   this.xhrRequest(`https://api.compound.finance/api/v2/account?addresses[]=${this.state.value1}`, (res) => {
  //     const response = JSON.parse(res);
  //     response.accounts[0].tokens.forEach((token) => {
  //       if(token.supply_balance_underlying.value > 0) {
  //         console.log(token.address);
  //         console.log(token.supply_balance_underlying.value);
  //         console.log('==============');
  //       }
  //     });
  //   });
  // }

  getCompoundPositions = async e => {
    e.preventDefault();

    const cTokens = await ApiService.getAccount(this.state.value1);
    cTokens.accounts[0].tokens.forEach(token => {
      if (token.supply_balance_underlying.value > 0) {
        console.log(token.address);
        console.log(token.supply_balance_underlying.value);
        console.log("==============");
      }
    });
    console.log(cTokens);

    const underlyingToken = await Promise.all(
      cTokens.accounts[0].tokens.map(token =>
        ApiService.getCTokenInfo(token.address)
      )
    );

    console.log(underlyingToken);

    const underlyingTokenAddrAndSupply = underlyingToken.map((token, i) => ({
      underlying_address: token.cToken[0].underlying_address,
      supply_balance_underlying: Number.parseFloat(
        cTokens.accounts[0].tokens.filter(
          ctoken => ctoken.address === token.cToken[0].token_address
        )[0].supply_balance_underlying.value
      )
    }));
    console.log(underlyingTokenAddrAndSupply);

    const ethValueUnderlying = await Promise.all(
      underlyingTokenAddrAndSupply.map(token => {
        if (token.supply_balance_underlying > 0)
          return ApiService.getEthValue(token.underlying_address);
      })
    );
    console.log(ethValueUnderlying);

    const ethConversion = ethValueUnderlying.map((value, i) =>
      value !== undefined
        ? underlyingTokenAddrAndSupply[i].supply_balance_underlying *
          value.data[0].src_qty[0]
        : 0
    );
    console.log(ethConversion);

    const daiToEthRes = await ApiService.getEthToDai();
    const daiToEth = daiToEthRes.data[0].src_qty[0];

    const daiConversion = ethConversion.map(ethValue => {
      if (ethValue != undefined) {
        const daiValue = ethValue / daiToEth;
        console.log("Value in dai: ", daiValue);
        return daiValue;
      }
    });
    console.log(daiConversion);

    const totalDaiValue = daiConversion.reduce((prev, curr) => prev + curr);
    console.log(totalDaiValue);
    this.setState({ totalDaiValue });
  };

  // valueInDai
  handleChange2 = e => {
    this.setState({ value2: e.target.value });
  };

  // valueInDai = async (e) => {
  //   e.preventDefault();

  //   this.xhrRequest(`https://api.kyber.network/buy_rate?id=${this.state.value2}&qty=1`, (res) => {
  //     const response = JSON.parse(res);
  //     const ethValue = response.data[0].src_qty[0];

  //     // TODO: Fix this
  //     this.xhrRequest(`https://api.kyber.network/buy_rate?id=0x6b175474e89094c44da98b954eedeac495271d0f&qty=1`, (res) => {
  //       const response = JSON.parse(res);
  //       const daiToEth = response.data[0].src_qty[0];
  //       const daiValue = ethValue / daiToEth;
  //       console.log('Value in dai: ', daiValue);
  //     });
  //   });
  // }

  valueInDai = async e => {
    e.preventDefault();

    const ethValueRes = await ApiService.getEthValue(this.state.value2);
    const ethValue = ethValueRes.data[0].src_qty[0];

    const daiToEthRes = await ApiService.getEthToDai();
    const daiToEth = daiToEthRes.data[0].src_qty[0];
    const daiValue = ethValue / daiToEth;
    console.log("Value in dai: ", daiValue);
    this.setState({ totalDaiValue: daiValue });
  };

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
            onChange={this.handleChange1}
          />
          <button>Go</button>
        </form>
        <form onSubmit={this.valueInDai}>
          <input
            type="text"
            placeholder="valueInDai"
            value={this.state.value2}
            onChange={this.handleChange2}
          />
          <button>Go</button>
        </form>
        <div>Total Position in Dai : {this.state.totalDaiValue}</div>
        <div>Token to Dai value: {this.state.tokenDaiValue}</div>
      </div>
    );
  }
}

export default App;
