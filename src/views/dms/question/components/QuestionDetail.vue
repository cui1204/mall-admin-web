<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="question"
             :rules="rules"
             ref="questionFrom"
             label-width="150px">
      <el-form-item label="题目类型：">
        <el-select v-model="question.categoryId"
                   placeholder="请选择菜单">
          <el-option
            v-for="item in selectCategoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="题目：" prop="title">
        <el-input v-model="question.content"></el-input>
      </el-form-item>

      <el-form-item label="选项：" prop="name">
        <el-input v-model="question.optional"></el-input>
      </el-form-item>

      <el-form-item label="答案：">
        <el-select v-model="question.resultId"
                   placeholder="请选择菜单">
          <el-option
            v-for="(item,i) in selectAnswerList"
            :key="i"
            :label="item"
            :value="i">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('questionFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('questionFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import {fetchList, createQuestion, updateQuestion, getQuestion} from '@/api/question';
  import {fetchAllCategoryList} from '@/api/category';

  const defaultQuestion = {
    content: '',
    categoryId: 0,
    optional: '',
    resultId: 0,
  };
  export default {
    name: "QuestionDetail",
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        question: Object.assign({}, defaultQuestion),
        selectCategoryList: [],
        selectAnswerList: ['A','B','C','D','E','F','G'],
        rules: {
          content: [
            {required: true, message: '请输入题目正文', trigger: 'blur'},
            {min: 2, max: 249, message: '长度在 2 到 249 个字符', trigger: 'blur'}
          ],
          answer: [
            {required: true, message: '请输答案', trigger: 'blur'},
            {min: 2, max: 249, message: '长度在 2 到 249 个字符', trigger: 'blur'}
          ],
          icon: [
            {required: true, message: '请输入图片', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      if (this.isEdit) {
        getQuestion(this.$route.query.id).then(response => {
          this.question = response.data;
        });
      } else {
        this.question = Object.assign({}, defaultQuestion);
      }
      this.getSelectCategoryList();
      this.getSelectAnswerList();
    },
    methods: {
      getSelectCategoryList() {
        fetchAllCategoryList().then(response => {
          this.selectCategoryList = response.data;
          this.selectCategoryList.unshift({id: 0, name: '请选择题目类型'});
        });
      },
      getSelectAnswerList() {

        // fetchAllCategoryList().then(response => {
        //   this.selectAnswerList = response.data;
        //   this.selectAnswerList.unshift({id: 0, name: '题目类型'});
        // });
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                updateQuestion(this.$route.query.id, this.question).then(response => {
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                  });
                  this.$router.back();
                });
              } else {
                createQuestion(this.question).then(response => {
                  this.$refs[formName].resetFields();
                  this.resetForm(formName);
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration: 1000
                  });
                  this.$router.back();
                });
              }
            });

          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.question = Object.assign({}, defaultQuestion);
        // this.getSelectAnswerList();
      },
    }
  }
</script>

<style scoped>

</style>
