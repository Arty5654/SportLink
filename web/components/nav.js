"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { UserContext } from "@app/UserContext";

const Nav = () => {

  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const user1 = JSON.parse(sessionStorage.getItem('user'));
    setUser(user1);
  }, []);


  return (
    <nav className="w-full bg-white text-black h-12 border-b border-grey-500 flex items-center justify-between py-8 mb-24">
      <div className="flex gap-2">
        <div className="relative group">
          <Link href="/maps">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
              />
            </svg>

            <span className="absolute top-full mt-1 mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition duration-500 whitespace-nowrap">
              Maps
            </span>
          </Link>
        </div>

        <div className="relative group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z"
            />
          </svg>

          <span className="absolute top-full mt-1 mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition duration-500 whitespace-nowrap">
            Event Dashboard
          </span>
        </div>
      </div>
      <Link href="/">
        <div className="flex gap text-3xl font-semibold">
          <p className="text-green-500">Sport</p>
          <p className="text-blue-500">Link</p>
        </div>
      </Link>

      <div className="flex gap-2">
        <div className="relative group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            />
          </svg>

          <span className="absolute top-full mt-1 mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition duration-500 whitespace-nowrap">
            Notifications
          </span>
        </div>

        <div className="relative group">
          <Link href="/profile">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>

            <span className="absolute top-full mt-1 mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition duration-500 whitespace-nowrap">
              Your Account
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
