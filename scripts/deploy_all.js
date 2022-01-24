const { ethers, upgrades } = require("hardhat");

async function main() {
  const addr = await deployV1();
  await deployV2(addr);
  await deployV3(addr);
}

async function deployV1() {
  const accounts = await ethers.getSigners()
  const contractOwner = accounts[0]
  console.log(`contractOwner ${contractOwner.address}`)

  const Tokenavg1 = await ethers.getContractFactory("TokenavgpriceV1");
  const tokenavg1 = await upgrades.deployProxy(Tokenavg1, { initializer: 'setAdmin' });
  await tokenavg1.deployed();
  console.log("TokenavgpriceV1 deployed to ", tokenavg1.address);
  return tokenavg1.address;
}

async function deployV2(addr) {
  const accounts = await ethers.getSigners()
  const contractOwner = accounts[0]

  const Tokenavg2 = await ethers.getContractFactory("TokenavgpriceV2");
  console.log("Upgrading TokenavgV1");
  await upgrades.upgradeProxy(addr, Tokenavg2);
  console.log("TokenavgV1 upgraded");
}

async function deployV3(addr) {
  const accounts = await ethers.getSigners()
  const contractOwner = accounts[0]

  const Tokenavg3 = await ethers.getContractFactory("TokenavgpriceV3");
  console.log("Upgrading TokenavgV2");
  await upgrades.upgradeProxy(addr, Tokenavg3);
  console.log("TokenavgV2 upgraded");
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

exports.deployV1 = deployV1
exports.deployV2 = deployV2
exports.deployV3 = deployV3
