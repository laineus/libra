module.exports = {
  root: true,
  extends: [
    'standard',
    'plugin:vue/vue3-recommended',
  ],
  plugins: [],
  rules: {
    'object-property-newline': 0,
    'no-extend-native': 0,
    'lines-between-class-members': 0,
    'no-return-assign': 0,
    'promise/param-names': 0,
    'vue/max-attributes-per-line': 0,
    'vue/attributes-order': 0,
    'vue/attribute-hyphenation': 0,
    'vue/require-prop-types': 0,
    'vue/custom-event-name-casing': 0,
    'vue/singleline-html-element-content-newline': 0
  },
  globals: {
    location: true,
    alert: true,
    localStorage: true,
    FileReader: true,
    Blob: true,
    WebGLRenderingContext: true,
    Phaser: true,
    greenworks: true,
    t: true,
    l: true,
    ENV: true
  }
}