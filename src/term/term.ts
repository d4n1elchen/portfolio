import { Nullable } from "./types";

import "./term.scss";
import { escapeHtml } from "./utils";

export class Term {
  termDiv: HTMLDivElement;
  printed: string;
  input: string;

  username: string;
  hostname: string;

  cwd: string;

  constructor(
    termDiv: Nullable<HTMLDivElement>,
    username: string,
    hostname: string
  ) {
    if (!termDiv) {
      return;
    }

    this.termDiv = termDiv;
    this.username = username;
    this.hostname = hostname;
    this.cwd = "~";

    this.printed = this.getPrompt();
    this.input = "";

    this.print();

    // Capture keyboard input
    const self = this;
    document.addEventListener("keydown", function (event) {
      if (event.key === "Backspace") {
        self.input = self.input.slice(0, -1);
      } else if (event.key === "Enter") {
      } else if (event.key.length == 1) {
        self.input += event.key;
      }
      self.print();
    });
  }

  print() {
    this.termDiv.innerHTML = this.wrapDiv(
      this.printed + escapeHtml(this.input) + this.getCursor(),
      "term-container"
    );
    this.termDiv.scrollTop = this.termDiv.scrollHeight;
  }

  wrapDiv(innerHTML: string, className: string) {
    return `<div class="${className}">${innerHTML}</div>`;
  }

  getPrompt() {
    return `<span class="host">${this.username}@${this.hostname}</span><span class="colon">:</span><span class="cwd">${this.cwd}</span> <span class="dollar">$</span> `;
  }

  getCursor() {
    return `<span class="cursor">█</span>`;
  }
}
