import { childLabel, isConfiguredChild } from "../utils/data";
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
      <span>{label}</span>
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
  const configured = isConfiguredChild(child);
  const card = (
    <button
      disabled={!configured}
      className={`child-card ${selected ? "selected" : ""}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      <Avatar child={child} />
      <strong>{childLabel(child)}</strong>
      {status && configured && (
        <span className="child-status">
          {selected ? "✓ Prezent" : "Absent"}
        </span>
      )}
      {!status && selected && (
        <span className="child-status">✓ Responsabil</span>
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
        aria-label={`Emoția pentru ${childLabel(child)}${emotion && selected ? `: ${emotion}` : ""}`}
        onClick={() => {
          onEmotion();
        }}
      >
        {selected && emotion ? (
          <>
            <Face emotion={emotion} size={38} />
            <span>{emotion}</span>
          </>
        ) : (
          <span>{selected ? "Alege emoția" : "Absent"}</span>
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
