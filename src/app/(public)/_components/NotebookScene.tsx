"use client";

interface NotebookSceneProps {
  openProgress: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function NotebookScene({ openProgress }: NotebookSceneProps) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-linear-to-br from-background via-background to-primary/10">
      <div className="notebook-scene-glow pointer-events-none absolute inset-0" />
      <div className="notebook-scene-sweep pointer-events-none absolute inset-0" />

      <div className="relative w-[84%] max-w-96">
        {/* Shadow base */}
        <div className="absolute inset-x-4 -bottom-4 h-6 rounded-full bg-foreground/8 blur-xl" />

        {/* Notebook cover */}
        <div className="relative rounded-xl border border-border/90 bg-primary/12 p-1.5 shadow-lg shadow-primary/10 sm:rounded-2xl">
          {/* Spine */}
          <div className="absolute left-0 top-0 h-full w-3.5 rounded-l-xl rounded-r-none bg-primary/40 sm:rounded-l-2xl">
            {/* Spiral rings */}
            <div className="absolute inset-y-3 left-0.5 right-0.5 flex flex-col justify-around">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="h-2 rounded-full bg-background/60 ring-1 ring-primary/30"
                />
              ))}
            </div>
          </div>

          {/* Ruled line separator */}
          <div className="absolute left-3.5 top-3 h-[calc(100%-1.5rem)] w-px bg-primary/30" />

          {/* Page content */}
          <div className="relative ml-4 flex h-full flex-col rounded-lg border border-border/60 bg-card/95 shadow-inner">
            {/* Page header rule */}
            <div className="border-b border-primary/20 px-4 pt-3 pb-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary/60" />
                  <div className="h-2 w-20 rounded bg-primary/25" />
                </div>
                <div className="h-1.5 w-12 rounded bg-muted-foreground/20" />
              </div>
            </div>

            {/* Subject tag */}
            <div className="px-4 pt-3">
              <div className="inline-flex items-center gap-1.5 rounded-md border border-primary/25 bg-primary/10 px-2.5 py-1">
                <div className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                <div className="h-1.5 w-14 rounded bg-primary/40" />
              </div>
            </div>

            {/* Text lines */}
            <div className="space-y-1.5 px-4 pt-3 pb-4">
              <div className="h-2 w-full rounded bg-foreground/8" />
              <div className="h-2 w-[91%] rounded bg-foreground/8" />
              <div className="h-2 w-[83%] rounded bg-foreground/8" />
              {/* Visual break */}
              <div className="pt-1" />
              <div className="h-2 w-full rounded bg-foreground/8" />
              <div className="h-2 w-[88%] rounded bg-foreground/8" />
              <div className="h-2 w-[76%] rounded bg-foreground/8" />
            </div>

            {/* Ruled lines background */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-22 px-4 pb-4">
              <div className="h-full space-y-4 opacity-40">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-px w-full bg-primary/15" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating grade badge */}
      <div className="absolute right-[10%] top-[12%] flex items-center gap-1.5 rounded-lg border border-border bg-card/90 px-2.5 py-1.5 shadow-sm backdrop-blur-sm sm:right-[8%]">
        <div className="h-2 w-2 rounded-full bg-primary/70" />
        <span className="font-heading text-xs font-semibold text-primary">10</span>
        <div className="h-2.5 w-px bg-border" />
        <div className="h-1.5 w-8 rounded bg-muted-foreground/30" />
      </div>

      {/* Floating subject pill */}
      <div className="absolute bottom-[14%] left-[7%] rounded-full border border-border bg-card/90 px-3 py-1 shadow-sm backdrop-blur-sm">
        <div className="h-1.5 w-16 rounded bg-muted-foreground/25" />
      </div>
    </div>
  );
}
