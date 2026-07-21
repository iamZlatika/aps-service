export type TextSegment =
  | { readonly type: "text"; readonly value: string }
  | { readonly type: "url"; readonly value: string };

const TRAILING_PUNCTUATION_REGEX = /[.,!?;:)\]}'"]+$/;

function trimTrailingPunctuation(url: string): {
  url: string;
  trailing: string;
} {
  const match = url.match(TRAILING_PUNCTUATION_REGEX);
  if (!match) return { url, trailing: "" };
  return { url: url.slice(0, -match[0].length), trailing: match[0] };
}

export function splitTextByUrls(text: string): TextSegment[] {
  const URL_REGEX = /https?:\/\/[^\s]+/g;
  const segments: TextSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = URL_REGEX.exec(text)) !== null) {
    const { url, trailing } = trimTrailingPunctuation(match[0]);

    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        value: text.slice(lastIndex, match.index),
      });
    }
    if (url.length > 0) {
      segments.push({ type: "url", value: url });
    }
    if (trailing.length > 0) {
      segments.push({ type: "text", value: trailing });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }

  return segments;
}
