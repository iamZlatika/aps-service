import type { ReactNode } from "react";

import { Card, CardContent } from "@/shared/components/ui/card.tsx";
import { Separator } from "@/shared/components/ui/separator.tsx";

interface PersonCardProps {
  avatarSlot: ReactNode;
  infoSlot: ReactNode;
  metaSlot?: ReactNode;
  commentSlot?: ReactNode;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  children?: ReactNode;
}

export const PersonCard = ({
  avatarSlot,
  infoSlot,
  metaSlot,
  commentSlot,
  leftAction,
  rightAction,
  children,
}: PersonCardProps) => {
  return (
    <Card className="p-2 sm:p-6">
      {(leftAction || rightAction) && (
        <div className="flex items-center justify-between mb-2">
          <div>{leftAction}</div>
          <div className="flex items-center gap-1">{rightAction}</div>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="shrink-0">{avatarSlot}</div>
        <div className="flex-1 min-w-0">
          {infoSlot}
          {metaSlot && <div className="mt-2">{metaSlot}</div>}
          {commentSlot && (
            <div className="mt-2 text-sm text-muted-foreground">
              {commentSlot}
            </div>
          )}
        </div>
      </div>

      {children && (
        <>
          <Separator className="my-4 h-px bg-border" />
          <CardContent className="p-0">{children}</CardContent>
        </>
      )}
    </Card>
  );
};
