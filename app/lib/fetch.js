/*
* @Author: perry
* @Date:   2018-03-15 16:06:42
* @Last Modified by:   perry
* @Last Modified time: 2018-03-28 22:39:37
*/
import axios from "axios";
import { cloneDeep } from "lodash";

const localFetch = options => {
  let { method = "get", data, url } = options;

  const cloneData = cloneDeep(data);

  switch (method.toLowerCase()) {
    case "get":
      return axios.get(url, {
        params: cloneData
      });
    case "delete":
      return axios.delete(url, {
        params: cloneData
      });
    case "post":
      return axios.post(url, cloneData);
    case "put":
      return axios.put(url, cloneData);
    case "patch":
      return axios.patch(url, cloneData);
    default:
      return axios(options);
  }
};
// {
//     // headers: {'x-access-token': localStorage.getItem('token')},
//   }
export default function fetch(options) {
  const opt = Object.assign(options);
  return localFetch(opt)
    .then(response => {
      const data = response.data;
      if (response.status >= 200 && response.status < 300) {
        return data;
      }
    })
    .catch(error => {
      const { response } = error;
      let msg;
      let statusCode;
      if (response && response instanceof Object) {
        const { data, statusText } = response;
        statusCode = response.status;
        msg = data.message || statusText;
      } else {
        statusCode = 600;
        msg = error.message || "网络错误";
      }
      return response;
      // res.status(500).send(response);
      // return { success: false, statusCode, message: msg }
    });
}
