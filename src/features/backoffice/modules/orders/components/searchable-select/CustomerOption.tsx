interface CustomerOptionProps {
  name: string;
  phones: string[];
}

export const CustomerOption = ({ name, phones }: CustomerOptionProps) => (
  <div className="flex flex-col">
    <span className="text-sm font-medium">{name}</span>
    <span className="text-xs text-muted-foreground">{phones?.join(", ")}</span>
  </div>
);
