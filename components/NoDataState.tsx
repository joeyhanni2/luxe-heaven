import { LucideIcon } from "lucide-react";

interface NoDataStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function NoDataState({ icon: Icon, title, description }: NoDataStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in-50 duration-500">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}