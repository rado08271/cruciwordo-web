export const About = () => {
  return (
    <section
      className={"text-stone-600 w-screen bg-white p-24 overflow-hidden flex flex-col gap-12"}
    >
      <h3 className={"font-header font-medium text-5xl"}>Welcome to Cruciwordo!</h3>
      <article className={"flex flex-row justify-center gap-16 text-xl"}>
        <p className={"flex-1"}>
          Ever dreamed of becoming a conundrum connoisseur? Welcome to your wildest dream!
          PuzzleMaster throws you in the deep end of word search mazes.
        </p>
        <p className={"flex-1"}>
          Every game is a new journey, a new puzzle, a new chance to show off your mastery. Embrace
          the challenge, unlock levels and become the PuzzleMaster of the century. Are you game?
        </p>
      </article>
    </section>
  );
};
