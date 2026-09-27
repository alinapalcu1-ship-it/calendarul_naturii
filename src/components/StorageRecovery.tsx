import { useEffect, useRef, useState } from "react";
import type { State } from "../types";
import { readConfigurationFile } from "../utils/classroomStorage";

export function StorageRecovery({
  onRestore,
}: {
  onRestore: (state: State) => void;
}) {
  const [pending, setPending] = useState<State | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (pending) dialog.current?.showModal();
  }, [pending]);
  return (
    <section className="settings-panel storage-recovery">
      <h2>Recuperează configurația grupei</h2>
      <p>
        Datele locale nu au putut fi încărcate și nu au fost suprascrise. Poți
        reîncerca încărcarea sau poți importa un backup salvat anterior.
      </p>
      <button
        className="secondary"
        disabled={busy}
        onClick={() => window.location.reload()}
      >
        Reîncearcă încărcarea
      </button>
      <label className="upload backup-import">
        {busy ? "Se verifică backupul…" : "Importă configurația"}
        <input
          type="file"
          accept=".json,application/json"
          aria-label="Importă configurația"
          disabled={busy}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            setBusy(true);
            setError("");
            try {
              setPending(await readConfigurationFile(file));
            } catch {
              setError(
                "Backupul nu este valid sau fotografiile nu pot fi citite. Datele existente au fost păstrate.",
              );
            } finally {
              setBusy(false);
            }
          }}
        />
      </label>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {pending && (
        <dialog
          ref={dialog}
          className="dialog recovery-dialog"
          aria-labelledby="recovery-title"
          aria-describedby="recovery-description"
          onCancel={() => setPending(null)}
        >
          <h2 id="recovery-title">Înlocuim configurația grupei?</h2>
          <p id="recovery-description">
            Backupul pentru grupa „{pending.group || "Fără nume"}” va înlocui
            configurația locală, inclusiv fotografiile. Alegerile zilnice vor fi
            resetate.
          </p>
          <button
            autoFocus
            className="secondary"
            onClick={() => setPending(null)}
          >
            Anulează
          </button>
          <button
            className="danger"
            onClick={() => {
              onRestore(pending);
              setPending(null);
            }}
          >
            Da, restaurează configurația
          </button>
        </dialog>
      )}
    </section>
  );
}
