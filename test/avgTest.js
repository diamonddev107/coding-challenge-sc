const { expect } = require("chai");
const { ethers } = require("hardhat");
const utils = require('ethers').utils;
const { deployV1 } = require('../scripts/deploy_all.js');
const { deployV2 } = require('../scripts/deploy_all.js');
const { deployV3 } = require('../scripts/deploy_all.js');

describe("=== Test Avg Price ===", function () {
  let addr
  let accounts
  let contractOwner
  let testToken
  let mock
  let base
  before(async function () {
    accounts = await ethers.getSigners()
    contractOwner = accounts[0]
    const Mock = await ethers.getContractFactory("MockBep20");
    mock = await Mock.deploy()
    await mock.deployed()
    base = new Date("2022-01-01T08:00:00")

  })

  it("Check V1", async () => {
    addr = await deployV1()
    console.log("V1 deployed to ", addr)
    const avg1 = await ethers.getContractAt("TokenavgpriceV1", addr)
    let time1 = Date.now() - base
    console.log(time1)
    await avg1.connect(contractOwner).setDayPrice(mock.address, 22);
    expect(await avg1.getDayPrice(mock.address, 0)).to.be.equal(22);

    await avg1.connect(accounts[1]).setDayPrice(mock.address, 23);
  })

  it("Check V2", async () => {
    await deployV2(addr)
    const avg2 = await ethers.getContractAt("TokenavgpriceV2", addr)
    await expect(avg2.connect(accounts[1]).setDayPrice(mock.address, 23)).to.be.reverted;
    
    expect(await avg2.getDayPrice(mock.address, 0)).to.be.equal(22);
    expect(await avg2.getDayPrice(mock.address, 1)).to.be.equal(23);
  })

  it("Check V3", async () => {
    await deployV3(addr)
    const avg3 = await ethers.getContractAt("TokenavgpriceV3", addr)
    await avg3.connect(contractOwner).updateDayPrice(mock.address, 0, 33)
    expect(await avg3.getDayPrice(mock.address, 0)).to.be.equal(33)
    expect(await avg3.getDayPrice(mock.address, 1)).to.be.equal(23);
  })
});
