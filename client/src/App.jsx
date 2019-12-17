import React, { Component } from "react";
import DefiInsure from "./contracts/DefiInsure.json";
import getWeb3 from "./getWeb3";
import ApiService from "./services";
import "bulma/css/bulma.min.css";
import moment from "moment";

import "./App.css";
import Header from "./components/Header.jsx";

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    compoundAddress: "",
    makerAddress: "",
    value2: "",
    totalDaiValue: 0,
    compundDaiValue: 0,
    makerCollateralDaiValue: 0,
    loadingInsurance: false,
    startedLoading: false,
    coverPrice: 0,
    coverPeriod: 0,
    coverValidTime: 0
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

  // getCompoundPositions
  handleCompoundAddressChange = e => {
    this.setState({ compoundAddress: e.target.value });
  };
  handleMakerAddressChange = e => {
    this.setState({ makerAddress: e.target.value });
  };

  getCompoundPositions = async e => {
    e.preventDefault();

    const cTokens = await ApiService.getAccount(this.state.compoundAddress);
    if (cTokens.accounts !== undefined) {
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
          return undefined;
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
        if (ethValue !== undefined) {
          const daiValue = ethValue / daiToEth;
          console.log("Value in dai: ", daiValue);
          return daiValue;
        }
        return undefined;
      });
      console.log(daiConversion);

      const totalDaiValue = daiConversion.reduce((prev, curr) => prev + curr);
      console.log(totalDaiValue);
      this.setState({ compundDaiValue: totalDaiValue });
    }
  };

  getMakerPosition = async e => {
    e.preventDefault();
    this.setState({ loadingInsurance: true, startedLoading: true });

    const makerPosition = await ApiService.getMakerCollateral(
      this.state.makerAddress
    );
    if (makerPosition.allCups.nodes.length > 0) {
      const makerCollateralTotal = makerPosition.allCups.nodes
        .map(maker => Number.parseFloat(maker.ink))
        .reduce((prev, curr) => prev + curr);
      console.log(makerCollateralTotal);

      const pEthToEthRes = await ApiService.getPEthToEthPrice();
      const pEthToEth = Object.values(pEthToEthRes)[0].eth;
      console.log(pEthToEth);

      const makerCollateralInEth = makerCollateralTotal * pEthToEth;
      const daiToEthRes = await ApiService.getEthToDai();
      const daiToEth = daiToEthRes.data[0].src_qty[0];
      const makerCollateralInDai = makerCollateralInEth / daiToEth;
      console.log(makerCollateralInDai);

      this.setState({ makerCollateralDaiValue: makerCollateralInDai }, () => {
        this.getNexusCoverValue();
      });
    } else {
      console.log("no cdp found");
    }
  };

  getNexusCoverValue = async () => {
    const res = await ApiService.getNexusQuotes(
      this.state.makerCollateralDaiValue,
      "DAI",
      365,
      "0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B"
    );
    console.log(res);
    this.setState({
      coverPrice: res.coverCurrPrice,
      coverPeriod: res.coverPeriod,
      coverValidTime: 60,
      loadingInsurance: false
    });
  };

  // valueInDai
  handleChange2 = e => {
    this.setState({ value2: e.target.value });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Header />
        <div className="section">
          <div className="container">
            <div className="columns">
              <div className="column is-three-fifths is-offset-one-fifth">
                <div className="columns" style={{ marginBottom: 24 }}>
                  <div className="column is-9">
                    <div className="control is-medium ">
                      <input
                        className="input is-medium is-rounded"
                        type="text"
                        placeholder="Enter your wallet address"
                        value={this.state.makerAddress}
                        onChange={this.handleMakerAddressChange}
                      />
                    </div>
                  </div>
                  <div className="column is-3">
                    <button
                      className="button is-link is-rounded is-medium is-fullwidth"
                      onClick={this.getMakerPosition}
                    >
                      <small>Get Insure Price</small>
                    </button>
                  </div>
                </div>
                {this.state.startedLoading ? (
                  <div>
                    <div className="card" style={{ marginBottom: 24 }}>
                      <header className="card-header">
                        <div className="card-header-title">
                          <h2 className="title is-4">
                            Generated Insure for Maker CDP
                          </h2>
                        </div>
                      </header>
                      <div className="card-content">
                        {this.state.loadingInsurance ? (
                          <div>
                            <div className="section">
                              <div className="container is-fluid">
                                <progress
                                  className="progress is-small is-primary"
                                  max="100"
                                >
                                  15%
                                </progress>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="container is-fluid">
                              <div className="columns">
                                <div className="column is-4 has-text-left">
                                  <h2 className="title is-5">
                                    Total Collateral
                                  </h2>
                                </div>
                                <div className="column is-8 has-text-left">
                                  <h2 className="title is-4 has-text-link">
                                    {this.state.makerCollateralDaiValue.toFixed(
                                      2
                                    )}{" "}
                                    DAI
                                  </h2>
                                </div>
                              </div>
                              <div className="columns">
                                <div className="column is-4 has-text-left">
                                  <h2 className="title is-5">Cover Price</h2>
                                </div>
                                <div className="column is-8 has-text-left">
                                  <h2 className="title is-4 has-text-link">
                                    {this.state.coverPrice / 10 ** 18} DAI
                                  </h2>
                                </div>
                              </div>
                              <div className="columns">
                                <div className="column is-4 has-text-left">
                                  <h2 className="title is-5">Cover Period</h2>
                                </div>
                                <div className="column is-8 has-text-left">
                                  <h2 className="title is-4 has-text-link">
                                    {this.state.coverPeriod} Day
                                  </h2>
                                </div>
                              </div>
                              <div className="columns">
                                <div className="column is-4 has-text-left">
                                  <h2 className="title is-5">
                                    Cover Valid For
                                  </h2>
                                </div>
                                <div className="column is-8 has-text-left">
                                  <h2 className="title is-4 has-text-link">
                                    {this.state.coverValidTime} Min
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <footer className="card-footer">
                        <p className="card-footer-item">
                          Quote generated by Nexus Mutual
                        </p>
                      </footer>
                    </div>
                    <div className="columns has-text-right">
                      <div className="column is-4 is-offset-8">
                        <button className="button is-link is-rounded is-fullwidth">
                          <small>Continue</small>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
