import React from "react";

import Sidebar from "../components/Sidebar";

function MainLayout({
  children
}) {

  return (

    <div className="main-layout">

      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN CONTENT */}

      <div className="main-content">

        <div className="content-wrapper">

          {children}

        </div>

      </div>

    </div>
  );
}

export default MainLayout;