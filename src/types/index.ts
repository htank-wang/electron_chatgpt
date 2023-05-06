export interface MessageProps {
  role: "system" | "user" | "assistant";
  content: string;
  type: string;
}

export interface ErrorMessage {
  code: string;
  message: string;
}
