import React, { useEffect, useRef, useState } from 'react';
import { ethers, formatEther } from 'ethers';
import { Contract } from 'ethers';
import { abi } from '../../utilities/ABI/abi.js';

const Home = () => {

    const providerRef = useRef();
    const contractRef = useRef();
    const [balanceB,setBalanceB] = useState();
    const [balanceA,setBalanceA] = useState();
    const [signerAddress,setSignerAddress] = useState();
    const [loading,setLoading] = useState(false);
    
    const contractAddress = "0xc365Fc4c14259b861Dddbe771618ab9258da32f3";

    //Get Essentials - Provider | Signer | Contract 
    const getEssentials = async() => {
        setLoading(true);
        if(window.ethereum == null){
            console.log("MetaMask not installed; using read-only defaults")
            const Provider = ethers.getDefaultProvider();
            providerRef.current = Provider;
        }
        else{
            const Provider = new ethers.BrowserProvider(window.ethereum);
            providerRef.current = Provider;
        }

        const Signer = await providerRef.current.getSigner();

        await providerRef.current.send('eth_requestAccounts', []);
        const contract = new Contract(contractAddress, abi, Signer);
        contractRef.current = contract;

        const address = await Signer.getAddress();
        setSignerAddress(address); 
    }

    const getBalance = async() => {
        if(signerAddress){
            const balance = await providerRef.current.getBalance(signerAddress);
            const formattedBalance = formatEther(balance);
            setLoading(false);
            return formattedBalance;
        }
    }

    //Get Essentials Call
    useEffect(()=>{
        getEssentials();
        const balance = getBalance();
        setBalanceB(balance);
        setBalanceA(balance);
    },[signerAddress])

    const handleMint = async() => {
        setLoading(true);
        try {
            const tx = await contractRef.current.publicMint(10);
            await tx.wait();
            alert("Minted Successfully!!!");
            setLoading(false);
        } catch (error) {
            console.error("Error Minting Tokens : ",error);
            setLoading(false);
        }
    }

    const handleTransfer = async() => {
        setLoading(true);
        try {
            const tx = await contractRef.current.transfer(contractAddress, 10);
            await tx.wait();
            alert("Transfer successfull!");
            setLoading(false);
        } catch (error) {
            console.error("Error Transferring Tokens : ",error);
            setLoading(false);
        }
    }

    const handleApprove = async() => {
        setLoading(true);
        try {
            const tx = await contractRef.current.approve(contractAddress, 10);
            await tx.wait();
            alert("Approved successfully!");
            const balance = await getBalance(signerAddress);
            setBalanceA(balance);
            setLoading(false);
        } catch (error) {
            console.error("Error Approving Tokens : ",error);
            setLoading(false);
        }
    }

    if(loading){
        return(
            <div className='min-h-[100vh] flex flex-column justify-center items-center'>
                <h1 className='text-black'>loading...</h1>
            </div>
        )
    }

    if(!loading){
        return (
            <div className='bg-[#fefae0] min-h-[100vh]'>
                <h1 className='text-center text-[32px] font-bold pt-4 pb-4'>SepoliaETH Testnet</h1>
                <div className='flex flex-col justify-center items-center'>
                    <button className='bg-[#bc6c25] text-[#fefae0] mb-4 p-4 rounded-[2.25rem] w-[90vw] md:w-[40vw] hover:cursor-pointer'  onClick={() => handleMint()}>Mint Token</button>
                    <button className='bg-[#bc6c25] text-[#fefae0] mb-4 p-4 rounded-[2.25rem] w-[90vw] md:w-[40vw] hover:cursor-pointer' onClick={() => handleTransfer()}>Handle Transfer</button>
                    <button className='bg-[#bc6c25] text-[#fefae0] mb-4 p-4 rounded-[2.25rem] w-[90vw] md:w-[40vw] hover:cursor-pointer' onClick={() => handleApprove()}>Handle Approve</button>
                    <div className='flex flex-col justify-center items-center bg-[#606c38] w-[90vw] md:w-[40vw] rounded-[2.25rem] p-4'>
                        <h2 className='mb-4 font-extrabold inline-block text-[#fefae0]'>Balance Before : <p className='font-normal inline-block'>{balanceB}</p></h2>
                        <h2 className='font-extrabold inline-block text-[#fefae0]'>Balance After : <p className='font-normal inline-block'>{balanceA}</p></h2>
                    </div>    
                </div>
            </div>
        )
    }
}

export default Home;