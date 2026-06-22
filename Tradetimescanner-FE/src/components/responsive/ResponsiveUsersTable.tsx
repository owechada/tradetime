import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaUserCircle } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

import ResponsiveTable, { TableColumn } from "./ResponsiveTable";
import { InputField } from "../forms";
import Searchbar from "../generic/Searchbar";
import { getallusers } from "../../services/user";
import { ispremuser } from "../../utils/functions";
import { useStateGetter } from "../../hooks/statehooks/UseStateGettersHook";
import { useStateSetter } from "../../hooks/statehooks/UseStateSettersHook";

interface User {
  id: string;
  username: string;
  mail: string;
  createdAt: string;
  exp_date?: string;
  [key: string]: any;
}

const ResponsiveUsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { control, watch } = useForm();
  const { setLoading } = useStateSetter();
  const [from, setFrom] = useState("2020-01-01");
  const [to, setTo] = useState(new Date().toISOString().split("T")[0]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filledWatch = watch(["from", "to"]);

  const getUsers = async () => {
    try {
      setLoading(true);
      const response = await getallusers(from, to, page);
      setUsers(response.data);
      setPage(response.pagination.currentPage);
      setTotalPage(response.pagination.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
    
    const sortedUsers = [...users].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      
      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setUsers(sortedUsers);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toDateString()} - ${date.toLocaleTimeString()}`;
  };

  const getDaysRemaining = (expDate: string) => {
    return Math.round(
      (new Date(expDate).getTime() - new Date().getTime()) / 86400000
    );
  };

  const columns: TableColumn[] = [
    {
      key: 'username',
      label: 'Username',
      priority: 'high',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <FaUserCircle className="text-gray-400" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'mail',
      label: 'Email',
      priority: 'high',
      sortable: true,
      className: 'max-w-xs truncate',
    },
    {
      key: 'createdAt',
      label: 'Date Joined',
      priority: 'medium',
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: 'premiumStatus',
      label: 'Premium Status',
      priority: 'medium',
      render: (_, row) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          ispremuser(row) 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {ispremuser(row) ? 'Subscribed' : 'Not subscribed'}
        </span>
      ),
    },
    {
      key: 'expiry',
      label: 'Expiry',
      priority: 'low',
      render: (_, row) => {
        if (!ispremuser(row)) return '-';
        const days = getDaysRemaining(row.exp_date);
        return `${days} days`;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      priority: 'medium',
      render: (_, row) => (
        <Menu as="div" className="relative">
          <Menu.Button className="p-1 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400">
            <IoMdMore className="text-gray-500 hover:text-gray-700" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-md p-1 bg-white border border-gray-200 ring-1 ring-black ring-opacity-5 py-2 z-50 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-red-50 text-red-700' : 'text-red-600'
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm font-medium`}
                  >
                    Delete user
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      ),
    },
  ];

  // Custom mobile card render
  const mobileCardRender = (user: User, index: number) => (
    <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FaUserCircle className="text-gray-400 text-lg" />
          <span className="font-semibold text-gray-900">{user.username}</span>
        </div>
        <Menu as="div" className="relative">
          <Menu.Button className="p-1 text-gray-500 hover:text-gray-700">
            <IoMdMore />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-40 rounded-lg shadow-md bg-white border border-gray-200 py-1 z-50 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-red-50 text-red-700' : 'text-red-600'
                    } block px-4 py-2 text-sm w-full text-left`}
                  >
                    Delete user
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Email:</span>
          <span className="text-gray-900 truncate ml-2">{user.mail}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Status:</span>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            ispremuser(user) 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {ispremuser(user) ? 'Subscribed' : 'Not subscribed'}
          </span>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    if (from !== filledWatch[0] || to !== filledWatch[1]) {
      filledWatch[0] && setFrom(filledWatch[0]);
      filledWatch[1] && setTo(filledWatch[1]);
    }
  }, [filledWatch]);

  useEffect(() => {
    getUsers();
  }, [from, to, page]);

  return (
    <div className="mx-4 md:mx-10 h-screen overflow-y-auto">
      <h1 className="font-bold text-gray-600 text-2xl md:text-3xl mb-6">All Users</h1>
      
      {/* Filters Section */}
      <div className="mb-6 space-y-4">
        <p className="font-medium text-gray-700">Filter</p>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          <InputField
            name="from"
            title="From"
            placeholder="From date"
            type="date"
            control={control}
          />
          <InputField
            name="to"
            title="To"
            placeholder="To date"
            type="date"
            control={control}
          />
          <div className="flex-1 w-full md:max-w-md">
            <Searchbar
              style="w-full font-semibold border text-gray-700 bg-white border-gray-300"
              placeholder="Search users"
              onChange={(value) => console.log(value)}
            />
          </div>
          <div className="text-sm font-bold text-gray-600 md:mb-2">
            Result: {users.length} (max 20 per page)
          </div>
        </div>
      </div>

      {/* Responsive Table */}
      <ResponsiveTable
        columns={columns}
        data={users}
        onSort={handleSort}
        loading={false}
        emptyMessage="No users found"
        mobileCardRender={mobileCardRender}
        className="mb-6"
      />

      {/* Pagination */}
      {totalPage > 1 && (
        <div className="flex justify-center md:justify-end">
          <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-3">
            <span className="text-sm font-medium text-gray-700">
              {page} of {totalPage}
            </span>
            {page > 1 && (
              <button
                className="bg-black text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors"
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
            )}
            {page !== totalPage && (
              <button
                className="bg-black text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors"
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveUsersTable;