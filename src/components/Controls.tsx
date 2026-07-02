import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useAppStore } from '../store/useStore'
import type { SelectionStyle, StageBg } from '../store/useStore'
import {
  setColor,
  setDecoration,
  setFontWeight,
  setItalic,
  setStroke,
  setTextShadow
} from '../editor/styleCommands'
import { toHexInput } from '../utils/color'
import { useT } from '../i18n'
import { FontPicker } from './FontPicker'
import { ColorField, Row, Seg, Section, Slider, Switch, ToggleBtn } from './ui'

export function Controls() {
  const [editor] = useLexicalComposerContext()
  const t = useT()
  const s = useAppStore((st) => st.selection)
  const b = useAppStore((st) => st.block)
  const stage = useAppStore((st) => st.stage)
  const base = useAppStore((st) => st.base)
  const setSelection = useAppStore((st) => st.setSelection)
  const setBlock = useAppStore((st) => st.setBlock)
  const setStage = useAppStore((st) => st.setStage)

  const cf = { presetsLabel: t('color.presets'), customLabel: t('color.customColor') }

  function updateShadow(patch: Partial<SelectionStyle>) {
    const next = { ...s, ...patch }
    setSelection(patch)
    setTextShadow(editor, next)
  }

  return (
    <div className="controls">
      {/* ---------- CANVAS (preview) ---------- */}
      <Section title={t('section.canvas')}>
        <Row label={t('canvas.background')}>
          <Seg<StageBg>
            options={[
              { value: 'checker', label: '▚', title: t('canvas.transparent') },
              { value: 'dark', label: '●', title: t('canvas.dark') },
              { value: 'light', label: '○', title: t('canvas.light') },
              { value: 'custom', label: '🎨', title: t('canvas.custom') }
            ]}
            value={stage.bg}
            onChange={(v) => setStage({ bg: v })}
          />
          {stage.bg === 'custom' && (
            <ColorField value={stage.color} onChange={(v) => setStage({ color: v })} {...cf} />
          )}
        </Row>
        <div className="hint">{t('canvas.note')}</div>
      </Section>

      {/* ---------- TEXT ---------- */}
      <Section title={t('section.text')}>
        <Row label={t('text.font')}>
          <FontPicker />
        </Row>
        <Row label={t('text.weight')}>
          <Slider
            value={s.fontWeight}
            min={100}
            max={900}
            step={100}
            onChange={(v) => {
              setFontWeight(editor, v)
              setSelection({ fontWeight: v })
            }}
          />
        </Row>
        <Row label={t('text.style')}>
          <span className="btn-group">
            <ToggleBtn
              active={s.fontWeight >= 600}
              title="Bold"
              onClick={() => {
                const w = s.fontWeight >= 600 ? 400 : 700
                setFontWeight(editor, w)
                setSelection({ fontWeight: w })
              }}
            >
              <b>B</b>
            </ToggleBtn>
            <ToggleBtn
              active={s.italic}
              title="Italic"
              onClick={() => {
                setItalic(editor, !s.italic)
                setSelection({ italic: !s.italic })
              }}
            >
              <i>I</i>
            </ToggleBtn>
            <ToggleBtn
              active={s.underline}
              title="Underline"
              onClick={() => {
                const v = !s.underline
                setDecoration(editor, v, s.strike)
                setSelection({ underline: v })
              }}
            >
              <u>U</u>
            </ToggleBtn>
            <ToggleBtn
              active={s.strike}
              title="Strikethrough"
              onClick={() => {
                const v = !s.strike
                setDecoration(editor, s.underline, v)
                setSelection({ strike: v })
              }}
            >
              <s>S</s>
            </ToggleBtn>
          </span>
        </Row>
      </Section>

      {/* ---------- COLOR & FILL ---------- */}
      <Section title={t('section.colorFill')}>
        <Row label={t('color.text')}>
          <ColorField
            value={toHexInput(s.color, base.color)}
            onChange={(v) => {
              setColor(editor, v)
              setSelection({ color: v })
            }}
            {...cf}
          />
        </Row>
        <Row label={t('color.gradient')}>
          <Switch checked={b.gradientEnabled} onChange={(v) => setBlock({ gradientEnabled: v })} />
        </Row>
        {b.gradientEnabled && (
          <>
            <div className="hint">{t('color.gradientHint')}</div>
            <Row label={t('color.fromTo')}>
              <span className="btn-group">
                <ColorField value={b.gradientFrom} onChange={(v) => setBlock({ gradientFrom: v })} {...cf} />
                <ColorField value={b.gradientTo} onChange={(v) => setBlock({ gradientTo: v })} {...cf} />
              </span>
            </Row>
            <Row label={t('color.angle')}>
              <Slider
                value={b.gradientAngle}
                min={0}
                max={360}
                suffix="°"
                onChange={(v) => setBlock({ gradientAngle: v })}
              />
            </Row>
          </>
        )}
      </Section>

      {/* ---------- OUTLINE ---------- */}
      <Section title={t('section.outline')}>
        <Row label={t('outline.width')}>
          <Slider
            value={s.strokeWidth}
            min={0}
            max={20}
            step={0.5}
            suffix="px"
            onChange={(v) => {
              setStroke(editor, v, s.strokeColor)
              setSelection({ strokeWidth: v })
            }}
          />
        </Row>
        <Row label={t('outline.color')}>
          <ColorField
            value={toHexInput(s.strokeColor, '#000000')}
            onChange={(v) => {
              setStroke(editor, s.strokeWidth, v)
              setSelection({ strokeColor: v })
            }}
            {...cf}
          />
        </Row>
      </Section>

      {/* ---------- TEXT SHADOW ---------- */}
      <Section
        title={t('section.textShadow')}
        action={<Switch checked={s.shadowEnabled} onChange={(v) => updateShadow({ shadowEnabled: v })} />}
      >
        {s.shadowEnabled && (
          <>
            <Row label={t('shadow.color')}>
              <ColorField value={s.shadowColor} onChange={(v) => updateShadow({ shadowColor: v })} {...cf} />
            </Row>
            <Row label={t('shadow.opacity')}>
              <Slider value={s.shadowAlpha} min={0} max={1} step={0.05} onChange={(v) => updateShadow({ shadowAlpha: v })} />
            </Row>
            <Row label={t('shadow.blur')}>
              <Slider value={s.shadowBlur} min={0} max={40} suffix="px" onChange={(v) => updateShadow({ shadowBlur: v })} />
            </Row>
            <Row label={t('shadow.offsetX')}>
              <Slider value={s.shadowX} min={-40} max={40} suffix="px" onChange={(v) => updateShadow({ shadowX: v })} />
            </Row>
            <Row label={t('shadow.offsetY')}>
              <Slider value={s.shadowY} min={-40} max={40} suffix="px" onChange={(v) => updateShadow({ shadowY: v })} />
            </Row>
          </>
        )}
      </Section>

      {/* ---------- BACKGROUND BOX ---------- */}
      <Section
        title={t('section.box')}
        action={<Switch checked={b.boxEnabled} onChange={(v) => setBlock({ boxEnabled: v })} />}
      >
        {b.boxEnabled && (
          <>
            <Row label={t('box.color')}>
              <ColorField value={b.boxColor} onChange={(v) => setBlock({ boxColor: v })} {...cf} />
            </Row>
            <Row label={t('box.opacity')}>
              <Slider value={b.boxAlpha} min={0} max={1} step={0.05} onChange={(v) => setBlock({ boxAlpha: v })} />
            </Row>
            <Row label={t('box.padding')}>
              <Slider value={b.boxPadding} min={0} max={120} suffix="px" onChange={(v) => setBlock({ boxPadding: v })} />
            </Row>
            <Row label={t('box.radius')}>
              <Slider value={b.boxRadius} min={0} max={120} suffix="px" onChange={(v) => setBlock({ boxRadius: v })} />
            </Row>
            <Row label={t('box.border')}>
              <span className="btn-group">
                <Slider value={b.borderWidth} min={0} max={20} suffix="px" onChange={(v) => setBlock({ borderWidth: v })} />
                <ColorField value={b.borderColor} onChange={(v) => setBlock({ borderColor: v })} {...cf} />
              </span>
            </Row>
          </>
        )}
      </Section>

      {/* ---------- DROP / LAYER SHADOW ---------- */}
      <Section
        title={t('section.dropShadow')}
        action={<Switch checked={b.dropEnabled} onChange={(v) => setBlock({ dropEnabled: v })} />}
      >
        {b.dropEnabled && (
          <>
            <Row label={t('shadow.color')}>
              <ColorField value={b.dropColor} onChange={(v) => setBlock({ dropColor: v })} {...cf} />
            </Row>
            <Row label={t('shadow.opacity')}>
              <Slider value={b.dropAlpha} min={0} max={1} step={0.05} onChange={(v) => setBlock({ dropAlpha: v })} />
            </Row>
            <Row label={t('shadow.blur')}>
              <Slider value={b.dropBlur} min={0} max={60} suffix="px" onChange={(v) => setBlock({ dropBlur: v })} />
            </Row>
            <Row label={t('shadow.offsetX')}>
              <Slider value={b.dropX} min={-60} max={60} suffix="px" onChange={(v) => setBlock({ dropX: v })} />
            </Row>
            <Row label={t('shadow.offsetY')}>
              <Slider value={b.dropY} min={-60} max={60} suffix="px" onChange={(v) => setBlock({ dropY: v })} />
            </Row>
          </>
        )}
      </Section>

      {/* ---------- LAYOUT ---------- */}
      <Section title={t('section.layout')}>
        <Row label={t('layout.align')}>
          <Seg
            options={[
              { value: 'start', label: '⇤', title: 'Start' },
              { value: 'center', label: '↔', title: 'Center' },
              { value: 'end', label: '⇥', title: 'End' },
              { value: 'justify', label: '☰', title: 'Justify' }
            ]}
            value={b.textAlign}
            onChange={(v) => setBlock({ textAlign: v })}
          />
        </Row>
        <Row label={t('layout.direction')}>
          <Seg
            options={[
              { value: 'auto', label: t('dir.auto') },
              { value: 'rtl', label: t('dir.rtl') },
              { value: 'ltr', label: t('dir.ltr') }
            ]}
            value={b.direction}
            onChange={(v) => setBlock({ direction: v })}
          />
        </Row>
        <Row label={t('layout.lineHeight')}>
          <Slider value={b.lineHeight} min={0.8} max={2.5} step={0.05} onChange={(v) => setBlock({ lineHeight: v })} />
        </Row>
        <Row label={t('layout.letterSpacing')}>
          <Slider value={b.letterSpacing} min={-10} max={40} step={0.5} suffix="px" onChange={(v) => setBlock({ letterSpacing: v })} />
        </Row>
      </Section>
    </div>
  )
}
