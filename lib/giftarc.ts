import { BrowserProvider, Contract, Interface, TransactionReceipt } from "ethers";
import { GIFTARC_CONTRACT } from "./arc";

export const GIFTARC_ABI = [
  "event GiftMinted(address indexed minter,uint256 indexed tokenId,string rarity,uint256 visualAmount,string designName)",
  "function mintFee() view returns (uint256)",
  "function mintGift(string rarity,uint256 visualAmount,string designName,string imageURI,string message) payable returns (uint256)",
  "function tokensOf(address owner) view returns (uint256[] memory)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)"
] as const;

const giftArcInterface = new Interface(GIFTARC_ABI);

import type { MintedNftPreview } from "./types";

export async function getGiftArcReadContract(provider: BrowserProvider) {
  return new Contract(GIFTARC_CONTRACT, GIFTARC_ABI, provider);
}

export async function getGiftArcWriteContract(provider: BrowserProvider) {
  const signer = await provider.getSigner();
  return new Contract(GIFTARC_CONTRACT, GIFTARC_ABI, signer);
}

export function extractMintedTokenId(receipt: TransactionReceipt): string | undefined {
  for (const log of receipt.logs) {
    try {
      const parsed = giftArcInterface.parseLog({ topics: log.topics, data: log.data });
      if (parsed?.name === "GiftMinted") {
        return parsed.args.tokenId.toString();
      }
    } catch {
      // Ignore unrelated logs.
    }
  }
  return undefined;
}

export function parseTokenMetadata(tokenURI: string): Omit<MintedNftPreview, "tokenId"> | null {
  if (!tokenURI.startsWith("data:application/json;base64,")) return null;

  const encoded = tokenURI.replace("data:application/json;base64,", "");
  const decoded = typeof window === "undefined"
    ? Buffer.from(encoded, "base64").toString("utf8")
    : window.atob(encoded);

  const metadata = JSON.parse(decoded);
  const attributes = Array.isArray(metadata.attributes) ? metadata.attributes : [];
  const readAttr = (trait: string) => attributes.find((attr: { trait_type?: string; value?: string | number }) => attr.trait_type === trait)?.value;

  return {
    name: metadata.name || "GiftArc NFT",
    image: metadata.image || "",
    rarity: readAttr("Rarity") as string | undefined,
    amount: readAttr("Visual Amount"),
    design: readAttr("Design") as string | undefined,
    message: readAttr("Message") as string | undefined
  };
}

export async function fetchMintedNftPreview(provider: BrowserProvider, tokenId: string | number): Promise<MintedNftPreview | null> {
  const contract = await getGiftArcReadContract(provider);
  const tokenURI = await contract.tokenURI(tokenId);
  const parsed = parseTokenMetadata(tokenURI);

  if (!parsed) return null;

  return {
    tokenId: String(tokenId),
    ...parsed
  };
}
