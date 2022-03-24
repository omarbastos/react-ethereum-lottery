import { useEffect, useState } from 'react';
import lottery from './services/lottery';
import Loading from './components/Loading';
import web3 from './services/web3';
import Alert from './components/Alert';
import { FaEthereum } from 'react-icons/fa';
import { SiWeb3Dotjs } from 'react-icons/si';
import { moneyMask } from './utils/formatNumber';

function App() {
  const [loading, setLoading] = useState(false);
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [alert, setAlert] = useState({
    status: false,
    type: 'success',
    message: '',
  });
  const [loadingText, setLoadingText] = useState('Loading');

  const [amountEnter, setAmountEnter] = useState(0);

  useEffect(() => {
    if (window?.ethereum) {
      fetchContract();
    }
  }, []);
  const fetchContract = async () => {
    setLoading(true);
    setLoadingText('Fetching contract details');
    try {
      const fetchedManager = await lottery.methods.manager().call();
      setManager(fetchedManager);
      const fetchedPlayers = await lottery.methods.getPlayers().call();
      setPlayers(fetchedPlayers);
      const fetchedBalance = await lottery.methods
        .getBalance()
        .call({ from: window?.ethereum?.selectedAddress });

      setBalance(fetchedBalance);
      setLoadingText('Almost done');
    } catch (error) {
      setAlert({ status: true, type: 'error', message: error.message });
      console.error(error.message);

      setLoadingText('User denied transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = async () => {
    if (!amountEnter) return;
    setLoadingText('Entering lottery');
    setLoading(true);
    try {
      await lottery.methods.enter().send({
        from: window?.ethereum?.selectedAddress,
        value: web3.utils.toWei(amountEnter.toString(), 'ether'),
      });
      await fetchContract();
      setAlert({
        status: true,
        type: 'success',
        message: 'You have entered the lottery',
      });
    } catch (error) {
      setAlert({ status: true, type: 'error', message: error.message });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handlePickWinner = async () => {
    setLoadingText('Picking a winner');
    setLoading(true);
    try {
      await lottery.methods
        .pickWinner()
        .send({ from: window?.ethereum?.selectedAddress });
      await fetchContract();
      setAlert({
        status: true,
        type: 'success',
        message: `We have a Winner!`,
      });
    } catch (error) {
      setAlert({ status: true, type: 'error', message: error.message });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const isManager =
    manager.toUpperCase() === window?.ethereum?.selectedAddress?.toUpperCase();
  if (!window?.ethereum) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center bg-gray-900">
        <div className="flex flex-col md:rounded-xl bg-gray-800 h-full md:h-auto w-full md:w-auto overflow-x-hidden md:max-w-2xl p-2 md:p-8">
          <div className="flex-auto">
            <h2 className="text-gray-100 text-3xl font-bold my-1">
              Lottery Contract
            </h2>
            <hr />
            <p className="text-gray-300 text-lg text-left my-4 break-words">
              Metamask is not available, please connect and reload the page
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (loading) return <Loading text={loadingText} />;
  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-gray-900">
      <div className="flex flex-col md:rounded-xl bg-gray-800 h-full md:h-auto w-full md:w-auto overflow-x-hidden md:max-w-2xl p-2 md:p-8">
        <div className="flex-auto">
          <h2 className="text-gray-100 text-3xl font-bold my-1">
            Lottery Contract
          </h2>
          <hr />
          <p className="text-gray-300 text-lg text-left my-4 break-words">
            This contract is managed by
            <span className="text-gray-100 underline italic mx-1">
              {manager}
            </span>
          </p>
          <p className="text-gray-300 text-lg text-left my-2">
            Right now has
            <span className="text-gray-100 mx-1">{players.length}</span>
            players competing to win
            <span className="text-gray-100 mx-1">
              {web3.utils.fromWei(balance, 'ether')}
            </span>
            ether!
          </p>
        </div>
        <div className="">
          <h4 className="text-gray-100">Want to try your luck?</h4>
          <div className="mb-6">
            <label
              htmlFor="amountEnter"
              className="block mb-2 text-sm font-medium text-gray-300">
              Amount of ether to enter
            </label>
            <div className="flex items-center">
              <input
                value={amountEnter}
                type="text"
                id="amountEnter"
                className="bg-gray-700 border outline-none border-gray-300 text-gray-300 text-sm rounded-lg focus:cyan-blue-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => {
                  const { value } = e.target;
                  setAmountEnter(moneyMask(value));
                }}
              />
              <button
                type="button"
                onClick={handleEnter}
                className="px-8 py-2 cursor-pointer mx-2 rounded underline font-semibold text-gray-900 bg-cyan-300">
                Enter
              </button>
            </div>
          </div>
        </div>

        {isManager && (
          <div className="">
            <h4 className="text-gray-100">Time to Pick a Winner?</h4>
            <button
              type="button"
              onClick={handlePickWinner}
              className="px-4 py-2 cursor-pointer my-2 rounded font-semibold text-cyan-300 border-2 border-cyan-300">
              Pick a Winner
            </button>
          </div>
        )}
        <p className="flex-none flex items-center text-gray-400 pt-8 text-sm">
          Powered by Ethereum and Web3.js
          <FaEthereum size="24" className="mx-1" />
          <SiWeb3Dotjs size="24" />
        </p>
      </div>
      <Alert {...alert} setAlert={setAlert} />
    </div>
  );
}

export default App;
