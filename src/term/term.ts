import { Nullable } from "./types";

import "./term.scss";
import { escapeHtml, replaceLineBreak } from "./utils";

export interface Command {
  name: string;
  text?: string;
  callback?: (args: string[]) => string;
  help?: string;
}

// TODO: autocomplete, command history

export class Term {
  termDiv: HTMLDivElement;
  printed: string;
  input: string;

  username: string;
  hostname: string;

  cwd: string;

  commands: Map<string, Command>;
  history: string[];
  historyCursor: number;

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

    this.commands = new Map<string, Command>();

    this.history = [];
    this.historyCursor = 0;

    let self = this;

    // Add utility commands
    this.addCommand({
      name: "help",
      callback: () => {
        return self.getHelp();
      },
      help: "Usage:  help\n\nPrint all available commands.\n",
    });

    this.addCommand({
      name: "clear",
      callback: () => {
        self.printed = "";
        return "";
      },
      help: "Usage:  clear\n\nClear screen.\n",
    });

    this.addCommand({
      name: "history",
      callback: () => {
        return self.getHistory();
      },
      help: "Usage:  clear\n\nClear screen.\n",
    });

    // Capture keyboard input
    document.addEventListener("keydown", this.handleKeydown.bind(this));

    // Support touch keyboard
    this.termDiv.setAttribute("contenteditable", "true");
    this.termDiv.style.caretColor = "transparent";

    // Print welcome message and prompt
    this.printed = this.getWelcomeMsg() + this.getPrompt();
    this.input = "";
    this.print();
  }

  handleKeydown(event: KeyboardEvent) {
    event.preventDefault();
    switch (event.key) {
      case "Backspace":
        this.input = this.input.slice(0, -1);
        break;
      case "Up":
      case "ArrowUp":
        if (this.historyCursor > 0) {
          this.historyCursor--;
          this.input = this.history[this.historyCursor];
        }
        break;
      case "Down":
      case "ArrowDown":
        if (this.historyCursor < this.history.length) {
          this.historyCursor++;
          this.input =
            this.historyCursor == this.history.length
              ? ""
              : this.history[this.historyCursor];
        }
        break;
      case "Enter":
        this.printed += escapeHtml(this.input) + "<br>";
        let res = this.execCommand(this.input);
        this.printed += res + this.getPrompt();
        this.history.push(this.input);
        this.historyCursor = this.history.length;
        this.input = "";
        break;
      default:
        if (event.key.length == 1) {
          this.input += event.key;
        }
    }
    this.print();
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

  getWelcomeMsg() {
    return replaceLineBreak(
      escapeHtml(`
 _____              _      _    _____ _                
|  __ \\            (_)    | |  / ____| |               
| |  | | __ _ _ __  _  ___| | | |    | |__   ___ _ __  
| |  | |/ _\` | '_ \\| |/ _ \\ | | |    | '_ \\ / _ \\ '_ \\
| |__| | (_| | | | | |  __/ | | |____| | | |  __/ | | |
|_____/ \\__,_|_| |_|_|\\___|_|  \\_____|_| |_|\\___|_| |_|
`) +
        `
Nice to meet you! My name is <mark>Daniel Chen</mark>!

Email: <a href="mailto://daniel@ccns.ncku.edu.tw">daniel@ccns.ncku.edu.tw</a>
Blog: <a href="https://blog.danielchen.cc/">https://blog.danielchen.cc/</a>
LinkedIn: <a href="https://www.linkedin.com/in/d4n1el/">https://www.linkedin.com/in/d4n1el/</a>

Type 'help' and hit enter to get available commands

`
    );
  }

  getHelp() {
    return replaceLineBreak(
      `Welcome to Daniel's personal website!\n\nCurrent supported commands: ${Array.from(
        this.commands
      )
        .map(([key, _]) => key)
        .join(", ")}\n\nType '[COMMAND] help' to get help for each commands\n\n`
    );
  }

  getHistory() {
    return replaceLineBreak(
      this.history.map((command) => command + "\n").join("")
    );
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

  execCommand(input: string) {
    let args = input.split(" ");
    let commandName = args.splice(0, 1)[0];
    if (this.commands.has(commandName)) {
      let command = this.commands.get(commandName);
      if (args[0] == "help") {
        if (command.help !== undefined) {
          return replaceLineBreak(command.help);
        } else {
          return "The author is lazy. He didn't provide any help string...<br>";
        }
      } else {
        if (command.callback) {
          return command.callback(args);
        } else {
          return replaceLineBreak(command.text);
        }
      }
    } else if (commandName.length === 0) {
      return "";
    } else {
      return `Command not found: ${escapeHtml(commandName)}<br>`;
    }
  }
}
