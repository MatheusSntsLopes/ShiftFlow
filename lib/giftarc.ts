import { BrowserProvider, Contract } from "ethers";
import { GIFTARC_CONTRACT } from "./arc";

export const GIFTARC_ABI = [
  "function mintFee() view returns (uint256)",
  "function mintGift(string rarity,uint256 visualAmount,string designName,string imageURI,string message) payable returns (uint256)",
  "function tokensOf(address owner) view returns (uint256[] memory)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)"
];

export async function getGiftArcReadContract(provider: BrowserProvider) {
  return new Contract(GIFTARC_CONTRACT, GIFTARC_ABI, provider);
}

export async function getGiftArcWriteContract(provider: BrowserProvider) {
  const signer = await provider.getSigner();
  return new Contract(GIFTARC_CONTRACT, GIFTARC_ABI, signer);
}
