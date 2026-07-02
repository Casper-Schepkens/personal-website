import content from "@/messages/nl.json";

export default content;

export function t(key, dict = content) {
  return key.split(".").reduce((obj, part) => obj?.[part], dict) ?? key;
}
