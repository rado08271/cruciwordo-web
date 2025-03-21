import {lazy, Suspense} from "react";
import Loading from "~/components/common/loading/loading";

const CreateGrid = lazy(() => import('~/components/cards/create-grid.tsx'))


export default function Create() {
    return (
        <>
            <Suspense fallback={<Loading/>}>
                <CreateGrid/>
            </Suspense>
        </>
    );
}
