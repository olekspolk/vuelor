export default {
  slots: {
    root: 'relative',
    canvas: 'rounded-[5px] outline-1 outline-solid -outline-offset-1 outline-[#0000001a]'
  },
  variants: {
    disabled: {
      true: {
        root: 'pointer-events-none opacity-50'
      }
    }
  }
}
