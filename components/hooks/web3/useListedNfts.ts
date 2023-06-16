
import { CryptoHookFactory } from "@_types/hooks";
import { Nft } from "@_types/nft";
import { ethers } from "ethers";
import { useCallback } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { useAccount } from '@hooks/web3';
import { ERC20_AIRDROP_TOKEN, ERC20_Token_Address } from "pages/api/utils";


type UseListedNftsResponse = {
  buyNft: (token: number, value: number, erc20Adress: string, owner: string, userList: string[], priceList: number[]) => Promise<void>;
  // airDropContract: (userList: string[], enbString: number[]) => Promise<void>;
}
type ListedNftsHookFactory = CryptoHookFactory<Nft[], UseListedNftsResponse>

export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>

export const hookFactory: ListedNftsHookFactory = ({ contract }) => () => {
  const { data, ...swr } = useSWR(
    contract ? "web3/useListedNfts" : null,
    async () => {
      const nfts = [] as Nft[];
      const coreNfts = await contract!.getAllNftsOnSale();
      // console.log(coreNfts);

      for (let i = 0; i < coreNfts.length; i++) {
        const item = coreNfts[i];
        const tokenURI = await contract!.tokenURI(item.tokenId);
        const metaRes = await fetch(tokenURI);
        const meta = await metaRes.json();

        if (item.creator !== ERC20_AIRDROP_TOKEN){
          nfts.push({
            price: parseFloat(ethers.utils.formatEther(item.price)),
            tokenId: item.tokenId.toNumber(),
            creator: item.creator,
            isListed: item.isListed,
            meta
          })
        }
      }

      return nfts;
    }
  )

  const _contract = contract;
  const buyNft = useCallback(async (token: number, value: number, erc20Adress: string, owner: string, userList: string[], priceList: number[]) => {
    debugger;
    try {

      const result = await _contract!.buyNft(
        token, 
        erc20Adress, 
        owner, 
        userList, 
        priceList, {
        value: ethers.utils.parseEther(value.toString())
      }
      )

      await toast.promise(
        result!.wait(), {
        pending: "Processing transaction",
        success: "Nft is yours! Go to Profile page",
        error: "Processing error"
      }
      );
    } catch (e: any) {
      console.error(e.message);
    }
  }, [_contract])

  // const airDropContract = async(userList: string[], enbString: number[])=>{
  //   const erc20Adress = ERC20_Token_Address;
  //   try {

  //     const airDrop = await airdrop!.multiTransferToken(erc20Adress, '0xA23512F4c7f8809e43eC1262A3aae12eE76E606A',userList, enbString);
  //     await toast.promise(
  //       airDrop!.wait(), {
  //         pending: "air drop Enb",
  //         success: "get Enb Success",
  //         error: "get Enb error"
  //       }
  //     );
  //   } catch (e: any) {
  //     console.error(e.message);
  //   }

  // }

  return {
    ...swr,
    buyNft,
    // airDropContract,
    data: data || [],
  };
}
