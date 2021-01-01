import useTranslate from '@/util/useTranslate'
import textData from '@/locales/index'
import setting from '@/data/setting'

const translate = useTranslate(textData)

export default (key, values) => translate(setting.state.lang, key, values)
