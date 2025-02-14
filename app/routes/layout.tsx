import React from 'react';
import {Outlet} from "react-router";

const Layout = (props) => (
    <div>
        <main className={'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center w-1/3'}>
            <Outlet/>
        </main>
    </div>
);

export default Layout;