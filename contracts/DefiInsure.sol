pragma solidity 0.5.8;

interface cToken {
  function balanceOfUnderlying(address account) external returns (uint);
}

contract DefiInsure {
  cToken cBAT;
  cToken cDAI;
  cToken cETH;
  cToken cREP;
  cToken cUSDC;
  cToken cWBTC;
  cToken cZRX;

  struct compoundPositions {
    cToken cBat;
    cToken cDAI;
    cToken cETH;
    cToken cREP;
    cToken cUSDC;
    cToken cWBTC;
    cToken cZRX;
  }

  constructor() public {
    cBAT = cToken(0xEBf1A11532b93a529b5bC942B4bAA98647913002);
    cDAI = cToken(0x6D7F0754FFeb405d23C51CE938289d4835bE3b14);
    cETH = cToken(0xd6801a1DfFCd0a410336Ef88DeF4320D6DF1883e);
    cREP = cToken(0xEBe09eB3411D18F4FF8D859e096C533CAC5c6B60);
    cUSDC= cToken(0x5B281A6DdA0B271e91ae35DE655Ad301C976edb1);
    cWBTC= cToken(0x0014F450B8Ae7708593F4A46F8fa6E5D50620F96);
    cZRX = cToken(0x52201ff1720134bBbBB2f6BC97Bf3715490EC19B);
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
}