import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Wallet,
  CircleDollarSign,
  BoxIcon,
  ArrowLeftRight,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card } from "../ui/card";

export default function NFTLendingApp() {
  const [connected, setConnected] = useState(false);
  const [activeNFTs, setActiveNFTs] = useState([
    {
      id: "1",
      name: "Ordinal #1234",
      image: "/api/placeholder/300/300",
      value: "1.5 TON",
      maxLoan: "1.0 TON",
    },
    {
      id: "2",
      name: "Ordinal #5678",
      image: "/api/placeholder/300/300",
      value: "2.0 TON",
      maxLoan: "1.4 TON",
    },
  ]);

  const [activeLoans, setActiveLoans] = useState([
    {
      id: "1",
      nftName: "Ordinal #9012",
      loanAmount: "0.8 TON",
      interest: "10%",
      dueDate: "2025-04-18",
      status: "Active",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header with Wallet Connection */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">TON NFT Lending Protocol</h1>
        <Button
          onClick={() => setConnected(!connected)}
          className={`flex items-center gap-2 ${connected ? "bg-green-500" : "bg-blue-500"}`}
        >
          <Wallet size={20} />
          {connected ? "Connected" : "Connect Wallet"}
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            icon={<BoxIcon size={24} />}
            title="Total Value Locked"
            value="5.5 TON"
          />
          <StatsCard
            icon={<CircleDollarSign size={24} />}
            title="Active Loans"
            value="3.2 TON"
          />
          <StatsCard
            icon={<ArrowLeftRight size={24} />}
            title="Available to Borrow"
            value="2.3 TON"
          />
        </div>

        {/* Tabs for different sections */}
        <Card className="p-4">
          <Tabs defaultValue="borrow" className="w-full">
            <TabsList>
              <TabsTrigger value="borrow">Borrow</TabsTrigger>
              <TabsTrigger value="lend">Lend</TabsTrigger>
              <TabsTrigger value="active">Active Loans</TabsTrigger>
            </TabsList>

            <TabsContent value="borrow">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {activeNFTs.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} onBorrow={() => {}} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="active">
              <div className="grid grid-cols-1 gap-4 mt-4">
                {activeLoans.map((loan) => (
                  <LoanCard key={loan.id} loan={loan} onRepay={() => {}} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

// Stats Card Component
const StatsCard = ({ icon, title, value }) => (
  <Card className="p-4">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-100 rounded-lg">{icon}</div>
      <div>
        <h3 className="text-sm text-gray-600">{title}</h3>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  </Card>
);

// NFT Card Component
const NFTCard = ({ nft, onBorrow }: any) => (
  <Card className="p-4">
    <img
      src={nft.image}
      alt={nft.name}
      className="w-full h-48 object-cover rounded-lg mb-4"
    />
    <h3 className="font-bold mb-2">{nft.name}</h3>
    <div className="text-sm text-gray-600 mb-2">
      <p>Value: {nft.value}</p>
      <p>Max Loan: {nft.maxLoan}</p>
    </div>
    <Button onClick={() => onBorrow(nft.id)} className="w-full">
      Borrow
    </Button>
  </Card>
);

// Loan Card Component
const LoanCard = ({ loan, onRepay }: any) => (
  <Card className="p-4">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="font-bold">{loan.nftName}</h3>
        <p className="text-sm text-gray-600">Amount: {loan.loanAmount}</p>
        <p className="text-sm text-gray-600">Interest: {loan.interest}</p>
        <p className="text-sm text-gray-600">Due: {loan.dueDate}</p>
      </div>
      <div>
        <Button
          onClick={() => onRepay(loan.id)}
          variant="outline"
          className="mr-2"
        >
          Repay
        </Button>
        <Button variant="destructive">Liquidate</Button>
      </div>
    </div>
  </Card>
);
