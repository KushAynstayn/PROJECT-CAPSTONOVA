import React from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@heroui/react";

// 1. Import your JSON data file
import usersData from "@/data/guest.json";

export default function App() {
  return (
    <Table removeWrapper aria-label="Table with dynamic data for guests">
      {/* 2. Update the table headers to match your data structure */}
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>EMAIL</TableColumn>
        <TableColumn>ID NUMBER</TableColumn>
        <TableColumn>COURSE</TableColumn>
        <TableColumn>DATE REQUESTED</TableColumn>
      </TableHeader>
      
      {/* 3. Dynamically create rows by mapping over your data */}
      <TableBody>
        {usersData.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.idNumber}</TableCell>
            <TableCell>{user.course}</TableCell>
            <TableCell>{user.dateRequested}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}