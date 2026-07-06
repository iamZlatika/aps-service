export const calcOrderItemTotal = (price: string, quantity: number): string =>
  (parseFloat(price) * quantity).toFixed();

const DEFAULT_WRAP_AT = 20;
const DEFAULT_MAX_CHARS = 40;

type WrapTextOptions = {
  wrapAt?: number;
  maxChars?: number;
};

export const renderWrappedText = (
  value: unknown,
  {
    wrapAt = DEFAULT_WRAP_AT,
    maxChars = DEFAULT_MAX_CHARS,
  }: WrapTextOptions = {},
) => {
  const text = (value as string) ?? "";

  if (text.length <= wrapAt) {
    return <span>{text}</span>;
  }

  const breakIndex = text.lastIndexOf(" ", wrapAt);
  const splitAt = breakIndex > 0 ? breakIndex : wrapAt;

  const line1 = text.slice(0, splitAt);
  const remainder = text.slice(splitAt + (breakIndex > 0 ? 1 : 0));
  const line2 =
    splitAt + remainder.length > maxChars
      ? text.slice(splitAt + (breakIndex > 0 ? 1 : 0), maxChars) + "…"
      : remainder;

  return (
    <div className="flex flex-col">
      <span>{line1}</span>
      <span>{line2}</span>
    </div>
  );
};
