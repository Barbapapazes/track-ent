<template>
  <button
    class="p-1 text-white rounded border boder-white hover:bg-white hover:text-blue-900 transition ease-in-out duration-200 tracking-wide"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'CustomButton',
}
</script>
