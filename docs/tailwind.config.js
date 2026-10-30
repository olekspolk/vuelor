export default {
  darkMode: 'class',
  content: [
    './content/**/*.{md,vue}',
    './components/**/*.{js,ts,vue}',
    './node_modules/@vuelor/picker/dist/index.js',
    './node_modules/@vuelor/gradient/dist/index.js'
  ],
  theme: {
    extend: {
      colors: {
        /* Site palette */
        ink: '#1a1a1a',
        'ink-raised': '#212124',
        night: '#0b0519',
        abyss: '#05030b',
        ember: '#ee3c4b',
        'ember-deep': '#8b1e2c',
        bone: '#f3efec',
        ash: '#8f8c96',
        line: '#2f2f2f',

        /* Picker demo tokens */
        'vuelor-primary': '#0d99ff',
        'vuelor-surface': '#ffffff',
        'vuelor-border': '#e6e6e6',
        'vuelor-input': '#f5f5f5',
      },
      fontFamily: {
        display: ['Montserrat Variable', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Figtree Variable', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      boxShadow: {
        'vuelor-card': '0 2px 5px 0 #00000026, 0 10px 16px 0 #0000001f, 0 0 .5px 0 #0000001f',
        'vuelor-thumb': '0px 0px .5px #0000002e, 0px 3px 8px #0000001a, 0px 1px 3px #0000001a',
        'vuelor-inner': 'inset 0 0 0 1px #0000001a'
      }
    },
    dropShadow: {
      /* Used for gradient picker slider thumbs only */
      'vuelor-thumb': ['0px 0px .5px #00000054', '0px 1px 3px #00000026']
    }
  },
  plugins: [],
}
