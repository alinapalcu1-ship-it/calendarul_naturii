import { useLanguage } from "../i18n/LanguageContext";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { useEffect, useRef } from "react";
import { Face } from "./Icon";
import { emotions } from "../utils/data";
import type { Child } from "../types";

export function ChildEmotionPicker({
  child,
  value,
  onSelect,
  onClose,
}: {
  child: Child;
  value?: string;
  onSelect: (emotion: string) => void;
  onClose: () => void;
}) {
  const { t, labelFor } = useLanguage();
  const { playWord } = useAudioPlayer();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    return () => {
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="child-emotion-dialog"
      aria-labelledby="child-emotion-title"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <h2 id="child-emotion-title">{t("Cum se simte {name}?", { name: child.name })}</h2>
      <div className="child-emotion-options">
        {emotions.map((emotion) => (
          <button
            key={emotion}
            aria-pressed={emotion === value}
            onClick={() => {
              onSelect(emotion);
              playWord(emotion);
            }}
          >
            <Face emotion={emotion} size={76} />
            <span>{labelFor(emotion)}</span>
            {emotion === value && <span aria-hidden="true">✓</span>}
          </button>
        ))}
      </div>
      <div className="child-emotion-actions">
        <button onClick={() => onSelect("")}>{t("Fără emoție aleasă")}</button>
        <button autoFocus onClick={onClose}>{t("Închide")}</button>
      </div>
    </dialog>
  );
}
