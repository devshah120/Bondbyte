"use client";

import { useState } from "react";
import { OBJECTS, fieldsOf } from "@/lib/cms/schema";
import type { ObjectKey } from "@/lib/cms/types";
import { api, ApiError } from "../api";
import { useCms, useContent, useDirtyGuard } from "../cms";
import { FormGroups, useForm } from "../fields";
import { SaveBar, ScreenHeader } from "../ui";

/** General settings, Header, Footer and Brand: one form each, saved as a whole. */
export function ObjectScreen({ objectKey }: { objectKey: ObjectKey }) {
  const content = useContent();
  const { setContent, notify, handleError } = useCms();
  const def = OBJECTS[objectKey];
  const form = useForm(content[objectKey] as unknown as Record<string, unknown>);
  const [base, setBase] = useState(content.revisions[objectKey] ?? 0);
  const [saving, setSaving] = useState(false);
  useDirtyGuard(`object:${objectKey}`, form.dirty);

  async function save() {
    const result = form.validate(fieldsOf(def.groups));
    if (!result.ok) {
      notify("Please check the highlighted fields.", "error");
      return;
    }
    setSaving(true);
    try {
      const next = await api.putObject(objectKey, form.draft, base);
      setContent(next);
      form.reset(next[objectKey] as unknown as Record<string, unknown>);
      setBase(next.revisions[objectKey] ?? 0);
      notify(`${def.title} saved.`);
    } catch (err) {
      if (err instanceof ApiError && err.errors) form.setErrors(err.errors);
      handleError(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <ScreenHeader title={def.title} description={def.description} />
      <FormGroups groups={def.groups} values={form.draft} errors={form.errors} onChange={form.update} idPrefix={objectKey} />
      <SaveBar dirty={form.dirty} saving={saving} onSave={save} onDiscard={form.discard} />
    </div>
  );
}
