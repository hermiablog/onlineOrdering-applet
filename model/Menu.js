//引入http.js
import Http from "../utils/http"

class Menu {
  /**
   * 发起网络请求，获取菜单数据
   */
  static async getMenuList() {
    const menuList = await Http.request({ url: "/menu" })
    return menuList
  }
  /**
   * 获取商品详情信息
   * @param {*} id 点击商品列表时获取的id
   */
  static async getDetailInfo(id) {
    const menuList = await Menu.getMenuList();
    const productList = menuList.productList;
    let detailList = []
    productList.forEach(data => {
      if (data.id === id) {
        detailList = data
      }
    });
    return detailList
  }
}

//导出类
export default Menu