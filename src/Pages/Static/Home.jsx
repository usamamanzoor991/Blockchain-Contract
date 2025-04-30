import React, { useEffect, useRef, useState } from 'react';
import { ethers, formatEther } from 'ethers';
import { Contract } from 'ethers';
import { abi } from '../../utilities/ABI/abi.js';

const Home = () => {

    const providerRef = useRef();
    const [signer,setSigner] = useState();
    const contractRef = useRef();
    const [balanceB,setBalanceB] = useState();
    const [balanceA,setBalanceA] = useState();

    //Get Provider And Signer Function - Provider(Read Only) | Signer(Read/Write) 
    const getProviderAndSigner = async() => {
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
        setSigner(Signer);
    }

    //Get Contract Function
    const getContract = async() => {
        if(signer!= undefined){
            await providerRef.current.send('eth_requestAccounts', []);
            const contract = new Contract("0xc365Fc4c14259b861Dddbe771618ab9258da32f3", abi, signer);
            contractRef.current = contract;
        }
    }

    const mintTokens = async() => {
        if(signer!= undefined){
            const address = await signer.getAddress();
            const balance = await providerRef.current.getBalance(address);
            setBalanceB(formatEther(balance));
        }
    }

    //Get Provider And Signer Call
    useEffect(()=>{
        getProviderAndSigner();
    },[])

    //Get Contract Call
    useEffect(()=>{
        getContract();
    },[signer])

    useEffect(()=>{
        mintTokens();
    },[signer])

    //Test
    useEffect(()=>{
        console.log("Provider : ",providerRef);
        console.log("Signer : ",signer);
        console.log("Contract : ",contractRef.current);
        console.log("Before Balance : ",balanceB);
    },[signer,balanceB])

    const handleMint = async() => {
        try {
            const tx = await contractRef.current.publicMint(10);
            await tx.wait();
            alert("Minted Successfully!!!");
        } catch (error) {
            console.error("Error Minting Tokens : ",error);
        }
    }

    const handleTransfer = async() => {
        try {
            const tx = await contractRef.current.transfer("0xc365Fc4c14259b861Dddbe771618ab9258da32f3", 10);
            await tx.wait();
            alert("Transfer successful!");
        } catch (error) {
            console.error("Error Minting Tokens : ",error);
        }
    }

    const handleApprove = async() => {
        try {
            const tx = await contractRef.current.approve("0xc365Fc4c14259b861Dddbe771618ab9258da32f3", 10);
            await tx.wait();
            alert("Approved successful!");
            const address = await signer.getAddress();
            const balance = await providerRef.current.getBalance(address);
            setBalanceA(formatEther(balance));
        } catch (error) {
            console.error("Error Minting Tokens : ",error);
        }
    }

    return (
        <div className='flex flex-col'>
          <button className='bg-orange-100 mb-[100px]' onClick={() => handleMint()}>Mint Token</button>
          <button className='bg-orange-100 mb-4' onClick={() => handleTransfer()}>Handle Transfer</button>
          <button className='bg-orange-100 mb-4' onClick={() => handleApprove()}>Handle Approve</button>
          <h1>Balance Before : {balanceB}</h1>
          <h1>Balance After : {balanceA}</h1>
        </div>
      )
}

export default Home;