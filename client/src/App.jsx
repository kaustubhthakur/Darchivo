import React,{useState,useEffect} from 'react'
import { ethers } from "ethers";
import "./App.css"
import Display from './components/display/Display';
import Modal from './components/modal/Modal';
import FileUpload from './components/upload/FileUpload';
import MetaMaskConnect from './components/metamask/MetamaskConnect';
const UploadABI=[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "url",
				"type": "string"
			}
		],
		"name": "add",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "allow",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "disallow",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "display",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "shareAccess",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "user",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "access",
						"type": "bool"
					}
				],
				"internalType": "struct DDrive.Access[]",
				"name": "",
				"type": "tuple[]"
			}
    
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const App = () => {
  const [account,setAccount] = useState("")
    const [contract,setContract] = useState("")
    const [provider,setProvider] = useState(null);
    const [modalOpen,setModalOpen] = useState(false);
    useEffect(() => {
      if (window.ethereum) {
        const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(ethProvider);
      } else {
        console.error("Please install MetaMask!");
      }
    }, []);
  
    const connectWallet = async () => {
      try {
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
      } catch (err) {
        console.error("Failed to connect wallet", err);
      }
    };
  
    const disconnectWallet = () => {
      setAccount(null);
    };
   // const [provider,setProvider] = useState(null);
   useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0xdb4bfcb3cfe084d1b79b484ce760c58f0e5c2eec";

        const contract = new ethers.Contract(
          contractAddress,
          UploadABI,
          signer
        );
        //console.log(contract);
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);
  return (
  
    <div  className='bg-hexagon '>
  
    {!modalOpen && (
      <button className="share" onClick={() => setModalOpen(true)}>
        Share
      </button>
    )}
    {modalOpen && (
      <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
    )}

    <div className="App">
      <h1 style={{ color: "white" }}>Darchivo</h1>
      <div class="bg"></div>
      <div class="bg bg2"></div>
      <div class="bg bg3"></div>

       <p className='address-metamask'>
        Account : {account ? account : "Not connected"}
      </p> 
      
      <FileUpload
        account={account}
        provider={provider}
        contract={contract}
      ></FileUpload>
      <Display contract={contract} account={account}></Display>
    </div>
  </div>
  )
}

export default App