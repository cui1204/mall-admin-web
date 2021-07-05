<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="关键字：">
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="关键字" clearable></el-input>
          </el-form-item>
          <el-form-item label="分类：">
            <el-select v-model="listQuery.categoryId" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in categoryOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddQuestion()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="questionTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="类别" align="center">
          <template slot-scope="scope">{{scope.row.categoryId | categoryNameFilter(categoryOptions)}}</template>
        </el-table-column>
        <el-table-column label="题目" align="center">
          <template slot-scope="scope">{{scope.row.content}}</template>
        </el-table-column>
<!--        <el-table-column label="菜单级数" width="100" align="center">-->
<!--          <template slot-scope="scope">{{scope.row.level | levelFilter}}</template>-->
<!--        </el-table-column>-->
        <el-table-column label="选项" align="center">
          <template slot-scope="scope">{{scope.row.optional}}</template>
        </el-table-column>
        <el-table-column label="答案" width="100" align="center">
          <template slot-scope="scope"> {{scope.row.resultId | answerFilter}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[10,15,20]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {fetchList,deleteQuestion,updateQuestion,updateHidden} from '@/api/question'
  import {fetchAllCategoryList} from '@/api/category';

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    keyword: null,
    categoryId:null
  };
  const defaultQuestion = {
    id: null,
    categoryId: null,
    content: null,
    optional:null,
    resultId:null,
    isJudgment:null
  };

  const answerList=['A','B','C','D','E','F','G'];
  export default {
    name: "questionList",
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        categoryOptions:[],
        defaultCategoryId:null,
        question: Object.assign({}, defaultQuestion),

      }
    },
    created() {
      // this.resetParentId();
      this.getList();
      this.getCateList();
    },
    watch: {
      $route(route) {
        this.getList();
      }
    },
    methods: {
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },

      handleAddQuestion() {
        this.$router.push('/dms/addQuestion');
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      getCateList(){
        fetchAllCategoryList().then(response=>{
          let cateList = response.data;
          for(let i=0;i<cateList.length;i++){
            let cate = cateList[i];
            this.categoryOptions.push({label:cate.name,value:cate.id});
          }
          this.defaultCategoryId=cateList[0].id;
        })
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleHiddenChange(index, row) {
        updateHidden(row.id,{hidden:row.hidden}).then(response=>{
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },

      handleUpdate(index, row) {
        this.$router.push({path:'/dms/updateQuestion',query:{id:row.id}});
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该题目', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteQuestion(row.id).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        });
      }
    },
    filters: {
      categoryNameFilter(value, list){
        for (let i = 0; i < list.length; i++) {
          //console.log(Object.keys(list[i]));
          //console.log(Object.values(list[i]));
          let id = Object.values(list[i])[1];
          if (id === value) {
            return Object.values(list[i])[0];
          }
        }
      },
      answerFilter(value) {
        return answerList[value];
      },

    }
  }
</script>

<style scoped>

</style>
