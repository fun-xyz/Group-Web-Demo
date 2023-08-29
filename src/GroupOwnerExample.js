import {
  convertToValidUserId,
  useConnectors,
  useCreateFun,
  MetamaskConnector,
  CoinbaseWalletConnector,
  WalletConnectConnector,

  generateRandomGroupId,
  Goerli,
  configureNewFunStore,
  useActiveAuths
} from "@fun-xyz/react";
import { useMemo } from "react";
import { useState } from "react";
import ConnectorButton from "./components/ConnectorButton"

//Step 1: Initialize the FunStore. This action configures your environment based on your apikey, chain, and the authentication methods of your choosing. 
const DEFAULT_FUN_WALLET_CONFIG = {
  apiKey: "hnHevQR0y394nBprGrvNx4HgoZHUwMet5mXTOBhf",
  chain: Goerli,
  gasSponsor: {
    sponsorAddress: "0xCB5D0b4569A39C217c243a436AC3feEe5dFeb9Ad", //Gasless payments on Goerli. Please switch to another gas sponsor method, or prefund your wallet on mainnet!
  }
};

const DEFAULT_CONNECTORS = [
  MetamaskConnector(),
  CoinbaseWalletConnector("FUN EXAMPLE APP NAME"),
  WalletConnectConnector(),
];

configureNewFunStore({
  config: DEFAULT_FUN_WALLET_CONFIG,
  connectors: DEFAULT_CONNECTORS,
});

window.Buffer = window.Buffer || require("buffer").Buffer;

export default function App() {
  const [receiptTxId, setReceiptTxId] = useState("")
  const [loading, setLoading] = useState(false)
  const { connectors, activeConnectors } = useConnectors();
  const { account, initializeFunAccount, funWallet, groupIds } = useCreateFun()
  const activeAuths = useActiveAuths()
  const activeConnections = useMemo(() => {
    return activeConnectors.filter((connector) => connector.active);
  }, [activeConnectors]);

  //Step 2: Use the initializeFunAccount method to create your funWallet object
  const initializeGroupAuthWallet = () => {
    const groupId = generateRandomGroupId()
    initializeFunAccount({
      users: [
        {
          userId: groupId,
          groupInfo: {
            threshold: 2,
            memberIds: activeConnections.map((connection) => (convertToValidUserId(connection.account))),
          }
        }
      ],
      index: 1234512345 //random number
    }).catch()
  }

  const createWallet = async () => {
    setLoading(true)
    //Step 3: Create the operation
    const op = await funWallet.create(activeAuths[0], groupIds[0])
    const operation = await funWallet.getOperation(op.opId)

    //Step 4: Sign the operation with all signers that are connected
    for (let auth of activeAuths) {
      await funWallet.signOperation(auth, operation)
    }

    //Step 5: Execute the operation.
    const receipt = await funWallet.executeOperation(activeAuths[0], operation)
    setReceiptTxId(receipt.txId)
    setLoading(false)

  }


  return (
    <div className="App">
      <h1>Create FunWallet that requires multiple users to sign off on a transaction.</h1>
      1.&ensp;
      {connectors && connectors.map((_, index) => (
        index === 3 ?
          null
          :
          <> 
            <ConnectorButton key={index} index={index} /> &ensp;
          </>

      ))
      }
      {
        <div>
          <b>{activeConnections.length}</b> connectors are currently connected.
        </div>
      }
      <br></br>
      <br></br>

      2.&ensp;
      <button onClick={initializeGroupAuthWallet}>Create group auth wallet</button>
      {account ?
        <div>
          Success! FunWallet Address: {account}
        </div>
        : <></>
      }
      <br></br>
      <br></br>


      3.&ensp;
      <button onClick={createWallet}>Create FunWallet</button>
      {loading ?
        <div>
          Please sign all {activeConnections.length} transactions. Loading...
        </div>
        : <></>
      }
      {receiptTxId ?
        <div>
          Success! View on <a href={`https://goerli.etherscan.io/address/${account}`} target="_blank" rel="noreferrer"> block explorer. </a>
        </div>
        : <></>
      }
      <br></br>
      <br></br>
    </div>
  );
}