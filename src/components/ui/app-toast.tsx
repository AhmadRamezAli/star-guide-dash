import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { toast as sonnerToast } from "sonner";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  id: string | number;
  type: ToastType;
  title: string;
  description?: string;
}

const toastConfig: Record<
  ToastType,
  { icon: typeof CheckCircle2; containerClass: string; iconClass: string }
> = {
  success: {
    icon: CheckCircle2,
    containerClass: "border-emerald-500/20 bg-emerald-950/20 text-emerald-200",
    iconClass: "text-emerald-400",
  },
  error: {
    icon: AlertCircle,
    containerClass: "border-rose-500/20 bg-rose-950/20 text-rose-200",
    iconClass: "text-rose-400",
  },
  warning: {
    icon: AlertTriangle,
    containerClass: "border-amber-500/20 bg-amber-950/20 text-amber-200",
    iconClass: "text-amber-400",
  },
  info: {
    icon: Info,
    containerClass: "border-sky-500/20 bg-sky-950/20 text-sky-200",
    iconClass: "text-sky-400",
  },
};

export function CustomToastCard({ id, type, title, description }: ToastProps) {
  const { icon: Icon, containerClass, iconClass } = toastConfig[type];

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all",
        "bg-background/95 text-foreground dark:bg-card/95",
        containerClass
      )}
    >
      <Icon className={cn("size-5 shrink-0 translate-y-0.5", iconClass)} />

      <div className="flex-1 space-y-1">
        <p className="text-sm font-semibold leading-tight text-foreground">{title}</p>
        {description && (
          <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => sonnerToast.dismiss(id)}
        aria-label="Close notification"
        className="shrink-0 rounded-md p-1 text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export const showToast = {
  success: (title: string, description?: string) => {
    sonnerToast.custom((id) => (
      <CustomToastCard id={id} type="success" title={title} description={description} />
    ));
  },
  error: (title: string, description?: string) => {
    sonnerToast.custom((id) => (
      <CustomToastCard id={id} type="error" title={title} description={description} />
    ));
  },
  warning: (title: string, description?: string) => {
    sonnerToast.custom((id) => (
      <CustomToastCard id={id} type="warning" title={title} description={description} />
    ));
  },
  info: (title: string, description?: string) => {
    sonnerToast.custom((id) => (
      <CustomToastCard id={id} type="info" title={title} description={description} />
    ));
  },
};