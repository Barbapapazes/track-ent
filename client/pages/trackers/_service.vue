<template>
  <div class="p-4">
    <Card>
      <StatusChart slot="body" :service="getService"></StatusChart>
    </Card>
  </div>
</template>

<script>
export default {
  computed: {
    getService() {
      return this.$route.params.service
    },
  },
}
</script>
