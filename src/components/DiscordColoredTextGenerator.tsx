"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

const FG_COLORS = [
  { ansi: "30", color: "#4f545c", name: "Dark Gray (33%)" },
  { ansi: "31", color: "#dc322f", name: "Red" },
  { ansi: "32", color: "#859900", name: "Yellowish Green" },
  { ansi: "33", color: "#b58900", name: "Gold" },
  { ansi: "34", color: "#268bd2", name: "Light Blue" },
  { ansi: "35", color: "#d33682", name: "Pink" },
  { ansi: "36", color: "#2aa198", name: "Teal" },
  { ansi: "37", color: "#ffffff", name: "White" },
];

const BG_COLORS = [
  { ansi: "40", color: "#002b36", name: "Blueish Black" },
  { ansi: "41", color: "#cb4b16", name: "Rust Brown" },
  { ansi: "42", color: "#586e75", name: "Gray (40%)" },
  { ansi: "43", color: "#657b83", name: "Gray (45%)" },
  { ansi: "44", color: "#839496", name: "Light Gray (55%)" },
  { ansi: "45", color: "#6c71c4", name: "Blurple" },
  { ansi: "46", color: "#93a1a1", name: "Light Gray (60%)" },
  { ansi: "47", color: "#fdf6e3", name: "Cream White" },
];

const STYLES = [
  { ansi: "0", name: "Reset All" },
  { ansi: "1", name: "Bold", class: "font-bold" },
  { ansi: "4", name: "Line", class: "underline" },
];

export default function DiscordColoredTextGenerator() {
  const textareaRef = useRef<HTMLDivElement>(null);
  const [tooltipText, setTooltipText] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [copyButtonState, setCopyButtonState] = useState({
    text: "Copy text as Discord formatted",
    bgColor: "#4f545c",
    count: 0,
  });

  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.innerHTML = 'Welcome to&nbsp;<span class="ansi-33">Rebane</span>\'s <span class="ansi-45"><span class="ansi-37">Discord</span></span>&nbsp;<span class="ansi-31">C</span><span class="ansi-32">o</span><span class="ansi-33">l</span><span class="ansi-34">o</span><span class="ansi-35">r</span><span class="ansi-36">e</span><span class="ansi-37">d</span>&nbsp;Text Generator!';
    }
  }, []);

  const handleStyleClick = (ansi: string) => {
    if (!textareaRef.current) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const text = selection.toString();
    if (!text) return;

    if (ansi === "0") {
      
      if (textareaRef.current) {
        textareaRef.current.innerText = textareaRef.current.innerText;
      }
      return;
    }

    const span = document.createElement("span");
    span.innerText = text;
    span.classList.add(`ansi-${ansi}`);


    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(span);

    range.selectNodeContents(span);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const showColorTooltip = (color: { ansi: string, name: string }, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();

    setTooltipText(color.name);
    setTooltipPosition({
      top: rect.top - 36,
      left: rect.left - 60 + (rect.width / 2),
    });
    setShowTooltip(true);
  };

  const nodesToANSI = (nodes: NodeListOf<ChildNode> | Array<ChildNode>, states: Array<{fg: number, bg: number, st: number}>) => {
    let text = "";

    for (const node of Array.from(nodes)) {
      if (node.nodeType === 3) {
        text += node.textContent;
        continue;
      }

      if (node.nodeName === "BR") {
        text += "\n";
        continue;
      }

      if (node instanceof HTMLElement) {
        const classes = node.className.split(" ");
        const ansiClass = classes.find(c => c.startsWith("ansi-"));

        if (ansiClass) {
          const ansiCode = +(ansiClass.split("-")[1]);
          const newState = { ...states[states.length - 1] };

          if (ansiCode < 30) newState.st = ansiCode;
          if (ansiCode >= 30 && ansiCode < 40) newState.fg = ansiCode;
          if (ansiCode >= 40) newState.bg = ansiCode;

          states.push(newState);
          text += `\x1b[${newState.st};${(ansiCode >= 40) ? newState.bg : newState.fg}m`;

          if (node.childNodes.length > 0) {
            text += nodesToANSI(node.childNodes, states);
          }

          states.pop();
          text += `\x1b[0m`;

          if (states[states.length - 1].fg !== 2) {
            text += `\x1b[${states[states.length - 1].st};${states[states.length - 1].fg}m`;
          }
          if (states[states.length - 1].bg !== 2) {
            text += `\x1b[${states[states.length - 1].st};${states[states.length - 1].bg}m`;
          }
        } else {
          if (node.childNodes.length > 0) {
            text += nodesToANSI(node.childNodes, states);
          }
        }
      }
    }

    return text;
  };


  const copyFormattedText = () => {
    if (!textareaRef.current) return;

    const toCopy = "```ansi\n" + nodesToANSI(textareaRef.current.childNodes, [{ fg: 2, bg: 2, st: 2 }]) + "\n```";

    navigator.clipboard.writeText(toCopy).then(() => {
      const funnyMessages = [
        "Copied!",
        "Double Copy!",
        "Triple Copy!",
        "Dominating!!",
        "Rampage!!",
        "Mega Copy!!",
        "Unstoppable!!",
        "Wicked Sick!!",
        "Monster Copy!!!",
        "GODLIKE!!!",
        "BEYOND GODLIKE!!!!"
      ];

      const newCount = Math.min(10, copyButtonState.count + 1);
      setCopyButtonState({
        text: funnyMessages[newCount],
        bgColor: newCount <= 8 ? "#3BA55D" : "#ED4245",
        count: newCount,
      });

      setTimeout(() => {
        setCopyButtonState({
          text: "Copy text as Discord formatted",
          bgColor: "#4f545c",
          count: 0,
        });
      }, 2000);
    }).catch(err => {
      console.error("Failed to copy:", err);
      if (copyButtonState.count > 2) return;

      alert("Copying failed. You might need to copy this manually:");
      alert(toCopy);
    });
  };

  
  const handleTextareaInput = () => {
    if (!textareaRef.current) return;

    const content = textareaRef.current.innerHTML;
    if (content.includes("<") && content.includes(">")) {
      
      const sanitized = content.replace(/<(?!\/?span|br|\/span class="ansi-\d+")[^>]+>/gi, '');
      if (sanitized !== content) {
        textareaRef.current.innerHTML = sanitized;
      }
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">
        Rebane's Discord <span className="text-[#5865F2]">Colored</span> Text Generator
      </h1>

      <div className="max-w-lg mx-auto mb-8">
        <h3 className="text-xl font-semibold mb-2">About</h3>
        <p className="mb-4">
          This is a simple app that creates colored Discord messages using the ANSI color codes
          available on the latest Discord desktop versions.
        </p>
        <p className="mb-6">
          To use this, write your text, select parts of it and assign colors to them,
          then copy it using the button below, and send in a Discord message.
        </p>

        <h3 className="text-xl font-semibold mb-2">Source Code</h3>
        <p>
          This app runs entirely in your browser and the source code is freely available on{' '}
          <a href="https://gist.github.com/rebane2001/07f2d8e80df053c70a1576d27eabe97c" className="discord-link hover:underline">
            GitHub
          </a>.
          Shout out to kkrypt0nn for{' '}
          <a href="https://gist.github.com/kkrypt0nn/a02506f3712ff2d1c8ca7c9e0aed7c06" className="discord-link hover:underline">
            this guide
          </a>.
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Create your text</h2>

      <div className="mb-4 space-x-2">
        {STYLES.map(style => (
          <Button
            key={style.ansi}
            variant="secondary"
            className={style.class}
            onClick={() => handleStyleClick(style.ansi)}
          >
            {style.name}
          </Button>
        ))}
      </div>

      <div className="mb-4">
        <strong className="mr-2">FG</strong>
        {FG_COLORS.map(color => (
          <Button
            key={color.ansi}
            variant="outline"
            className="w-8 h-8 p-0 m-1"
            style={{ backgroundColor: color.color }}
            onClick={() => handleStyleClick(color.ansi)}
            onMouseEnter={(e) => showColorTooltip(color, e)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            &nbsp;
          </Button>
        ))}
      </div>

      <div className="mb-6">
        <strong className="mr-2">BG</strong>
        {BG_COLORS.map(color => (
          <Button
            key={color.ansi}
            variant="outline"
            className="w-8 h-8 p-0 m-1"
            style={{ backgroundColor: color.color }}
            onClick={() => handleStyleClick(color.ansi)}
            onMouseEnter={(e) => showColorTooltip(color, e)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            &nbsp;
          </Button>
        ))}
      </div>

      <div className="flex justify-center mb-4">
        <div
          ref={textareaRef}
          className="discord-textarea"
          contentEditable="true"
          onInput={handleTextareaInput}
          suppressContentEditableWarning={true}
        ></div>
      </div>

      <Button
        className="my-4"
        style={{ backgroundColor: copyButtonState.bgColor }}
        onClick={copyFormattedText}
      >
        {copyButtonState.text}
      </Button>

      <p className="text-sm mt-4 text-gray-400">
        This is an unofficial tool, it is not made or endorsed by Discord.
      </p>

      {showTooltip && (
        <div
          className="fixed bg-[#3BA55D] text-white p-2 rounded pointer-events-none z-50"
          style={{ top: `${tooltipPosition.top}px`, left: `${tooltipPosition.left}px` }}
        >
          {tooltipText}
        </div>
      )}
    </div>
  );
}
