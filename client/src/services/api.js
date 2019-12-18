import Maker from "@makerdao/dai";
import { GraphQLClient } from "graphql-request";

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

  getMakerCollateral = async account => {
    const maker = await Maker.create("http", {
      url: "https://mainnet.infura.io/v3/16336a82e72c4f8eb86903e55ac6a8b2",
      web3: {
        statusTimerDelay: 15000
      },
      log: false
    });
    await maker.authenticate();
    const proxy = await maker.service("proxy").getProxyAddress(account);

    const query = `
  {
      allCups(
          first: 10,
          condition: { lad: "${proxy}" },
          orderBy: RATIO_ASC
      ) {
          totalCount
          pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          }
          nodes {
          id
          lad
          art
          ink
          ratio
          actions(first: 5) {
              nodes {
              act
              time
              }
          }
          }
      }
  }
  `;
    const graphQLClient = new GraphQLClient(
      "https://sai-mainnet.makerfoundation.com/v1",
      {
        mode: "cors"
      }
    );
    const response = await graphQLClient.request(query);
    return response;
  };

  getPEthToEthPrice = async () => {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=0xf53ad2c6851052a81b42133467480961b2321c09&vs_currencies=eth`
    )
      .then(res => res.json())
      .catch(err => console.log(err));
    return response;
  };

  getNexusQuotes = async (
    sumAssured,
    currencyType,
    coverPeriod,
    smartCoverAddress
  ) => {
    const response = await fetch(
      `https://api.nexusmutual.io/getquote/${sumAssured}/${currencyType}/${coverPeriod}/${smartCoverAddress}/K9`,
      {
        method: "GET",
        headers: {
          "x-api-key": "c904-42c7-2f90-a561"
        }
      }
    )
      .then(res => res.json())
      .catch(err => console.log(err));
    return response;
  };
}

export default ApiService;
