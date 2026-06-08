import "./work-card.css";

import { type Work } from "@/entities/work/types";
import { cn } from "@/shared/lib/utils";

import { WorkInfo } from "./WorkInfo";
import { WorkMedia } from "./WorkMedia";

interface WorkCardProps {
  work: Work;
  isReverse: boolean;
}

export const WorkCard = ({ work, isReverse }: WorkCardProps) => (
  <article className={cn("ws-work-card", isReverse && "ws-work-card-reverse")}>
    <WorkMedia work={work} />
    <WorkInfo work={work} />
  </article>
);
