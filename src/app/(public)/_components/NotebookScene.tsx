"use client";

interface NotebookSceneProps {
  openProgress: number;
}

export function NotebookScene({ openProgress: _openProgress }: NotebookSceneProps) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-linear-to-br from-background via-background to-primary/10">
      <div className="notebook-scene-glow pointer-events-none absolute inset-0" />
      <div className="notebook-scene-sweep pointer-events-none absolute inset-0" />

      <div className="relative w-[82%] max-w-95">
        <div className="absolute inset-x-2 -bottom-3.5 h-6 rounded-full bg-foreground/10 blur-md" />

        <div className="relative h-44 rounded-xl border border-border/80 bg-primary/15 p-1.5 sm:h-52">
          <div className="absolute left-0 top-0 h-full w-3 rounded-l-xl bg-primary/35" />
          <div className="absolute left-2 top-3 h-[calc(100%-1.5rem)] w-0.5 bg-primary/40" />

          <div className="relative ml-4 flex h-full flex-col rounded-lg border border-border/70 bg-card/90 p-4">
            <div className="h-2.5 w-20 rounded bg-primary/20" />
            <div className="mt-3 space-y-2">
              <div className="h-1.5 w-full rounded bg-foreground/10" />
              <div className="h-1.5 w-[88%] rounded bg-foreground/10" />
              <div className="h-1.5 w-[76%] rounded bg-foreground/10" />
              <div className="h-1.5 w-[92%] rounded bg-foreground/10" />
              <div className="h-1.5 w-[70%] rounded bg-foreground/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
