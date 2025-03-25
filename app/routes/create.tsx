import React, {lazy, Suspense} from "react";
import Loading from "~/components/common/loading/loading";

const CreateGrid = lazy(() => import('~/components/cards/create-grid.tsx'))


export default function Create() {
    return (
        <>
            <Suspense fallback={
                <div className={'absolute flex w-screen h-screen backdrop-blur justify-center items-center'}>
                    <Loading/>
                </div>
            }>
                <CreateGrid/>
            </Suspense>
        </>
    );
}
