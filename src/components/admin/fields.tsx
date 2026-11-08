"use client";

/* eslint-disable @next/next/no-img-element -- admin previews show arbitrary uploads at their natural size */

import { useCallback, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, ChevronUp, Copy, ImageIcon, Minus, Plus, Trash2, X } from "lucide-react";
import { defaultsFor, makeId, optionLabel, optionValue, validateFields, type Field, type Group, type Option } from "@/lib/cms/schema";
import { pagePath } from "@/lib/cms/content";
import { cn } from "@/lib/utils/cn";
import { useCms } from "./cms";
import { MediaPicker } from "./media";
import { btn, cardClass, iconBtn, inputClass, Switch } from "./ui";

type Values = Record<string, unknown>;

/* ── Form state ─────────────────────────────────────────────────────────── */

/** Draft values for a form, with errors and a dirty flag (compared with the last saved values). */
export function useForm<T extends Values>(initial: T) {
  const [saved, setSaved] = useState<T>(initial);
  const [draft, setDraft] = useState<T>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  const update = useCallback((key: string, value: unknown) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => (current[key] ? { ...current, [key]: "" } : current));
  }, []);

  /** Checks the draft against fields; shows errors and scrolls to the first one. */
  const validate = (fields: Field[]) => {
    const result = validateFields(fields, draft);
    setErrors(result.errors);
    if (!result.ok) {
      requestAnimationFrame(() => document.querySelector("[data-field-error]")?.scrollIntoView({ behavior: "smooth", block: "center" }));
    }
    return result;
  };

  const reset = (next: T) => {
    setSaved(next);
    setDraft(next);
    setErrors({});
  };

  const discard = () => {
    setDraft(saved);
    setErrors({});
  };

  return { draft, setDraft, saved, errors, setErrors, dirty, update, validate, reset, discard };
}

/* ── Layout ─────────────────────────────────────────────────────────────── */

const WIDE_TYPES = new Set(["textarea", "list", "lines", "group", "image", "checkbox"]);
const isWide = (field: Field) => field.full || WIDE_TYPES.has(field.type);

/** Renders schema groups as cards of fields. Fields hidden by `when` are left out. */
export function FormGroups({ groups, values, errors = {}, onChange, idPrefix }: { groups: Group[]; values: Values; errors?: Record<string, string>; onChange: (key: string, value: unknown) => void; idPrefix: string }) {
  return (
    <div className="space-y-5">
      {groups.map((group, index) => {
        const fields = group.fields.filter((field) => !field.when || field.when(values));
        if (fields.length === 0) return null;
        return (
          <section key={group.title ?? index} className={cardClass}>
            {group.title && <h2 className="text-base font-semibold tracking-tight text-fg">{group.title}</h2>}
            {group.description && <p className="mt-1 text-sm text-fg-muted">{group.description}</p>}
            <FieldGrid fields={fields} values={values} errors={errors} onChange={onChange} idPrefix={idPrefix} className={group.title || group.description ? "mt-5" : ""} />
          </section>
        );
      })}
    </div>
  );
}

export function FieldGrid({ fields, values, errors = {}, onChange, idPrefix, className }: { fields: Field[]; values: Values; errors?: Record<string, string>; onChange: (key: string, value: unknown) => void; idPrefix: string; className?: string }) {
  return (
    <div className={cn("grid gap-x-5 gap-y-5 sm:grid-cols-2", className)}>
      {fields
        .filter((field) => !field.when || field.when(values))
        .map((field) => (
          <div key={field.key} className={isWide(field) ? "sm:col-span-2" : ""}>
            <FieldInput field={field} value={values[field.key]} error={errors[field.key]} onChange={(value) => onChange(field.key, value)} idPrefix={idPrefix} />
          </div>
        ))}
    </div>
  );
}

/* ── One field ──────────────────────────────────────────────────────────── */

function useOptions(field: Field): Option[] {
  const { content } = useCms();
  if (field.options) return field.options;
  if (field.optionsFrom && content) return content.settings[field.optionsFrom];
  return [];
}

/** Suggestions for link fields: every page and detail page. */
function useLinkSuggestions(): string[] {
  const { content } = useCms();
  return useMemo(() => {
    if (!content) return [];
    return [
      ...content.pages.map(pagePath),
      ...content.projects.map((project) => `/work/${project.slug}`),
      ...content.insights.map((insight) => `/insights/${insight.slug}`),
      `mailto:${content.settings.email}`,
    ];
  }, [content]);
}

function Label({ field, htmlFor }: { field: Field; htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-fg">
      {field.label}
      {field.required && (
        <span className="text-red-600" aria-hidden>
          {" "}
          *
        </span>
      )}
    </label>
  );
}

function Help({ field, id }: { field: Field; id: string }) {
  if (!field.help) return null;
  return (
    <p id={id} className="mt-1.5 text-[0.8125rem] text-fg-subtle">
      {field.help}
    </p>
  );
}

function ErrorText({ error, id }: { error?: string; id: string }) {
  if (!error) return null;
  return (
    <p id={id} data-field-error className="mt-1.5 text-[0.8125rem] font-medium text-red-600">
      {error}
    </p>
  );
}

export function FieldInput({ field, value, error, onChange, idPrefix, disabled }: { field: Field; value: unknown; error?: string; onChange: (value: unknown) => void; idPrefix: string; disabled?: boolean }) {
  const id = `${idPrefix}-${field.key}`;
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;
  const a11y = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": [field.help ? helpId : "", error ? errorId : ""].filter(Boolean).join(" ") || undefined,
  };
  const options = useOptions(field);
  const suggestions = useLinkSuggestions();

  if (field.type === "checkbox") {
    return (
      <div>
        <Switch id={id} checked={Boolean(value)} onChange={onChange} label={field.label} disabled={disabled} />
        <Help field={field} id={helpId} />
        <ErrorText error={error} id={errorId} />
      </div>
    );
  }

  if (field.type === "list") return <ListField field={field} value={value} error={error} onChange={onChange} idPrefix={id} />;
  if (field.type === "group") {
    return (
      <div className="rounded-lg border border-line bg-bg/60 p-4">
        <FieldGrid fields={field.fields ?? []} values={(value as Values) ?? {}} onChange={(key, next) => onChange({ ...((value as Values) ?? {}), [key]: next })} idPrefix={id} />
        <ErrorText error={error} id={errorId} />
      </div>
    );
  }
  if (field.type === "image") return <ImageField field={field} value={String(value ?? "")} error={error} onChange={onChange} id={id} />;

  let control: React.ReactNode;
  switch (field.type) {
    case "textarea": {
      const text = String(value ?? "");
      control = (
        <>
          <textarea
            className={cn(inputClass, "min-h-[5.5rem] resize-y leading-relaxed")}
            rows={field.max && field.max > 1000 ? 7 : field.max && field.max > 300 ? 4 : 3}
            maxLength={field.max}
            placeholder={field.placeholder}
            value={text}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
            {...a11y}
          />
          {field.max && (
            <span className="mt-1 block text-right text-xs tabular-nums text-fg-subtle" aria-hidden>
              {text.length} / {field.max}
            </span>
          )}
        </>
      );
      break;
    }
    case "lines":
      control = <LinesInput value={value} onChange={onChange} a11y={a11y} placeholder={field.placeholder} disabled={disabled} />;
      break;
    case "select": {
      const current = String(value ?? "");
      const values = options.map(optionValue);
      control = (
        <select className={inputClass} value={current} disabled={disabled} onChange={(event) => onChange(event.target.value)} {...a11y}>
          {(!field.required || !current) && <option value="">{field.required ? "Choose…" : "Not specified"}</option>}
          {/* A value no longer in the option list stays selectable, so it is not lost silently. */}
          {current && !values.includes(current) && <option value={current}>{current}</option>}
          {options.map((option) => (
            <option key={optionValue(option)} value={optionValue(option)}>
              {optionLabel(option)}
            </option>
          ))}
        </select>
      );
      break;
    }
    case "number": {
      const number = Number(value) || 0;
      const min = field.min ?? 0;
      const max = field.max ?? Number.MAX_SAFE_INTEGER;
      const step = (delta: number) => onChange(Math.min(max, Math.max(min, number + delta)));
      control = (
        <div className="flex max-w-[16rem] items-stretch">
          <button type="button" className="rounded-l-lg border border-r-0 border-line-strong bg-surface-hi px-2.5 text-fg-muted hover:text-fg disabled:opacity-40" onClick={() => step(-1)} disabled={disabled || number <= min} aria-label={`${field.label}: one less`}>
            <Minus className="h-4 w-4" />
          </button>
          <input
            className={cn(inputClass, "rounded-none text-center tabular-nums")}
            type="number"
            inputMode="numeric"
            min={min}
            max={field.max}
            value={value === "" || value === undefined || value === null ? "" : String(value)}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value === "" ? "" : Number(event.target.value))}
            {...a11y}
          />
          <button type="button" className="rounded-r-lg border border-l-0 border-line-strong bg-surface-hi px-2.5 text-fg-muted hover:text-fg disabled:opacity-40" onClick={() => step(1)} disabled={disabled || number >= max} aria-label={`${field.label}: one more`}>
            <Plus className="h-4 w-4" />
          </button>
        </div>
      );
      break;
    }
    case "slug":
      control = (
        <input
          className={cn(inputClass, "font-mono text-sm")}
          maxLength={field.max}
          placeholder={field.placeholder ?? "my-page"}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          value={String(value ?? "")}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value.toLowerCase().replace(/\s+/g, "-"))}
          {...a11y}
        />
      );
      break;
    default:
      control = (
        <>
          <input
            className={inputClass}
            type={field.type === "email" ? "email" : field.type === "url" ? "url" : field.type === "date" ? "date" : "text"}
            maxLength={field.max}
            placeholder={field.placeholder}
            autoComplete="off"
            spellCheck={field.type === "text" ? undefined : false}
            list={field.type === "link" ? `${id}-list` : undefined}
            value={String(value ?? "")}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
            {...a11y}
          />
          {field.type === "link" && (
            <datalist id={`${id}-list`}>
              {suggestions.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          )}
        </>
      );
  }

  return (
    <div>
      <Label field={field} htmlFor={id} />
      {control}
      <Help field={field} id={helpId} />
      <ErrorText error={error} id={errorId} />
    </div>
  );
}

/* ── Lines: one text per row ────────────────────────────────────────────── */

function LinesInput({ value, onChange, a11y, placeholder, disabled }: { value: unknown; onChange: (value: string[]) => void; a11y: Record<string, unknown>; placeholder?: string; disabled?: boolean }) {
  const lines = useMemo(() => (Array.isArray(value) ? (value as string[]) : []), [value]);
  const joined = lines.join("\n");
  const [text, setText] = useState(joined);
  const [lastJoined, setLastJoined] = useState(joined);
  const clean = (raw: string) => raw.split("\n").map((line) => line.trim()).filter(Boolean);

  // A change from outside (Discard, a reload) replaces the text; typing keeps empty rows while editing.
  if (joined !== lastJoined) {
    setLastJoined(joined);
    if (clean(text).join("\n") !== joined) setText(joined);
  }

  return (
    <>
      <textarea
        className={cn(inputClass, "resize-y leading-relaxed")}
        rows={Math.min(12, Math.max(3, lines.length + 1))}
        placeholder={placeholder ?? "One per line"}
        value={text}
        disabled={disabled}
        onChange={(event) => {
          setText(event.target.value);
          const next = clean(event.target.value);
          setLastJoined(next.join("\n"));
          onChange(next);
        }}
        {...a11y}
      />
      <span className="mt-1 block text-xs text-fg-subtle">One per line.</span>
    </>
  );
}

/* ── Lists of items ─────────────────────────────────────────────────────── */

function ListField({ field, value, error, onChange, idPrefix }: { field: Field; value: unknown; error?: string; onChange: (value: unknown) => void; idPrefix: string }) {
  const items = useMemo(() => (Array.isArray(value) ? (value as (Values & { id: string })[]) : []), [value]);
  const [open, setOpen] = useState<Set<string>>(() => new Set(items.length <= 3 ? items.map((item) => item.id) : []));
  const itemLabel = field.itemLabel ?? "item";

  const title = (item: Values, index: number) => {
    const text = field.labelKey ? String(item[field.labelKey] ?? "").trim() : "";
    const short = text.length > 80 ? `${text.slice(0, 79)}…` : text;
    return short || `${itemLabel[0].toUpperCase()}${itemLabel.slice(1)} ${index + 1}`;
  };
  const toggle = (id: string) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const update = (index: number, key: string, next: unknown) => onChange(items.map((item, i) => (i === index ? { ...item, [key]: next } : item)));
  const move = (index: number, delta: number) => {
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    onChange(next);
  };
  const insert = (item: Values & { id: string }, at: number) => {
    const next = [...items];
    next.splice(at, 0, item);
    onChange(next);
    setOpen((current) => new Set([...current, item.id]));
  };
  const add = () => insert({ id: makeId(), ...defaultsFor(field.fields ?? []) }, items.length);
  const duplicate = (index: number) => insert({ ...structuredClone(items[index]), id: makeId() }, index + 1);
  const full = field.maxItems !== undefined && items.length >= field.maxItems;

  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium text-fg">
        {field.label}
        {field.required && <span className="text-red-600"> *</span>}
      </legend>
      {field.help && <p className="mb-2 text-[0.8125rem] text-fg-subtle">{field.help}</p>}
      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line-strong px-4 py-3 text-sm text-fg-subtle">Nothing added yet.</p>
      ) : (
        <ol className="space-y-2">
          {items.map((item, index) => {
            const expanded = open.has(item.id);
            const label = title(item, index);
            return (
              <li key={item.id} className={cn("rounded-lg border border-line bg-surface", expanded && "border-line-strong")}>
                <div className="flex items-center gap-1 pr-1.5">
                  <button type="button" className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-fg" aria-expanded={expanded} onClick={() => toggle(item.id)}>
                    <ChevronRight className={cn("h-4 w-4 shrink-0 text-fg-subtle transition-transform", expanded && "rotate-90")} />
                    <span className="truncate">{label}</span>
                  </button>
                  <button type="button" className={iconBtn} onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move "${label}" up`}>
                    <ChevronUp />
                  </button>
                  <button type="button" className={iconBtn} onClick={() => move(index, 1)} disabled={index === items.length - 1} aria-label={`Move "${label}" down`}>
                    <ChevronDown />
                  </button>
                  <button type="button" className={iconBtn} onClick={() => duplicate(index)} disabled={full} aria-label={`Copy "${label}"`} title="Copy">
                    <Copy />
                  </button>
                  <button type="button" className={cn(iconBtn, "hover:bg-red-50 hover:text-red-600")} onClick={() => onChange(items.filter((_, i) => i !== index))} aria-label={`Remove "${label}"`} title="Remove">
                    <Trash2 />
                  </button>
                </div>
                {expanded && (
                  <div className="border-t border-line px-3 py-4">
                    <FieldGrid fields={field.fields ?? []} values={item} onChange={(key, next) => update(index, key, next)} idPrefix={`${idPrefix}-${item.id}`} />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
      <button type="button" className={cn(btn.outline, btn.sm, "mt-2.5")} onClick={add} disabled={full}>
        <Plus /> Add {itemLabel}
      </button>
      {error && (
        <p data-field-error className="mt-1.5 text-[0.8125rem] font-medium text-red-600">
          {error}
        </p>
      )}
    </fieldset>
  );
}

/* ── Images ─────────────────────────────────────────────────────────────── */

function ImageField({ field, value, error, onChange, id }: { field: Field; value: string; error?: string; onChange: (value: string) => void; id: string }) {
  const [picking, setPicking] = useState(false);
  // Remembers which address failed to load, so a new address gets a fresh try.
  const [brokenSrc, setBrokenSrc] = useState("");
  const broken = brokenSrc === value;
  const setBroken = () => setBrokenSrc(value);

  return (
    <div>
      <Label field={field} htmlFor={id} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-[repeating-conic-gradient(#eef2fb_0%_25%,#fff_0%_50%)] bg-[length:16px_16px]">
          {value && !broken ? <img src={value} alt="" className="max-h-full max-w-full object-contain" onError={setBroken} /> : <ImageIcon className="h-6 w-6 text-fg-subtle" />}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            id={id}
            className={cn(inputClass, "font-mono text-sm")}
            placeholder="/uploads/… or https://…"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-invalid={error ? true : undefined}
            spellCheck={false}
          />
          <div className="flex flex-wrap gap-2">
            <button type="button" className={cn(btn.outline, btn.sm)} onClick={() => setPicking(true)}>
              <ImageIcon /> Choose from media
            </button>
            {value && (
              <button type="button" className={cn(btn.ghost, btn.sm)} onClick={() => onChange("")}>
                <X /> Remove
              </button>
            )}
          </div>
        </div>
      </div>
      <Help field={field} id={`${id}-help`} />
      <ErrorText error={error} id={`${id}-error`} />
      {picking && (
        <MediaPicker
          current={value}
          onClose={() => setPicking(false)}
          onPick={(url) => {
            onChange(url);
            setPicking(false);
          }}
        />
      )}
    </div>
  );
}
