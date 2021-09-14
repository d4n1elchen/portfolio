import { Nullable } from "./types";

export class Term {
  termDiv: HTMLDivElement;
  printed: string;
  input: string;

  constructor(termDiv: Nullable<HTMLDivElement>) {
    if (!termDiv) {
      return;
    }

    this.termDiv = termDiv;
    this.printed = "";

    setInterval(() => {
      this.printed += "test<br>";
      this.print();
    }, 100);
  }

  print() {
    this.termDiv.innerHTML = this.printed;
    this.termDiv.scrollTop = this.termDiv.scrollHeight;
  }
}
