import { useRef, useState } from "react";
import type { PageProps, Child } from "../types";
import { Avatar } from "../components/Controls";
import { Icon } from "../components/Icon";
import { routines } from "../utils/data";
import { resizePhoto } from "../utils/photos";
export default function TeacherSettings({
  state,
  update,
  reset,
}: { reset: () => void } & PageProps) {
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<number | null>(null);
  const latest = useRef(state);
  latest.current = state;
  const editChild = (id: number, patch: Partial<Child>) =>
    update({
      children: latest.current.children.map((c) =>
        c.id === id ? { ...c, ...patch } : c,
      ),
    });
  return (
    <div className="settings-layout">
      <section className="settings-panel">
        <h2>Grupa noastră</h2>
        <label>
          Numele grupei
          <input
            maxLength={70}
            value={state.group}
            onChange={(e) => update({ group: e.target.value })}
          />
        </label>
        <label>
          Mesajul dimineții
          <textarea
            maxLength={240}
            value={state.message}
            placeholder="Astăzi descoperim familia."
            onChange={(e) => update({ message: e.target.value })}
          />
        </label>
        <p className="muted">
          Lasă mesajul gol pentru a-l ascunde de pe ecranul principal.
        </p>
        <h2>Programul zilei</h2>
        <div className="routine-settings">
          {routines.map((a) => (
            <button
              key={a}
              aria-pressed={state.activities.includes(a)}
              className={state.activities.includes(a) ? "active" : ""}
              onClick={() =>
                update({
                  activities: routines.filter((r) =>
                    r === a
                      ? !state.activities.includes(a)
                      : state.activities.includes(r),
                  ),
                })
              }
            >
              <Icon name={a} size={32} />
              {a}
              <span>{state.activities.includes(a) ? "✓" : "—"}</span>
            </button>
          ))}
        </div>
        <h2>O nouă zi</h2>
        <p className="muted">
          La schimbarea zilei, prezența și alegerile zilnice se resetează
          automat. Grupa, fotografiile, programul și anotimpul se păstrează.
        </p>
        <button className="secondary" onClick={() => setConfirm("presence")}>
          Resetează prezența
        </button>
        <button className="danger" onClick={() => setConfirm("all")}>
          Resetează complet aplicația
        </button>
        <p className="privacy">
          <Icon name="heart" size={25} />
          Datele introduse în această aplicație sunt păstrate doar pe acest
          dispozitiv și nu sunt transmise către un server.
        </p>
        <p className="muted">
          Datele sunt legate de acest browser și de adresa aplicației. Ștergerea
          datelor browserului le elimină. Fotografiile sunt micșorate local
          înainte de salvare.
        </p>
      </section>
      <section className="settings-panel">
        <h2>
          Copiii grupei <span className="badge">{state.children.length}</span>
        </h2>
        <p className="muted">
          Editează numele, fotografia și data aniversării. Modificările se
          salvează automat.
        </p>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <div className="child-edit-list">
          {state.children.map((c) => (
            <div className="child-editor" key={c.id}>
              <Avatar child={c} size={64} />
              <div className="child-fields">
                <label>
                  Nume
                  <input
                    aria-label={`Nume copil ${c.id}`}
                    maxLength={45}
                    value={c.name}
                    onChange={(e) => editChild(c.id, { name: e.target.value })}
                  />
                </label>
                <label>
                  Aniversare
                  <input
                    type="date"
                    aria-label={`Aniversare copil ${c.id}`}
                    value={c.birthday}
                    onChange={(e) =>
                      editChild(c.id, { birthday: e.target.value })
                    }
                  />
                </label>
                <label className="upload">
                  {busy === c.id ? "Se pregătește…" : "Alege fotografie"}
                  <input
                    aria-label={`Fotografie copil ${c.id}`}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={busy !== null}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (!file) return;
                      setBusy(c.id);
                      setError("");
                      try {
                        editChild(c.id, { photo: await resizePhoto(file) });
                      } catch (err) {
                        setError(
                          err instanceof Error
                            ? err.message
                            : "Fotografia nu a putut fi încărcată.",
                        );
                      } finally {
                        setBusy(null);
                      }
                    }}
                  />
                </label>
                {c.photo && (
                  <button
                    className="remove-photo"
                    onClick={() => editChild(c.id, { photo: undefined })}
                  >
                    Elimină fotografia
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      {confirm && (
        <div className="modal-backdrop">
          <section
            className="dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            onKeyDown={(e) => {
              if (e.key === "Escape") setConfirm("");
              if (e.key === "Tab") {
                const buttons = Array.from(
                  e.currentTarget.querySelectorAll("button"),
                );
                const first = buttons[0],
                  last = buttons[buttons.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                  e.preventDefault();
                  last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                  e.preventDefault();
                  first.focus();
                }
              }
            }}
          >
            <h2 id="confirm-title">
              {confirm === "all"
                ? "Ștergem toate datele?"
                : "Resetăm prezența?"}
            </h2>
            <p>
              {confirm === "all"
                ? "Numele, fotografiile și toate alegerile vor fi șterse din aplicație. Această acțiune nu poate fi anulată."
                : "Toți copiii vor fi marcați absenți și responsabilul va fi șters."}
            </p>
            <button
              autoFocus
              className="secondary"
              onClick={() => setConfirm("")}
            >
              Anulează
            </button>
            <button
              className="danger"
              onClick={() => {
                if (confirm === "all") reset();
                else update({ present: [], helper: null });
                setConfirm("");
              }}
            >
              Da, {confirm === "all" ? "șterge tot" : "resetează"}
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
