/* eslint-disable @next/next/no-img-element */

import { Disclosure } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { useAccount, useNetwork } from '@hooks/web3';
import ActiveLink from '../link';
import Walletbar from './Walletbar';
import { ethers } from 'ethers';
import { Select } from 'antd';
import { useMemo } from 'react';

const base = [
  { name: 'Home', href: '/', current: true },
  // { name: 'InternetCelebrity', href: '/manage/internetCelebrity', current: false },
  // { name: 'Brand', href: '/manage/brand', current: false }, 
  // { name: 'Buyer', href: '/manage/buyer', current: false },
  // { name: 'Platform', href: '/manage/platform', current: false },
  // { name: 'Create', href: '/nft/create', current: false }
]
const create =[
  { name: 'Create', href: '/nft/create', current: false }
]
const other = [
    { name: 'InternetCelebrity', href: '/manage/internetCelebrity', current: false },
  { name: 'Brand', href: '/manage/brand', current: false }, 
  { name: 'Buyer', href: '/manage/buyer', current: false },
  { name: 'Platform', href: '/manage/platform', current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const { account } = useAccount();
  const { network } = useNetwork();
  const { role, setRole } = account;
  // { value: 'platform', label: 'platform' },
  // { value: 'internetCelebrity', label: 'internetCelebrity' },
  // { value: 'brand', label: 'brand' },
  // { value: 'buyer', label: 'buyer' },
  const navigation = useMemo(()=>{
    switch (role){
      case 'platform':
        return [...base, ...other, ...create];
      case 'internetCelebrity':
        return [...base,  { name: 'InternetCelebrity', href: '/manage/internetCelebrity', current: false }, ...create];
      case 'brand':
        return [...base, { name: 'Brand', href: '/manage/brand', current: false }, ...create];
      case 'buyer':
        return [...base, { name: 'Buyer', href: '/manage/buyer', current: false }, ...create];
      default:
        return [...base, ...other, ...create];
    }


  },[role])

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu butt*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <img
                    className="hidden lg:block h-10 w-auto"
                    src="/images/page_logo.png"
                    alt="Workflow"
                  />
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <ActiveLink
                        key={item.name}
                        href={item.href}
                        activeClass="bg-gray-900 text-white"
                      >
                        <a
                          className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </a>
                      </ActiveLink>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <div className='mr-1'>
                <Select
                  // defaultValue={
                  //   role
                  // }
                  style={{ width: 120 }}
                  onChange={(value)=>{
                    localStorage.setItem('platform-role', value);
                    setRole(value);
                  }}
                  options={[
                    { value: 'platform', label: 'platform' },
                    { value: 'internetCelebrity', label: 'internetCelebrity' },
                    { value: 'brand', label: 'brand' },
                    { value: 'buyer', label: 'buyer' },
                  ]}
                  value={role}
                  />
                </div>
                
                <div className="text-gray-300 self-center mr-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
                    <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-indigo-400" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx={4} cy={4} r={3} />
                    </svg>
                    { network.isLoading ?
                      "Loading..." :
                      account.isInstalled ?
                      network.data :
                      "Install Web3 Wallet"
                    }
                  </span>
                </div>
                <div className="text-gray-300 self-center mr-2">
                  <span>
                    you have {Number(account.balance as string)?? ''} enb 
                  </span>
                </div>
                <Walletbar
                  isInstalled={account.isInstalled}
                  isLoading={account.isLoading}
                  connect={account.connect}
                  account={account.data}
                  balance={account.balance as string}
                />
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
