import React from 'react';

// Explicit mapping for common emojis used in the app to avoid variation selector discrepancies
const emojiMap = {
  // Common UI
  '💡': '1f4a1',
  '🛠': '1f6e0-fe0f',
  '🛠️': '1f6e0-fe0f',
  '🎯': '1f3af',
  '🚀': '1f680',
  '🧭': '1f9ed',
  '🏁': '1f3c1',
  '🗺': '1f5fa',
  '🗺️': '1f5fa',
  '📝': '1f4dd',
  '📚': '1f4da',
  '🎓': '1f393',
  '💻': '1f4bb',
  '🔥': '1f525',
  '💬': '1f4ac',
  '✔️': '2714-fe0f',
  '✔': '2714-fe0f',
  '📊': '1f4ca',
  '🧠': '1f9e0',
  '🤖': '1f916',
  '⚙️': '2699-fe0f',
  '⚙': '2699-fe0f',
  '📅': '1f4c5',
  '🏆': '1f3c6',
  '✨': '2728',
  '🔑': '1f511',
  '👥': '1f465',
  '🔒': '1f512',
  '🔓': '1f513',
  '👤': '1f464',
  '📈': '1f4c8',
  '🏫': '1f3eb',
  '🕰️': '1f570-fe0f',
  '🕰': '1f570-fe0f',
  '⭐': '2b50',
  '🌟': '1f31f',
  '🔍': '1f50d',
  '📖': '1f4d6',
  '❓': '2753',
  '❔': '2754',
  '❌': '274c',
  '✅': '2705',
  '🎉': '1f389',
  '💪': '1f4aa',
  '🤔': '1f914',
  '✍️': '270d-fe0f',
  '✍': '270d-fe0f',
};

export const getAppleEmojiUrl = (emoji) => {
  if (emojiMap[emoji]) {
    return `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@14.0.0/img/apple/64/${emojiMap[emoji]}.png`;
  }
  
  // Dynamic fallback
  try {
    const codePoints = Array.from(emoji).map(char => char.codePointAt(0).toString(16));
    // Filter out empty or invalid codepoints
    const cleanPoints = codePoints.filter(cp => cp && cp !== 'fe0f');
    if (cleanPoints.length === 0) return null;
    
    // Most standard emojis in datasource-apple use lowercase hex without fe0f unless required
    const filename = cleanPoints.join('-');
    return `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@14.0.0/img/apple/64/${filename}.png`;
  } catch (e) {
    return null;
  }
};

// Regex for splitting (global flag required, uses modern unicode code points)
const EMOJI_REGEX_SPLIT = /([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F000}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2B50}])/gu;

// Regex for testing (no global flag to prevent lastIndex state issues)
const EMOJI_REGEX_TEST = /([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F000}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2B50}])/u;

const AppleEmoji = ({ emoji, className = '', style = {} }) => {
  if (!emoji) return null;

  const trimmed = emoji.trim();
  const isSingleEmoji = Array.from(trimmed).length <= 2 && EMOJI_REGEX_TEST.test(trimmed);
  
  if (isSingleEmoji) {
    const url = getAppleEmojiUrl(trimmed);
    if (url) {
      return (
        <img
          src={url}
          alt={trimmed}
          className={`apple-emoji inline-block h-[1.25em] w-[1.25em] align-middle select-none mx-0.5 object-contain ${className}`}
          style={{ verticalAlign: '-0.15em', ...style }}
          onError={(e) => {
            // fallback to text if image fails to load
            e.target.style.display = 'none';
            const span = document.createElement('span');
            span.innerText = trimmed;
            e.target.parentNode.insertBefore(span, e.target);
          }}
        />
      );
    }
  }

  // If it's a mix of text and emojis, parse and render them
  const parts = emoji.split(EMOJI_REGEX_SPLIT);
  
  return (
    <>
      {parts.map((part, index) => {
        const isEmoji = EMOJI_REGEX_TEST.test(part);
        if (isEmoji) {
          const url = getAppleEmojiUrl(part);
          if (url) {
            return (
              <img
                key={index}
                src={url}
                alt={part}
                className={`apple-emoji inline-block h-[1.25em] w-[1.25em] align-middle select-none mx-0.5 object-contain ${className}`}
                style={{ verticalAlign: '-0.15em', ...style }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  const span = document.createElement('span');
                  span.innerText = part;
                  e.target.parentNode.insertBefore(span, e.target);
                }}
              />
            );
          }
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};

export default AppleEmoji;
