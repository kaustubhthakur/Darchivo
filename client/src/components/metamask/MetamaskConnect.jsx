import { useState } from 'react';

const MetamaskConnect = () => {
    const [address, setAddress] = useState('');

    const connectMetamask = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Request account access if needed
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const userAddress = accounts[0]; // Get the first account address
                setAddress(userAddress); // Store the address in state
            } catch (error) {
                console.error('User denied account access or error occurred', error);
            }
        } else {
            console.log('MetaMask is not installed!');
        }
    };

    return (
        <div>
            <button onClick={connectMetamask}>Connect MetaMask</button>
            {address && <p>Connected Address: {address}</p>}
        </div>
    );
};

export default MetamaskConnect;
