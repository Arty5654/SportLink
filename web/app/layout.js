import React from "react";
import Nav from "@components/nav";
import Provider from "@components/provider";
import "@styles/global.css";

export const metadata = {
  title: "SportLink",
  description: "Description",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <div className="app">
          <Nav />
          <main className="w-full">{children}</main>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
