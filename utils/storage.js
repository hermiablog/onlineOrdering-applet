/**
 * 微信小程序标准版：统一封装的 storage 操作类
 */
class Storage {
  //类数组，通过[属性]的方式调用
  types = {
    1: 'get', // get
    2: 'set', // set
    3: 'rm' // rm
  }
  /**
   * 检验本地存储 key 是否合法
   * @param {String} key | 要操作的键值
   * @param {Number} type | 类型，是 get set rm 
   * @param {Boolean} emptyFlag | 是否判断为空情况，默认判断 true，false 为不判断
   */
  checkKeyType(key, type, emptyFlag = true) {
    if (typeof key != 'string') {
      throw new Error(`Storage ${this.types[type]} func: key must be string`)
      return false
    }
    if (emptyFlag) {
      let tmpKey = key.TrimStr()
      if (tmpKey == '') {
        throw new Error(`Storage ${this.types[type]} func: key can not be empty`)
        return false
      }
      return tmpKey;
    }
    return key
  }

  /**
   * get方法 从本地缓存中获取指定key的值
   * @param {String} key | 要操作的键值
   * @param {Boolean} syncFlag | 同步状态，默认 false (异步)，true 为同步
   */
  get = (key, syncFlag = false) => {
    const tmpKey = this.checkKeyType(key, 1)
    if (tmpKey) {
      const errMsg = 'Storage get: failed to get data'
      return new Promise((resolve, reject) => {
        if (syncFlag) {
          let res = wx.getStorageSync(tmpKey)
          if (res) {
            resolve(JSON.parse(res))
          } else {
            reject(errMsg)
          }
        } else {
          wx.getStorage({
            key: tmpKey,
            success: (res) => {
              resolve(JSON.parse(res.data))
            },
            fail: (err) => {
              reject(errMsg)
            }
          })
        }
      })
    }
  }

  /**
   * 将数据保存在本地存储的指定key中 会覆盖掉原来该 key 对应的内容
   * @param {String} key | 要操作的键值
   * @param {*} data | 要存储的值，会转换为 JSON 串进行存储
   * @param {Boolean} syncFlag | 同步状态，默认 false (异步)，true 为同步
   */
  set = (key, data, syncFlag) => {
    const tmpKey = this.checkKeyType(key, 2)
    if (tmpKey) {
      const sucMsg = 'Storage set: set data successfully'
      const errMsg = 'Storage set: failed to set data'
      return new Promise((resolve, reject) => {
        let tmpData = JSON.stringify(data)
        if (syncFlag) {
          try {
            wx.setStorageSync(tmpKey, tmpData)
            resolve(sucMsg)
          } catch (err) {
            console.log(err)
            reject(errMsg)
          }
        } else {
          wx.setStorage({
            data: tmpData,
            key: tmpKey,
            success: () => {
              resolve(sucMsg)
            },
            fail: (err) => {
              console.log(err)
              reject(errMsg)
            }
          })
        }
      })
    }
  }

  /**
   * 可以移除本地存储中指定key的数据 如果不指定则清除全部数据
   * @param {String} key | 要操作的键值，为空则清空所有，有值则清空指定的值
   * @param {Boolean*} syncFlag | 同步状态，默认 false (异步)，true 为同步
   */
  rm = (key = '', syncFlag = false) => {
    let tmpKey = this.checkKeyType(key, 3, false)
    tmpKey = tmpKey.TrimStr()
    const sucMsg = 'Storage rm: rm data successfully'
    const errMsg = 'Storage rm: failed to rm data'
    return new Promise((resolve, reject) => {
      if (tmpKey == '') {
        if (syncFlag) {
          try {
            wx.clearStorageSync()
            resolve(sucMsg)
          } catch (err) {
            console.log(err)
            reject(errMsg)
          }
        } else {
          wx.clearStorage({
            success: (res) => {
              resolve(sucMsg)
            },
            fail: (err) => {
              console.log(err)
              reject(errMsg)
            }
          })
        }
      } else {
        if (syncFlag) {
          try {
            wx.removeStorageSync(tmpKey)
            resolve(sucMsg)
          } catch (err) {
            console.log(err)
            reject(errMsg)
          }
        } else {
          wx.removeStorage({
            key: tmpKey,
            success: () => {
              resolve(sucMsg)
            },
            fail: (err) => {
              console.log(err)
              reject(errMsg)
            }
          })
        }
      }
    })
  }

}
/**
 * 清除字符串前后的空格
 */
String.prototype.TrimStr = function () {
  return this.replace(/(^\s*)|(\s*$)/g, '');
}

export {
  Storage
}
