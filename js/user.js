// 用户登录和注册的表单项验证的通用代码
/**
 * 对某个表单进行验证的构造函数
 */
class FieldValidator {
  /**
   * 构造器
   * @param {String} txtId 文本框ID
   * @param {Function} validatorFunc 验证规则函数，当需要对该文本框进行验证时，会调用该函数，函数的参数为当前文本框的值，函数的返回值为验证的错误信息，若没有返回，则表示没错误
   * constructor 是一种用于创建和初始化class创建的对象的特殊方法。
   */
  constructor(txtId, validatorFunc) {
    //拿到文本框的dom对象
    this.input = $("#" + txtId);
    this.p = this.input.nextElementSibling; // nextElementSibling可获取当前元素的下一个 兄弟元素
    this.validatorFunc = validatorFunc; // 保存函数
    // 何时验证：1.文本框失去焦点时，2.表单提交时
    this.input.onblur = () => {
      this.validate(); // 失去焦点时，触发验证
    };
  }
  /**
   * 验证，成功返回true，失败返回false
   */
  async validate() {
    const err = await this.validatorFunc(this.input.value); // 从validatorFunc拿到文本框的值
    if (err) {
      // 有错误，则给p元素文本内容添加错误信息
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = ""; // 没错误返空
      return true;
    }
  }
  // 静态方法,传入所有的验证器validators，类（class）通过 static 关键字定义静态方法。
  /**
   * 对传入的所有验证器进行统一验证,如果所有的验证均通过，则返回true，否则返回false
   * @param {FieldValidator[]} validators
   */
  static async validate(...validators) {
    // 拿到一个promise数组
    const proms = validators.map((v) => v.validate());
    const results = await Promise.all(proms);
    return results.every((r) => r); // every() 方法测试一个数组内的所有元素是否都能通过指定函数的测试。它返回一个布尔值。
  }
}
// // 有可能是异步的
// var loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
//   if (!val) {
//     return "请填写账号";
//   }
//   const resp = await API.exists(val);
//   if (resp.data) {
//     return "该账号已被使用，重新设置";
//   }
// });
// var nicknamevalidator = new FieldValidator("txtNickname", function (val) {
//   if (!val) {
//     return "请填写昵称";
//   }
// });
// function test() {
//   //同时触发
//   FieldValidator.validate(nicknamevalidator, loginIdValidator).then(
//     (result) => {
//       console.log(result);
//     }
//   );
// }
