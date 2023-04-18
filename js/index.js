// 验证是否有登录，没有的话就跳转到登录页面，有的话就获取到登录信息
(async function () {
  const resp = await API.profile(); // 调用profile函数，带来token
  const user = resp.data; // 登录成功就会有data，保存到user中
  if (!user) {
    alert("未登录或登录已过期，请重新登录");
    location.href = "./login.html";
    return;
  }
  // 获取需要的dom元素
  const doms = {
    // 侧边栏
    aside: {
      nickname: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    chatContainer: $(".chat-container"),
    txtMsg: $("txtMsg"),
    MsgContainer: $(".msg-container"),
  };
  // 接下来的代码环境，为登录状态后需要做的事情
  setUserInfo();

  // 注销事件
  doms.close.onclick = function () {
    API.loginOut(); // 调用退出登录函数
    location.href = "./login.html";
  };

  // 加载历史记录
  await loadHistory();
  async function loadHistory() {
    const resp = await API.getHistory();
    for (const item of resp.data) {
      addChat(item); // 把获取到的对象传入到addchat
    }
    scrollBottom();
  }

  // 发送消息事件
  doms.MsgContainer.onsubmit = function (e) {
    e.preventDefault(); // 阻止表单默认行为
    sendChat();
  };

  //设置用户信息
  function setUserInfo() {
    // 不能使用innerHTML
    doms.aside.nickname.innerText = user.nickname;
    doms.aside.loginId.innerText = user.loginId;
  }
  // 根据消息对象，将其添加到页面中
  function addChat(chatInfo) {
    const div = $$$("div"); // 创建一个div
    div.classList.add("chat-item");
    // 判断from里边有没有值，有的话就是人发送的信息
    if (chatInfo.form) {
      div.classList.add("me");
    }
    const img = $$$("img");
    img.className = "chat-avatar";
    // 是人还是机器发的信息
    img.src = chatInfo.form ? "./asset/avatar.png" : "./asset/robot.png";
    //创建内容
    const content = $$$("div");
    content.className = "chat-content";
    content.innerText = chatInfo.content;

    const date = $$$("div");
    date.className = "chat-date";
    date.innerText = formatDate(chatInfo.createdAt);

    // 把元素加入到div里边
    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(date);
    // 最后把div加入到container里边
    doms.chatContainer.appendChild(div);
  }
  // 时间信息
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear(); // 该getFullYear()方法根据本地时间返回指定日期的年份。
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  // 设置滚动条到最后
  function scrollBottom() {
    doms.chatContainer.acrollTop = doms.chatContainer.acrollTop;
  }
  // 发送消息
  async function sendChat() {
    // 把文本框的东西读出来
    const content = doms.txtMsg.value.trim(); // 该trim()方法去除字符串两端的空格并返回一个新字符串，而不修改原始字符串。
    if (!content) {
      return; //没有值就返回
    }
    // 率先往界面添加信息(最快速度让界面有内容，提升用户体验)
    addChat({
      from: user.loginId,
      to: null,
      createdAt: Date.now(),
      content,
    });
    // 发送出信息之后，把文本框清空
    doms.txtMsg.value = "";
    scrollBottom();
    const resp = API.sendChat(content);
    // 这一步是机器人回复的信息
    addChat({
      from: null,
      to: user.loginId,
      ...resp.data,
    });
    scrollBottom();
  }

  // addChat({
  //   content: "adfasdfasdfsdaf",
  //   createdAt: 123456456,
  //   from: "haadfdsha",
  //   to: null,
  // });
})();
