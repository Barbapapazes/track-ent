<template>
  <section
    class="bg-gradient-to-br from-blue-500 to-indigo-500 rounded shadow-md hover:shadow-2xl p-2 transition ease-in-out duration-200"
  >
    <span class="text-xl text-white uppercase font-bold">
      <slot name="title"></slot>
    </span>
    <slot name="body"></slot>
    <div class="mt-3">
      <slot name="actions"></slot>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Card',
}
</script>
