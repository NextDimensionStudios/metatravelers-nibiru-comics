const fs = require('fs');
const { ethers } = require('hardhat');
const csv = require('csvtojson');

async function main() {
    const contractAddress = '0xa772A8C5Bb0D9723E3aF07652c0d6AD1C5BD4830';
    const csvPath = './data/MetaTravelers_Comics_Minting_List_-_Episode_5_Initial.csv';
    const users = await csv().fromFile(csvPath);
    const Comics = await ethers.getContractFactory('NibiruComicsPolygon');
    const comics = await Comics.attach(contractAddress);
    const signer0 = await ethers.provider.getSigner(0);
    const nonce = await signer0.getTransactionCount();
    // loop through whitelist and mint tokens
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        try {
            let txn = await comics._mintLoop(user.Address, user.Quantity, {
                nonce: nonce + i
            });
            await txn.wait();
            console.log(`${i + 2}. Minted ${user.Quantity} NFT(s) for ${user.Address}`);
            fs.appendFileSync('distribute_log.txt', `${i + 2}. Minted ${user.Quantity} NFT(s) for ${user.Address}\n`, function (err) {
                if (err) throw err;
            });
        } catch (error) {
            console.error(error);
            fs.appendFileSync('distribute_log.txt', 'missing\n', function (err) {
                if (err) throw err;
            });
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
