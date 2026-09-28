import { useLanguage } from "../i18n/LanguageContext";
import { useRef, useState } from "react";
import type { PageProps, Child, State } from "../types";
import { Avatar } from "../components/Controls";
import { Icon } from "../components/Icon";
import { routines } from "../utils/data";
import { resizePhoto } from "../utils/photos";
import {
  configurationBackup,
  readConfigurationFile,
} from "../utils/classroomStorage";

export default function TeacherSettings({
  state,
  update,
  reset,
  startNewDay,
}: PageProps & { reset: () => void; startNewDay: () => void }) {
  const { t, labelFor } = useLanguage();
  const [unlocked, setUnlocked] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [pendingImport, setPendingImport] = useState<State | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState<number | null>(null);
  const latest = useRef(state);
  latest.current = state;
  const editChild = (id: number, patch: Partial<Child>) =>
    update({
      children: latest.current.children.map((c) =>
        c.id === id ? { ...c, ...patch } : c,
      ),
    });
  const titles: Record<string, string> = {
    unlock: "Deschidem setările educatoarei?",
    all: "Ștergem toate datele?",
    day: "Începem o zi nouă?",
    presence: "Resetăm prezența?",
    import: "Înlocuim configurația grupei?",
  };
  const descriptions: Record<string, string> = {
    unlock:
      "Această zonă este pentru educatoare. Continuarea permite modificarea numelor, fotografiilor și configurației grupei.",
    all: "Numele, fotografiile și toate alegerile vor fi șterse din aplicație. Exportă mai întâi configurația dacă vrei să o păstrezi.",
    day: "Prezența, emoțiile, vremea, temperatura, anotimpul, hainele și selecțiile zilei se resetează. Numele, fotografiile, aniversările și setările grupei rămân salvate.",
    presence:
      "Toți copiii vor fi marcați absenți și responsabilul va fi șters.",
    import: t("Configurația curentă va fi înlocuită cu grupa „{group}”, cu {count} copii cu nume. Alegerile zilnice se resetează. Exportă configurația actuală înainte dacă vrei să o păstrezi.", { group: pendingImport?.group || t("Fără nume"), count: pendingImport?.children.filter(c => c.name).length ?? 0 }),
  };
  return (
    <div className="settings-layout">
      <section className="settings-panel settings-access">
        <h2>{t("Configurarea grupei")}</h2>
        <p className="muted">
          {t(unlocked
            ? "Modificările se salvează automat pe acest dispozitiv. Blochează setările înainte să revii la copii."
            : "Setările sunt blocate pentru a evita modificările accidentale prin atingere.")}
        </p>
        <button
          className="secondary"
          disabled={busy !== null}
          onClick={() => (unlocked ? setUnlocked(false) : setConfirm("unlock"))}
        >
          {t(unlocked ? "Blochează setările" : "Deblochează setările")}
        </button>
        {notice && <p role="status">{t(notice)}</p>}
        {error && (
          <p role="alert" className="error">
            {t(error)}
          </p>
        )}
      </section>
      <fieldset
        className="settings-fields"
        disabled={!unlocked || busy !== null}
      >
        <section className="settings-panel">
          <h2>{t("Grupa noastră")}</h2>
          <label>{t("Numele grupei")}<input
              maxLength={70}
              value={state.group}
              onChange={(e) => update({ group: e.target.value })}
            />
          </label>
          <label>{t("Mesajul dimineții")}<textarea
              maxLength={240}
              value={state.message}
              placeholder={t("Astăzi descoperim familia.")}
              onChange={(e) => update({ message: e.target.value })}
            />
          </label>
          <p className="muted">{t("Lasă mesajul gol pentru a-l ascunde de pe ecranul principal.")}</p>
          <h2>{t("Programul zilei")}</h2>
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
                {labelFor(a)}
                <span>{t(state.activities.includes(a) ? "✓" : "—")}</span>
              </button>
            ))}
          </div>
          <h2>{t("O nouă zi")}</h2>
          <p className="muted">{t("La schimbarea zilei, prezența și alegerile zilnice se resetează automat. Grupa, fotografiile, aniversările, mesajul și programul se păstrează.")}</p>
          <button className="primary" onClick={() => setConfirm("day")}>{t("Începe o zi nouă")}</button>
          <button className="secondary" onClick={() => setConfirm("presence")}>{t("Resetează prezența")}</button>
          <button className="danger" onClick={() => setConfirm("all")}>{t("Resetează complet aplicația")}</button>
          <h2>{t("Backup și restaurare")}</h2>
          <p className="muted">{t("Backupul include numele, fotografiile, aniversările, mesajul și programul grupei. Păstrează fișierul într-un loc privat. Alegerile zilnice nu sunt incluse.")}</p>
          <button
            className="secondary"
            onClick={() => {
              const url = URL.createObjectURL(
                new Blob([configurationBackup(state)], {
                  type: "application/json",
                }),
              );
              const link = document.createElement("a");
              link.href = url;
              link.download = "configuratie-calendarul-naturii.json";
              link.click();
              window.setTimeout(() => URL.revokeObjectURL(url), 1000);
              setNotice(
                "Configurația a fost exportată, inclusiv fotografiile.",
              );
            }}
          >{t("Exportă configurația")}</button>
          <label className="upload backup-import">{t("Importă configurația")}<input
              type="file"
              accept=".json,application/json"
              aria-label={t("Importă configurația")}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                setError("");
                setNotice("");
                setBusy(-1);
                try {
                  const imported = await readConfigurationFile(file);
                  setPendingImport(imported);
                  setConfirm("import");
                } catch (err) {
                  setError(
                    err instanceof Error
                      ? err.message
                      : "Importul nu a reușit. Datele existente au fost păstrate.",
                  );
                } finally {
                  setBusy(null);
                }
              }}
            />
          </label>
          <p className="privacy">
            <Icon name="heart" size={25} />{t("Datele sunt păstrate doar pe acest dispozitiv și nu sunt transmise către un server.")}</p>
          <p className="muted">{t("Fotografiile sunt micșorate local și salvate în IndexedDB. Setările mici rămân în localStorage. Ștergerea datelor browserului elimină configurația; păstrează un backup.")}</p>
        </section>
        <section className="settings-panel">
          <h2>{t("Copiii grupei")}<span className="badge">{state.children.length}</span>
          </h2>
          <p className="muted">{t("Editează numele, fotografia și data aniversării. Modificările se salvează automat.")}</p>
          <div className="child-edit-list">
            {state.children.map((c) => (
              <div className="child-editor" key={c.id}>
                <Avatar child={c} size={64} />
                <div className="child-fields">
                  <label>{t("Nume")}<input
                      aria-label={t("Nume copil {id}", { id: c.id })}
                      maxLength={45}
                      placeholder={t("Loc disponibil")}
                      value={c.name}
                      onChange={(e) =>
                        editChild(c.id, { name: e.target.value })
                      }
                    />
                  </label>
                  <label>{t("Aniversare")}<input
                      type="date"
                      aria-label={t("Aniversare copil {id}", { id: c.id })}
                      value={c.birthday}
                      onChange={(e) =>
                        editChild(c.id, { birthday: e.target.value })
                      }
                    />
                  </label>
                  <label className="upload">
                    {t(busy === c.id ? "Se pregătește…" : "Alege fotografie")}
                    <input
                      aria-label={t("Fotografie copil {id}", { id: c.id })}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
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
                      onClick={() => setConfirm(`photo:${c.id}`)}
                    >{t("Elimină fotografia")}</button>
                  )}
                  {(c.name || c.photo || c.birthday) && (
                    <button
                      className="remove-photo"
                      onClick={() => setConfirm(`child:${c.id}`)}
                    >{t("Elimină copilul")}</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </fieldset>
      {confirm && (
        <div className="modal-backdrop">
          <section
            className="dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-description"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setConfirm("");
                setPendingImport(null);
              }
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
              {t(titles[confirm] ||
                (confirm.startsWith("photo:")
                  ? "Eliminăm fotografia?"
                  : "Eliminăm datele copilului?"))}
            </h2>
            <p id="confirm-description">
              {t(descriptions[confirm] ||
                (confirm.startsWith("photo:")
                  ? "Fotografia va fi eliminată. Numele și aniversarea se păstrează."
                  : "Numele, fotografia și aniversarea vor fi șterse. Locul rămâne disponibil pentru alt copil."))}
            </p>
            <button
              autoFocus
              className="secondary"
              onClick={() => {
                setConfirm("");
                setPendingImport(null);
              }}
            >{t("Anulează")}</button>
            <button
              className="danger"
              onClick={() => {
                if (confirm === "all") reset();
                else if (confirm === "day") startNewDay();
                else if (confirm === "unlock") setUnlocked(true);
                else if (confirm === "import" && pendingImport) {
                  update(pendingImport);
                  setPendingImport(null);
                  setNotice(
                    "Configurația importată este pregătită pentru o zi nouă.",
                  );
                } else if (confirm.startsWith("photo:"))
                  editChild(Number(confirm.split(":")[1]), {
                    photo: undefined,
                  });
                else if (confirm.startsWith("child:")) {
                  const id = Number(confirm.split(":")[1]);
                  update({
                    children: state.children.map((c) =>
                      c.id === id ? { id, name: "", birthday: "" } : c,
                    ),
                    present: state.present.filter((n) => n !== id),
                    helper: state.helper === id ? null : state.helper,
                    childEmotions: Object.fromEntries(
                      Object.entries(state.childEmotions).filter(
                        ([key]) => Number(key) !== id,
                      ),
                    ),
                  });
                } else update({ present: [], helper: null });
                setConfirm("");
              }}
            >
              {t(confirm === "unlock"
                ? "Sunt educatoare, continuă"
                : confirm === "all"
                  ? "Da, șterge tot"
                  : confirm === "import"
                    ? "Da, înlocuiește configurația"
                    : confirm.includes(":")
                      ? "Da, elimină"
                      : "Da, resetează")}
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
