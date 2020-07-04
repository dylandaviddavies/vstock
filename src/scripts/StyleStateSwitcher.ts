import { StyleState } from '@/types';

const vars = [
  "primary",
  "subtext",
  "primary-darker",
  "text",
  "text-darker",
  "box-border",
  "badge-bg",
  "body",
  "modal",
  "badge-bg-primary",
  "header-avatar-hover-effect",
  "chip-bg",
  "chip-bg-primary",
  "box-body"
];
export default function (state: StyleState) {
  if (state == null || state === StyleState.Default) {
    document.documentElement.removeAttribute("style");
    return;
  }

  vars.forEach(c =>
    document.documentElement.style.setProperty(
      `--color-${c}`,
      `var(--color-${c}-${StyleState[state].toLowerCase()})`
    )
  );
}