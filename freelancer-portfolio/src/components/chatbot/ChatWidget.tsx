"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { MessageCircle, Send, X } from "lucide-react";

type Message = {
  role: "assistant" | "user";
  text: string;
};

const suggestions = [
  "What services do you offer?",
  "Show me your projects",
  "How much will my project cost?",
  "How long does delivery take?",
];

function getReply(message: string): string {
  const text = message.toLowerCase().trim();

  if (
    /\b(price|cost|budget|charge|charges|pricing|kitna|paise)\b/.test(
      text
    )
  ) {
    return (
      "Pricing depends on your project scope, features and complexity. " +
      "Share your requirements and budget range through the enquiry form. " +
      "Aditya will review them before confirming a quotation for " +
      "StackBloom Studio."
    );
  }

  if (
    /\b(time|timeline|deadline|delivery|duration|days|kab)\b/.test(text)
  ) {
    return (
      "Delivery depends on the agreed scope, availability and when " +
      "content and feedback are received. Include your preferred " +
      "deadline in the enquiry form so Aditya can discuss a realistic schedule."
    );
  }

  if (
    /\b(portfolio|previous|sample|samples|example|examples|github)\b/.test(
      text
    ) ||
    /show.*projects|your projects|selected work|past work/.test(text)
  ) {
    return (
      "Our Work page features D-Finance, JobPilot AI, an Indian Sign " +
      "Language learning system, a Kotlin ticket machine and NailGuard. " +
      "Each project card includes a GitHub link. D-Finance also has " +
      "a website link. Use “Explore projects” below to view them."
    );
  }

  if (
    /\b(revision|revisions|maintenance)\b/.test(text) ||
    /after.*delivery|ongoing support/.test(text)
  ) {
    return (
      "Revisions, handover and any ongoing support are agreed in the " +
      "project scope. Additional features or changes outside that " +
      "scope may require a separate estimate."
    );
  }

  if (
    /\b(payment|payments|advance|deposit|refund)\b/.test(text)
  ) {
    return (
      "Payment milestones and any cancellation or refund terms must " +
      "be agreed before the project starts. Hosting, domains and " +
      "third-party service costs will also be clarified in the quotation."
    );
  }

  if (
    /\b(college|assignment|assignments|academic|report|student|learning)\b/.test(
      text
    )
  ) {
    return (
      "Technical learning support includes concept explanations, " +
      "debugging guidance, project planning, code walkthroughs and " +
      "feedback on your own report drafts. Tell us the topic and " +
      "what you need help understanding."
    );
  }

  if (
    /\b(dashboard|dashboards|excel|analysis|analytics|data)\b/.test(text)
  ) {
    return (
      "StackBloom Studio offers data preparation, analysis, Excel " +
      "dashboards and reporting. Describe your data sources, the " +
      "insights you need and your preferred output. Avoid sharing " +
      "confidential records in this chat."
    );
  }

  if (
    /\b(fix|fixes|bug|bugs|repair|error|errors)\b/.test(text) ||
    /existing website/.test(text)
  ) {
    return (
      "For website fixes, share the affected page address, a description " +
      "of the issue and the technology used through the enquiry form. " +
      "Do not send passwords or private API keys."
    );
  }

  if (
    /\b(chatbot|ai|llm)\b|artificial intelligence|machine learning/.test(
      text
    )
  ) {
    return (
      "StackBloom Studio can discuss conversational assistants, LLM " +
      "integrations and machine learning prototypes. Feasibility, " +
      "evaluation needs and third-party costs depend on your use case. " +
      "This website assistant itself uses predefined responses."
    );
  }

  if (
    /\b(automation|automate|python|script|scripts)\b/.test(text)
  ) {
    return (
      "We build scripts and tools for repetitive tasks, file processing " +
      "and workflow automation. Describe your current process, the " +
      "inputs you use and the result you want."
    );
  }

  if (
    /\b(website|websites|landing|shopping|ecommerce)\b/.test(text) ||
    /web app|web development|e-commerce|online shop/.test(text)
  ) {
    return (
      "For a website or web app, describe your business, required pages " +
      "and features. For an online shop, mention products, payments, " +
      "checkout and order management. Also tell us whether you already " +
      "have a domain, hosting and content."
    );
  }

  if (
    /\b(founder|aditya|owner|company|studio)\b/.test(text) ||
    /who are you|about you/.test(text)
  ) {
    return (
      "StackBloom Studio is operated by Aditya Pandey, a full-stack " +
      "developer interested in web applications, AI and automation. " +
      "You can learn more on the About page."
    );
  }

  if (
    /\b(services|offer|provide|help)\b/.test(text)
  ) {
    return (
      "StackBloom Studio offers website development, web applications, " +
      "data dashboards, Python automation, AI prototypes and technical " +
      "project guidance. Which service interests you?"
    );
  }

  if (
    /\b(contact|enquiry|discuss|hire|start|project|quote|email)\b/.test(
      text
    )
  ) {
    return (
      "Use “Open enquiry form” below to send your name, email and " +
      "project requirements. Aditya will review your request before " +
      "confirming scope, pricing and delivery. Chat messages alone " +
      "are not submitted as enquiries."
    );
  }

  if (/^(hi|hello|hey|namaste)\b/.test(text)) {
    return (
      "Hello! I'm StackBloom Studio's guided project assistant. " +
      "I can explain our services, projects and enquiry process. " +
      "What would you like to build?"
    );
  }

  if (/\b(thanks|thank you|shukriya)\b/.test(text)) {
    return (
      "You're welcome! When you're ready, use the enquiry form " +
      "to share your project requirements with Aditya."
    );
  }

  return (
    "I can explain StackBloom Studio's services, projects, quotation " +
    "process and delivery arrangements. Try one of the quick questions " +
    "below, or use the enquiry form for a detailed requirement."
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text:
        "Welcome to StackBloom Studio! I can help you explore our " +
        "services and explain how to start a project. What do you need?",
    },
  ]);

  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop =
        messagesRef.current.scrollHeight;
    }
  }, [messages, open]);

  function sendMessage(value: string) {
    const text = value.trim().slice(0, 500);

    if (!text) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", text },
      { role: "assistant", text: getReply(text) },
    ]);

    setInput("");
    inputRef.current?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(input);
  }

  function closeChat() {
    setOpen(false);
    launcherRef.current?.focus();
  }

    return (
    <div className="sb-chat-widget">
      {open && (
        <section
          id="project-chat"
          className="sb-chat-panel"
          role="dialog"
          aria-labelledby="chat-title"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.stopPropagation();
              closeChat();
            }
          }}
        >
          <header className="sb-chat-header">
            <div>
              <strong id="chat-title">StackBloom Assistant</strong>
              <span>Services, projects & enquiries</span>
            </div>

            <button
              type="button"
              onClick={closeChat}
              aria-label="Close chat"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </header>

          <div
            className="sb-chat-messages"
            ref={messagesRef}
            role="log"
            aria-label="Conversation"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`sb-message sb-message-${message.role}`}
              >
                <span>
                  {message.role === "assistant"
                    ? "StackBloom"
                    : "You"}
                </span>
                <p>{message.text}</p>
              </div>
            ))}
          </div>

          <div className="sb-chat-controls">
            {messages.length === 1 && (
              <div className="sb-chat-shortcuts">
                {[
                  {
                    label: "Services",
                    question: suggestions[0],
                  },
                  {
                    label: "Projects",
                    question: suggestions[1],
                  },
                  {
                    label: "Pricing",
                    question: suggestions[2],
                  },
                  {
                    label: "Timeline",
                    question: suggestions[3],
                  },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => sendMessage(item.question)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            <div className="sb-chat-links">
              <Link
                href="/projects"
                onClick={() => setOpen(false)}
              >
                Projects ↗
              </Link>

              <Link
                href="/contact"
                onClick={() => setOpen(false)}
              >
                Send enquiry ↗
              </Link>
            </div>

            <form
              className="sb-chat-form"
              onSubmit={handleSubmit}
            >
              <label
                className="sb-chat-hidden-label"
                htmlFor="chat-input"
              >
                Your question
              </label>

              <input
                ref={inputRef}
                id="chat-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type your question..."
                maxLength={500}
                autoComplete="off"
              />

              <button
                type="submit"
                aria-label="Send message"
                disabled={!input.trim()}
              >
                <Send size={18} aria-hidden="true" />
              </button>
            </form>

            <p className="sb-chat-notice">
              Guided answers · Chat messages are not enquiries.
            </p>
          </div>
        </section>
      )}

      <button
        ref={launcherRef}
        type="button"
        className="sb-chat-launcher"
        aria-expanded={open}
        aria-controls={open ? "project-chat" : undefined}
        aria-haspopup="dialog"
        onClick={() => {
          if (open) closeChat();
          else setOpen(true);
        }}
      >
        {open ? (
          <X size={20} aria-hidden="true" />
        ) : (
          <MessageCircle size={20} aria-hidden="true" />
        )}
        <span>{open ? "Close chat" : "Let's chat"}</span>
      </button>
    </div>
  );
}