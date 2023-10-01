import React from "react";
import "@styles/global.css";
import Nav from "@components/nav";

export const metadata = {
  title: "SportLink",
  description: "Description",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <div className="main">
          <Nav />
          <main className="app">{children}</main>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
