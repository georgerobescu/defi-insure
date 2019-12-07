pragma solidity 0.5.8;

interface cToken {
  function balanceOfUnderlying(address account) external returns (uint);
}

interface UniswapExchange {
  function getEthToTokenInputPrice(uint256 eth_sold) external view returns (uint256 tokens_bought);
  function getTokenToEthInputPrice(uint256 tokens_sold) external view returns (uint256 eth_bought);
}

interface UniswapFactory {
  function getExchange(address token) external view returns (address exchange);
}

interface ERC20 {

}

contract DefiInsure {
  cToken cBAT;
  cToken cDAI;
  cToken cETH;
  cToken cREP;
  cToken cUSDC;
  cToken cWBTC;
  cToken cZRX;

  UniswapFactory uniswapFactory;

  ERC20 bat;
  ERC20 dai;
  ERC20 rep;
  ERC20 usdc;
  ERC20 wbtc;
  ERC20 zrx;

  constructor() public {
    cBAT = cToken(0x6C8c6b02E7b2BE14d4fA6022Dfd6d75921D90E4E);
    cDAI = cToken(0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643);
    cETH = cToken(0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5);
    cREP = cToken(0x158079Ee67Fce2f58472A96584A73C7Ab9AC95c1);
    cUSDC = cToken(0x39AA39c021dfbaE8faC545936693aC917d5E7563);
    cWBTC = cToken(0xC11b1268C1A384e55C48c2391d8d480264A3A7F4);
    cZRX = cToken(0xB3319f5D18Bc0D84dD1b4825Dcde5d5f7266d407);

    uniswapFactory = UniswapFactory(0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95);

    bat = ERC20(0x0D8775F648430679A709E98d2b0Cb6250d2887EF);
    dai = ERC20(0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359); // really sai
    rep = ERC20(0x1985365e9f78359a9B6AD760e32412f4a445E862);
    usdc = ERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
    wbtc = ERC20(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599);
    zrx = ERC20(0xE41d2489571d322189246DaFA5ebDe1F4699F498);
  }

  function getCompoundPositions(address user) public returns(uint[7] memory) {
    return [
      cBAT.balanceOfUnderlying(user),
      cDAI.balanceOfUnderlying(user),
      cETH.balanceOfUnderlying(user),
      cREP.balanceOfUnderlying(user),
      cUSDC.balanceOfUnderlying(user),
      cWBTC.balanceOfUnderlying(user),
      cZRX.balanceOfUnderlying(user)
    ];
  }

  function valueInDai(uint amount, address token) view public returns(uint) {
    UniswapExchange tokenExchange = UniswapExchange(getUniswapExchange(token));
    UniswapExchange daiExchange = UniswapExchange(getUniswapExchange(0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359)); // dai address

    uint valueInEth = tokenExchange.getTokenToEthInputPrice(amount);
    return daiExchange.getEthToTokenInputPrice(valueInEth);
  }

  function getUniswapExchange(address token) view internal returns(address) {
    return uniswapFactory.getExchange(token);
  }
}