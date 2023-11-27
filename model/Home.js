//引入http.js
import Http from "../utils/http"

class Home {
  //发起网络请求，获取首页数据
  static async getHomeList() {
    const homeList = await Http.request({ url: "/index" })
    return homeList
  }
}

//导出类
export default Home