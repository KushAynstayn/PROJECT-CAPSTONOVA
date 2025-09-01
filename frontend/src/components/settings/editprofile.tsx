"use client";

import React from 'react';
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label"; 
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// List of department options for the dropdown
const departmentOptions = ["CCICT", "COT-D", "COT-E", "CME", "CAS", "COE", "CoED"];

// Define the shape of the props this component expects
interface EditProfileProps {
    formData: any;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectChange: (fieldName: string, value: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ formData, onInputChange, onSelectChange, onSave, onCancel }) => (
  <>
    <h1 className="text-center text-3xl font-serif tracking-wider text-gray-800 mb-1">
      Edit Profile
    </h1>
    <p className="text-center text-lg text-gray-500">
      Update your information
    </p>
    <div className="border-t my-8"></div>
    
    {/* Personal Details Section */}
    <div className="space-y-8">
        {/* Name Fields - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8">
            <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-600">First Name</Label>
                <Input id="firstName" type="text" value={formData.firstName} onChange={onInputChange} className="w-full mt-2 border-gray-300 rounded-md focus:ring-maroon-500 focus:border-maroon-500" />
            </div>
            <div>
                <Label htmlFor="middleName" className="text-sm font-medium text-gray-600">Middle Name (Optional)</Label>
                <Input id="middleName" type="text" value={formData.middleName} onChange={onInputChange} className="w-full mt-2 border-gray-300 rounded-md focus:ring-maroon-500 focus:border-maroon-500" />
            </div>
            <div>
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-600">Last Name</Label>
                <Input id="lastName" type="text" value={formData.lastName} onChange={onInputChange} className="w-full mt-2 border-gray-300 rounded-md focus:ring-maroon-500 focus:border-maroon-500" />
            </div>
        </div>

        {/* Contact and School Info - 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            <div>
                <Label htmlFor="idNumber" className="text-sm font-medium text-gray-600">ID Number</Label>
                <Input id="idNumber" type="text" value={formData.idNumber} onChange={onInputChange} className="w-full mt-2 border-gray-300 rounded-md focus:ring-maroon-500 focus:border-maroon-500" />
            </div>
            <div>
                <Label htmlFor="department" className="text-sm font-medium text-gray-600">Department</Label>
                <Select value={formData.department} onValueChange={(value) => onSelectChange('department', value)}>
                  <SelectTrigger className="w-full mt-2 border-gray-300 rounded-md focus:ring-maroon-500 focus:border-maroon-500">
                    <SelectValue placeholder="Select a Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentOptions.map((dept) => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}
                  </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-600">CTU Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={onInputChange} className="w-full mt-2 border-gray-300 rounded-md focus:ring-maroon-500 focus:border-maroon-500" />
            </div>
            <div>
                <Label htmlFor="contactNumber" className="text-sm font-medium text-gray-600">Contact Number</Label>
                <Input id="contactNumber" type="text" value={formData.contactNumber} onChange={onInputChange} className="w-full mt-2 border-gray-300 rounded-md focus:ring-maroon-500 focus:border-maroon-500" />
            </div>
        </div>
    </div>
    
    {/* Change Password Section */}
    <div className="mt-10 pt-6 border-t">
        <h2 className="text-xl font-serif tracking-wider text-gray-700 mb-6">Change Password</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" value={formData.currentPassword} onChange={onInputChange} className="w-full mt-2 border-gray-300 rounded-md focus:ring-maroon-500 focus:border-maroon-500" />
            </div>
            <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" value={formData.newPassword} onChange={onInputChange} className="w-full mt-2 border-gray-300 rounded-md focus:ring-maroon-500 focus:border-maroon-500" />
            </div>
            <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={onInputChange} className="w-full mt-2 border-gray-300 rounded-md focus:ring-maroon-500 focus:border-maroon-500" />
            </div>
        </div>
    </div>

    {/* Action Buttons */}
    <div className="flex justify-end items-center mt-12 pt-6 border-t gap-4">
       <Button variant="outline" type="button" onClick={onCancel} className="px-6 py-2 border-gray-300 text-gray-700">
        Cancel
      </Button>
      <Button type="button" onClick={onSave} className="px-6 py-2 bg-[#A42A27] hover:bg-[#8b2220] text-white rounded-md font-semibold">
        Save Changes
      </Button>
    </div>
  </>
);

export default EditProfile;