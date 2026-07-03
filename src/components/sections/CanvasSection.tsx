import { Checkerboard, Moon, Sun, Palette } from '@phosphor-icons/react'
import { useAppStore } from '../../store/useStore'
import type { StageBg } from '../../store/useStore'
import { useT } from '../../i18n'
import { ColorField, Row, Seg } from '../ui'

const SZ = 16

export function CanvasSection() {
  const t = useT()
  const stage = useAppStore((s) => s.stage)
  const setStage = useAppStore((s) => s.setStage)
  return (
    <>
      <Row label={t('canvas.background')}>
        <Seg<StageBg>
          options={[
            { value: 'checker', label: <Checkerboard size={SZ} />, title: t('canvas.transparent') },
            { value: 'dark', label: <Moon size={SZ} weight="fill" />, title: t('canvas.dark') },
            { value: 'light', label: <Sun size={SZ} weight="fill" />, title: t('canvas.light') },
            { value: 'custom', label: <Palette size={SZ} />, title: t('canvas.custom') }
          ]}
          value={stage.bg}
          onChange={(v) => setStage({ bg: v })}
        />
        {stage.bg === 'custom' && (
          <ColorField
            value={stage.color}
            onChange={(v) => setStage({ bg: 'custom', color: v })}
            presetsLabel={t('color.presets')}
            customLabel={t('color.customColor')}
          />
        )}
      </Row>
      <div className="hint">{t('canvas.note')}</div>
    </>
  )
}
