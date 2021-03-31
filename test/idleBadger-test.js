
const { expect } = require("chai");
const { BigNumber, Wallet } = require("ethers");
const { formatEther, parseEther } =require('@ethersproject/units')
const badgerABI = require('../abis/badger.json');
const badgerSettAbi = require('../abis/badgerSettAbi.json');
const { ethers } = require("hardhat");

// Mainnet Fork and test case for mainnet with hardhat network by impersonate account from mainnet
describe("deployed Contract on Mainnet fork", function() {
  it("hardhat_impersonateAccount and transfer balance to our account", async function() {
    const accounts = await ethers.getSigners();
    
    // Mainnet addresses
    const accountToImpersonate = '0x2faf487a4414fe77e2327f0bf4ae2a264a776ad2'
    const badgerAddress = '0x3472A5A71965499acd81997a54BBA8D852C6E53d'
    const BadgerSettVault = '0x19D97D8fA813EE2f51aD4B4e04EA08bAf4DFfC28'
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [accountToImpersonate]}
    )
    let signer = await ethers.provider.getSigner(accountToImpersonate)
    let badgerContract = new ethers.Contract(badgerAddress, badgerABI, signer)
    await badgerContract.transfer(accounts[0].address, badgerContract.balanceOf(accountToImpersonate))
    signer = await ethers.provider.getSigner(accounts[0].address)
    badgerContract = new ethers.Contract(badgerAddress, badgerABI, signer)
  });

  it("Initialize IDle and Badger startergy", async function() {
    const accounts = await ethers.getSigners();
    const accountToImpersonate = '0x2faf487a4414fe77e2327f0bf4ae2a264a776ad2'
    const badgerAddress = '0x3472A5A71965499acd81997a54BBA8D852C6E53d'
    const BadgerSettVault = '0x19D97D8fA813EE2f51aD4B4e04EA08bAf4DFfC28'
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [accountToImpersonate]}
    )
    let signer = await ethers.provider.getSigner(accountToImpersonate)
    let badgerContract = new ethers.Contract(badgerAddress, badgerABI, signer)
    await badgerContract.transfer(accounts[0].address, badgerContract.balanceOf(accountToImpersonate))
    signer = await ethers.provider.getSigner(accounts[0].address)
    badgerContract = new ethers.Contract(badgerAddress, badgerABI, signer)
    const IdleBadger = await ethers.getContractFactory('IdleBadger', signer);
    const IdleBadger_Instance = await IdleBadger.deploy();
    let BadgerSettVault = new ethers.Contract(BadgerSettVault, badgerSettAbi, signer)
    await IdleBadger_Instance.initialize(
        BadgerSettVault.address, 
        accounts[0].address
    )
  });

  it("Mint or deposit from Badger through idle startergy", async function() {
    const accounts = await ethers.getSigners();

    const accountToImpersonate = '0x2faf487a4414fe77e2327f0bf4ae2a264a776ad2'
    const badgerAddress = '0x3472A5A71965499acd81997a54BBA8D852C6E53d'
    const BadgerSettVault = '0x19D97D8fA813EE2f51aD4B4e04EA08bAf4DFfC28'

    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [accountToImpersonate]}
    )

    let signer = await ethers.provider.getSigner(accountToImpersonate)
    let badgerContract = new ethers.Contract(badgerAddress, badgerABI, signer)

    const bal00 = await badgerContract.balanceOf(accountToImpersonate)
    console.log('bal00', bal00.toString())

    await badgerContract.transfer(accounts[0].address, badgerContract.balanceOf(accountToImpersonate))
    signer = await ethers.provider.getSigner(accounts[0].address)
    badgerContract = new ethers.Contract(badgerAddress, badgerABI, signer)
    const IdleBadger = await ethers.getContractFactory('IdleBadger', signer);
    const IdleBadger_Instance = await IdleBadger.deploy();
    let BadgerSettVault = new ethers.Contract(BadgerSettVault, badgerSettAbi, signer)
    await IdleBadger_Instance.initialize(
        BadgerSettVault.address, 
        accounts[0].address
    )
    await badgerContract.approve(BadgerSettVault.address, '1000000000000000000000000000000000')
    await badgerContract.transfer(IdleBadger_Instance.address, '1000000')

    const bal0 = await BadgerSettVault.balanceOf(accounts[0].address)
    console.log('bal0', bal0.toString())
    await IdleBadger_Instance.mint() //// Mint Tokens or BuyTokens
    const bal1 = await BadgerSettVault.balanceOf(accounts[0].address)
    console.log('bal1', bal1.toString())

  });

  it("Redeem or withdraw from Badger through idle startergy", async function() {
    const accounts = await ethers.getSigners();
    const accountToImpersonate = '0x2faf487a4414fe77e2327f0bf4ae2a264a776ad2'
    const badgerAddress = '0x3472A5A71965499acd81997a54BBA8D852C6E53d'
    const BadgerSettVault = '0x19D97D8fA813EE2f51aD4B4e04EA08bAf4DFfC28'
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [accountToImpersonate]}
    )
    let signer = await ethers.provider.getSigner(accountToImpersonate)
    let badgerContract = new ethers.Contract(badgerAddress, badgerABI, signer)
    await badgerContract.transfer(accounts[0].address, badgerContract.balanceOf(accountToImpersonate))
    signer = await ethers.provider.getSigner(accounts[0].address)
    badgerContract = new ethers.Contract(badgerAddress, badgerABI, signer)
    const IdleBadger = await ethers.getContractFactory('IdleBadger', signer);
    const IdleBadger_Instance = await IdleBadger.deploy();
    let BadgerSettVault = new ethers.Contract(BadgerSettVault, badgerSettAbi, signer)
    await IdleBadger_Instance.initialize(
        BadgerSettVault.address, 
        accounts[0].address
    )
    await badgerContract.approve(BadgerSettVault.address, '1000000000000000000000000000000000')
    await badgerContract.transfer(IdleBadger_Instance.address, '10000000')
    await IdleBadger_Instance.mint() //// Mint Tokens or BuyTokens from Badger
    const balance = await BadgerSettVault.balanceOf(accounts[0].address)
    await BadgerSettVault.transfer(IdleBadger_Instance.address, balance)
    await IdleBadger_Instance.redeem(IdleBadger_Instance.address) //// Idle Redeem or SellTokens from Badger Sett 
  });

  
  // it("Get NextSupplyRate", async function() {
  //   const accounts = await ethers.getSigners();
  //   const accountToImpersonate = '0x2faf487a4414fe77e2327f0bf4ae2a264a776ad2'
  //   const badgerAddress = '0x3472A5A71965499acd81997a54BBA8D852C6E53d'
  //   const BadgerSettVault = '0x19D97D8fA813EE2f51aD4B4e04EA08bAf4DFfC28'
  //   await hre.network.provider.request({
  //       method: "hardhat_impersonateAccount",
  //       params: [accountToImpersonate]}
  //   )
  //   let signer = await ethers.provider.getSigner(accountToImpersonate)
  //   let badgerContract = new ethers.Contract(badgerAddress, badgerABI, signer)
  //   await badgerContract.transfer(accounts[0].address, badgerContract.balanceOf(accountToImpersonate))
  //   signer = await ethers.provider.getSigner(accounts[0].address)
  //   badgerContract = new ethers.Contract(badgerAddress, badgerABI, signer)
  //   const IdleBadger = await ethers.getContractFactory('IdleBadger', signer);
  //   const IdleBadger_Instance = await IdleBadger.deploy();
  //   let BadgerSettVault = new ethers.Contract(BadgerSettVault, badgerSettAbi, signer)
  //   await IdleBadger_Instance.initialize(
  //       BadgerSettVault.address, 
  //       accounts[0].address
  //   )
  //   const rate = await IdleBadger_Instance.nextSupplyRate('0') //// Idle Redeem or SellTokens from Badger Sett 
  //   console.log('rate: ', rate.toString());
    
  //   const getPriceInTokens = await IdleBadger_Instance.getPriceInToken() //// Idle Redeem or SellTokens from Badger Sett 
  //   console.log('getPriceInTokens: ', getPriceInTokens.toString());
  // });

  
  // it("This test case will print all state", async function() {
  //   const accounts = await ethers.getSigners();

  //   const accountToImpersonate = '0x2faf487a4414fe77e2327f0bf4ae2a264a776ad2'
  //   const badgerAddress = '0x3472A5A71965499acd81997a54BBA8D852C6E53d'
  //   const BadgerSettVault = '0x19D97D8fA813EE2f51aD4B4e04EA08bAf4DFfC28'

  //   await hre.network.provider.request({
  //       method: "hardhat_impersonateAccount",
  //       params: [accountToImpersonate]}
  //   )

  //   let signer = await ethers.provider.getSigner(accountToImpersonate)
  //   let badgerContract = new ethers.Contract(badgerAddress, badgerABI, signer)

  //   await badgerContract.transfer(accounts[0].address, badgerContract.balanceOf(accountToImpersonate))

  //   signer = await ethers.provider.getSigner(accounts[0].address)
  //   badgerContract = new ethers.Contract(badgerAddress, badgerABI, signer)
    
  //   const IdleBadger = await ethers.getContractFactory('IdleBadger', signer);
  //   const IdleBadger_Instance = await IdleBadger.deploy();
  //   console.log('IdleBadger_Instance: ', IdleBadger_Instance.address);

  //   const rate = await IdleBadger_Instance.nextSupplyRate('0') //// Idle Redeem or SellTokens from Badger Sett 
  //   console.log('rate: ', rate.toString());

  //   let BadgerSettVault = new ethers.Contract(BadgerSettVault, badgerSettAbi, signer)
  //   console.log('BadgerSettVault.address: ', BadgerSettVault.address)

  //   const maxBondDailyRate = await BadgerSettVault.callStatic.maxBondDailyRate()
  //   console.log('maxBondDailyRate: ', maxBondDailyRate.toString())

  //   await IdleBadger_Instance.initialize(
  //       BadgerSettVault.address, 
  //       accounts[0].address
  //   )

  //   await badgerContract.approve(BadgerSettVault.address, '1000000000000000000000000000000000')
  //   await badgerContract.transfer(IdleBadger_Instance.address, '10000000')

  //   const bal4 = await badgerContract.balanceOf(IdleBadger_Instance.address)
  //   console.log('IdleBadger_Instance.address-bal4: ', bal4.toString())

  //   const bal5 = await BadgerSettVault.balanceOf(IdleBadger_Instance.address)
  //   console.log('BadgerSettVault.address-bal5: ', bal5.toString())

  //   await IdleBadger_Instance.mint() //// Mint Tokens or BuyTokens from Badger
    
  //   const bal6 = await badgerContract.balanceOf(IdleBadger_Instance.address)
  //   console.log('IdleBadger_Instance.address-bal6: ', bal6.toString())

  //   const bal61 = await BadgerSettVault.balanceOf(accounts[0].address)
  //   console.log('BadgerSettVault.address-bal61: ', bal61.toString())

  //   await BadgerSettVault.transfer(IdleBadger_Instance.address, bal61)

  //   const bal7 = await BadgerSettVault.balanceOf(IdleBadger_Instance.address)
  //   console.log('BadgerSettVault.address-bal7: ', bal7.toString())

  //   await IdleBadger_Instance.redeem(IdleBadger_Instance.address) //// Idle Redeem or SellTokens from Badger Sett 

  //   const bal8 = await badgerContract.balanceOf(IdleBadger_Instance.address)
  //   console.log('IdleBadger_Instance.address-bal8: ', bal8.toString())
    
  //   const bal9 = await BadgerSettVault.balanceOf(IdleBadger_Instance.address)
  //   console.log('BadgerSettVault.address-bal9: ', bal9.toString())

  // });
})