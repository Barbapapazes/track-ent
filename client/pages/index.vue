<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-w-screen-lg m-auto"
  >
    <template v-for="tracker in trackers">
      <Card :key="tracker">
        <div slot="title">Tracker sur {{ tracker.toUpperCase() }}</div>
        <PreviewChart
          slot="body"
          :service="tracker"
          style="height: 250px"
        ></PreviewChart>
        <div slot="actions" class="flex justify-end">
          <CustomButton class="uppercase font-semibold">
            <NuxtLink :to="`/trackers/${tracker}`">voir plus</NuxtLink>
          </CustomButton>
        </div>
      </Card>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      trackers: ['ent', 'celene', 'cas'],
    }
  },
}
</script>
