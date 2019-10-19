<template>
    <el-tag closable :hit='this.boolean' :effect="this.type" type='info'>
        <slot></slot>
    </el-tag>
</template>

<script>
export default {
  props: ['type'],
  data () {
    return {
      boolean: false
    }
  }
}
</script>

<style scoped lang="scss">
    span.el-tag.el-tag--plain{
        border: none;
    }

    span.el-tag--info.el-tag--plain{
        color: rgb(0, 150, 136);
    }
</style>
