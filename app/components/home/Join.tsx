import FancyTextInput from "../common/input/fancy-text-input";

export const Join = () => {
  return (
    <form
      className={
        "text-sky-500 w-screen bg-white p-24 overflow-hidden flex flex-col gap-12 justify-center items-center"
      }
    >
      <h3 className={"font-header font-medium text-5xl"}>Start Playing</h3>
      <label htmlFor={"puzzle-id"} className={"w-1/2 text-xl text-center"}>
        Don’t just stand on the sidelines — dive straight into the action! The cryptic world of
        Cruciwordo awaits!
      </label>
      <FancyTextInput placeholder={"i.e. #cruciwordo"} className={"text-center"} />
      <button className={"bg-sky-500 py-2 px-4 rounded-lg text-white text-md"}>Play Now</button>
    </form>
  );
};
