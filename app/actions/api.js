import * as Utils from '@utils';
import * as actionTypes from "./actionTypes";
import { store } from '@store';
import { Platform } from 'react-native';
export const _TOKEN = () => {
  try {
    return store.getState().auth.login.data.token;
  } catch (error) {
    return null;
  }
};
const onLogin = data => {
  return {
    type: actionTypes.LOGIN,
    data
  };
};

export const saveImage = (data) => dispatch => {
  let formData = new FormData();
  let temp = data.image_1;
  let extension = temp.mime.substring(temp.mime.indexOf("/") + 1, temp.mime.length);
  let image_1 = {
    uri: Platform.OS == "android" ? temp.path : `file://${temp.path}`,
    type: temp.mime,
    name: `image_1.${extension}`,
  };
  formData.append('image_1', image_1);

  temp = data.image_2;
  extension = temp.mime.substring(temp.mime.indexOf("/") + 1, temp.mime.length);
  let image_2 = {
    uri: Platform.OS == "android" ? temp.path : `file://${temp.path}`,
    type: temp.mime,
    name: `image_2.${extension}`,
  };
  formData.append('image_2', image_2);

  temp = data.image_3;
  extension = temp.mime.substring(temp.mime.indexOf("/") + 1, temp.mime.length);
  let image_3 = {
    uri: Platform.OS == "android" ? temp.path : `file://${temp.path}`,
    type: temp.mime,
    name: `image_3.${extension}`,
  };
  formData.append('image_3', image_3);
  formData.append('userId', data.userId);
  fetch(`${Utils.SERVER_HOST}/api/saveImage`, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${_TOKEN()}`,
    },
    body: (formData),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {});
};
export const insertArticle = (data, callback) => dispatch => {
  fetch(`${Utils.SERVER_HOST}/api/insertArticle`, {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${_TOKEN()}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      callback({ success: res.success });
    })
    .catch((err) => callback({ success: false }));
};

export const getAllArticle = (data, callback) => (dispatch) => {
  fetch(`${Utils.SERVER_HOST}/api/getAllArticle`, {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${_TOKEN()}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      callback({ success: res.success, data: res.data, start_time: res.start_time });
    })
    .catch((err) => callback({ success: false, users: err }));
};

export const getAllOwnerArticle = (data, callback) => (dispatch) => {
  fetch(`${Utils.SERVER_HOST}/api/getAllOwnerArticle`, {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${_TOKEN()}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      callback({ success: res.success, data: res.data });
    })
    .catch((err) => callback({ success: false, users: err }));
};

export const getOwnerArticleCount = (data, callback) => (dispatch) => {
  fetch(`${Utils.SERVER_HOST}/api/getOwnerArticleCount`, {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${_TOKEN()}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      callback({ success: res.success, count: res.count });
    })
    .catch((err) => callback({ success: false, users: err }));
};


export const republicOffer = (id, callback) => (dispatch) => {
  fetch(`${Utils.SERVER_HOST}/api/republicOffer/${id}`, {
    method: 'get',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${_TOKEN()}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      callback({ success: res.success });
    })
    .catch((err) => callback({ success: false }));
};

export const deleteArticle = (id, callback) => (dispatch) => {
  fetch(`${Utils.SERVER_HOST}/api/deleteArticle/${id}`, {
    method: 'get',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${_TOKEN()}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      callback({ success: res.success });
    })
    .catch((err) => callback({ success: false }));
};

export const deleteExtraArticles = (id, callback) => (dispatch) => {
  fetch(`${Utils.SERVER_HOST}/api/deleteExtraArticles/${id}`, {
    method: 'get',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${_TOKEN()}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      callback({ success: res.success });
    })
    .catch((err) => callback({ success: false }));
};

export const getComments = (news_id, callback) => (dispatch) => {
  fetch(`${Utils.SERVER_HOST}/api/comments/${news_id}`, {
    method: 'get',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${_TOKEN()}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      callback({ success: res.success, data: res.comments });
    })
    .catch((err) => callback({ success: false, data: success }));
};

export const connectServer = (id, callback) => (dispatch) => {
  fetch(`${Utils.SERVER_HOST}/api/connect/${id}`, {
    method: 'get',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${_TOKEN()}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      callback({ success: res.success });
    })
    .catch((err) => callback({ success: false }));
}
export const refreshServe = (callback) => (dispatch) => {
  fetch(`${Utils.SERVER_HOST}/api/refreshServe`, {
    method: 'get',
    headers: {
      'content-type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((res) => {
      callback({ success: res.success });
    })
    .catch((err) => callback({ success: false }));
}
export const increaseTime = (id, callback) => dispatch => {
  const data = {
    success: true,
    data: {},
  };
  fetch(`${Utils.SERVER_HOST}/api/increase/${id}`, {
    method: 'get',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${_TOKEN()}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.success) {
        data.data = res.data;
        dispatch(onLogin(data));
      }
      callback({ success: res.success });
    })
    .catch((err) => callback({ success: false }));
}
export const checkCountry = (id, callback) => dispatch => {
  fetch(`${Utils.SERVER_HOST}/api/checkCountry/${id}`, {
    method: 'get',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${_TOKEN()}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      callback({ success: res.success, 'state': res.state });
    })
    .catch((err) => callback({ success: false }));
}
export const getRole = (id, callback) => (dispatch) => {
  fetch(`${Utils.SERVER_HOST}/api/getRole/${id}`, {
    method: 'get',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${_TOKEN()}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      callback({ success: res.success, data: res.data });
    })
    .catch((err) => callback({ success: false }));
}