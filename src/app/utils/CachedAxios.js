import axios from 'axios';

function CachedAxios() {
  this.cache = {};
  this.call = (url) => {
    if (this.cache[url]) {
      return new Promise((resolve) => {
        resolve(this.cache[url]);
      });
    }

    return axios(url)
      .then((res) => {
        this.cache[url] = res;
        return res;
      });
  };
}

export default CachedAxios;
