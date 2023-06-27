<template>
  <div>
    <el-empty description="主頁正在開發中，敬請期待..."></el-empty>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentUserAvatar: localStorage.getItem("currentUserAvatar")
    }
  }
}
</script>

<style>
</style>