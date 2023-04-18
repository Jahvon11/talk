// 有可能是异步的（这是账号的验证规则）
const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "请填写账号";
  }
});
// 密码的验证规则
const loginPwdValidator = new FieldValidator("txtLoginPwd", function (val) {
  if (!val) {
    return "请填写密码";
  }
});
const form = $(".user-form");
// 给表单注册提交事件
form.onsubmit = async function (e) {
  e.preventDefault(); // 阻止默认的点击事件执行
  // 调用静态方法,同时进行验证
  const result = await FieldValidator.validate(
    loginIdValidator,
    loginPwdValidator
  );
  if (!result) {
    return; // 验证未通过
  }
  const formData = new FormData(form); // 传入表单dom，得到一个表单数据对象，FormData表单数据
  // 该FormData.entries()方法返回一个迭代器，该迭代器遍历FormData. 每对的键是一个字符串对象，值是一个字符串或一个Blob.
  // Object.fromEntries()方法把按键值对列表转换为一个对象。
  const data = Object.fromEntries(formData.entries());
  // 通过则调用API注册
  console.log(data);
  const resp = await API.login(data);
  if (resp.code === 0) {
    alert("登录成功，点击确定，跳转到首页");
    location.href = "./index.html";
  } else {
    alert("账号或密码错误");
    loginPwdValidator.input.value = "";
  }
};
