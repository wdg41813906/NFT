


import { useListedNfts } from "@hooks/web3";
import { FunctionComponent, useMemo } from "react";
import NftItem from "../item";
import advertisementJson from '../../../../content/advertisementSpaces.json';


const NftList: FunctionComponent = () => {
  const { nfts } = useListedNfts();
  // console.log('nft', nfts);
  // const nftData = useMemo(() => {
  //   const data: any = {}
  //   nfts?.data?.forEach((item) => {
  //     const { type } = item.meta;
  //     if (Reflect.has(data, type)) {
  //       data[type] = [...data[type], item.meta]
  //     } else {
  //       data[type] = [item.meta]
  //     }
  //   })
  //   return data;
  // }, [nfts?.data])
  return (
    <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
      {nfts?.data?.map((nft, i) => {
        // const items = { meta: nft }
        return (
          <div key={i} className="flex flex-col rounded-lg shadow-lg overflow-hidden max-w-xs" >
            <NftItem
              item={nft as any}
              buyNft={nfts.buyNft}
            />
          </div>
        )
      }
      )
      }
    </div >
  )
}

export default NftList;
