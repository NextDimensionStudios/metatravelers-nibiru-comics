// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

/**
████████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████████
██████████████████████████████▓╝╘███████████████████████████████
████████████████████████████▓▓    ▓█████████████████████████████
██████████████████████▓▀╙              ╙▀▓██████████████████████
███████████████████▀"     ,▄▄▄▄▄▄▄▄▄▄,     "▀███████████████████
████████████████▓╜    ▄█████████████████▓w    ╙█████████████████
██████████████▓┘   ╔███████████████████████▓╕   └███████████████
█████████████▓   ╓██▓╝``╙▓████████████▓╩```██▓,   ▀█████████████
████████████╝   ▄███▓     `▀████████▓"     ████▄   ▐████████████
███████████▓   ▓████▓   ╒    ▀███▓▀        █████▓   ▀███████████
██████████▓   ▐█████▓   ]▓▄    ╙╝    ▄▓[   █████▓L   ███████████
█████████▓╝   ██████▓   ]███▓,    ,▓██▓[   ██████▓   ╚██████████
███████Ü      ███████▓▓▓▓▓▓▓▓▓r   ▓▓▓▓▓▓▓▓▓██████▓      ║███████
████████▓▄╖   ██████▓                      ██████▓   ╓▄█████████
██████████▓   ▐██████▓&&&&&&&&    &&&&&&&&▄█████▓F   ███████████
███████████@   █████▓                      █████▓   ▐███████████
███████████▓L   █████▄╥▄▄▄▄▄╥╓    ▄▄▄▄▄▄▄▄▄████▓   ╔████████████
█████████████N   ▀████████████r   ███████████▓╝   ▄█████████████
██████████████▓    ▀██████████▓▄▄██████████▓╝   ,███████████████
████████████████▓,   "▀▓████████████████▓╝    ,▄████████████████
███████████████████▄      "╙▀▀▓▓▓▀▀▀╩"     ,▄███████████████████
██████████████████████▓▄µ              ╓▄███████████████████████
█████████████████████████████▓    ██████████████████████████████
██████████████████████████████▓,,███████████████████████████████
████████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████████
 */

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NibiruComicsPolygon is ERC721, Ownable {
    using Strings for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private supply;

    string public uriPrefix = "";
    string public uriSuffix = ".json";

    uint256 public maxSupply;

    address[] public whitelistAddresses;
    uint256[] public whitelistAmounts;

    constructor() ERC721("Metatravelers: Nibiru Comics", "NBRUCOM") {}

    function totalSupply() external view returns (uint256) {
        return supply.current();
    }

    function walletOfOwner(address _owner)
        external
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory ownedTokenIds = new uint256[](ownerTokenCount);
        uint256 currentTokenId = 1;
        uint256 ownedTokenIndex = 0;

        while (
            ownedTokenIndex < ownerTokenCount && currentTokenId <= maxSupply
        ) {
            address currentTokenOwner = ownerOf(currentTokenId);

            if (currentTokenOwner == _owner) {
                ownedTokenIds[ownedTokenIndex] = currentTokenId;

                ownedTokenIndex++;
            }

            currentTokenId++;
        }

        return ownedTokenIds;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        _tokenId.toString(),
                        uriSuffix
                    )
                )
                : "";
    }

    function setWhitelistAddresses(address[] memory _addresses)
        external
        onlyOwner
    {
        whitelistAddresses = _addresses;
    }

    function setWhitelistAmounts(uint256[] memory _amounts) external onlyOwner {
        whitelistAmounts = _amounts;
    }

    function setMaxSupply(uint256 _maxSupply) external onlyOwner {
        maxSupply = _maxSupply;
    }

    function setUriPrefix(string memory _uriPrefix) external onlyOwner {
        uriPrefix = _uriPrefix;
    }

    function setUriSuffix(string memory _uriSuffix) external onlyOwner {
        uriSuffix = _uriSuffix;
    }

    function _mintForAddress(address _receiver, uint256 _mintAmount)
        public
        onlyOwner
    {
        for (uint256 i = 0; i < _mintAmount; i++) {
            supply.increment();
            _safeMint(_receiver, supply.current());
        }
    }

    function _mintLoop(
        address[] memory _addresses,
        uint256[] memory _amounts,
        uint256 _collectionAmount
    ) external onlyOwner {
        require(
            _addresses.length == _amounts.length,
            "addresses and amounts must be the same length"
        );
        for (uint256 i = 0; i < _collectionAmount; i++) {
            _mintForAddress(_addresses[i], _amounts[i]);
        }
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return uriPrefix;
    }
}
