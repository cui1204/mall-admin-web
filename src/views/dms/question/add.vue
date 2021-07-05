<template> 
  <question-detail :is-edit='false'></question-detail>
</template>
<script>
  import QuestionDetail from './components/QuestionDetail'
  export default {
    name: 'addQuestion',
    components: { QuestionDetail }
  }
</script>
<style>
</style>


