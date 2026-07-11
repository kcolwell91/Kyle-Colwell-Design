import { splitWords } from '@/utils/wordReveal';

type WordSpansProps = {
  text: string;
  startIndex?: number;
  className?: string;
  revealAccent?: 'burgundy';
};

export function WordSpans({
  text,
  startIndex = 0,
  className,
  revealAccent,
}: WordSpansProps) {
  const words = splitWords(text);

  return (
    <>
      {words.map((word, i) => {
        const index = startIndex + i;
        return (
          <span
            key={`${word}-${index}`}
            className={className}
            data-word-index={index}
            data-reveal-accent={revealAccent}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </>
  );
}

export function countWords(...texts: string[]) {
  return texts.reduce((total, text) => total + splitWords(text).length, 0);
}
