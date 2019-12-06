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
    cBAT = cToken(0xEBf1A11532b93a529b5bC942B4bAA98647913002);
    cDAI = cToken(0x6D7F0754FFeb405d23C51CE938289d4835bE3b14);
    cETH = cToken(0xd6801a1DfFCd0a410336Ef88DeF4320D6DF1883e);
    cREP = cToken(0xEBe09eB3411D18F4FF8D859e096C533CAC5c6B60);
    cUSDC = cToken(0x5B281A6DdA0B271e91ae35DE655Ad301C976edb1);
    cWBTC = cToken(0x0014F450B8Ae7708593F4A46F8fa6E5D50620F96);
    cZRX = cToken(0x52201ff1720134bBbBB2f6BC97Bf3715490EC19B);

    uniswapFactory = UniswapFactory(0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36);

    bat = ERC20(0xDA5B056Cfb861282B4b59d29c9B395bcC238D29B);
    dai = ERC20(0x2448eE2641d78CC42D7AD76498917359D961A783);
    rep = ERC20(0xfBf4AD5D61fC56d788a37c11B2d368Da5fb0eA05);
    usdc = ERC20(0x30C50d14858E3f285405b534bD41e11dD4fEcD75);
    wbtc = ERC20(0x577D296678535e4903D59A4C929B718e1D575e0A);
    zrx = ERC20(0xF22e3F33768354c9805d046af3C0926f27741B43);
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

  // This will be an internal function
  function getUniswapExchange(address token) public returns(address) {
    return uniswapFactory.getExchange(token);
  }
}