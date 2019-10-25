<template>
  <div class="bg">
    <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
      <li>5</li>
      <li>6</li>
      <li>7</li>
      <li>8</li>
      <li>9</li>
      <li>8</li>
      <li>9</li>
    </ul>
  </div>
</template>
<script>

</script>
<style lang="scss" scoped>
  .bg{
    background-color:#2d3a4b;
    height: 500px;
    width: 500px;
    padding: 50px;
  }
  ul{
    width: 300px;
    height: 300px;
    box-sizing: border-box;
  }
  li{
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    float: left;
    width: 33.3333%;
    height: 33.33%;
    color: #fff;
    background-color: #409EFF;
    border: 1px solid #fff;
    text-align: center;
    line-height: 100px;
    margin-left:-1px;
    margin-top:-1px;
  }
  li:hover{
    border: 1px solid #ffc33d;
    z-index: 2;
  }
</style>
