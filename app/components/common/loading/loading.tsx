import React from 'react';

type Props = {
    title?: string
}
const Loading = ({title}: Props) => (
    <section className={'absolute origin-center p-10 backdrop-blur flex-col z-50 w-full h-full flex items-center justify-center'}>
        <h1 className={'text-3xl'}>Loading ...</h1>
        {title && <h5 className={'text-sm'}>{title}</h5>}
    </section>
);

export default Loading;