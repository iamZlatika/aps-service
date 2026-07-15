import { splitTextByUrls } from "@/shared/lib/linkifyText.ts";

interface LinkifiedTextProps {
  text: string;
  className?: string;
}

const LinkifiedText = ({ text, className }: LinkifiedTextProps) => {
  const segments = splitTextByUrls(text);

  return (
    <span className={className}>
      {segments.map((segment, index) =>
        segment.type === "url" ? (
          <a
            key={index}
            href={segment.value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline break-all"
          >
            {segment.value}
          </a>
        ) : (
          <span key={index}>{segment.value}</span>
        ),
      )}
    </span>
  );
};

export default LinkifiedText;
