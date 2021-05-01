import setting from '@/data/setting'
export default size => {
  return setting.state.lang === 'ja' ? size : size + 1
}
