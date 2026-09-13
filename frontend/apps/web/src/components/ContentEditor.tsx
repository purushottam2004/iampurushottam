import { useState } from 'react'

type ContentEditorProps = {
  value: string
  onSave: (next: string) => Promise<void>
  label?: string
  rows?: number
}

export function ContentEditor({ value, onSave, label = 'Edit', rows = 8 }: ContentEditorProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      await onSave(draft)
      setEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.')
    } finally {
      setSaving(false)
    }
  }

  if (!editing) {
    return (
      <p className="inline-actions">
        <button
          type="button"
          className="text-action"
          onClick={() => {
            setDraft(value)
            setEditing(true)
          }}
        >
          {label}
        </button>
      </p>
    )
  }

  return (
    <div>
      <label className="field">
        {label}
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={rows}
          spellCheck={false}
        />
      </label>
      <p className="quiet field-hint">HTML is rendered on the page.</p>
      {error && <p className="error">{error}</p>}
      <p className="inline-actions">
        <button type="button" className="text-action" onClick={() => void handleSave()} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          className="text-action"
          onClick={() => {
            setDraft(value)
            setEditing(false)
            setError(null)
          }}
        >
          Cancel
        </button>
      </p>
    </div>
  )
}
