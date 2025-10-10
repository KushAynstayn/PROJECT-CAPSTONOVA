"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { InputWithClear } from "@/components/ui/inputWithClear";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";

interface RestrictedAccount {
  id: number;
  name: string;
  email: string;
  userType: string;
}

const RestrictedAccounts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [accounts, setAccounts] = useState<RestrictedAccount[]>([
    {
      id: 1,
      name: "Juan Dela Cruz",
      email: "juan.delacruz@example.com",
      userType: "Admin",
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria.santos@example.com",
      userType: "Proponent",
    },
    {
      id: 3,
      name: "Jose Reyes",
      email: "jose.reyes@example.com",
      userType: "Viewer",
    },
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleRestore = (account: RestrictedAccount) => {
    // Example routing logic based on user type
    switch (account.userType) {
      case "Admin":
        console.log(`Restoring ${account.name} and redirecting to Admin tab...`);
        break;
      case "Proponent":
        console.log(`Restoring ${account.name} and redirecting to Proponent tab...`);
        break;
      case "Adviser":
        console.log(`Restoring ${account.name} and redirecting to Adviser tab...`);
        break;
      case "Viewer":
        console.log(`Restoring ${account.name} and redirecting to Viewer tab...`);
        break;
    }

    // Remove from restricted list after restore
    setAccounts((prev) => prev.filter((a) => a.id !== account.id));
  };

  const filteredAccounts = accounts.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.userType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="relative flex items-center w-full grow md:max-w-md rounded-md border border-gray-300 shadow-md bg-background overflow-hidden">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <InputWithClear
            className={cn(
              "ml-10 w-full rounded-none border-none bg-none focus-visible:ring-0 focus-visible:ring-offset-0"
            )}
            type="search"
            placeholder="Search restricted accounts..."
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={handleClearSearch}
          />
        </div>
      </div>

      {/* Table */}
      <div className="relative max-h-[60vh] overflow-y-auto">
        <Table removeWrapper aria-label="Restricted accounts table">
          <TableHeader>
            <TableColumn className="bg-[#660000] text-white text-left">
              NAME
            </TableColumn>
            <TableColumn className="bg-[#660000] text-white text-left">
              EMAIL
            </TableColumn>
            <TableColumn className="bg-[#660000] text-white text-left">
              USER TYPE
            </TableColumn>
            <TableColumn className="bg-[#660000] text-white text-left">
              ACTION
            </TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No restricted accounts found."}>
            {filteredAccounts.map((account) => (
              <TableRow
                key={account.id}
                className="hover:bg-[#660000] hover:text-white transition-colors duration-200"
              >
                <TableCell className="border-b border-gray-200">
                  {account.name}
                </TableCell>
                <TableCell className="border-b border-gray-200">
                  {account.email}
                </TableCell>
                <TableCell className="border-b border-gray-200">
                  {account.userType}
                </TableCell>
                <TableCell className="border-b border-gray-200">
                  <Button
                    className="bg-[#660000] hover:bg-[#4d0000] text-white"
                    onClick={() => handleRestore(account)}
                  >
                    Restore
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RestrictedAccounts;
