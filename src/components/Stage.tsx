import type { CSSProperties, RefObject } from 'react'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useAppStore } from '../store/useStore'
import { hexToRgba } from '../utils/color'
import { useT } from '../i18n'
import { SelectionStatePlugin } from '../editor/SelectionStatePlugin'
import { setFontSize } from '../editor/styleCommands'
import { VerticalSlider } from './ui'

const SOLID: Record<string, string> = { dark: '#0b0b0f', light: '#e9e9ee' }

export function Stage({ captureRef }: { captureRef: RefObject<HTMLDivElement | null> }) {
  const block = useAppStore((s) => s.block)
  const base = useAppStore((s) => s.base)
  const stage = useAppStore((s) => s.stage)
  const [editor] = useLexicalComposerContext()
  const selection = useAppStore((s) => s.selection)
  const setSelection = useAppStore((s) => s.setSelection)
  const t = useT()

  const bgColor =
    stage.bg === 'custom' ? stage.color : stage.bg === 'checker' ? undefined : SOLID[stage.bg]

  const boxStyle: CSSProperties = {
    background: block.boxEnabled ? hexToRgba(block.boxColor, block.boxAlpha) : 'transparent',
    padding: block.boxEnabled ? block.boxPadding : 0,
    borderRadius: block.boxRadius,
    border:
      block.boxEnabled && block.borderWidth > 0
        ? `${block.borderWidth}px solid ${block.borderColor}`
        : undefined,
    filter: block.dropEnabled
      ? `drop-shadow(${block.dropX}px ${block.dropY}px ${block.dropBlur}px ${hexToRgba(
          block.dropColor,
          block.dropAlpha
        )})`
      : undefined
  }

  const editableStyle: CSSProperties = {
    fontFamily: `'${base.fontFamily}', 'Vazirmatn', sans-serif`,
    fontSize: base.fontSize,
    color: base.color,
    lineHeight: block.lineHeight,
    letterSpacing: block.letterSpacing,
    textAlign: block.textAlign,
    ...(block.gradientEnabled
      ? {
          backgroundImage: `linear-gradient(${block.gradientAngle}deg, ${block.gradientFrom}, ${block.gradientTo})`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent'
        }
      : {})
  }

  const dirClass =
    block.direction === 'rtl' ? 'dir-rtl' : block.direction === 'ltr' ? 'dir-ltr' : 'dir-auto'

  return (
    <div className="stage">
      <div className="stage-scroll">
        <div
          className={stage.bg === 'checker' ? 'stage-bg checker' : 'stage-bg'}
          style={bgColor ? { backgroundColor: bgColor } : undefined}
          aria-hidden="true"
        />
        <div className="capture" ref={captureRef}>
          <div className="text-box" style={boxStyle}>
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className={`editable ${dirClass}${block.gradientEnabled ? ' has-gradient' : ''}`}
                  style={editableStyle}
                  aria-label="Story text"
                />
              }
              placeholder={<div className="editable-placeholder">{t('placeholder')}</div>}
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
        </div>
      </div>
      <HistoryPlugin />
      <SelectionStatePlugin />
      <VerticalSlider
        value={selection.fontSize}
        min={3}
        max={280}
        suffix="px"
        onChange={(v) => {
          setFontSize(editor, v)
          setSelection({ fontSize: v })
        }}
      />
    </div>
  )
}
