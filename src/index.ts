import { Term } from "./term/term";
import { replaceLineBreak } from "./term/utils";

import "normalize.css";
import "./index.scss";

const termDiv = document.getElementById("term") as HTMLDivElement;
const term = new Term(termDiv, "daniel", "usc");

term.addCommand({
  name: "about",
  callback: () => {
    return replaceLineBreak(`Hi, my name is Daniel Chen. I’m currently a Computer Science master student from University of Southern California. I graduated from Dept. of Mechanical Engineering, National Cheng-Kung University (NCKU), Taiwan. I’m interested in rhythm games and programming. I watch Japanese anime and conmic in my free time.

My research interests are: web development, DevOps, streaming technology, and math. In my blog, I’ll post some learning notes. Notes and tutorials will be posted in English. Reviews and jottings will be in Chinese. However, some materials that already has abundant English resource or some topics including important conceptional explaination will be written in Chinese. You are welcome to leave comments to discuss.

Email: <a href="mailto://daniel@ccns.ncku.edu.tw">daniel@ccns.ncku.edu.tw</a>
Blog: <a href="https://blog.danielchen.cc/">https://blog.danielchen.cc/</a>
LinkedIn: <a href="https://www.linkedin.com/in/d4n1el/">https://www.linkedin.com/in/d4n1el/</a>

`);
  },
  help: "Usage:  about\n\nPrint some information about me\n",
});
