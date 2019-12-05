pragma solidity 0.5.8;

interface cToken {
  function balanceOf(address account) external returns (uint);
}

contract DefiInsure {
  cToken cBat;
  cToken cDai;
  cToken cEth;
  cToken cRep;
  cToken cUsdc;
  cToken cWbtc;
  cToken cZrx;

  constructor() public {
    cBat cToken(0xebf1a11532b93a529b5bc942b4baa98647913002);
    cDai cToken(0x6d7f0754ffeb405d23c51ce938289d4835be3b14);
    cEth cToken(0xd6801a1dffcd0a410336ef88def4320d6df1883e);
    cRep cToken(0xebe09eb3411d18f4ff8d859e096c533cac5c6b60);
    cUsdc cToken(0x5b281a6dda0b271e91ae35de655ad301c976edb1);
    cWbtc cToken(0x0014f450b8ae7708593f4a46f8fa6e5d50620f96);
    cZrx cToken(0x52201ff1720134bbbbb2f6bc97bf3715490ec19b);
  }
}