import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import Header from "../components/Header";
import NotConnectedPage from "../components/NotConnectedPage";
import Sidebar from "../components/Sidebar";

/**
 * AccountAbstraction component
 * @returns
 */
const AccountAbstraction = () => {
  const { isConnected } = useWeb3Auth();

  return (
    <main className="flex flex-col h-screen z-0">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {isConnected ? (
          <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-flex-start overflow-scroll">
            <h1 className="w-11/12 px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">Account Abstraction</h1>
          </div>
        ) : (
          <NotConnectedPage />
        )}
      </div>
    </main>
  );
};

export default AccountAbstraction;
