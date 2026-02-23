import React, { useCallback, useMemo, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Card } from "./ui";

export function FileDrop({ onPick }: { onPick: (file: File) => void }) {
  const [hover, setHover] = useState(false);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setHover(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onPick(f);
  }, [onPick]);

  const onInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onPick(f);
  }, [onPick]);

  const accept = useMemo(() => ".pdf,.dwg,.png,.jpg,.jpeg", []);
  return (
    <Card
      className={"p-4 transition " + (hover ? "border-sky-400/50" : "")}
      onDragOver={(e) => { e.preventDefault(); setHover(true); }}
      onDragLeave={() => setHover(false)}
      onDrop={onDrop}
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-sky-500/15 border border-sky-400/30 grid place-items-center">
          <UploadCloud className="h-5 w-5 text-sky-300" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">Upload or drop blueprint</div>
          <div className="text-xs text-slate-400 mt-1">
            For the demo, any file works — we’ll “extract” geometry and generate outputs.
          </div>
          <div className="mt-3">
            <label className="inline-flex cursor-pointer text-sm font-semibold rounded-xl bg-slate-800/60 hover:bg-slate-800 px-3 py-2 border border-slate-700/60">
              Choose file
              <input className="hidden" type="file" accept={accept} onChange={onInput} />
            </label>
          </div>
        </div>
      </div>
    </Card>
  );
}
