const { expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { ethers } = require('hardhat');
ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.ERROR);

describe('Comics', () => {
    const MAX_SUPPLY = 500;
    let owner, address1;
    let Comics, comics;

    before(async () => {
        [owner, address1] = await ethers.getSigners();
        Comics = await ethers.getContractFactory('NibiruComicsPolygon');
    });

    beforeEach(async () => {
        comics = await Comics.deploy();
        await comics.deployed();
    });

    it('should revert if non-owner tries to mint', async () => {
        await expectRevert(
            comics.connect(address1)._mintLoop(address1.address, 1),
            'Ownable: caller is not the owner'
        );
    });

    it('should revert when minting, if exceeds maxSupply', async () => {
        await expectRevert(
            comics.connect(owner)._mintLoop(address1.address, 1),
            'Minting supply limit reached'
        );
    });

    it('should revert if non-owner calls setMaxSupply', async () => {
        await expectRevert(
            comics.connect(address1).setMaxSupply(MAX_SUPPLY),
            'Ownable: caller is not the owner'
        );
    });

    it('should update the max supply to the expected value', async () => {
        await comics.connect(owner).setMaxSupply(MAX_SUPPLY);
        expect(await comics.maxSupply()).to.eq(MAX_SUPPLY);
    });

    it('should allow owner to mint a comic to a specified address', async () => {
        await comics.connect(owner).setMaxSupply(MAX_SUPPLY);
        await comics.connect(owner)._mintLoop(address1.address, 1);
        expect(await comics.balanceOf(address1.address)).to.eq(1);
    });

    it('should return the correct totalSupply()', async () => {
        await comics.connect(owner).setMaxSupply(MAX_SUPPLY);

        expect(await comics.totalSupply()).to.eq(0);

        await comics.connect(owner)._mintLoop(address1.address, 1);
        expect(await comics.totalSupply()).to.eq(1);

        await comics.connect(owner)._mintLoop(address1.address, 10);
        expect(await comics.totalSupply()).to.eq(11);
    });

    it('should return the ownedTokenIds when walletOfOwner is called', async () => {
        const quantity = 3;
        await comics.connect(owner).setMaxSupply(MAX_SUPPLY);
        await comics.connect(owner)._mintLoop(address1.address, quantity);
        const tokens = await comics.walletOfOwner(address1.address);
        for(let i = 0; i < quantity; i++) {
            expect(tokens[i]).to.eq(i + 1);
        }
    });

    it('should revert if non-owner tries to set base token URI', async () => {
        const uriPrefix = 'newUriPrefix/';
        await expectRevert(
            comics.connect(address1).setUriPrefix(uriPrefix),
            'Ownable: caller is not the owner'
        );
    });

    it('should return the correct tokenURI', async () => {
        const quantity = 3;
        const uriPrefix = 'newUriPrefix/';
        await comics.connect(owner).setMaxSupply(MAX_SUPPLY);
        await comics.connect(owner).setUriPrefix(uriPrefix);
        await comics.connect(owner)._mintLoop(address1.address, quantity);
        for(let i = 0; i < quantity; i++) {
            expect(await comics.tokenURI(i + 1)).to.eq(uriPrefix + String(i + 1));
        }
    });

    it('should update the uriPrefix to the expected value', async () => {
        const uriPrefix = 'newUriPrefix/';
        expect(await comics.uriPrefix()).to.eq('');
        await comics.connect(owner).setUriPrefix(uriPrefix);
        expect(await comics.uriPrefix()).to.eq(uriPrefix);
    });

    it('should revert if the provided tokenId does not exist', async () => {
        await expectRevert(
            comics.tokenURI(0),
            'ERC721Metadata: URI query for nonexistent token'
        );
    });
    
});
