import {
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaSquareXTwitter,
} from "react-icons/fa6";
import people_talking from "~/assets/people-talking.png";

export const Footer = () => {
  return (
    <section
      className={
        "text-sky-800 w-screen bg-white p-24 overflow-hidden flex flex-col gap-12 justify-center items-center relative"
      }
    >
      <img src={people_talking} alt={"talking people outside from humaans"} />
      <div className={"flex flex-row gap-4"}>
        <FaFacebook />
        <FaSquareXTwitter />
        <FaDiscord />
        <FaInstagram />
        <FaLinkedin />
        <FaGithub />
      </div>
      <p>© {new Date().getFullYear()} - Cruciwordo. All Rights Reserved.</p>
    </section>
  );
};

export default Footer;
