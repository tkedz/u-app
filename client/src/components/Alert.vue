<template>
    <div class="alert p-4 position" :class="{'alert-success': success, 'alert-danger': !success}">
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: ['success']
};
</script>

<style scoped>
.position {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -20%);
}
</style>