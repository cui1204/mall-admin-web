import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/questionCategory/list',
    method: 'get',
    params: params
  })
}

export function createCategory(data) {
  return request({
    url: '/questionCategory/create',
    method: 'post',
    data: data
  })
}

export function updateCategory(id, data) {
  return request({
    url: '/questionCategory/update/' + id,
    method: 'post',
    data: data
  })
}

export function deleteCategory(data) {
  return request({
    url:'/questionCategory/delete',
    method:'post',
    data:data
  })
}

export function fetchAllCategoryList() {
  return request({
    url: '/questionCategory/listAll',
    method: 'get'
  })
}

