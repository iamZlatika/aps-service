interface TopBarListItem {
  label: string;
  value: number;
  formattedValue: string;
}

interface TopBarListProps {
  title: string;
  items: TopBarListItem[];
}

export const TopBarList = ({ title, items }: TopBarListProps) => {
  const maxValue = Math.max(1, ...items.map((item) => item.value));

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.label} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-sm">
              <span className="truncate">{item.label}</span>
              <span className="font-medium">{item.formattedValue}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted">
              <div
                className="h-1.5 rounded-full bg-primary"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
