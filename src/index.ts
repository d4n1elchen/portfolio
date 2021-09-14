import { Term } from "./term/term";

import "normalize.css";
import "./index.scss";

const termDiv = document.getElementById("term") as HTMLDivElement;
const term = new Term(termDiv, "daniel", "usc");
