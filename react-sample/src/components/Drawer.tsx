import { WALLET_ADAPTERS } from "@web3auth/base";
import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import { useWalletServicesPlugin } from "@web3auth/wallet-services-plugin-react-hooks";
import { useLocation, useNavigate } from "react-router-dom";

import UserProfile from "../components/UserProfile";
import { usePlayground } from "../services/playground";

interface DrawerProps {
  isOpen: boolean;
  setOpen: any;
}

/**
 * Drawer component
 */
const Drawer = ({ isOpen, setOpen }: DrawerProps) => {
  const { connectedChain } = usePlayground();
  const { showCheckout, showWalletConnectScanner, showWalletUI } = useWalletServicesPlugin();
  const { web3Auth, logout, isConnected } = useWeb3Auth();

  const navigate = useNavigate();
  function goToHome() {
    navigate("/");
  }
  function goToTransaction() {
    navigate("/transaction");
  }
  function goToContract() {
    navigate("/contract");
  }

  const location = useLocation();
  function linktoGo(label: string, path: any, id: number) {
    return (
      <div
        onClick={() => path()}
        key={id}
        className="flex items-center px-4 py-2 mb-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-primary  cursor-pointer"
      >
        <span className="text-sm font-normal">{label}</span>
      </div>
    );
  }
  function activePage(label: string, id: number) {
    return (
      <div key={id} className="flex items-center px-4 py-2 mb-2 rounded-lg bg-gray-100 text-primary cursor-pointer">
        <span className="text-sm font-bold">{label}</span>
      </div>
    );
  }
  if (isOpen) {
    return (
      <div className="fixed flex w-full h-full  lg:hidden">
        <div onClick={() => setOpen(false)} className="w-full h-full bg-black/[.4]"></div>
        <div className="flex right-0 flex-col justify-between h-screen p-5 bg-white w-80">
          <div className="py-2">
            <strong className="px-4 block p-1 text-xs font-medium text-gray-400 uppercase">MENU</strong>
            <nav className="flex flex-col mt-6">
              {location.pathname === "/" ? activePage("Main Page", 1) : linktoGo("Main Page", goToHome, 1)}
              {location.pathname === "/transaction" ? activePage("Transactions", 2) : linktoGo("Transactions", goToTransaction, 2)}
              {location.pathname === "/contract"
                ? activePage("Smart Contract Interactions", 3)
                : linktoGo("Smart Contract Interactions", goToContract, 3)}
              {isConnected && web3Auth.connectedAdapterName === WALLET_ADAPTERS.AUTH ? (
                <>
                  {linktoGo("WalletConnect Scanner", showWalletConnectScanner, 6)}
                  {linktoGo("Wallet UI", showWalletUI, 7)}
                </>
              ) : null}
              <div
                onClick={() => {
                  setOpen(false);
                  logout({ cleanup: true });
                }}
                className="flex items-center px-4 py-2 mb-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-primary  cursor-pointer"
              >
                <span className="text-sm font-normal">Disconnect</span>
              </div>
            </nav>
          </div>
          <UserProfile />
        </div>
      </div>
    );
  }

  return null;
};

export default Drawer;