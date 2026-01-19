"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./Header";

interface HeaderWrapperProps {
  isSidebarCollapsed: boolean;
}

export default function HeaderWrapper({ isSidebarCollapsed }: HeaderWrapperProps) {
  const searchParams = useSearchParams();
  const contractId = searchParams.get("contractId");
  const [contractName, setContractName] = useState<string>("");
  const [contractImage, setContractImage] = useState<string>("");

  useEffect(() => {
    if (contractId) {
      // Fetch contract data from local storage first (cache)
      const cachedName = localStorage.getItem(`contract_${contractId}_name`);
      const cachedImage = localStorage.getItem(`contract_${contractId}_image`);

      if (cachedName) setContractName(cachedName);
      if (cachedImage) setContractImage(cachedImage);

      // Then fetch from API to update
      fetch(`/api/contracts/${contractId}`)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Failed to fetch");
        })
        .then((data) => {
          setContractName(data.name);
          setContractImage(data.imageUrl || "");
          localStorage.setItem(`contract_${contractId}_name`, data.name);
          localStorage.setItem(`contract_${contractId}_image`, data.imageUrl || "");
        })
        .catch((err) => {
          console.error("Error fetching contract:", err);
        });
    } else {
      setContractName("");
      setContractImage("");
    }
  }, [contractId]);

  return (
    <Header
      isSidebarCollapsed={isSidebarCollapsed}
      contractName={contractName}
      contractImage={contractImage}
    />
  );
}
