import "./css/App.css";

import { Web3AuthInnerContext, Web3AuthProvider } from "@web3auth/modal-react-hooks";
import { WalletServicesProvider } from "@web3auth/wallet-services-plugin-react-hooks";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Contract from "./pages/Contract";
import HomePage from "./pages/HomePage";
// import NFT from "./pages/NFT";
import AccountAbstraction from "./pages/AccountAbstraction";
import Transaction from "./pages/Transaction";
import { Playground } from "./services/playground";
import { PrimeSdkProvider } from "./services/PrimeSdkProvider";
import web3AuthContextConfig from "./services/web3authContext";

/**
 * App component
 * @returns
 */
function App() {
  return (
    <div>
      <Web3AuthProvider config={web3AuthContextConfig}>
        <WalletServicesProvider context={Web3AuthInnerContext}>
          <Playground>
            <PrimeSdkProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/">
                    <Route index element={<HomePage />} />
                    <Route path="contract" element={<Contract />} />
                    <Route path="transaction" element={<Transaction />} />
                    <Route path="accountabstraction" element={<AccountAbstraction />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </PrimeSdkProvider>
          </Playground>
        </WalletServicesProvider>
      </Web3AuthProvider>
    </div>
  );
}

export default App;
