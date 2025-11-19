export default {
  content: [
    './content/**/*.{md,vue}',
    './components/**/*.{js,ts,vue}',
    './node_modules/@vuelor/picker/src/theme/tailwindcss.ts'
  ],
  theme: {
    extend: {
      boxShadow: {
        'vuelor-card': '0 2px 5px 0 #00000026, 0 10px 16px 0 #0000001f, 0 0 .5px 0 #0000001f',
        'vuelor-thumb': '0px 0px .5px #0000002e, 0px 3px 8px #0000001a, 0px 1px 3px #0000001a',
        'vuelor-inner': 'inset 0 0 0 1px #0000001a'
      }
    },
    dropShadow: {
      'vuelor-thumb': ['0px 0px .5px #00000054', '0px 1px 3px #00000026']
    }
  },
  plugins: [],
}
