import { useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useAppStore } from '../../store/useStore'
import { usePresets } from '../../hooks/usePresets'
import type { StylePreset } from '../../hooks/usePresets'
import {
  setColor,
  setDecoration,
  setFontFamily,
  setFontSize,
  setFontWeight,
  setItalic,
  setStroke,
  setTextShadow
} from '../../editor/styleCommands'
import { useT } from '../../i18n'

export function PresetsSection() {
  const [editor] = useLexicalComposerContext()
  const t = useT()
  const selection = useAppStore((s) => s.selection)
  const block = useAppStore((s) => s.block)
  const stage = useAppStore((s) => s.stage)
  const setSelection = useAppStore((s) => s.setSelection)
  const setBlock = useAppStore((s) => s.setBlock)
  const setStage = useAppStore((s) => s.setStage)
  const { presets, save, remove } = usePresets()
  const [name, setName] = useState('')

  function onSave() {
    const trimmed = name.trim()
    if (!trimmed) return
    save(trimmed, { selection, block, stage })
    setName('')
  }

  function apply(preset: StylePreset) {
    setFontFamily(editor, preset.selection.fontFamily)
    setFontSize(editor, preset.selection.fontSize)
    setFontWeight(editor, preset.selection.fontWeight)
    setItalic(editor, preset.selection.italic)
    setDecoration(editor, preset.selection.underline, preset.selection.strike)
    setColor(editor, preset.selection.color)
    setStroke(editor, preset.selection.strokeWidth, preset.selection.strokeColor)
    setTextShadow(editor, preset.selection)
    setSelection(preset.selection)
    setBlock(preset.block)
    setStage(preset.stage)
  }

  return (
    <>
      <div className="row">
        <input
          className="preset-name-input"
          placeholder={t('presets.namePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave()
          }}
        />
        <button type="button" className="btn" onClick={onSave} disabled={!name.trim()}>
          {t('presets.save')}
        </button>
      </div>
      {presets.length === 0 ? (
        <div className="hint">{t('presets.empty')}</div>
      ) : (
        <div className="preset-chips">
          {presets.map((p) => (
            <span key={p.id} className="preset-chip">
              <button type="button" className="preset-chip-name" onClick={() => apply(p)}>
                {p.name}
              </button>
              <button
                type="button"
                className="preset-chip-x"
                aria-label={t('presets.delete')}
                onClick={() => remove(p.id)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </>
  )
}
