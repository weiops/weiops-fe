<template>
  <div>
    <Tabs :value="tabValue">
      <TabPane label="团队" name="team">
        <Team></Team>
      </TabPane>
      <TabPane label="业务" name="business">业务</TabPane>
      <TabPane label="子业务" name="sub_business">子业务</TabPane>
      <TabPane label="应用" name="application">应用</TabPane>
    </Tabs>
  </div>
</template>

<script>

import Team from './team'

export default {
  name: 'RelationIndex',
  components: {
    Team
  },
  data () {
    return {
      tabValue: 'team'
    }
  }
}
</script>

<style scoped>

</style>
