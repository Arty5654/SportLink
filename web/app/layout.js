import React from "react";
import "@styles/global.css";
import Nav from "@components/nav";
import { UserContext, UserProvider } from "./UserContext";

export const metadata = {
  title: "SportLink",
  description: "Description",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <div className="app">
            <Nav />
            <main className="w-full">{children}</main>
          </div>
        </UserProvider>
      </body>
    </html>
  );
};

export default RootLayout;
