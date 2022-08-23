<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      syc: {{ '欢迎' }}
    </div>
    <!-- 123 -->
    <div style="text-align:center;clear:both;" />
    <div class="wrapper">
      <div
        id="one"
        class="border-circle"
      />
      <div
        id="two"
        class="border-circle"
      />
      <div class="background-circle">
        <div class="triangle-light" />
        <div class="body" />
        <span class="shirt-text">V</span>
        <span class="shirt-text">u</span>
        <span class="shirt-text">e</span>
        <span class="shirt-text">j</span>
        <span class="shirt-text">S</span>
        <div class="triangle-dark" />
      </div>
      <div class="head">
        <div
          id="left"
          class="ear"
        />
        <div
          id="right"
          class="ear"
        />
        <div class="hair-main">
          <div
            id="left"
            class="sideburn"
          />
          <div
            id="right"
            class="sideburn"
          />
          <div class="hair-top" />
        </div>
        <div class="face">
          <div class="hair-bottom" />
          <div class="nose" />
          <div
            id="left"
            class="eye-shadow"
          >
            <div class="eyebrow" />
            <div class="eye" />
          </div>
          <div
            id="right"
            class="eye-shadow"
          >
            <div class="eyebrow" />
            <div class="eye" />
          </div>
          <div class="mouth" />
          <div class="shadow-wrapper">
            <div class="shadow" />
          </div>
        </div>
      </div>
      <span
        id="one"
        class="music-note"
      >&#9835;</span>
      <span
        id="two"
        class="music-note"
      >&#9834;</span>
    </div>
    <!-- 123 -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style src="@/styles/loading.css" ></style>
<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
