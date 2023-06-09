
/* eslint-disable @next/next/no-img-element */

import type { NextPage } from 'next';
import { BaseLayout, NftList } from '@ui';
// import ActiveLink from '@ui/link';
import { useAccount, useListedNfts, useNetwork } from '@hooks/web3';
import { ExclamationIcon } from '@heroicons/react/solid';
import { Button } from 'antd';
import { useWeb3 } from '@providers/web3';

// import { Image } from 'antd';
// import Link from 'next/link';
// import advertisementJson from '../../content/advertisementSpaces.json';

const Advertisement: NextPage = () => {
  const { network } = useNetwork();
  // const { nfts } = useListedNfts();
  // const { account } = useAccount();
  // // const state = useWeb3();
  // const clicks =  async () => {
  //   // await nfts?.airDropContract(['0xB38d2D30e1f854C608117aEA7694c52c73929FC7'], [300])
  //   // const re = await airdrop?.
  //   // const re = await airdrop?.multiTransferToken("0x179FED89Dad72537FFCc1eb5b810b463B7C7e88d",["0xA23512F4c7f8809e43eC1262A3aae12eE76E606A"],[100]);
  // }
  
  return (
    <BaseLayout>
      <div className="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="absolute inset-0">
          <div className="bg-white h-full"/>
        </div>
        <div className="relative">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">NFT Market</h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            </p>
          </div>
          
          {/* <Link href="/api/utils">
                <a>
                  啊啊啊啊啊啊
                </a>
              </Link> */}
               {/* <NftList />  */}
          { network.isConnectedToNetwork ?
            <NftList /> :
            <div className="rounded-md bg-yellow-50 p-4 mt-10">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Attention needed</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                    { network.isLoading ?
                      "Loading..." :
                      `Connect to ${network.targetNetwork}`
                    }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </BaseLayout>
  )
}

export default Advertisement
