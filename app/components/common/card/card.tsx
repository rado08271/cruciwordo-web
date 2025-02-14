import {Link} from "react-router";
import PrimaryButton from "~/components/common/buttons/primary-button";
import OutlinedButton from "~/components/common/buttons/outlined-button";
import type {PropsWithChildren, ReactElement, ReactNode} from 'react';
import React, {Children, createContext, useContext} from 'react';
import type {ButtonProps} from "~/components/common/buttons/props";

const useCardChild = (children, name: string) => {
    return Children.toArray(children).filter(child =>  !(!child) && (child as ReactElement).type['name'] == name)
}

const Card = ({children}: PropsWithChildren) => {
    const supertitle = useCardChild(children, CardSupertitle.name);
    const title = useCardChild(children, CardTitle.name);
    const primaryButton = useCardChild(children, CardPrimaryButton.name);
    const actionButtons = useCardChild(children, CardActionButtons.name);
    const captions = useCardChild(children, CardCaption.name);
    const content = useCardChild(children, CardContent.name);

    return (
        <section className={'bg-white rounded-xl p-8 shadow-lg flex flex-col gap-4 '}>
            {supertitle[0]}
            {title[0]}
            {primaryButton[0]}

            {actionButtons.length != 0 && <div id={'card-buttons'} className={'flex-row gap-4 flex-1 flex-grow flex-shrink w-full inline-flex'}>
                {actionButtons}
            </div>}
            {captions.length != 0 && <div id={'card-caption'} className={'flex flex-col gap-1 text-sm pt-4 text-center text-slate-600'}>
                {captions}
            </div>}
            {content}
        </section>
);
};

const CardSupertitle = ({
    children
}: PropsWithChildren) => {
    return (<h1 id={'card-supertitle'}
                className={'capitalize text-center text-3xl font-mono text-blue-800'}>{children}</h1>)
}

const CardTitle = ({children}: PropsWithChildren) => {
    return (<h2 id={'card-title'} className={'text-center text-slate-600'}>{children}</h2>)
}

const CardPrimaryButton = ({children, icon, route}: ButtonProps&{route: string}) => {
    return (
        <Link to={route}>
            <PrimaryButton id={'card-primary-action'} className={'pt-4'} icon={icon}>{children}</PrimaryButton>
        </Link>
    )
}

const CardActionButtons = ({children, icon, route}: ButtonProps&{route: string}) => {
    return (
        <Link to={route} className={'flex-1'}>
            <OutlinedButton id={'card-action'} icon={icon}>{children}</OutlinedButton>
        </Link>
    )
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
Card.PrimaryButton = CardPrimaryButton;
Card.Button = CardActionButtons;
Card.Caption = CardCaption;
Card.Content = CardContent;

export default Card;