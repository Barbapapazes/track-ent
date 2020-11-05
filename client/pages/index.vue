<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl m-auto pt-4"
  >
    <!-- <status-chart service="ent" class="xl:w-1/3 lg:w-2/4 w-full"></status-chart>
    <status-chart
      service="celene"
      class="xl:w-1/3 lg:w-2/4 w-full"
    ></status-chart>
    <status-chart service="cas" class="xl:w-1/3 lg:w-2/4 w-full"></status-chart> -->
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
            <NuxtLink :to="`/trackers/${tracker}`">voir</NuxtLink>
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
