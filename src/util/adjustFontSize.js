import setting from '@/data/setting'
export default size => {
  return ['ja', 'cn'].includes(setting.state.lang) ? size : size + 1
}
