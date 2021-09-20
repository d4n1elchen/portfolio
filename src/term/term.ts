import { Nullable } from "./types";

import "./term.scss";
import { escapeHtml, replaceLineBreak } from "./utils";

export interface Command {
  name: string;
  text?: string;
  callback?: () => string;
  help?: string;
}

export class Term {
  termDiv: HTMLDivElement;
  printed: string;
  input: string;

  username: string;
  hostname: string;

  cwd: string;

  commands: Map<string, Command>;

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

    this.commands = new Map<string, Command>();

    this.print();

    // Capture keyboard input
    const self = this;
    document.addEventListener("keydown", function (event) {
      if (event.key === "Backspace") {
        self.input = self.input.slice(0, -1);
      } else if (event.key === "Enter") {
        self.printed +=
          escapeHtml(self.input) +
          "<br>" +
          self.execCommand(self.input) +
          self.getPrompt();
        self.input = "";
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

  addCommand(cmd: Command) {
    if (cmd.callback === undefined && cmd.text === undefined) {
      throw new Error("Either `callback` or `text` should be defined.");
    }
    this.commands.set(cmd.name, cmd);
  }

  execCommand(cmd: string) {
    if (this.commands.has(cmd)) {
      let command = this.commands.get(cmd);
      if (command.callback) {
        return command.callback();
      } else {
        return replaceLineBreak(command.text);
      }
    } else if (cmd.length === 0) {
      return "";
    } else {
      return `Command not found: ${cmd}<br>`;
    }
  }
}
