import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/question/list/',
    method: 'get',
    params: params
  })
}

export function deleteQuestion(id) {
  return request({
    url: '/question/delete/' + id,
    method: 'post'
  })
}

export function createQuestion(data) {
  return request({
    url: '/question/create',
    method: 'post',
    data: data
  })
}

export function updateQuestion(id, data) {
  return request({
    url: '/question/update/' + id,
    method: 'post',
    data: data
  })
}

export function getQuestion(id) {
  return request({
    url: '/question/' + id,
    method: 'get',
  })
}

export function updateHidden(id, params) {
  return request({
    url: '/question/updateHidden/' + id,
    method: 'post',
    params: params
  })
}



