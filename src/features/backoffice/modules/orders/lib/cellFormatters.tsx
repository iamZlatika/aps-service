export const calcLineItemTotal = (price: string, quantity: number): string =>
  (parseFloat(price) * quantity).toFixed();

const WRAP_AT = 25;
const MAX_CHARS = 47;

export const renderWrappedText = (value: unknown) => {
  const text = (value as string) ?? "";

  if (text.length <= WRAP_AT) {
    return <span>{text}</span>;
  }

  const breakIndex = text.lastIndexOf(" ", WRAP_AT);
  const splitAt = breakIndex > 0 ? breakIndex : WRAP_AT;

  const line1 = text.slice(0, splitAt);
  const remainder = text.slice(splitAt + (breakIndex > 0 ? 1 : 0));
  const line2 =
    splitAt + remainder.length > MAX_CHARS
      ? text.slice(splitAt + (breakIndex > 0 ? 1 : 0), MAX_CHARS) + "…"
      : remainder;

  return (
    <div className="flex flex-col">
      <span>{line1}</span>
      <span>{line2}</span>
    </div>
  );
};
