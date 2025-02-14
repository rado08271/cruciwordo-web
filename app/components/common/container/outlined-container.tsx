import type {PropsWithChildren, ReactNode} from "react";

type Props =  PropsWithChildren&{
    icon?: ReactNode
    title?: string,
    className: string
}

const OutlinedContainer = ({ className, children, title, icon}: Props) => {
    return (
        <section className={'p-6 border-2 rounded-xl'}>
            <div className={'inline-flex gap-2 items-center'}>
                <span className={'text-blue-800'}>{icon}</span>
                <p className={'font-bold text-xl'}>{title}</p>
            </div>
            <div className={`mt-4 ${className}`}>
                {children}
            </div>
        </section>
    );
};

export default OutlinedContainer