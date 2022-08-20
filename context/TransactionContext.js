import React, { useState, useEffect } from "react"

export const TransactionContext = React.createContext()

let eth;

if (typeof window !== 'undefined') {
    eth = window.ethereum;
}

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        addressTo: '',
        amount: '',
    })

    useEffect(() => {
      checkIfWalletIsConnected();
    }, [])

    const connectWallet = async (metamask = eth) => {
        try {
            if (!metamask) return alert('Please install metamask')
            const accounts = await metamask.request({ method: 'eth_requestAccounts'})
        } catch (error) {
            console.log(error);
        }
    }

    const checkIfWalletIsConnected = async (metamask = eth) => {
        try {
            if (!metamask) return alert('Please install metamask');
            const accounts = await metamask.request({ method: 'eth_accounts' })

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const sendTransaction = async(
        metamask = eth,
        connectedAccount = currentAccount,
    ) => {
        try {
            if (!metamask) return alert('Please install metamask');
            const { addressTo, amount } = formData;
            const transactionContract = getEthereumContract();

            const parsedAmount = ethers.utils.parseEther(amount);

            await metamask.request({
                method: 'eth_sendTransaction',
                params: [
                    {
                        from: connectedAccount,
                        to: addressTo,
                        value: parsedAmount._hex,
                    },
                ],
            })

            const transactionHash = await transactionContract.publishTransaction(
                addressTo,
                parsedAmount,
                `Transferring ETH ${parsedAmount} to ${addressTo}`,
                'TRANSFER'
            )

            setIsLoading(true);

            await transactionHash.wait();

            //DB
            // await saveTransaction(
            //     transactionHash.hash,
            //     amount,
            //     connectedAccount,
            //     addressTo
            // )

            setIsLoading(false);

        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = (e, name) => {
        formData((prevState) => ({ ...prevState, [name]: e.target.value }))
    }

    return (
        <TransactionContext.Provider
            value={{
                connectWallet,
                currentAccount,
                sendTransaction,
                handleChange,
            }}
        >
            {children}
        </TransactionContext.Provider>
    )
}