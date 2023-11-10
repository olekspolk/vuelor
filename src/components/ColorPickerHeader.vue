<template>
  <div class="header">
    <div class="modes">
      <button
        class="mode-btn"
        :class="{ active: value === 'color' }"
        @click="onSelect('color')"
      >
        <div class="mode-icon"></div>
      </button>
      <button
        class="mode-btn"
        :class="{ active: value === 'gradient' }"
        @click="onSelect('gradient')"
      >
        <div class="mode-icon"></div>
      </button>
    </div>
    <button
      class="close-btn"
      @click="$emit('close')"
    >
      <svg
        class="svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        xmlns="http://www.w3.org/2000/svg">
        <path
          fill="#000"
          fill-opacity="1"
          fill-rule="nonzero"
          stroke="none"
          d="m6 5.293 4.789-4.79.707.708-4.79 4.79 4.79 4.789-.707.707-4.79-4.79-4.789 4.79-.707-.707L5.293 6 .502 1.211 1.21.504 6 5.294z"
        />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    value: String
  },

  methods: {
    onSelect (value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px;
  border-bottom: 1px solid #e6e6e6;

  button {
    background-color: transparent;
  }

  button:focus {
    outline: none;
  }
}
.modes {
  display: flex;
  padding-left: 6px;
}
.mode-btn {
  height: 24px;
  width: 24px;
  border-radius: 3px;
  border: none;
  border: none;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: #e6e6e6;
  }

  &:not(:last-child) {
    margin-right: 2px;
  }

  &.active {
    background-color: #e6e6e6;
  }

  &:nth-child(1) {
    .mode-icon {
      background-color: black;
    }
  }

  &:nth-child(2) {
    .mode-icon {
      background: linear-gradient(to bottom, black, white);
    }
  }
}
.close-btn {
  cursor: pointer;
  height: 32px;
  width: 32px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;

  &:hover {
    background-color: #f5f5f5;
  }
}
.mode-icon {
  height: 12px;
  width: 12px;
}
</style>
