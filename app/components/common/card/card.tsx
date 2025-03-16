import {Link} from "react-router";
import PrimaryButton from "~/components/common/buttons/primary-button";
import OutlinedButton from "~/components/common/buttons/outlined-button";
import type {PropsWithChildren, ReactElement, ReactNode} from 'react';
import React, {Children, createContext, useContext} from 'react';
import type {ButtonProps} from "~/components/common/buttons/props";

const useCardChild = (children, name: string) => {
    return Children.toArray(children).filter(child => !(!child) && (child as ReactElement).type['name'] == name)
}

const Card = ({children}: PropsWithChildren) => {
    const supertitle = useCardChild(children, CardSupertitle.name);
    const title = useCardChild(children, CardTitle.name);
    const captions = useCardChild(children, CardCaption.name);
    const content = useCardChild(children, CardContent.name);

    return (
        <section className={'bg-white rounded-xl p-8 shadow-lg flex flex-col gap-4'}>
            {supertitle[0]}
            {/*{title[0]}*/}
            {content}
            {/*{captions}*/}
        </section>
    );
};

type Props = PropsWithChildren&{
    className?: string
}

const CardSupertitle = ({ className, children}: Props) => {
    return (<h1 id={'card-supertitle'}
                className={`capitalize text-center text-3xl font-medium ${className}`}>{children}</h1>)
}

const CardTitle = ({children}: Props) => {
    return (<h2 id={'card-title'} className={'text-center'}>{children}</h2>)
}

const CardCaption = ({children}: PropsWithChildren) => {
    return (
        <p>{children}</p>
    )
}

const CardContent = ({children}: PropsWithChildren) => {
    return (
        children
    )
}


Card.Title = CardSupertitle;
Card.Subtitle = CardTitle;
Card.Caption = CardCaption;
Card.Content = CardContent;

export default Card;