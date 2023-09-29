import { useEffect, useState } from "react";
import { useConnection } from "../context/connection";
import { Contract, ethers } from "ethers";
import { crowdFundingAddress } from "../utils";
import { abi } from "../ABI/crowFund";

const useCampaign = () => {
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [fetched, setFetched] = useState(false);

  const provider = new ethers.BrowserProvider(window.ethereum)

  const { isActive } = useConnection();
  const crowFundContract = new Contract(crowdFundingAddress, abi, provider)

  const getCampaignCount = async () => {
    try {
      const result = await crowFundContract.id();
      return Number(result);
    } catch (error) {
      throw new Error(`Error calling id: ${error}`);
    }
  }
  const getCampaigns = async (count) => {
    try {
      const d = [];
      for (let index = 1; index <= count[0]; index++) {
        const result = await crowFundContract.crowd(index);
        d.push(result)
      }
      console.log(d)
      return d;
    } catch (error) {
      throw new Error(`Error calling crowd: ${error}`);
    }
  }

  const getAll = async () => {
    Promise.all([getCampaignCount()])
      .then((count) => getCampaigns(count))
      .then((data) => { setAllCampaigns(data); setFetched(true) })
      .catch(error => {
        console.error('Error:', error);

      });
  }

  useEffect(() => {
    if (!isActive || !provider) {
      return;
    }
    if (!fetched) {
      getAll();
    }
  }, [isActive, provider])

  return allCampaigns;

}

export default useCampaign;