import * as actionTypes from "./actionTypes";
import * as Utils from "../utils";
import { GetPrefrence } from "@store";
import { _TOKEN } from "./api";
import { useReducer } from "react";
const onLogin = data => {
  return {
    type: actionTypes.LOGIN,
    data
  };
};
export const registration = (userinfo, callback) => dispatch => {
  fetch(`${Utils.SERVER_HOST}/api/register`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(userinfo)
  })
    .then(res => res.json())
    .then(res => {
      return callback({ success: res.success, data: res.data });
    })
    .catch(err => console.log('err', err));
};
export const authentication = (login, userinfo, callback) => async dispatch => {
  const data = {
    success: login,
    data: {},
  };
  if (!login) {
    fetch(`${Utils.SERVER_HOST}/api/logout`, {
      method: 'get',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${_TOKEN()}`,
      }
    });
    dispatch(onLogin(data));
    callback({ success: true });
    return;
  }
  fetch(`${Utils.SERVER_HOST}/api/login`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(userinfo)
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        data.data = res.data;
        dispatch(onLogin(data));
      }
      return callback({ success: res.success, data: res.message });
    })
    .catch(err => { console.log(err) });
};
export const changeUser = (user) => dispatch => {
  dispatch(
    onLogin({
      success: true,
      data: user
    })
  );
}
export const changeProfile = (userinfo, callback) => dispatch => {
  const data = {
    success: true,
    data: {},
  };
  fetch(`${Utils.SERVER_HOST}/api/changeprofile`, {
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${_TOKEN()}`,
    },
    method: 'POST',
    body: JSON.stringify(userinfo)
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
         console.log(res.data)
        data.data = res.data;
        dispatch(onLogin(data));
      }
      callback({ success: res.success, data: res.data });
    })
    .catch(err => callback({ success: false, data: err }));
}
export const changePassword = (data, callback) => dispatch => {
  fetch(`${Utils.SERVER_HOST}/api/changepassword`, {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${_TOKEN()}`,
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(res => {
      callback({ success: res.success, message: res.message });
    })
    .catch(err => callback({ success: false, message: err }));
}

export const resetPassword = (data, callback) => dispatch => {
  fetch(`${Utils.SERVER_HOST}/api/resetpassword`, {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${_TOKEN()}`,
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(res => {
      callback({ success: res.success, state:res.state });
    })
    .catch(err => callback({ success: false }));
}
export const checkemail = (data, callback) => dispatch => {
  fetch(`${Utils.SERVER_HOST}/api/checkemail`, {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${_TOKEN()}`,
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(res => {
      console.log(res)
      callback({ success: res.success});
    })
    .catch(err => callback({ success: false }));
}
export const getResource = (callback) => dispatch => {
  fetch(`${Utils.SERVER_HOST}/api/userresource`, {
    method: 'get',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${_TOKEN()}`,
    },
  })
    .then(res => res.json())
    .then(res => {
      callback({ success: res.success, data: { groups: res.groups, teams: res.teams, positions: res.positions } });
    })
    .catch(err => callback({ success: false, data: err }));
}
export const getuser = (user_id, callback) => dispatch => {
  fetch(`${Utils.SERVER_HOST}/api/users/${user_id}`, {
    method: 'get',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${_TOKEN()}`,
    },
  })
    .then(res => res.json())
    .then(res => {
      callback({ success: res.success, user: res.user });
    })
    .catch(err => callback({ success: false, user: err }));
}
export const verification = (verification, callback) => dispatch => {
  fetch(`${Utils.SERVER_HOST}/api/forgotpassword`, {
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(verification)
  })
    .then(res => res.json())
    .then(res => {
      callback({ success: res.success, code: res.code });
    })
    .catch(err => callback({ success: false, code: err }));
}
export const contact = (text, lan, callback) => dispatch => {
  fetch(`${Utils.SERVER_HOST}/api/contact`, {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${_TOKEN()}`,
    },
    body: JSON.stringify({ contact: text, lan: lan })
  })
    .then(res => res.json())
    .then(res => {
      callback({ success: res.success, message: res.message });
    })
    .catch(err => callback({ success: false, message: null }));
}
export const device_token = (device) => async dispatch => {

  let device_token = await GetPrefrence('device_token');
  fetch(`${Utils.SERVER_HOST}/api/token`, {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${_TOKEN()}`,
    },
    body: JSON.stringify({ device_token: device_token, device: device })
  })
    .then(res => res.json())
    .then(res => {
    })
    .catch(err => console.log(err));
}
export const remove_token = (device) => dispatch => {
  fetch(`${Utils.SERVER_HOST}/api/token/remove`, {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${_TOKEN()}`,
    },
    body: JSON.stringify({ device: device })
  });
}

export const refreshUser = (callback) => dispatch => {
  const data = {
    success: true,
    data: {},
  };
  fetch(`${Utils.SERVER_HOST}/api/refreshUser`, {
    method: 'get',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${_TOKEN()}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.success) {
        data.data = res.data;
        dispatch(onLogin(data));
      }
      callback({ success: res.success, data: res.message });
    })
    .catch((err) => callback({ success: false }));
}