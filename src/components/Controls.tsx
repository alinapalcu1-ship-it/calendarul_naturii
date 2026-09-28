import { useLanguage } from "../i18n/LanguageContext";
import { isConfiguredChild } from "../utils/data";
import type { ReactNode } from "react";
import { Icon, Face } from "./Icon";
import { StoryArt } from "./StoryArt";
import type { Child } from "../types";
export function Choice({
  label,
  selected,
  onClick,
  children,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  children?: ReactNode;
}) {
  const { labelFor } = useLanguage();
  return (
    <button
      className={`choice ${selected ? "selected" : ""}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {selected && (
        <span className="check">
          <Icon name="check" size={20} />
        </span>
      )}
      {children || <Icon name={label} size={64} />}
      <span>{labelFor(label)}</span>
    </button>
  );
}
export function Avatar({ child, size = 76 }: { child: Child; size?: number }) {
  return child.photo ? (
    <img
      className="avatar"
      width={size}
      height={size}
      src={child.photo}
      alt=""
    />
  ) : (
    <StoryArt name="avatar" size={size} className="child-placeholder" />
  );
}
export function ChildCard({
  child,
  selected,
  onClick,
  status = true,
  emotion,
  onEmotion,
}: {
  child: Child;
  selected: boolean;
  onClick: () => void;
  status?: boolean;
  emotion?: string;
  onEmotion?: () => void;
}) {
  const { t, labelFor } = useLanguage();
  const configured = isConfiguredChild(child);
  const card = (
    <button
      disabled={!configured}
      className={`child-card ${selected ? "selected" : ""}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      <Avatar child={child} />
      <strong>{(child.name.trim() || t("Loc disponibil"))}</strong>
      {status && configured && (
        <span className="child-status">
          {t(selected ? "✓ Prezent" : "Absent")}
        </span>
      )}
      {!status && selected && (
        <span className="child-status">{t("✓ Responsabil")}</span>
      )}
    </button>
  );
  if (!onEmotion || !configured) return card;
  return (
    <div className="attendance-child">
      {card}
      <button
        className="child-emotion-button"
        disabled={!selected}
        aria-label={t("Emoția pentru {name}", { name: child.name }) + (emotion && selected ? `: ${labelFor(emotion)}` : "")}
        onClick={() => {
          onEmotion();
        }}
      >
        {selected && emotion ? (
          <>
            <Face emotion={emotion} size={38} />
            <span>{labelFor(emotion)}</span>
          </>
        ) : (
          <span>{t(selected ? "Alege emoția" : "Absent")}</span>
        )}
      </button>
    </div>
  );
}
export function Notice({ children }: { children: ReactNode }) {
  return (
    <div className="notice" role="status">
      {children}
    </div>
  );
}
