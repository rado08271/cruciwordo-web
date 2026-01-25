import { Link } from "react-router";

export const Hero = () => {
  return (
    <section
      className={
        "text-white w-screen h-screen bg-sky-500 flex flex-col justify-center items-center hover:bg-opacity-50"
      }
    >
      <h1 className={"font-header font-medium text-8xl lg:text-[20em]/[1.1em]"}>CRUCIWORDO</h1>
      <ol className={"flex flex-row gap-6 text-lg"}>
        <Link to={"/create"}>Create</Link>
        <Link to={"/how-to"}>How to play</Link>
        <Link to={"/about"}>About</Link>
      </ol>
    </section>
  );
};
