import type {ButtonProps} from "~/components/common/buttons/props";

const PrimaryButton = ({id, children, className, icon, disabled}: ButtonProps&{disabled: boolean}) => (
    <div className={className ?? ""}>
        <button id={id} disabled={disabled}
             className={'disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer w-full bg-slate-900 p-3 rounded text-center flex flex-row justify-center gap-4 text-bold text-white text-lg items-center'}>
            <div>{icon}</div>
            <p>{children}</p>
        </button>
    </div>
)

export default PrimaryButton;