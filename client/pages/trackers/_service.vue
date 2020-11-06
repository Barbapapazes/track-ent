<template>
  <Card>
    <StatusChart slot="body" :service="getService"></StatusChart>
  </Card>
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
