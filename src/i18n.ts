import { useAppStore } from './store/useStore'
import type { Lang } from './store/useStore'

type Dict = Record<string, string>

const en: Dict = {
  'app.tagline': 'Persian & English story text → transparent PNG',
  'app.by': 'by Pigment Development',

  'section.canvas': 'Canvas',
  'section.text': 'Text',
  'section.colorFill': 'Color & fill',
  'section.outline': 'Outline / thickness',
  'section.textShadow': 'Text shadow',
  'section.box': 'Background box',
  'section.dropShadow': 'Layer shadow',
  'section.layout': 'Layout',

  'canvas.background': 'Preview background',
  'canvas.transparent': 'Checkered',
  'canvas.dark': 'Dark',
  'canvas.light': 'Light',
  'canvas.custom': 'Custom',
  'canvas.note': 'Preview only — the exported PNG is always transparent.',

  'text.font': 'Font',
  'text.size': 'Size',
  'text.weight': 'Weight',
  'text.style': 'Style',

  'color.text': 'Text color',
  'color.gradient': 'Gradient fill',
  'color.fromTo': 'From → To',
  'color.angle': 'Angle',
  'color.gradientHint': 'Gradient applies to all text and overrides per-word color.',
  'color.presets': 'Presets',
  'color.customColor': 'Custom',

  'outline.width': 'Width',
  'outline.color': 'Color',

  'shadow.color': 'Color',
  'shadow.opacity': 'Opacity',
  'shadow.blur': 'Blur',
  'shadow.offsetX': 'Offset X',
  'shadow.offsetY': 'Offset Y',

  'box.color': 'Color',
  'box.opacity': 'Opacity',
  'box.padding': 'Padding',
  'box.radius': 'Radius',
  'box.border': 'Border',

  'layout.align': 'Align',
  'layout.direction': 'Direction',
  'layout.lineHeight': 'Line height',
  'layout.letterSpacing': 'Letter spacing',
  'dir.auto': 'Auto',
  'dir.rtl': 'RTL',
  'dir.ltr': 'LTR',

  'font.search': 'Search fonts…',
  'font.all': 'All',
  'font.google': 'Google Fonts',
  'font.bundled': 'Bundled · export-safe',
  'font.googleGroup': 'Google · may not export exactly',
  'font.persian': 'Persian',
  'font.latin': 'English',
  'font.favorites': 'Favorites',
  'font.all2': 'All fonts',
  'font.empty': 'No matching fonts.',

  'export.resolution': 'Quality',
  'export.save': 'Save PNG',
  'export.saveIos': 'Save image',
  'export.copy': 'Copy',
  'export.rendering': 'Rendering…',
  'export.copied': 'Copied to clipboard.',
  'export.copyFail': 'Copy failed — use Save instead.',
  'export.downloaded': 'PNG saved.',
  'export.failed': 'Export failed — see console.',
  'export.meta': 'transparent PNG',
  'export.iosHint': 'On iPhone: tap Save → “Save Image”, or long-press the preview to save to Photos.',
  'export.close': 'Close',

  placeholder: 'Type your text…',
  reset: 'Reset'
}

const fa: Dict = {
  'app.tagline': 'متن فارسی و انگلیسی → تصویر PNG شفاف',
  'app.by': 'ساخته‌ی پیگمنت',

  'section.canvas': 'بوم',
  'section.text': 'متن',
  'section.colorFill': 'رنگ و پرکردن',
  'section.outline': 'خط دور / ضخامت',
  'section.textShadow': 'سایه‌ی متن',
  'section.box': 'کادر پس‌زمینه',
  'section.dropShadow': 'سایه‌ی کلی',
  'section.layout': 'چیدمان',

  'canvas.background': 'پس‌زمینه‌ی پیش‌نمایش',
  'canvas.transparent': 'شطرنجی',
  'canvas.dark': 'تیره',
  'canvas.light': 'روشن',
  'canvas.custom': 'دلخواه',
  'canvas.note': 'فقط پیش‌نمایش — خروجی PNG همیشه شفاف است.',

  'text.font': 'فونت',
  'text.size': 'اندازه',
  'text.weight': 'ضخامت',
  'text.style': 'حالت',

  'color.text': 'رنگ متن',
  'color.gradient': 'پرکردن گرادیانت',
  'color.fromTo': 'از ← تا',
  'color.angle': 'زاویه',
  'color.gradientHint': 'گرادیانت روی کل متن اعمال می‌شود و رنگ تک‌تک کلمات را نادیده می‌گیرد.',
  'color.presets': 'رنگ‌های آماده',
  'color.customColor': 'دلخواه',

  'outline.width': 'ضخامت',
  'outline.color': 'رنگ',

  'shadow.color': 'رنگ',
  'shadow.opacity': 'شفافیت',
  'shadow.blur': 'محو',
  'shadow.offsetX': 'فاصله افقی',
  'shadow.offsetY': 'فاصله عمودی',

  'box.color': 'رنگ',
  'box.opacity': 'شفافیت',
  'box.padding': 'فاصله داخلی',
  'box.radius': 'گردی گوشه',
  'box.border': 'کادر',

  'layout.align': 'ترازبندی',
  'layout.direction': 'جهت',
  'layout.lineHeight': 'فاصله خطوط',
  'layout.letterSpacing': 'فاصله حروف',
  'dir.auto': 'خودکار',
  'dir.rtl': 'راست‌چین',
  'dir.ltr': 'چپ‌چین',

  'font.search': 'جست‌وجوی فونت…',
  'font.all': 'همه',
  'font.google': 'گوگل فونت',
  'font.bundled': 'همراه اپ · مطمئن برای خروجی',
  'font.googleGroup': 'گوگل · ممکن است دقیق خروجی نگیرد',
  'font.persian': 'فارسی',
  'font.latin': 'انگلیسی',
  'font.favorites': 'برگزیده‌ها',
  'font.all2': 'همه‌ی فونت‌ها',
  'font.empty': 'فونتی پیدا نشد.',

  'export.resolution': 'کیفیت',
  'export.save': 'ذخیره PNG',
  'export.saveIos': 'ذخیره تصویر',
  'export.copy': 'کپی',
  'export.rendering': 'در حال ساخت…',
  'export.copied': 'در کلیپ‌بورد کپی شد.',
  'export.copyFail': 'کپی نشد — از ذخیره استفاده کنید.',
  'export.downloaded': 'تصویر ذخیره شد.',
  'export.failed': 'خطا در خروجی — کنسول را ببینید.',
  'export.meta': 'PNG شفاف',
  'export.iosHint': 'روی آیفون: «ذخیره تصویر» را بزنید، یا روی پیش‌نمایش نگه دارید تا در گالری ذخیره شود.',
  'export.close': 'بستن',

  placeholder: 'متن خود را بنویسید…',
  reset: 'بازنشانی'
}

const DICTS: Record<Lang, Dict> = { en, fa }

export type TFn = (key: string) => string

export function useT(): TFn {
  const lang = useAppStore((s) => s.lang)
  return (key: string) => DICTS[lang][key] ?? en[key] ?? key
}
