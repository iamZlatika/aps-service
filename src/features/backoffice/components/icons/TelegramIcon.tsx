import { type SVGProps } from "react";

type TelegramIconProps = SVGProps<SVGSVGElement>;

export const TelegramIcon = ({
  width = 24,
  height = 24,
  ...props
}: TelegramIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="120" cy="120" r="120" fill="#24A1DE" />

      <path
        d="M54 118.5L171.5 73C176.9 70.9 181.6 74.3 179.9 82L159.9 176.3C158.4 183 154.2 184.6 148.5 181.4L118 159L103.3 173.2C101.7 174.8 100.3 176.2 97.2 176.2L99.4 145.2L154.6 95.3C157 93.2 154.1 92 150.9 94L82.7 136.9L53.3 127.7C46.9 125.7 46.8 121.3 54 118.5Z"
        fill="white"
      />
    </svg>
  );
};
