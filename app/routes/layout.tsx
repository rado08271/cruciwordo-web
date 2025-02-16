import React from 'react';
import {Outlet} from "react-router";

const Layout = (props) => (
    <div>
        <main className={' pl-8 pr-8 pt-8 pb-8 flex justify-center items-center w-full h-full'}>
            <div className={'w-full md:w-3/4 xl:w-1/2 2xl:w-1/3'}>
                <Outlet/>
            </div>
        </main>
    </div>
);

export default Layout;