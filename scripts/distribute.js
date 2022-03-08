const { ethers } = require('hardhat');
const csv = require('csvtojson');

async function main() {
    const address = '0x0165878A594ca255338adfa4d48449f69242Eb8F';
    const csvPath = './data/MetaTravelers Comics Minting List - Testing.csv';
    const users = await csv().fromFile(csvPath);
    const Comics = await ethers.getContractFactory('NibiruComicsPolygon');
    const comics = await Comics.attach(address);
    
    // loop through whitelist and mint tokens
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        try {
            let txn = await comics._mintLoop(user.Address, user.Quantity);
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
