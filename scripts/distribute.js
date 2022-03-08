const { ethers } = require('hardhat');
const csv = require('csvtojson');
const BigNumber = require('@ethersproject/bignumber').BigNumber;

async function main() {
    const contractAddress = '';
    const csvPath = './data/<MintingListName>.csv';
    const users = await csv().fromFile(csvPath);
    const Comics = await ethers.getContractFactory('NibiruComicsPolygon');
    const comics = await Comics.attach(contractAddress);
    
    // loop through whitelist and mint tokens
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        try {
            let txn = await comics._mintLoop(user.Address, user.Quantity, { gasLimit: BigNumber.from('800000') });
            await txn.wait();
            console.log(`Minted ${user.Quantity} NFT(s) for ${user.Address}`);
        } catch (error) {
            console.error(error);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
