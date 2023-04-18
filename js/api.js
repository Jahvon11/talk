var API = (function () {
  const BASE_URL = "https://study.duyiedu.com";
  const TOKEN_KEY = "token";

  //封装fetch函数
  function get(path) {
    //有token就拿，没有就空对象
    const headers = {};
    const token = localStorage.getItem(TOKEN_KEY); //看看localstorage里边能不能拿到
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, { headers });
  }
  function post(path, bodyObj) {
    const headers = {
      "content-type": "application/json",
    };
    const token = localStorage.getItem(TOKEN_KEY); //看看localstorage里边能不能拿到
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, {
      headers,
      method: "POST",
      body: JSON.stringify(bodyObj),
    });
  }

  //注册 POST请求
  async function reg(userInfo) {
    const resp = await post("/api/user/reg", userInfo); //等待解析
    return await resp.json();
  }
  //登录 POST请求
  async function login(loginInfo) {
    const resp = await post("/api/user/login", loginInfo); //等待解析
    const result = await resp.json(); //登录完成，拿到响应结果
    if (resp.code === 0) {
      //===0 代表登录成功
      //将响应头中的token(令牌)保存起来（localStorage）
      const token = resp.headers.get("authorization"); //成功才能拿到令牌，所以要进行判断
      localStorage.setItem(TOKEN_KEY, token); //进行保存（键值对）
    }
    //失败则直接返回
    return result;
  }
  //验证账号
  async function exists(loginId) {
    const resp = await get("/api/user/exists?loginId=" + loginId);
    return await resp.json();
  }
  //验证用户信息
  async function profile() {
    const resp = await get("/api/user/profile");
    return await resp.json();
  }
  //发送聊天消息
  async function sendChat(content) {
    const resp = await post("/api/chat", { content });
    return await resp.json();
  }
  //获取聊天记录
  async function getHistory() {
    const resp = await get("/api/chat/history");
    return await resp.json();
  }
  //退出登录
  function loginOut() {
    localStorage.removeItem(TOKEN_KEY);
  }

  return {
    reg,
    login,
    exists,
    profile,
    sendChat,
    getHistory,
    loginOut,
  };
})();
