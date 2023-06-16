import { parseEther } from 'ethers/lib/utils';

import { CryptoHookFactory } from "@_types/hooks";
import { useEffect, useState } from "react";
import useSWR from "swr";

type UseAccountResponse = {
  connect: () => void;
  isLoading: boolean;
  isInstalled: boolean;
  role: string;
  setRole: (role: string) => void;
  balance: number | string;
}

type AccountHookFactory = CryptoHookFactory<string, UseAccountResponse>

export type UseAccountHook = ReturnType<AccountHookFactory>

export const hookFactory: AccountHookFactory = ({ provider, ethereum, isLoading, erc20Token, }) => () => {
  const { data, mutate, isValidating, ...swr } = useSWR(
    provider ? "web3/useAccount" : null,
    async () => {
      const accounts = await provider!.listAccounts();
      const account = accounts[0];

      if (!account) {
        throw "Cannot retreive account! Please, connect to web3 wallet."
      }

      return account;
    }, {
    revalidateOnFocus: false,
    shouldRetryOnError: false
  }
  )
  const [balance, setBalance] = useState();
  const [role, setRole] =useState('platform');
  useEffect(()=>{
    const platROle = localStorage.getItem('platform-role');
    if(!platROle){
      localStorage.setItem('platform-role', 'platform');
    }
    setRole(platROle ?? 'platform')
  },[])
  useEffect(() => {
    ethereum?.on("accountsChanged", handleAccountsChanged);
    return () => {
      ethereum?.removeListener("accountsChanged", handleAccountsChanged);
    }
  })
  useEffect(() => {
    if (data) {
      balanceof(data);
    }
  }, [data])

  const handleAccountsChanged = (...args: unknown[]) => {
    const accounts = args[0] as string[];
    if (accounts.length === 0) {
      console.error("Please, connect to Web3 wallet");
    } else if (accounts[0] !== data) {
      mutate(accounts[0]);
    }
  }

  const connect = async () => {
    try {
      ethereum?.request({ method: "eth_requestAccounts" });
    } catch (e) {
      console.error(e);
    }
  }
  const balanceof = async (address: string) => {
    if (!erc20Token) return;
    const tokenNum = await erc20Token?.balanceOf(address);
    setBalance(tokenNum._hex);
  }

  return {
    ...swr,
    data,
    isValidating,
    isLoading: isLoading as boolean,
    isInstalled: ethereum?.isMetaMask || false,
    mutate,
    connect,
    balance,
    role,
    setRole,
  };
}
