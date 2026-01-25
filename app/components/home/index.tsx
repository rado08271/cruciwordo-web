import { Link } from "react-router";

import { Games } from "./Games";
import { Tiles } from "./Tiles";
import Footer from "../common/Footer";
import { Join } from "./Join";
import { Hero } from "./Hero";

const Home = () => {
  return (
    <div>
      <Hero />
      <Join />
      <Games />
      <Tiles />
      <Footer />
    </div>
  );
};

export default Home;
