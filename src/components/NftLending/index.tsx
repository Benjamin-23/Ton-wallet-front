import React, { useState } from "react";
import {
  App,
  Page,
  Navbar,
  Block,
  List,
  ListItem,
  Button,
  Segmented,
  SegmentedButton,
  Checkbox,
  Link,
  Popover,
} from "konsta/react";
import {
  Bell,
  User,
  Trophy,
  HelpCircle,
  ArrowUpDown,
  Filter,
  Printer,
} from "lucide-react";

export default function NFTLending() {
  const [selectedTab, setSelectedTab] = useState("new");
  const [sortValue, setSortValue] = useState("avg");
  const [filterValue, setFilterValue] = useState("all");
  const [currency, setCurrency] = useState("wETH");
  const [listedOnly, setListedOnly] = useState(false);

  return (
    <App theme="ios" dark>
      <Page className="bg-black">
        {/* Top Navigation */}
        <Navbar
          className="bg-black"
          title={
            <div className="flex items-center space-x-6">
              <span className="text-2xl font-bold">nfti</span>
              <div className="hidden md:flex space-x-4">
                <Link className="text-white">Get a loan</Link>
                <Link className="text-gray-400">Give a loan</Link>
                <Link className="text-gray-400">Loans</Link>
              </div>
            </div>
          }
          right={
            <div className="flex items-center space-x-4 overflow-x-auto">
              <Bell size={20} className="text-gray-300 md:block hidden" />
              <User size={20} className="text-gray-300 md:block hidden" />
              <Trophy size={20} className="text-gray-300 md:block hidden" />
              <HelpCircle size={20} className="text-gray-300 md:block hidden" />
              <Button
                className="bg-[#2a2438] text-gray-300 px-3 py-1 rounded-lg whitespace-nowrap"
                inline
              >
                Connect
              </Button>
              <div className="bg-[#2a2438] px-3 py-1 rounded-lg hidden md:block">
                <span className="text-gray-400">$2,714</span>
                <span className="ml-2 text-gray-400">15.52</span>
              </div>
            </div>
          }
        />

        {/* Sub Navigation */}
        <Block className="p-0 m-0 bg-[#1f1b2e] border-b border-[#2a2438]">
          <Segmented className="p-4 overflow-x-auto flex-nowrap">
            <SegmentedButton
              active={selectedTab === "new"}
              onClick={() => setSelectedTab("new")}
              className="text-white whitespace-nowrap"
            >
              Get a new loan
            </SegmentedButton>
            <SegmentedButton
              active={selectedTab === "my"}
              onClick={() => setSelectedTab("my")}
              className="text-gray-400 whitespace-nowrap"
            >
              My Loans
            </SegmentedButton>
            <SegmentedButton
              active={selectedTab === "offers"}
              onClick={() => setSelectedTab("offers")}
              className="text-gray-400 whitespace-nowrap"
            >
              Offers received
            </SegmentedButton>
          </Segmented>

          <Block className="p-4 flex justify-end">
            <Button
              className="bg-[#2a2438] text-gray-300 text-sm md:text-base"
              inline
            >
              Get a loan on multiple NFTs
            </Button>
          </Block>
        </Block>

        {/* Main Content */}
        <Block className="bg-[#1f1b2e] m-4 rounded-lg">
          {/* Filter Bar */}
          <Block className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-[#2a2438]">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <h2 className="text-white text-sm md:text-base">
                Your assets (0)
              </h2>
              <Button
                className="bg-[#2a2438] text-gray-300 text-sm md:text-base"
                inline
                onClick={() => {}}
              >
                <div className="flex items-center gap-2">
                  <span>Order by Avg. loan amount</span>
                  <ArrowUpDown size={16} />
                </div>
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
              <Button
                className="bg-[#2a2438] text-gray-300 text-sm md:text-base w-full md:w-auto"
                inline
              >
                Filter by All Projects
              </Button>

              <Button
                className="bg-[#2a2438] text-gray-300 text-sm md:text-base w-full md:w-auto"
                inline
              >
                Currency wETH
              </Button>

              <Checkbox
                className="text-gray-300"
                checked={listedOnly}
                onChange={() => setListedOnly(!listedOnly)}
                label="Listed assets only"
              />

              <Button className="text-gray-300" inline clear>
                <Printer size={20} />
              </Button>
            </div>
          </Block>

          {/* Table Header */}
          <List className="bg-transparent overflow-x-auto">
            <ListItem
              className="text-gray-400 bg-transparent"
              title={
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <span>Name</span>
                  <span className="hidden md:block">Avg. APR</span>
                  <span className="hidden md:block">Avg. loan amount</span>
                </div>
              }
            />
          </List>

          {/* No Assets Message */}
          <Block className="p-4 md:p-8 text-center">
            <div className="border border-dashed border-[#2a2438] rounded-lg p-4 md:p-8 text-gray-400">
              No assets found
            </div>
          </Block>
        </Block>
      </Page>
    </App>
  );
}
