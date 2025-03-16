import React from 'react';
import {Outlet} from "react-router";

const Layout = (props) => (
    <main className={''}>
        <Outlet/>
    </main>
);

export default Layout;