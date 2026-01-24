import React from 'react';
import {Outlet} from "react-router";

const Layout = (props: any) => (
    <main className={''}>
        <Outlet/>
    </main>
);

export default Layout;