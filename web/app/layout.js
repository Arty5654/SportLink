import React from "react";
import "@styles/global.css";

export const metadata = {
  title: "SportLink",
  description: "Description",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <div className="main">
          <main className="app">{children}</main>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
