class ApiService {
  getAccount = async accountAddress => {
    const response = await fetch(
      `https://api.compound.finance/api/v2/account?addresses[]=${accountAddress}`
    )
      .then(res => res.json())
      .catch(err => console.log(err));
    return response;
  };

  getCTokenInfo = async cTokenAddress => {
    const response = await fetch(
      `https://api.compound.finance/api/v2/ctoken?addresses[]=${cTokenAddress}`
    )
      .then(res => res.json())
      .catch(err => console.log(err));
    return response;
  };

  getEthValue = async tokenAddress => {
    const response = await fetch(
      `https://api.kyber.network/buy_rate?id=${tokenAddress}&qty=1`
    )
      .then(res => res.json())
      .catch(err => console.log(err));
    return response;
  };

  getEthToDai = async () => {
    const response = await fetch(
      `https://api.kyber.network/buy_rate?id=0x6b175474e89094c44da98b954eedeac495271d0f&qty=1`
    )
      .then(res => res.json())
      .catch(err => console.log(err));
    return response;
  };
}

export default ApiService;
