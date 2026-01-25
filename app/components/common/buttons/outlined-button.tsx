import type { ButtonProps } from "~/components/common/buttons/props";

const OutlinedButton = ({ id, children, className, icon }: ButtonProps) => (
  <div className={className ?? ""}>
    <div
      id={id}
      className={
        "p-2 text-center flex flex-row justify-center gap-4 text-bold text-slate-900 border border-gray-300 rounded-sm items-center"
      }
    >
      <div>{icon}</div>
      <p>{children}</p>
    </div>
  </div>
);

export default OutlinedButton;
